"""
FastAPI Backend Server for AgriSmart AI (SIH-2026)
Exposes REST endpoints for:
- /predict (Core CV task)
- /advisory (Agentic Advisor + RAG + IoT + Weather)
- /diagnose (One-shot Multimodal Image + Advisory Plan)
- /chat (Conversational Agronomy RAG & Guardrails)
- /telemetry (IoT sensor feed)
- /weather (Live Satellite agrometeorology)
- /health (Health checks)
"""

import os
import shutil
import tempfile
from typing import Optional
from fastapi import FastAPI, UploadFile, File, Form, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse

from src.cv_pipeline.predict import predict
from src.advisor.agentic_advisor import AgenticAdvisor
from src.rag_pipeline.retriever import get_global_retriever
from src.advisor.sensor_stream import IoTSensorSimulator
from src.advisor.weather_service import WeatherService, geocode_location, fetch_live_agri_weather
from src.api.schemas import (
    PredictionResponse, 
    AdvisoryRequest, 
    AdvisoryResponse,
    ChatRequest,
    ChatResponse,
    FullDiagnosisResponse
)

app = FastAPI(
    title="AgriSmart AI API",
    description="Intelligent Agriculture Advisory Platform - SIH 2026",
    version="1.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

advisor = AgenticAdvisor()
retriever = get_global_retriever()
sensor_stream = IoTSensorSimulator()
weather_service = WeatherService()

# Serve Frontend static directory if present
FRONTEND_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "..", "frontend"))
if os.path.exists(FRONTEND_DIR):
    app.mount("/static", StaticFiles(directory=FRONTEND_DIR), name="static")

    @app.get("/", include_in_schema=False)
    def serve_frontend_root():
        index_file = os.path.join(FRONTEND_DIR, "index.html")
        if os.path.exists(index_file):
            return FileResponse(index_file)
        return {"message": "AgriSmart AI API is running. Visit /docs for OpenAPI specifications."}


@app.get("/health")
def health_check():
    return {
        "status": "healthy",
        "service": "AgriSmart AI Core Server",
        "version": "1.0.0",
        "modules": {
            "cv_pipeline": "online",
            "rag_knowledge_base": "online",
            "weather_intelligence": "online",
            "iot_sensor_stream": "online",
            "agentic_advisor": "online"
        }
    }


@app.post("/predict", response_model=PredictionResponse)
async def predict_crop_disease(
    file: UploadFile = File(...),
    model_type: str = Form("efficientnet"),
    user_prompt: Optional[str] = Form(None)
):
    """
    Core Mandatory Task: Accept leaf image and classify disease.
    """
    if not file.content_type.startswith("image/"):
        raise HTTPException(status_code=400, detail="Uploaded file is not an image.")
    
    suffix = os.path.splitext(file.filename)[1] or ".jpg"
    with tempfile.NamedTemporaryFile(delete=False, suffix=suffix) as tmp:
        shutil.copyfileobj(file.file, tmp)
        tmp_path = tmp.name

    try:
        res = predict(tmp_path, model_type=model_type, user_prompt=user_prompt)
        return res
    finally:
        if os.path.exists(tmp_path):
            os.remove(tmp_path)


@app.post("/advisory", response_model=AdvisoryResponse)
def generate_full_advisory(req: AdvisoryRequest):
    """
    Generate end-to-end grounded RAG + IoT advisory for a diagnosed disease.
    """
    result = advisor.formulate_advisory(
        disease_name=req.disease_name,
        confidence=req.confidence,
        user_location=req.location
    )
    return result


@app.post("/diagnose", response_model=FullDiagnosisResponse)
async def diagnose_leaf_full(
    file: UploadFile = File(...),
    location: str = Form("Ahmedabad, Gujarat"),
    model_type: str = Form("efficientnet"),
    user_prompt: Optional[str] = Form(None)
):
    """
    One-Shot Multimodal Diagnosis: Accepts leaf image + location, returns vision classification + full treatment plan.
    """
    if not file.content_type.startswith("image/"):
        raise HTTPException(status_code=400, detail="Uploaded file is not an image.")
    
    suffix = os.path.splitext(file.filename)[1] or ".jpg"
    with tempfile.NamedTemporaryFile(delete=False, suffix=suffix) as tmp:
        shutil.copyfileobj(file.file, tmp)
        tmp_path = tmp.name

    try:
        pred_res = predict(tmp_path, model_type=model_type, user_prompt=user_prompt)
        advisory_res = advisor.formulate_advisory(
            disease_name=pred_res["disease"],
            confidence=pred_res["confidence"],
            user_location=location
        )
        return {
            "prediction": pred_res,
            "advisory": advisory_res,
            "status": "success"
        }
    finally:
        if os.path.exists(tmp_path):
            os.remove(tmp_path)


@app.post("/chat", response_model=ChatResponse)
def chat_with_agronomist(req: ChatRequest):
    """
    Conversational Agronomy Agent: Handles crop Q&A, fertilizer doses, pest treatments, weather spray queries, and domain guardrails.
    """
    loc_ctx = None
    if req.location:
        geo = geocode_location(req.location)
        weather = fetch_live_agri_weather(geo["lat"], geo["lon"], geo["name"])
        loc_ctx = {"geo": geo, "weather": weather}

    ans = retriever.answer_query(req.query, location_context=loc_ctx)
    return {
        "response": ans.get("response", ""),
        "type": ans.get("type", "general"),
        "source": ans.get("source", "AgriSmart Knowledge Base"),
        "status": "success"
    }


@app.get("/telemetry")
def get_sensor_telemetry(soil_type: str = "Loamy"):
    """
    Real-time IoT soil and environmental telemetry.
    """
    return sensor_stream.get_telemetry(soil_type=soil_type)


@app.get("/weather")
def get_weather(location: str = "Ahmedabad, Gujarat"):
    """
    Live Satellite weather & spray window intelligence.
    """
    geo = geocode_location(location)
    return fetch_live_agri_weather(geo["lat"], geo["lon"], geo["name"])


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)

