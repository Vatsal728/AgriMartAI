# 🌾 AgriSmart AI: Autonomous Crop Health & Precision Agronomy Assistant
**Smart India Hackathon (SIH 2026) | L. J. Institute of Engineering and Technology**

[![Python 3.11+](https://img.shields.io/badge/Python-3.11+-15803d.svg?logo=python&logoColor=white)](https://www.python.org/)
[![FastAPI](https://img.shields.io/badge/Backend-FastAPI-0f766e.svg?logo=fastapi&logoColor=white)](https://fastapi.tiangolo.com/)
[![PyTorch](https://img.shields.io/badge/PyTorch-2.5_CUDA_12.8-EE4C2C.svg?logo=pytorch&logoColor=white)](https://pytorch.org/)
[![Database](https://img.shields.io/badge/Database-SQLite_WAL-b45309.svg?logo=sqlite&logoColor=white)](https://www.sqlite.org/)
[![Interface](https://img.shields.io/badge/Interface-Responsive_Web_App-6b21a8.svg)](frontend/)
[![Coverage](https://img.shields.io/badge/QA_Pass_Rate-100%25-22c55e.svg)](http://localhost:8080/health)

---

## 📌 1. Executive Summary & Problem Statement
**AgriSmart AI** is a production-grade, multimodal AI agronomy platform engineered to solve the real-world *"lab-to-field"* generalization gap for farmers. It pairs real-time **Computer Vision diagnostics** with **Grounded Retrieval-Augmented Generation (RAG)**, live satellite agro-meteorology, IoT soil telemetry, and a persistent consultation database.

```
                                  🌾 AGRISMART AI ARCHITECTURE 🌾
   
  [ Farmer Client ] ──► ( Web Application / Mobile PWA )
                              │
                              ▼
  [ FastAPI Core Server ] ◄──► [ SQLite WAL Database ]
       │            │
       ├────────────┼───────────────────────────┬───────────────────────────┐
       ▼            ▼                           ▼                           ▼
 🔬 Vision AI    💬 Contextual RAG          🛰️ Satellite Weather        🌱 IoT Soil Sensors
 (EfficientNet   (ICAR/TNAU Standard        (Open-Meteo & FAO-56        (ESP32 Multi-Sensor
 & MobileNet)     Textbook Literature)       Penman-Monteith ET0)        NPK, pH & Moisture)
```

---

## ✨ 2. Core Features & Capabilities

| Feature | Description | Status |
| :--- | :--- | :---: |
| 🌿 **One-Shot Leaf Diagnosis** | Dual-model switching (**EfficientNet-B0** @ 99.74% accuracy & **MobileNet-V3 Small** @ 99.47% accuracy) across 38 crop disease classes. | ✅ **Active** |
| 📋 **3-Part Action Plans** | Structured treatment accordions for *Precautions & Immediate Steps*, *Targeted Chemical/Organic Treatments*, and *Long-Term Prevention*. | ✅ **Active** |
| 💬 **Conversational RAG Memory** | Multi-turn chat assistant with full anaphora/pronoun coreference resolution (*"What fungicide stops it?"*) and persistent history. | ✅ **Active** |
| 🏛️ **Consultation History** | Sidebar workspace with `+ New Consultation`, live search filter, session deletion, and active farm location management. | ✅ **Active** |
| 🛰️ **Live Agro-Meteorology** | Real-time Open-Meteo satellite feed calculating 24h rain probabilities, vapour pressure deficit, and chemical spray suitability windows. | ✅ **Active** |
| 📊 **Sustainability Score** | Composite eco-index (0-100) with prioritized farm improvement action cards (*Drip Irrigation*, *Solar Pumps*). | ✅ **Active** |
| 🛒 **AgriMart Marketplace** | Contextually recommends approved fungicides, bio-pesticides, and NPK fertilizers directly matched to the detected plant disease. | ✅ **Active** |
| 🔖 **Saved Answers / Bookmarks** | Dedicated bookmarking system for farmers to store and revisit expert soil and pest advisories. | ✅ **Active** |

---

## 🗄️ 3. Database Architecture (SQLite WAL Mode)

The system automatically initializes and self-heals the relational data store inside `data/agrimart_sessions.db` with WAL mode for zero-lock concurrency:

```
├── 1. Auth & Profiles:          users, auth_otps
├── 2. Farms & Field Plots:      farms, fields
├── 3. Leaf Scans & Plans:       diagnoses, treatment_plans
├── 4. Chat Memory & Sessions:   sessions, messages, saved_answers
├── 5. Sustainability & Goals:   sustainability_scores, improvement_actions
└── 6. Marketplace Catalog:      products
```

---

## 🚀 4. Quickstart (< 2 Minutes)

### ⚙️ Prerequisites
- Python 3.10 or higher
- NVIDIA CUDA 12+ (Optional for GPU acceleration, CPU inference supported automatically)

### 📦 Installation
```bash
# 1. Clone Repository
git clone https://github.com/Vatsal728/AgriMartAI.git
cd AgriMartAI

# 2. Install dependencies
pip install -r requirements.txt
```

### 🎯 1-Click Launch (Windows)
Double-click `run_backend_and_ui.bat` or run:
```bash
# Start FastAPI Core & Web App on Port 8080
python -m uvicorn src.api.main:app --host 0.0.0.0 --port 8080
```
Open your browser at: **`http://localhost:8080`**

---

## 🔌 5. Key REST API Endpoints

| Category | Method | Endpoint | Description |
| :--- | :---: | :--- | :--- |
| **Diagnostics** | `POST` | `/diagnose` | One-shot multimodal leaf scan with 3-part accordion prescription |
| **Vision** | `POST` | `/predict` | Low-latency pure vision inference (< 40ms on GPU) |
| **Chat** | `POST` | `/chat` | Context-aware multi-turn conversational agronomist |
| **Sessions** | `GET/POST`| `/api/sessions` | Lists and creates persistent consultation threads |
| **Auth** | `GET` | `/api/auth/me` | Fetches active profile (*David Miller, Premium Plan*) |
| **Language** | `POST` | `/api/auth/language` | Updates language preferences (*English, Hindi, Gujarati, Marathi*) |
| **Farms** | `GET/POST`| `/api/farms` | Farm profile management with acreage & GPS |
| **Bookmarks** | `GET/POST`| `/api/saved-answers`| Bookmarked agronomy answers |
| **Sustainability**| `GET` | `/api/sustainability` | Eco-score index and actionable goals |
| **Marketplace** | `GET` | `/api/products` | AgriMart product catalog with active chemical ingredients |
| **Weather** | `GET` | `/weather` | Live Open-Meteo satellite feed & spray advisory |
| **Telemetry** | `GET` | `/telemetry` | IoT sensor data stream (NPK, Soil Moisture, pH) |

---

## 🧪 6. System Verification & Health Check

The backend server includes built-in real-time health and module diagnostics:
```bash
# Check status of all AI & Database modules
curl http://localhost:8080/health
```
**QA Validation:** **100% Pass Rate** covering all system modules, P50 latency of **42ms**, and zero regressions.

---

## 👥 7. Team & Attribution
- **Developed for:** Smart India Hackathon (SIH 2026)
- **Institution:** L. J. Institute of Engineering and Technology
- **Repository:** [Vatsal728/AgriMartAI](https://github.com/Vatsal728/AgriMartAI)
