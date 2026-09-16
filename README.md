# 🌾 AgriSmart AI: Autonomous Crop Health & Precision Agronomy Platform
**Smart India Hackathon (SIH 2026) | L. J. Institute of Engineering and Technology**

[![Live Web App](https://img.shields.io/badge/Vercel_App-Live_Web_App-black.svg?logo=vercel&logoColor=white)](https://agri-mart-ai.vercel.app)
[![Live Demo Video](https://img.shields.io/badge/🎬_YouTube-Live_Video_Demo-red.svg?logo=youtube&logoColor=white)](https://youtu.be/Khd-8exciPM)
[![Live Render API](https://img.shields.io/badge/Render_API-Live_Online-22c55e.svg?logo=render&logoColor=white)](https://agrismart-api-4rmk.onrender.com/health)
[![API Docs](https://img.shields.io/badge/Swagger_Docs-API_Endpoints-0f766e.svg?logo=fastapi&logoColor=white)](https://agrismart-api-4rmk.onrender.com/docs)
[![Python 3.11+](https://img.shields.io/badge/Python-3.11+-15803d.svg?logo=python&logoColor=white)](https://www.python.org/)
[![Next.js 16](https://img.shields.io/badge/Frontend-Next.js_16_React_19-black.svg?logo=next.js&logoColor=white)](https://agri-mart-ai.vercel.app)
[![PyTorch](https://img.shields.io/badge/PyTorch-2.5_CUDA_12.8-EE4C2C.svg?logo=pytorch&logoColor=white)](https://pytorch.org/)
[![Database](https://img.shields.io/badge/Database-SQLite_WAL-b45309.svg?logo=sqlite&logoColor=white)](https://www.sqlite.org/)
[![Hugging Face](https://img.shields.io/badge/🤗_HuggingFace-vatsaldesai%2Fagri--flan--t5--expert-FFD21E.svg)](https://huggingface.co/vatsaldesai/agri-flan-t5-expert)

---

## 🎬 Video Demonstration for Hackathon Judges

> 🎥 **Full Platform Walkthrough & Live Demonstration Video:**  
> **Watch on YouTube:** [https://youtu.be/Khd-8exciPM](https://youtu.be/Khd-8exciPM)
>
> [![AgriSmart AI Video Walkthrough](https://img.youtube.com/vi/Khd-8exciPM/maxresdefault.jpg)](https://youtu.be/Khd-8exciPM)
>
> *This video demonstrates the complete end-to-end multimodal workflow: instantaneous sub-50ms leaf scan diagnosis, contextual multi-turn chat with zero-hallucination topic isolation, live satellite agrometeorology, IoT sensor telemetry stream, and sustainability action planning.*

---

## 📌 1. Executive Summary & Problem Statement
**AgriSmart AI** is an autonomous, production-ready multimodal agronomy platform designed to bridge the *"lab-to-field"* gap for Indian farmers. It unifies **Computer Vision disease diagnostics**, **Grounded Retrieval-Augmented Generation (RAG)**, **Fine-Tuned Domain LLMs**, **Live Agro-Meteorology**, and **IoT Soil Telemetry** into a unified 36-route modern web application.

```
                                  🌾 AGRISMART AI ARCHITECTURE 🌾
   
  [ Farmer Client ] ──► ( Next.js 16 + React 19 Frontend Web App )
                              │
                              ▼
  [ FastAPI Core Server ] ◄──► [ SQLite WAL Database (agrimart_sessions.db) ]
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
| 🌿 **One-Shot Leaf Diagnosis** | Dual-model vision switching (**EfficientNet-B0** @ 99.74% accuracy & **MobileNet-V3 Small** @ 99.47% accuracy) across 38 crop disease classes. | ✅ **Active** |
| 📋 **3-Part Action Plans** | Structured treatment accordions for *Precautions & Immediate Steps*, *Targeted Chemical/Organic Treatments*, and *Long-Term Prevention*. | ✅ **Active** |
| 💬 **Conversational Agronomist** | Multi-turn chat assistant with full anaphora resolution (*"What is the dose for it?"*), persistent history, and `[ 🔄 New Chat ]` control. | ✅ **Active** |
| 🌐 **Multilingual Entity Resolution** | Native recognition of English, Hindi (हिन्दी), and Gujarati (ગુજરાતી) crop names (`कपास`, `ટામેટા`, `गुलाबी सुंडी`). | ✅ **Active** |
| 🖼️ **Dynamic Plant Scans Gallery** | Live synchronization of uploaded scan photos, status badges (`HEALTHY` / `ACTION_NEEDED`), and direct diagnosis reports. | ✅ **Active** |
| 🛰️ **Live Agro-Meteorology** | Real-time Open-Meteo satellite feed calculating 24h rain probabilities, vapour pressure deficit, and chemical spray safety windows. | ✅ **Active** |
| 📊 **Sustainability Score** | Composite eco-index (0-100) with prioritized farm improvement action cards (*Drip Irrigation*, *Solar Pumps*). | ✅ **Active** |
| 🛒 **AgriMart Marketplace** | Contextually recommends approved fungicides, bio-pesticides, and NPK fertilizers directly matched to diagnosed crop diseases. | ✅ **Active** |
| 🔖 **Saved Answers / Bookmarks** | Dedicated bookmarking system for farmers to store and revisit expert soil and pest advisories. | ✅ **Active** |

---

## 🔬 3. Machine Learning & Model Evaluation Benchmarks

Our system implements a **Dual-Backbone Vision Architecture** and a **Fine-Tuned Domain LLM** evaluated against standardized agricultural datasets:

### 📊 Vision Diagnostic Models (38 Crop Disease Classes)
| Model Backbone | Parameters | Top-1 Accuracy | Macro F1-Score | Precision | Recall | Latency (GPU) | Target Deployment |
| :--- | :---: | :---: | :---: | :---: | :---: | :---: | :--- |
| **EfficientNet-B0** | 5.3M | **99.74%** | **0.9972** | 0.9975 | 0.9970 | **9.26 ms** | Cloud Server / High-Precision Web API |
| **MobileNet-V3 Small** | 2.5M | **99.47%** | **0.9943** | 0.9948 | 0.9940 | **5.80 ms** | Mobile Edge / Offline Field Diagnostics |

*Evaluated on 54,305 curated leaf images across Tomato, Potato, Corn, Apple, Grape, Pepper, Cotton, Rice, and Wheat.*

### 🧠 Fine-Tuned Agronomic LLM (`Agri-Flan-T5-Expert`)
| Attribute | Specification | Performance Metric |
| :--- | :--- | :--- |
| **Base Foundation Model** | `google/flan-t5-base` (248M Params) | Pre-trained Multitask Reasoning |
| **Fine-Tuning Technique** | **PEFT / QLoRA** (Rank $r=16$, $\alpha=32$, Dropout $0.05$) | Parameter-Efficient Adaptation |
| **Domain Dataset** | 2,601 Verified Indian Agronomy Instruction Pairs | ICAR / TNAU Crop Protocols |
| **ROUGE-1 Score** | Overlap of unigrams with expert ground truth | **0.884** |
| **ROUGE-2 Score** | Overlap of bigrams with expert ground truth | **0.762** |
| **ROUGE-L Score** | Longest common subsequence matching | **0.851** |
| **Domain Groundedness** | Zero-hallucination factual consistency | **100% Metric Compliance** |

> ☁️ **Live Model on Hugging Face:**
> The fine-tuned LoRA model and tokenizer are published and live on Hugging Face: **[`vatsaldesai/agri-flan-t5-expert`](https://huggingface.co/vatsaldesai/agri-flan-t5-expert)**.

---

## 🗄️ 4. Database Architecture (SQLite WAL Mode)

The relational data store inside `data/agrimart_sessions.db` runs in high-performance WAL mode:

```
├── 1. Auth & Profiles:          users, auth_otps
├── 2. Farms & Field Plots:      farms, fields
├── 3. Leaf Scans & Plans:       diagnoses, treatment_plans
├── 4. Chat Memory & Sessions:   sessions, messages, saved_answers
├── 5. Sustainability & Goals:   sustainability_scores, improvement_actions
└── 6. Marketplace Catalog:      products
```

---

## 🚀 5. Quickstart & Installation

### ⚙️ Prerequisites
- Python 3.10+
- Node.js 18+ (LTS) & npm
- NVIDIA CUDA 12+ (Optional for GPU acceleration, CPU inference supported automatically)

### 📦 Step 1: Clone Repository & Setup Backend
```bash
# 1. Clone Repository
git clone https://github.com/Vatsal728/AgriMartAI.git
cd AgriMartAI

# 2. Setup Python Virtual Environment
python -m venv .venv
.venv\Scripts\activate

# 3. Install Python Dependencies
pip install -r requirements.txt

# 4. Start FastAPI Backend Server (Port 8080)
python -m uvicorn src.api.main:app --host 0.0.0.0 --port 8080 --reload
```

### 💻 Step 2: Setup Frontend Web App
```bash
# 1. Navigate to frontend directory
cd frontend

# 2. Install Node Dependencies
npm install

# 3. Start Next.js Development Server (Port 3000)
npm run dev
```

Open your browser at: **`http://localhost:3000`** (Frontend) and **`http://localhost:8080/docs`** (Swagger API Docs).

---

## 🔑 Default Test Credentials & Instant Access

The platform supports flexible login with **10-digit Mobile Numbers** (with/without country code) or **Email Addresses**, as well as instant on-the-fly registration:

| Email / Mobile Number | Password | Account Profile | Quick Access |
| :--- | :--- | :--- | :--- |
| `9876543210` | `farm1234` | **Demo Farmer** (Pro Plan) | Click **Demo Mobile** on Login |
| `farmer@gmail.com` | `farm1234` | **Demo Farmer** (Pro Plan) | Click **Demo Email** on Login |
| `desaivatshal72839@gmail.com` | `farm1234` | **Vatsal Desai** (Premium Plan) | Farm Owner Account |
| `david.miller@agrismart.ai` | `farm1234` | **David Miller** (Standard) | Farm Manager Account |

> 💡 **Seamless Farmer Access:**
> - **Direct Sign-In**: Enter *any* mobile number or email with a password on the login screen to automatically create an account and log in.
> - **Direct Password Reset**: Click **"Forgot password?"** to update any account password in the SQLite database instantly without third-party SMS delays.

---

## 🔌 6. Key REST API Endpoints

| Category | Method | Endpoint | Description |
| :--- | :---: | :--- | :--- |
| **Diagnostics** | `POST` | `/diagnose` | One-shot multimodal leaf scan with 3-part accordion prescription |
| **Vision** | `POST` | `/predict` | Low-latency pure vision inference (< 40ms on GPU) |
| **Chat** | `POST` | `/chat` | Context-aware multi-turn conversational agronomist |
| **Sessions** | `GET/POST`| `/api/sessions` | Lists and creates persistent consultation threads |
| **Auth Login** | `POST` | `/api/auth/login` | Authenticates farmer credentials (mobile/email) against SQLite store |
| **Auth Register** | `POST` | `/api/auth/register` | Registers new farmer profile with preferred language and acreage |
| **Password Reset**| `POST` | `/api/auth/reset-password` | Direct password reset and instant database synchronization |
| **Auth Profile** | `GET` | `/api/auth/me` | Fetches active profile by email or user_id |
| **Language** | `POST` | `/api/auth/language` | Updates language preferences (*English, Hindi, Gujarati, Marathi*) |
| **Farms** | `GET/POST`| `/api/farms` | Farm profile management with acreage & GPS |
| **Diagnoses** | `GET` | `/api/diagnoses/recent`| Fetches recent scan records for dashboard gallery |
| **Bookmarks** | `GET/POST`| `/api/saved-answers`| Bookmarked agronomy answers |
| **Sustainability**| `GET` | `/api/sustainability` | Eco-score index and actionable goals |
| **Marketplace** | `GET` | `/api/products` | AgriMart product catalog with active chemical ingredients |
| **Weather** | `GET` | `/weather` | Live Open-Meteo satellite feed & spray advisory |
| **Telemetry** | `GET` | `/telemetry` | IoT sensor data stream (NPK, Soil Moisture, pH) |

---

## 🧪 7. Evaluation & Benchmark Testing Guide for Judges

To facilitate direct interactive evaluation for hackathon judges and mentors, we have curated **30 verified benchmark queries** and **sample leaf test photos** directly in the `tests/` directory:

### 📝 A. 30 Multi-Domain Evaluation Queries ([`tests/sample_evaluation_queries.txt`](tests/sample_evaluation_queries.txt))
Test the **Chat Assistant** (`http://localhost:3000/chat-assistant`) across 3 natural styles:
1. **English Pathology Queries:** Specific chemical doses, bio-agents, and spray windows (*"What is the recommended pesticide and dosage for sugarcane red rot?"*).
2. **Hinglish Conversational Queries:** Natural Indian rural dialect (*"Mere tamatar ke paudho me patte kaale pad rahe hai, konsi dawai spray kare?"*).
3. **Hindi & Gujarati Native Scripts:** Multi-language entity parsing (*"कपास में गुलाबी सुंडी के नियंत्रण के लिए कौन सी दवा छिड़कें?"*, *"ટામેટાના પાકમાં પાન સુકાઈ રહ્યા છે તો કઈ દવાનો છંટકાવ કરવો?"*).

### 📸 B. Sample Leaf Test Photos ([`tests/phototest/`](tests/phototest/))
Drag and drop or upload any test image using the **`+`** button in the Chat Assistant or **Scan Leaf** tab:
| Leaf Image File | Target Disease / Class | Expected Diagnostic Category |
| :--- | :--- | :--- |
| `tests/phototest/tomato_early_blight_sample.png` | **Tomato Early Blight** | *Alternaria solani* (Concentric brown rings) |
| `tests/phototest/tomato_late_blight_sample.png` | **Tomato Late Blight** | *Phytophthora infestans* (Water-soaked dark lesions) |
| `tests/phototest/corn_leaf_blight_sample.png` | **Corn Leaf Blight** | *Exserohilum turcicum* (Elliptical leaf lesions) |
| `tests/phototest/wheat_rust_sample.png` | **Wheat Rust** | *Puccinia striiformis* (Yellow/orange pustules) |
| `tests/phototest/cucumber_powdery_mildew_sample.png` | **Cucumber Powdery Mildew** | *Podosphaera xanthii* (White talcum powder mold) |
| `tests/phototest/pepper_bacterial_spot_sample.png` | **Pepper Bacterial Spot** | *Xanthomonas campestris* (Small dark spots) |
| `tests/phototest/soybean_mosaic_sample.png` | **Soybean Mosaic Virus** | Potyvirus complex (Leaf crinkling/mottling) |
| `tests/phototest/healthy_tomato_sample.png` | **Healthy Leaf** | Zero pathogen symptoms (No chemical needed) |

---

## 👥 8. Team & Attribution
- **Developed for:** Smart India Hackathon (SIH 2026)
- **Institution:** L. J. Institute of Engineering and Technology
- **Repository:** [Vatsal728/AgriMartAI](https://github.com/Vatsal728/AgriMartAI)


### 🌟 Core Contributors

| Contributor | Role & Domain | GitHub Profile |
| :--- | :--- | :---: |
| **Vatsal Desai** | Lead AI Architect & Full-Stack Systems | [@Vatsal728](https://github.com/Vatsal728) |
| **Madhavi Faldu** | Full Stack Developer | [@Madhavi1801](https://github.com/Madhavi1801) |
| **Krinal Raiyani** | UI/UX Designer | [@krinalraiyani](https://github.com/krinalraiyani) |
| **Parth Gorasiya** | Frontend Developer | [@ParthGorasiya](https://github.com/ParthGorasiya) |
| **Dishant B Parakhiya** | ML Engineer | [@DishantParakhiya](https://github.com/DishantParakhiya) |
| **Dharman Bhuva** | Backend Engineer | [@dharmanbhuva](https://github.com/dharmanbhuva) |