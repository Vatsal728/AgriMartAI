"""
FastAPI Backend Server for AgriSmart AI (SIH-2026)
Exposes REST endpoints for:
- /predict (Core CV task)
- /advisory (Agentic Advisor + RAG + IoT + Weather)
- /telemetry (IoT sensor feed)
- /health (Health checks)
"""

import os
import shutil
import tempfile
from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.middleware.cors import CORSMiddleware

from src.cv_pipeline.predict import predict
from src.advisor.agentic_advisor import AgenticAdvisor
from src.advisor.sensor_stream import IoTSensorSimulator
from src.advisor.weather_service import WeatherService
from src.api.schemas import PredictionResponse, AdvisoryRequest, AdvisoryResponse

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
sensor_stream = IoTSensorSimulator()
weather_service = WeatherService()

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
async def predict_crop_disease(file: UploadFile = File(...)):
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
        res = predict(tmp_path)
        return res
    finally:
        if os.path.exists(tmp_path):
            os.remove(tmp_path)

@app.post("/advisory", response_model=AdvisoryResponse)
def generate_full_advisory(req: AdvisoryRequest):
    """
    Bonus Endpoints: Generate end-to-end grounded RAG + IoT advisory.
    """
    result = advisor.formulate_advisory(
        disease_name=req.disease_name,
        confidence=req.confidence,
        user_location=req.location
    )
    return result

@app.get("/telemetry")
def get_sensor_telemetry(soil_type: str = "Loamy"):
    """
    Bonus Module F: Real-time IoT soil and environmental telemetry.
    """
    return sensor_stream.get_telemetry(soil_type=soil_type)

@app.get("/weather")
def get_weather(location: str = "Ahmedabad,IN"):
    """
    Bonus Module C: Weather intelligence endpoint.
    """
    return weather_service.get_weather(city=location)

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
