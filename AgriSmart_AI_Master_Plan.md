# AgriSmart AI: Complete End-to-End Execution Plan & Technical Blueprint (SIH-2026)

## 1. Executive Summary & Core Mission
**AgriSmart AI** is an intelligent agricultural advisory platform designed to solve the critical "lab-to-field" domain shift in crop disease detection [cite: 2]. By combining a two-stage Computer Vision pipeline (YOLO leaf detection + EfficientNet classification) with an offline Retrieval-Augmented Generation (RAG) LLM engine and real-time data integrations, this project delivers actionable, scientifically grounded guidance to farmers [cite: 2].

---

## 2. Complete Technology Stack
To ensure high performance locally on the Dell G15 (RTX 3050 4GB VRAM, i5-12500H, 16GB DDR5 RAM, Drive E storage) while fulfilling all SIH-2026 requirements, the following tech stack is utilized:

### 2.1 Artificial Intelligence & Machine Learning
* **Computer Vision Framework:** PyTorch & Ultralytics YOLOv8 (for bounding box leaf detection and classification).
* **Vision Backbone:** EfficientNet-B0 / ResNet-34 (lightweight architectures optimized for 4GB VRAM training using mixed precision `fp16=True`).
* **Embeddings Model:** `sentence-transformers` (`all-MiniLM-L6-v2`) for converting text chunks into dense vector embeddings locally.
* **Local LLM Engine:** Ollama running quantized Llama-3-8B-Instruct (offloaded to system RAM and CPU threads, bypassing GPU limits).

### 2.2 Backend & Data Ingestion
* **Core API Framework:** FastAPI (Python) for high-performance asynchronous request handling.
* **Vector Database:** ChromaDB (embedded locally in the `vector_store/` directory for fast, offline similarity search).
* **Data Processing & OCR:** OpenCV, Pillow (PIL), PyPDF2, and pandas for image augmentation and textbook text structuring.

### 2.3 Frontend User Interface
* **Rapid Prototyping Dashboard:** Streamlit (Python-based UI for instant testing of image uploads, disease predictions, and chat responses).
* **Production UI (Optional):** Next.js / Tailwind CSS (for polished frontend presentation during final demo and video submission).

### 2.4 External APIs & Integrations (Bonus Modules)
* **Weather Intelligence:** OpenWeatherMap API (fetching live forecast, rain probability, and temperature data).
* **Sensor Simulation:** Custom Python mock data stream simulating soil moisture, pH levels, and ambient temperature (satisfying IoT Bonus Module F without physical hardware) [cite: 2].

---

## 3. Team Role Distribution & Responsibilities
While this plan outlines the entire project scope for a collaborative team, the **Core AI, Computer Vision Training, and Backend Architecture** are designated to Vatsal, leveraging the Dell G15 setup.

| Module / Pillar | Primary Owner / Lead | Key Deliverables & Responsibilities |
| :--- | :--- | :--- |
| **Dataset & CV Pipeline** | **Vatsal** | FieldPlant data preprocessing, YOLOv8 bounding box training, EfficientNet classification training, hyperparameter tuning (`batch=4`, `imgsz=640`, mixed precision), and writing the mandatory `predict.py` inference script. |
| **Backend & RAG Engine** | **Vatsal** | FastAPI server setup, agricultural textbook OCR/parsing, ChromaDB vector store ingestion, local LLM orchestration (Ollama/Llama-3), and connecting CV output to text retrieval. |
| **Frontend & UI / UX** | Teammate A | Streamlit or Next.js responsive web application, camera/image upload interface, chat dashboard for the GenAI assistant, and multi-language support. |
| **External APIs & Sensor Feed** | Teammate B | Live weather API integration (OpenWeatherMap), simulated IoT soil moisture/pH sensor stream, and rule-based triggering logic for the Agentic Advisor. |
| **Documentation & Video** | Joint Effort | GitHub README.md structuring, the 1-page model report (`report/model_report.pdf`), metric tracking (Macro-F1, Confusion Matrix), and the 3–5 minute final demo video. |

---

## 4. Step-by-Step Implementation Roadmap

### Phase 1: Data Acquisition & Preparation (Days 1–2)
* **Action:** Download the **FieldPlant** dataset (approx. 6 GB compressed / 12 GB extracted) and store it locally on **Drive E**.
* **Action:** Digitize and structure regional agricultural textbooks into clean JSON format containing disease symptoms, organic/chemical treatments, and preventive protocols.
* **Validation:** Verify that all dataset classes cleanly map to the hackathon's required shared class list (~15–20 disease classes + "healthy") [cite: 2].

### Phase 2: Computer Vision Model Training (Days 3–5)
* **Action (Vatsal):** Train Stage 1 YOLOv8 leaf detection model on FieldPlant bounding boxes using low-VRAM constraints (`batch=4`, `imgsz=640`, `fp16=True`) on the RTX 3050.
* **Action (Vatsal):** Train Stage 2 EfficientNet classification backbone on cropped leaves, combining FieldPlant field images with PlantVillage lab images to ensure robust generalization [cite: 2].
* **Action (Vatsal):** Implement and test the mandatory `predict(image_path)` function inside `predict.py`, outputting the exact string label and confidence score.
* **Validation:** Generate the Macro-F1 score and confusion matrix on the held-out validation split.

### Phase 3: RAG Knowledge Base & Backend Integration (Days 6–7)
* **Action (Vatsal):** Chunk the structured textbook JSON and embed it into a local ChromaDB vector store using `all-MiniLM-L6-v2`.
* **Action (Vatsal):** Build a FastAPI backend (`src/api/main.py`) that accepts the image, triggers `predict.py`, retrieves matching textbook context via vector search, and pipes it into a local quantized Llama-3 model via Ollama.
* **Action (Teammate B):** Connect weather API calls and simulated soil sensor feeds to dynamically inject environmental context into the LLM prompt.

### Phase 4: Frontend UI & Agentic Orchestration (Days 8–9)
* **Action (Teammate A):** Connect the Next.js or Streamlit frontend to the FastAPI backend endpoints.
* **Action (Joint):** Test the complete end-to-end loop: Image Upload → YOLO Crop → Disease Classification → RAG Text Retrieval → Weather/Sensor Check → Final Farmer Advisory.

### Phase 5: Submission Polish & Documentation (Day 10)
* **Action (Joint):** Finalize the GitHub repository structure, write a comprehensive `README.md` with explicit setup instructions under 10 minutes, and compile the 1-page model report PDF.
* **Action (Joint):** Record and edit the 3–5 minute demo video showcasing the core CV task and bonus modules [cite: 2].

---

## 5. Repository Structure Blueprint (`agrismart-ai/`)

```text
agrismart-ai/
├── README.md                      # Entry point, metrics, setup instructions
├── requirements.txt               # Python dependencies
├── .env.example                   # Configuration keys (Weather API, etc.)
├── data/                          # Local data storage on Drive E
│   ├── raw_images/                # FieldPlant & PlantVillage datasets
│   └── textbooks_structured.json  # Cleaned agronomy knowledge base
├── src/
│   ├── cv_pipeline/
│   │   ├── train_yolo.py          # YOLO leaf detection training script
│   │   ├── train_classifier.py    # EfficientNet classification script
│   │   └── predict.py             # Mandatory core prediction interface
│   ├── rag_pipeline/
│   │   ├── ingest_vector_db.py    # Textbook embedding & ChromaDB setup
│   │   └── retriever.py           # Semantic search query logic
│   └── api/
│       └── main.py                # FastAPI backend server
├── app/
│   └── frontend_app.py            # Streamlit / Next.js user interface
├── vector_store/                  # Local vector database files
├── models/                        # Saved model weights (.pt / .pth)
└── report/                        # Mandatory 1-page model report PDF
```

---

## 6. Success Metrics & Compliance Checklist
* **Core Task Compliance:** Model accepts a single image and outputs exact class string + confidence score via `predict.py` [cite: 2].
* **Evaluation Metric:** Macro-F1 and confusion matrix accurately reported on validation splits [cite: 2].
* **GenAI Grounding:** All LLM outputs strictly restricted to retrieved textbook data via RAG to eliminate hallucinations.
* **Hardware Efficiency:** Local execution optimized for Dell G15 (RTX 3050 4GB VRAM constrained training, CPU/RAM offloaded LLM).
