# AgriSmart AI: Intelligent Crop Protection & Autonomous Agronomy Assistant
**Smart India Hackathon (SIH 2026) | L. J. Institute of Engineering and Technology**

[![Python 3.11+](https://img.shields.io/badge/Python-3.11+-green.svg)](https://www.python.org/)
[![FastAPI](https://img.shields.io/badge/Backend-FastAPI-blue.svg)](https://fastapi.tiangolo.com/)
[![Streamlit](https://img.shields.io/badge/Frontend-Streamlit-red.svg)](https://streamlit.io/)
[![ChromaDB](https://img.shields.io/badge/Vector_RAG-ChromaDB-orange.svg)](https://www.trychroma.com/)
[![PyTorch](https://img.shields.io/badge/PyTorch-2.6_CUDA-EE4C2C.svg)](https://pytorch.org/)
[![PEFT LoRA](https://img.shields.io/badge/Fine--Tuning-QLoRA_FP16-yellow.svg)](https://github.com/huggingface/peft)

---

## 1. Executive Summary & Problem Statement
**AgriSmart AI** is a complete, production-ready AI crop diagnostic and agronomic advisory system. It solves the critical "lab-to-field" generalization problem and provides 100% grounded, zero-hallucination crop prescriptions.

### Core Architectural Pillars:
1. **Multimodal Dual-Engine Vision AI**:
   - **EfficientNet-B0 (Cloud Precision)**: **99.74% Accuracy**, 9.26 ms latency.
   - **MobileNet-V3 (Mobile Edge)**: **99.47% Accuracy**, 5.80 ms latency.
   - Supports 38 crop disease classes across Tomato, Potato, Corn, Apple, Grape, Pepper, Cotton, Rice, Wheat, Sugarcane, Okra, and Cassava.
2. **Deterministic Hybrid RAG Engine**:
   - 440-page digital Plant Pathology textbook (*MBO09*) indexed in **ChromaDB** (758 semantic passages).
   - Structured ICAR/TNAU protocols with certified Indian metric dosages (*Indofil M-45 @ 2.5g/L, Streptocycline @ 100-200 ppm, Tebuconazole @ 1ml/L*).
3. **Fine-Tuned Domain LLM (QLoRA / FP16)**:
   - 2,601 verified Indian agronomy training pairs covering disease cures, tank-mix compatibility, resistance management (FRAC), Hinglish farmer queries, and security guardrails.
4. **Agrometeorological Spray & Smart Irrigation**:
   - Real-time Open-Meteo satellite weather integration with rain wash-off rules and wind drift thresholds.
   - FAO-56 evapotranspiration models and IoT soil moisture telemetry.

---

## 2. Implemented Modules (Core + SIH Bonus)

| Module | Category | Description | Status |
| :--- | :--- | :--- | :--- |
| **Multimodal Crop Diagnosis** | **Core Mandatory** | Accepts a leaf image + farmer question simultaneously; outputs exact disease classification & confidence. | ✅ Implemented |
| **Grounded Field Action Plan** | Core Mandatory | 4-part treatment cards: Chemical Control, Organic Bio-Remedies, Cultural Prevention, Live Spray Decision. | ✅ Implemented |
| **Offline Vector RAG** | Bonus Module A | ChromaDB vector search backed by *MBO09 Plant Pathology* textbook. | ✅ Implemented |
| **Smart Irrigation** | Bonus Module B | Logic predicting irrigation timing based on soil moisture and 24h precipitation probability. | ✅ Implemented |
| **Weather-Based Intelligence**| Bonus Module C | Real-time satellite geocoding, humidity, and wind-drift chemical spray window planner. | ✅ Implemented |
| **Sustainability Score** | Bonus Module D | Quantified water conservation score (liters saved/acre) and eco-friendly practice index. | ✅ Implemented |
| **Farmer Assistant (GenAI)** | Bonus Module E | Conversational reasoning engine citing verified agricultural and plant pathology literature. | ✅ Implemented |

| **IoT Sensor Telemetry** | Bonus Module F | Real-time telemetry stream simulator (Soil Moisture %, pH, NPK, Soil Temp). | ✅ Implemented |
| **Autonomous Agentic Advisor**| Bonus Module G | Continuous reasoning loop combining IoT sensors, weather, and diagnosis into a single field plan. | ✅ Implemented |

---

## 3. Quickstart & Reproduction Guide (< 5 Minutes)

### Step 1: Clone Repository & Setup Environment
```bash
git clone https://github.com/Vatsal728/AgriMartAI.git
cd AgriMartAI

# Install dependencies
pip install -r requirements.txt
```

### Step 2: Ingest ChromaDB Agronomy Vector Database
```bash
python -m src.rag_pipeline.ingest_vector_db
```

### Step 3: Run Leaf Disease CLI Prediction
```bash
python -m src.cv_pipeline.predict --image "data/plantvillage/test/test/PotatoEarlyBlight1.JPG"
```

### Step 4: Launch Interactive Web Dashboard
```bash
streamlit run app/frontend_app.py --server.port 8502
```
*Or double-click `run_dashboard.bat` on Windows.*

### Step 5: (Optional) Launch FastAPI Backend Server
```bash
python -m uvicorn src.api.main:app --host 0.0.0.0 --port 8000 --reload
# Interactive Swagger Documentation available at: http://localhost:8000/docs
```

### Step 6: (Optional) Fine-Tune Large Language Model (QLoRA / LoRA)
```bash
python src/cv_pipeline/train_agri_llm.py --model "google/flan-t5-base" --epochs 3 --batch_size 4
```

---

## 4. Frontend & Backend API Integration

The system exposes clean REST endpoints for React / Next.js / Flutter mobile integration:

| Endpoint | Method | Payload | Description |
| :--- | :--- | :--- | :--- |
| `/predict` | `POST` | `multipart/form-data` (`file`) | Classifies leaf image and returns disease + confidence. |
| `/advisory` | `POST` | `{"disease_name": "...", "location": "..."}` | Generates full ICAR treatment plan + weather spray rules. |
| `/weather` | `GET` | `?location=Ahmedabad` | Returns satellite temperature, rain risk, and spray safety. |
| `/telemetry` | `GET` | `?soil_type=Black Cotton` | Returns real-time IoT soil moisture, NPK, and pH levels. |
| `/health` | `GET` | None | Real-time system and AI model health checks. |

*Full integration code examples are documented in [`FRONTEND_BACKEND_INTEGRATION.txt`](FRONTEND_BACKEND_INTEGRATION.txt).*

---

## 5. Directory Structure

```text
AgriMartAI/
├── README.md                           # Master project documentation
├── requirements.txt                    # Project dependencies
├── run_dashboard.bat                   # 1-Click Streamlit dashboard launcher
├── FRONTEND_BACKEND_INTEGRATION.txt    # Frontend API handoff guide
├── data/
│   ├── BOOK_DS/
│   │   ├── main_dataset.json           # 2,601 verified Indian agronomy training pairs
│   │   └── MBO09.pdf                   # 440-page digital Plant Pathology textbook
│   ├── textbooks_structured.json       # 38-class structured ICAR disease protocols
│   └── agriculture_qa_huggingface.json # 25,410 farmer Q&A knowledge records
├── src/
│   ├── cv_pipeline/
│   │   ├── predict.py                  # Core CV inference interface
│   │   ├── benchmark_models.py         # Cloud vs Edge benchmarking script
│   │   ├── train_agri_llm.py           # QLoRA / LoRA GPU training pipeline
│   │   └── build_production_dataset.py # High-density agronomy dataset builder
│   ├── rag_pipeline/
│   │   ├── ingest_vector_db.py         # ChromaDB indexing engine
│   │   └── retriever.py                # Deterministic entity-aware semantic retriever
│   ├── advisor/
│   │   ├── agentic_advisor.py          # Autonomous multi-signal reasoning loop
│   │   ├── weather_service.py          # Open-Meteo satellite & FAO-56 ET0 model
│   │   ├── sensor_stream.py            # IoT telemetry simulator
│   │   └── soil_database.py            # Indian agro-ecological soil zones
│   └── api/
│       ├── main.py                     # FastAPI REST server
│       └── schemas.py                  # Pydantic request/response schemas
├── app/
│   └── frontend_app.py                 # Streamlit UI dashboard
├── models/
│   ├── efficientnet_b0_best.pth        # 99.74% Accuracy Cloud Backbone
│   ├── mobilenet_v3_best.pth           # 99.47% Accuracy Edge Backbone
│   └── benchmark_results.json          # Benchmark metrics & latency logs
└── vector_store/                       # ChromaDB persistent vector database
```

---

## 6. Literature & Dataset Grounding
1. **Agricultural Knowledge Base & Standards**:
   - Digital Plant Pathology Textbook (*MBO09*)
   - Standard Plant Pathology and Agronomy Reference Protocols
   - 25,410+ Verified Agricultural Expert Q&A Knowledge Base
2. **Computer Vision Datasets**:
   - *New Plant Diseases Dataset (Augmented)*: 38 disease & healthy classes across 14 crops.
   - *FieldPlant & PlantDoc*: Real-world natural background field validation.


---

## 7. License & Declaration
Developed for the **Smart India Hackathon (SIH 2026)**. All third-party libraries, datasets, and pretrained backbones are credited in accordance with the Problem Statement guidelines.
