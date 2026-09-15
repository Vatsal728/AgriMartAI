"""
Pydantic Schemas for AgriSmart AI Backend API
Full Figma Schema Support:
- Authentication & Multi-Language Profiles
- Farm & Field Management
- Multimodal Leaf Diagnosis & 3-Part Accordion Plans
- Chat Memory & Sessions
- Bookmarks / Saved Answers
- Sustainability Metrics & Goals
- Marketplace Recommended Products
"""

from typing import List, Optional, Dict, Any
from pydantic import BaseModel, Field

# ==================== VISION & DIAGNOSIS ====================
class PredictionResponse(BaseModel):
    disease: str = Field(..., description="Exact predicted crop disease label")
    confidence: float = Field(..., description="Model prediction confidence (0.0 to 1.0)")
    crop: str = Field(..., description="Crop name (e.g. Tomato, Corn, Cassava)")
    bounding_box: Optional[List[float]] = Field(None, description="Coordinates [x1, y1, x2, y2]")
    model_used: Optional[str] = Field(None, description="Vision model architecture used")
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
    llm_expert_advisory: Optional[str] = None
    conversational_summary: str

class FullDiagnosisResponse(BaseModel):
    prediction: PredictionResponse
    advisory: AdvisoryResponse
    session_id: Optional[str] = None
    status: str = "success"

# ==================== CHAT & SESSIONS ====================
class ChatMessageSchema(BaseModel):
    id: Optional[str] = None
    role: str
    content: str
    image_path: Optional[str] = None
    diagnosis: Optional[Dict[str, Any]] = None
    source: Optional[str] = None
    created_at: Optional[str] = None

class SessionCreateRequest(BaseModel):
    title: Optional[str] = None
    crop: Optional[str] = "General"
    location: Optional[str] = "Ahmedabad, Gujarat"
    user_id: Optional[str] = "usr_david_miller"

class SessionResponse(BaseModel):
    id: str
    title: str
    crop: str
    location: str
    created_at: str
    updated_at: str
    message_count: Optional[int] = 0
    last_message: Optional[str] = None

class SessionDetailResponse(BaseModel):
    session: SessionResponse
    messages: List[ChatMessageSchema]

class ChatRequest(BaseModel):
    query: str
    location: Optional[str] = "Ahmedabad, Gujarat"
    crop: Optional[str] = "General"
    session_id: Optional[str] = None
    history: Optional[List[Dict[str, Any]]] = []

class ChatResponse(BaseModel):
    response: str
    type: str
    source: str
    session_id: Optional[str] = None
    status: str = "success"

# ==================== AUTHENTICATION & USERS ====================
class UserRegisterRequest(BaseModel):
    full_name: str
    phone_number: Optional[str] = None
    email: Optional[str] = None
    password: Optional[str] = None
    language: Optional[str] = "en"

class UserLoginRequest(BaseModel):
    login_id: str = Field(..., description="Phone number or email")
    password: str

class SendOtpRequest(BaseModel):
    phone_number: str

class VerifyOtpRequest(BaseModel):
    phone_number: str
    otp_code: str

class LanguageUpdateRequest(BaseModel):
    language: str = Field(..., description="'en', 'hi', 'gu', 'mr'")

class UserResponse(BaseModel):
    id: str
    phone_number: Optional[str]
    email: Optional[str]
    full_name: str
    avatar_url: Optional[str]
    preferred_language: str
    subscription_plan: str
    is_verified: bool
    created_at: str

# ==================== FARMS & FIELDS ====================
class FarmCreateRequest(BaseModel):
    farm_name: str
    location_name: str
    latitude: Optional[float] = 0.0
    longitude: Optional[float] = 0.0
    total_area: Optional[float] = 1.0
    area_unit: Optional[str] = "Acres"
    user_id: Optional[str] = "usr_david_miller"

class FieldCreateRequest(BaseModel):
    plot_name: str
    crop_name: str
    crop_variety: Optional[str] = None
    soil_type: Optional[str] = "Loamy"
    sowing_date: Optional[str] = None
    area: Optional[float] = 1.0

class FarmResponse(BaseModel):
    id: str
    user_id: Optional[str]
    farm_name: str
    location_name: str
    latitude: float
    longitude: float
    total_area: float
    area_unit: str
    created_at: str

class FieldResponse(BaseModel):
    id: str
    farm_id: str
    plot_name: str
    crop_name: str
    crop_variety: Optional[str] = None
    soil_type: str
    sowing_date: Optional[str] = None
    area: float

# ==================== BOOKMARKS / SAVED ANSWERS ====================
class SavedAnswerCreateRequest(BaseModel):
    title: str
    summary_text: str
    category: Optional[str] = "Agronomy"
    user_id: Optional[str] = "usr_david_miller"

class SavedAnswerResponse(BaseModel):
    id: str
    user_id: str
    title: str
    summary_text: str
    category: str
    created_at: str

# ==================== SUSTAINABILITY & PRODUCTS ====================
class ActionStatusUpdateRequest(BaseModel):
    status: str = Field(..., description="'pending', 'in_progress', 'completed'")

class SustainabilityResponse(BaseModel):
    score: Dict[str, Any]
    actions: List[Dict[str, Any]]

class ProductResponse(BaseModel):
    id: str
    name: str
    category: str
    active_ingredient: Optional[str] = None
    price_inr: float
    package_size: str
    image_url: Optional[str] = None
    target_diseases: Optional[str] = None
    stock_quantity: int
