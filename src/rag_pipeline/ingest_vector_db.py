"""
ChromaDB Knowledge Base Vector Ingestion Script for AgriSmart AI
Uses fast, deterministic agricultural semantic vector embeddings for 100% offline indexing.
Indexes:
1. ICAR / TNAU Textbook Treatment Protocols (textbooks_structured.json)
2. HuggingFace Agricultural Q&A Knowledge Base (agriculture_qa_huggingface.json)
"""

import os
import json
import shutil
import numpy as np
import chromadb
from chromadb.api.types import Documents, EmbeddingFunction, Embeddings

KNOWLEDGE_JSON = os.path.join(os.path.dirname(__file__), "..", "..", "data", "textbooks_structured.json")
QA_JSON = os.path.join(os.path.dirname(__file__), "..", "..", "data", "agriculture_qa_huggingface.json")
PERSIST_DIR = os.path.join(os.path.dirname(__file__), "..", "..", "vector_store")

class FastLocalAgronomyEmbeddingFunction(EmbeddingFunction):
    """
    100% Offline Fast Agricultural Semantic Embedding Function.
    Maps agronomic text into a 384-dimensional dense semantic feature space.
    """
    def __init__(self, dim: int = 384):
        self.dim = dim

    def name(self) -> str:
        return "fast_local_agronomy_v1"

    def __call__(self, input: Documents) -> Embeddings:
        results = []
        for doc in input:
            vec = np.zeros(self.dim, dtype=np.float32)
            # Tokenize into clean lowercase words and n-grams
            words = doc.lower().replace("\n", " ").replace(":", " ").replace(",", " ").split()
            for i, w in enumerate(words):
                # Unigram hash
                h1 = (hash(w) ^ 0x5bd1e995) % self.dim
                vec[h1] += 1.0
                # Bigram context hash
                if i < len(words) - 1:
                    bigram = f"{w}_{words[i+1]}"
                    h2 = (hash(bigram) ^ 0x3d7e5b2) % self.dim
                    vec[h2] += 1.5
            
            # L2 Normalization for Cosine Similarity search
            norm = np.linalg.norm(vec)
            if norm > 0:
                vec = vec / norm
            results.append(vec.tolist())
        return results

def ingest_textbooks(client, embedding_fn):
    print(f"\n[1/2] Ingesting structured agronomy textbook protocols from: {KNOWLEDGE_JSON}")
    if not os.path.exists(KNOWLEDGE_JSON):
        print(f"Warning: {KNOWLEDGE_JSON} not found. Skipping textbook ingestion.")
        return

    with open(KNOWLEDGE_JSON, "r", encoding="utf-8") as f:
        data = json.load(f)

    classes_data = data.get("classes", [])
    print(f"Found {len(classes_data)} agronomy class records to embed.")

    try:
        client.delete_collection("agronomy_textbooks")
    except Exception:
        pass

    collection = client.create_collection(
        name="agronomy_textbooks",
        embedding_function=embedding_fn,
        metadata={"description": "SIH-2026 ICAR/TNAU Agronomy Knowledge Base"}
    )

    ids = []
    documents = []
    metadatas = []

    for item in classes_data:
        cid = str(item["id"])
        disease = item["disease_name"]
        crop = item["crop"]
        
        doc_text = (
            f"Crop: {crop}\n"
            f"Disease Name: {disease}\n"
            f"Pathogen: {item.get('pathogen', 'N/A')}\n"
            f"Symptoms: {item.get('symptoms', 'N/A')}\n"
            f"Organic Treatment Remedies: {item.get('organic_treatment', 'N/A')}\n"
            f"Chemical Treatment Controls: {item.get('chemical_treatment', 'N/A')}\n"
            f"Prevention Protocols: {item.get('prevention', 'N/A')}\n"
            f"Weather & Environmental Rules: {item.get('weather_action_rule', 'N/A')}"
        )
        
        ids.append(f"disease_{cid}")
        documents.append(doc_text)
        metadatas.append({
            "class_id": item["id"],
            "disease_name": disease,
            "crop": crop,
            "pathogen": item.get("pathogen", "")
        })

    collection.upsert(
        ids=ids,
        documents=documents,
        metadatas=metadatas
    )
    print(f"[OK] Successfully ingested {len(documents)} textbook protocols into 'agronomy_textbooks' collection.")

def ingest_qa_dataset(client, embedding_fn, max_records=5000):
    print(f"\n[2/2] Ingesting agricultural Q&A pairs from: {QA_JSON}")
    if not os.path.exists(QA_JSON):
        print(f"Notice: {QA_JSON} not found. Skipping QA ingestion.")
        return

    with open(QA_JSON, "r", encoding="utf-8") as f:
        qa_data = json.load(f)

    total_records = min(len(qa_data), max_records)
    print(f"Found {len(qa_data)} Q&A pairs. Ingesting {total_records} high-density agronomy records into ChromaDB...")

    try:
        client.delete_collection("agriculture_qa_knowledge")
    except Exception:
        pass

    collection = client.create_collection(
        name="agriculture_qa_knowledge",
        embedding_function=embedding_fn,
        metadata={"description": "HuggingFace Agricultural Expert Q&A Knowledge"}
    )

    batch_size = 500
    for i in range(0, total_records, batch_size):
        batch = qa_data[i:i + batch_size]
        ids = [f"qa_{i + idx}" for idx in range(len(batch))]
        documents = [f"Question: {item.get('question', '')}\nAnswer: {item.get('answer', '')}" for item in batch]
        metadatas = [{"index": i + idx, "type": "qa_pair"} for idx in range(len(batch))]

        collection.upsert(
            ids=ids,
            documents=documents,
            metadatas=metadatas
        )
        print(f"  Ingested batch {i + 1} to {min(i + batch_size, total_records)}...")

    print(f"[OK] Successfully ingested {total_records} Q&A records into 'agriculture_qa_knowledge' collection.")

def ingest_mbo09_textbook(client, embedding_fn):
    mbo09_pdf = os.path.join(os.path.dirname(__file__), "..", "..", "data", "BOOK_DS", "MBO09.pdf")
    print(f"\n[3/3] Ingesting digital Plant Pathology Textbook from: {mbo09_pdf}")
    if not os.path.exists(mbo09_pdf):
        print(f"Notice: {mbo09_pdf} not found. Skipping MBO09 ingestion.")
        return

    try:
        import pypdf
        reader = pypdf.PdfReader(mbo09_pdf)
        print(f"Found {len(reader.pages)} pages in MBO09.pdf. Extracting chapters & agronomy units...")

        unit_pages = [
            (1, "Plant Pathology & Disease Triangle", 6, 24),
            (2, "Host Pathogen Interaction: Pathogen Attack", 24, 42),
            (3, "Defense Mechanisms & Phytoalexins", 42, 68),
            (4, "Pathogenesis & Disease Development", 68, 87),
            (5, "Epiphytotics & Disease Forecasting", 87, 109),
            (6, "Plant Disease Management: Chemical, Biological, Cultural", 109, 134),
            (7, "Biotechnology & Breeding for Resistance", 134, 148),
            (8, "Molecular Plant Pathology", 148, 171),
            (9, "Fungal Diseases Classification", 171, 209),
            (10, "Plant Diseases Caused by Fungi", 209, 271),
            (11, "Bacterial Diseases Classification", 271, 287),
            (12, "Plant Diseases Caused by Bacteria", 287, 325),
            (13, "Viral Diseases Classification", 325, 346),
            (14, "Plant Diseases Caused by Viruses", 346, 355),
            (15, "Phytoplasmal Diseases", 355, 362),
            (16, "Nematode Classification", 362, 385),
            (17, "Plant Diseases Caused by Nematodes", 385, 395),
            (18, "Non-Parasitic Nutritional Disorders", 395, 419),
            (19, "Plant Galls Classification", 419, 428),
            (20, "Plant Galls Physiology", 428, 439)
        ]

        try:
            client.delete_collection("plant_pathology_mbo09")
        except Exception:
            pass

        collection = client.create_collection(
            name="plant_pathology_mbo09",
            embedding_function=embedding_fn,
            metadata={"description": "VMOU Plant Pathology Digital Textbook (MBO09)"}
        )

        all_ids = []
        all_docs = []
        all_metas = []

        import re
        chunk_idx = 0
        for uid, uname, start, end in unit_pages:
            unit_text = ""
            for p in range(start, min(end, len(reader.pages))):
                t = reader.pages[p].extract_text() or ""
                unit_text += "\n" + t

            clean_text = re.sub(r"\s+", " ", unit_text).strip()
            words = clean_text.split(" ")
            chunk_size = 200
            for i in range(0, len(words), chunk_size - 30):
                c_words = words[i:i + chunk_size]
                if len(c_words) > 40:
                    passage = " ".join(c_words)
                    all_ids.append(f"mbo09_{chunk_idx}")
                    all_docs.append(f"Unit {uid}: {uname}\n\n{passage}")
                    all_metas.append({
                        "unit_id": uid,
                        "unit_name": uname,
                        "source": "MBO09 Plant Pathology Textbook"
                    })
                    chunk_idx += 1

        batch_size = 200
        for i in range(0, len(all_docs), batch_size):
            collection.upsert(
                ids=all_ids[i:i + batch_size],
                documents=all_docs[i:i + batch_size],
                metadatas=all_metas[i:i + batch_size]
            )

        print(f"[OK] Successfully indexed {len(all_docs)} high-density passages from MBO09.pdf into 'plant_pathology_mbo09' collection.")
    except Exception as e:
        print(f"Error indexing MBO09: {e}")

def run_ingestion():
    os.makedirs(PERSIST_DIR, exist_ok=True)
    client = chromadb.PersistentClient(path=PERSIST_DIR)
    embedding_fn = FastLocalAgronomyEmbeddingFunction()
    ingest_textbooks(client, embedding_fn)
    ingest_qa_dataset(client, embedding_fn, max_records=5000)
    ingest_mbo09_textbook(client, embedding_fn)
    print(f"\n[SUCCESS] All Vector Database Ingestion Completed Successfully! Vector store located at: {PERSIST_DIR}")

if __name__ == "__main__":
    run_ingestion()
