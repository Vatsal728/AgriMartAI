// ==================== USER & AUTH ====================
export interface User {
  id: string; // e.g. "usr_david_miller"
  phone_number: string | null;
  email: string | null;
  full_name: string;
  avatar_url: string | null;
  preferred_language: "en" | "hi" | "gu" | "mr";
  subscription_plan: "Free" | "Premium Plan";
  is_verified: boolean;
  created_at: string;
}

// ==================== FARMS & FIELDS ==================
export interface Farm {
  id: string; // e.g. "farm_central_valley"
  user_id: string | null;
  farm_name: string;
  location_name: string; // e.g. "Central Valley, CA, USA"
  latitude: number;
  longitude: number;
  total_area: number;
  area_unit: "Acres" | "Hectares";
  created_at: string;
}

export interface FieldPlot {
  id: string; // e.g. "fld_plot_b12"
  farm_id: string;
  plot_name: string; // e.g. "Plot B-12 (North)"
  crop_name: string; // e.g. "Tomato"
  crop_variety: string | null;
  soil_type: "Loamy" | "Black Clay" | "Red Laterite" | "Sandy" | string;
  sowing_date: string | null;
  area: number;
}

// ==================== MULTIMODAL LEAF DIAGNOSIS =======
export interface VisionPrediction {
  disease: string; // e.g. "Tomato Early Blight"
  confidence: number; // 0.0 to 1.0 (e.g. 0.9840)
  crop: string; // e.g. "Tomato"
  bounding_box?: [number, number, number, number] | null;
  model_used?: "Efficientnet" | "Mobilenet";
  status: string;
}

export interface DiagnosisAccordionRecord {
  id: string;
  user_id?: string;
  field_id?: string;
  image_url: string;
  crop: string;
  disease_name: string;
  scientific_name?: string;
  confidence: number;
  severity: "Optimal" | "Mild" | "Severe";
  model_used: string;
  precautions_immediate: string; // Accordion 1 (Markdown)
  recommended_treatment: string; // Accordion 2 (Chemical/Bio)
  long_term_prevention: string; // Accordion 3 (Crop rotation etc.)
  weather_risk_notes?: string; // Weather risk advisory
}

export interface Product {
  id: string;
  name: string;
  category: "Fungicide" | "Bio-Insecticide" | "Bactericide" | string;
  active_ingredient?: string;
  price_inr: number;
  package_size: string;
  image_url?: string;
  target_diseases?: string;
  stock_quantity: number;
}

export interface FullDiagnosisResponse {
  prediction: VisionPrediction;
  advisory: {
    disease_detected: string;
    confidence: number;
    crop_category: string;
    conversational_summary: string;
    rag_knowledge: Record<string, unknown>;
    environment_telemetry: Record<string, unknown>;
    actionable_decisions: Record<string, unknown>;
  };
  diagnosis_record: DiagnosisAccordionRecord;
  recommended_products: Product[];
  session_id: string;
  status: "success";
}

// ==================== CHAT & SESSIONS =================
export interface ChatMessage {
  id?: string;
  role: "user" | "assistant" | "system";
  content: string; // Markdown text
  image_path?: string | null;
  diagnosis?: unknown;
  source?: string | null; // e.g. "ICAR/TNAU Standards"
  created_at?: string;
}

export interface ChatSession {
  id: string; // e.g. "ses_7954029023"
  title: string;
  crop: string;
  location: string;
  message_count?: number;
  last_message?: string | null;
  created_at: string;
  updated_at: string;
}

export interface ChatResponse {
  response: string; // Formatted Markdown advice
  type: string;
  source: string;
  session_id: string;
  status: "success";
}

// ==================== SUSTAINABILITY & CHARTS =========
export interface SustainabilityScore {
  id: string;
  farm_id: string;
  current_score: number; // 0-100 (e.g. 82)
  target_score: number; // e.g. 90
  water_efficiency_score: number;
  carbon_reduction_score: number;
  chemical_reduction_score: number;
}

export interface ImprovementAction {
  id: string;
  score_id: string;
  action_title: string; // e.g. "Drip Irrigation Upgrade"
  description: string;
  points_reward: number; // e.g. +8
  status: "pending" | "in_progress" | "completed";
}

export interface SustainabilityDashboardResponse {
  score: SustainabilityScore;
  actions: ImprovementAction[];
}

// ==================== WEATHER & IOT SENSORS ===========
export interface LiveWeatherResponse {
  location: string;
  temperature_c: number;
  humidity_pct: number;
  wind_speed_kmh: number;
  rain_probability_pct: number;
  rain_mm: number;
  soil_moisture_pct: number;
  et0_fao_evapotranspiration_mm_day: number;
  conditions: string; // e.g. "Mainly Clear", "Overcast"
  is_real_data: boolean;
}

export interface SoilTelemetryResponse {
  node_id: string;
  soil_type: string;
  soil_moisture_pct: number;
  soil_moisture_status: "Optimal" | "Low" | "Critical";
  soil_ph: number;
  soil_temp_c: number;
  nutrients_npk: {
    nitrogen_mg_kg: number;
    phosphorus_mg_kg: number;
    potassium_mg_kg: number;
  };
  sensor_health: string;
}

export interface SavedAnswer {
  id: string;
  user_id: string;
  title: string;
  summary_text: string;
  category: string;
  created_at: string;
}
