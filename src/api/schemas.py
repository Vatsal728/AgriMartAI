"""
Pydantic Schemas for AgriSmart AI Backend API
"""

from typing import List, Optional, Dict, Any
from pydantic import BaseModel, Field

class PredictionResponse(BaseModel):
    disease: str = Field(..., description="Exact predicted crop disease label")
    confidence: float = Field(..., description="Model prediction confidence (0.0 to 1.0)")
    crop: str = Field(..., description="Crop name (e.g. Tomato, Corn, Cassava)")
    bounding_box: Optional[List[float]] = Field(None, description="Coordinates [x1, y1, x2, y2]")
    status: str = "success"

class AdvisoryRequest(BaseModel):
    disease_name: str
    confidence: float = 0.90
    location: Optional[str] = "Ahmedabad,IN"
    soil_type: Optional[str] = "Loamy"

class AdvisoryResponse(BaseModel):
    disease_detected: str
    confidence: float
    crop_category: str
    rag_knowledge: Dict[str, Any]
    environment_telemetry: Dict[str, Any]
    actionable_decisions: Dict[str, Any]
    conversational_summary: str
