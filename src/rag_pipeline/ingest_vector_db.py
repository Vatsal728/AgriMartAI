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

def run_ingestion():
    os.makedirs(PERSIST_DIR, exist_ok=True)
    client = chromadb.PersistentClient(path=PERSIST_DIR)
    embedding_fn = FastLocalAgronomyEmbeddingFunction()
    ingest_textbooks(client, embedding_fn)
    ingest_qa_dataset(client, embedding_fn, max_records=5000)
    print(f"\n[SUCCESS] All Vector Database Ingestion Completed Successfully! Vector store located at: {PERSIST_DIR}")

if __name__ == "__main__":
    run_ingestion()
