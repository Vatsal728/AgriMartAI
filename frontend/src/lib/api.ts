import type {
  ChatResponse,
  ChatSession,
  Farm,
  FieldPlot,
  FullDiagnosisResponse,
  LiveWeatherResponse,
  Product,
  SavedAnswer,
  SoilTelemetryResponse,
  SustainabilityDashboardResponse,
  User,
} from "@/types/api";

const PRODUCTION_API_URL = "https://agrismart-api-4rmk.onrender.com";

const BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL ||
  process.env.NEXT_PUBLIC_API_URL ||
  (typeof window !== "undefined" && window.location.hostname === "localhost"
    ? "http://localhost:8080"
    : PRODUCTION_API_URL);

export async function apiFetch<T>(endpoint: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`${BASE_URL}${endpoint}`, {
    headers: {
      Accept: "application/json",
      ...(options?.headers || {}),
    },
    ...options,
  });

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({ detail: res.statusText }));
    throw new Error(errorData.detail || `API request failed: ${res.status}`);
  }

  return res.json();
}

export const AgriSmartAPI = {
  // Health
  checkHealth: () => apiFetch<{ status: string; modules: string[] }>("/health"),

  // Auth & Profile
  login: (loginId: string, password: string) =>
    apiFetch<User>("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ login_id: loginId, password }),
    }),
  register: (data: { full_name: string; email: string; password?: string; phone_number?: string; language?: string }) =>
    apiFetch<User>("/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    }),
  getCurrentUser: (userId = "usr_david_miller", email?: string) => 
    apiFetch<User>(`/api/auth/me?${email ? `email=${encodeURIComponent(email)}&` : ""}user_id=${userId}`),
  updateLanguage: (language: string) =>
    apiFetch<{ status: string; preferred_language: string }>("/api/auth/language", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ language }),
    }),

  // Farms & Field Plots
  getFarms: (userId = "usr_david_miller") => apiFetch<Farm[]>(`/api/farms?user_id=${userId}`),
  getFarmFields: (farmId: string) => apiFetch<FieldPlot[]>(`/api/farms/${farmId}/fields`),

  // Multimodal Leaf Diagnosis
  diagnoseLeaf: async (formData: FormData) => {
    // Note: Do NOT set Content-Type header when uploading FormData — the browser sets the boundary.
    return apiFetch<FullDiagnosisResponse>("/diagnose", {
      method: "POST",
      body: formData,
    });
  },
  getRecentDiagnoses: (userId?: string, limit = 12) =>
    apiFetch<any[]>(`/api/diagnoses/recent?${userId ? `user_id=${userId}&` : ""}limit=${limit}`),
  getDiagnosisDetail: (diagId: string) =>
    apiFetch<any>(`/api/diagnoses/${diagId}`),

  // Chat & Multi-Turn Memory
  sendMessage: (query: string, sessionId?: string, location?: string) =>
    apiFetch<ChatResponse>("/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ query, session_id: sessionId, location }),
    }),

  // Consultation Sessions
  getSessions: (userId = "usr_david_miller") => apiFetch<ChatSession[]>(`/api/sessions?user_id=${userId}`),
  getSessionDetail: (sessionId: string) =>
    apiFetch<{ session: ChatSession; messages: unknown[] }>(`/api/sessions/${sessionId}`),
  deleteSession: (sessionId: string) =>
    apiFetch<{ status: string }>(`/api/sessions/${sessionId}`, { method: "DELETE" }),

  // Bookmarks / Saved Answers
  getSavedAnswers: (userId = "usr_david_miller") =>
    apiFetch<SavedAnswer[]>(`/api/saved-answers?user_id=${userId}`),
  bookmarkAnswer: (title: string, summaryText: string, category: string) =>
    apiFetch<SavedAnswer>("/api/saved-answers", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title, summary_text: summaryText, category }),
    }),
  deleteSavedAnswer: (id: string) =>
    apiFetch<{ status: string }>(`/api/saved-answers/${id}`, { method: "DELETE" }),

  // Sustainability & Goals
  getSustainability: (farmId = "farm_central_valley") =>
    apiFetch<SustainabilityDashboardResponse>(`/api/sustainability/${farmId}`),
  updateActionStatus: (actionId: string, status: "pending" | "in_progress" | "completed") =>
    apiFetch<{ status: string }>(`/api/sustainability/actions/${actionId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    }),

  // Marketplace & Recommendations
  getProducts: (category?: string) =>
    apiFetch<Product[]>(`/api/products${category ? `?category=${encodeURIComponent(category)}` : ""}`),
  getProductRecommendations: (disease: string) =>
    apiFetch<Product[]>(`/api/products/recommendations?disease=${encodeURIComponent(disease)}`),

  // Live Weather & IoT
  getLiveWeather: (location = "Ahmedabad, Gujarat") =>
    apiFetch<LiveWeatherResponse>(`/api/weather?location=${encodeURIComponent(location)}`),
  getSoilTelemetry: (soilType = "Loamy", crop = "Tomato") =>
    apiFetch<SoilTelemetryResponse>(
      `/api/soil-telemetry?soil_type=${encodeURIComponent(soilType)}&crop=${encodeURIComponent(crop)}`
    ),
};
