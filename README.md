# AgriSmart AI: Intelligent Agriculture for a Sustainable Future
**SIH - 2026 Internal Hackathon | L. J. Institute of Engineering and Technology**

[![Python 3.11](https://img.shields.io/badge/Python-3.11-green.svg)](https://www.python.org/)
[![FastAPI](https://img.shields.io/badge/Backend-FastAPI-blue.svg)](https://fastapi.tiangolo.com/)
[![Streamlit](https://img.shields.io/badge/Frontend-Streamlit-red.svg)](https://streamlit.io/)
[![ChromaDB](https://img.shields.io/badge/RAG-ChromaDB-orange.svg)](https://www.trychroma.com/)

---

## 1. Executive Summary & Problem Framing
**AgriSmart AI** addresses the critical "lab-to-field" domain shift in crop disease detection. Models that memorize clean lab images degrade sharply in real-world fields due to background clutter, lighting, and occlusions. AgriSmart AI combines:
1. **Two-Stage Computer Vision Pipeline:** YOLO leaf detection and bounding box cropping + Transfer Learning Classifier.
2. **Offline Grounded RAG Pipeline:** Vector embeddings of agronomic textbooks stored locally in **ChromaDB** to eliminate GenAI hallucinations.
3. **Autonomous Agentic Advisor:** Real-time synthesis of disease predictions, live weather forecasts, and simulated IoT soil sensor telemetry.

---

## 2. Implemented Modules (Core + Bonus)

| Module | Category | Description | Status |
| :--- | :--- | :--- | :--- |
| **Crop Disease Detection** | **Core Mandatory** | Accepts a single leaf image, outputs exact class string + confidence score via `predict(image_path)`. | ✅ Implemented |
| **Smart Irrigation** | Bonus Module B | Logic predicting irrigation timing based on soil moisture and 24h rain probability. | ✅ Implemented |
| **Weather-Based Intelligence** | Bonus Module C | OpenWeatherMap integration + dynamic agricultural weather risk analyzer. | ✅ Implemented |
| **Sustainability Score** | Bonus Module D | Quantified water conservation score (liters saved/acre) and chemical reduction metrics. | ✅ Implemented |
| **Farmer Assistant (GenAI)** | Bonus Module E | Grounded conversational explanations citing verified textbook remedies. | ✅ Implemented |
| **IoT Sensor Telemetry** | Bonus Module F | Simulated ESP32 real-time telemetry stream (Moisture, pH, NPK, Soil Temp). | ✅ Implemented |
| **Autonomous Agentic Advisor**| Bonus Module G | Continuous reasoning loop combining all sensor and diagnostic data. | ✅ Implemented |

---

## 3. Quickstart & Reproduction Guide (< 10 Minutes)

### Step 1: Clone and Install Dependencies
```bash
git clone https://github.com/your-username/AgriMartAI.git
cd AgriMartAI

# Install dependencies
pip install -r requirements.txt
```

### Step 2: Ingest Grounded Agronomy Knowledge Base (RAG)
```bash
python -m src.rag_pipeline.ingest_vector_db
```

### Step 3: Run Mandatory Core CLI Prediction
```bash
python -m src.cv_pipeline.predict --image "archive/train/images/sample.jpg"
```

### Step 4: Launch Interactive Web Dashboard
```bash
streamlit run app/frontend_app.py
```

### Step 5: (Optional) Launch FastAPI Backend
```bash
python -m src.api.main
# Swagger Docs available at: http://localhost:8000/docs
```

---

## 4. Dataset & Citations
1. **FieldPlant (Field Images):** Roboflow Universe (Version 11, CC BY 4.0). Real-world field captures across Cassava, Corn, and Tomato.
2. **PlantVillage / New Plant Diseases Dataset (Lab Images):** Samir Bhattarai (Kaggle). Clean augmented lab images used for transfer learning feature generalization.
3. **Agronomy Knowledge Base:** Structured treatments and management guidelines from standard agricultural extension publications.

---

## 5. Directory Structure

```text
agrismart-ai/
├── README.md                      # Entry point, setup, and submission contract
├── requirements.txt               # Dependencies
├── .env.example                   # Environment configuration
├── data/
│   ├── raw_images/                # Raw datasets (FieldPlant & PlantVillage)
│   └── textbooks_structured.json  # Cleaned agronomy knowledge base
├── src/
│   ├── cv_pipeline/
│   │   ├── dataset_builder.py     # Stratified split & class mapping
│   │   └── predict.py             # Mandatory prediction interface
│   ├── rag_pipeline/
│   │   ├── ingest_vector_db.py    # ChromaDB indexing
│   │   └── retriever.py           # Semantic search & grounded retrieval
│   ├── advisor/
│   │   ├── weather_service.py     # Live / simulated weather
│   │   ├── sensor_stream.py       # IoT sensor stream
│   │   └── agentic_advisor.py     # Autonomous reasoning loop
│   └── api/
│       ├── main.py                # FastAPI backend server
│       └── schemas.py             # Pydantic request/response schemas
├── app/
│   └── frontend_app.py            # Streamlit user interface
├── vector_store/                  # Embedded ChromaDB files
└── report/
    └── model_report.pdf           # 1-page report
```

---

## 6. Originality & License Declaration
This project is developed for the SIH-2026 Internal Hackathon. All third-party libraries, pretrained backbones, and public datasets are cited in accordance with Section 8 of the Problem Statement.
