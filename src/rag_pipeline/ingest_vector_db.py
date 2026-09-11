"""
ChromaDB Knowledge Base Vector Ingestion Script for AgriSmart AI
Chunks and embeds structured agronomy knowledge into vector_store/
"""

import os
import json
import chromadb
from chromadb.utils import embedding_functions

KNOWLEDGE_JSON = os.path.join(os.path.dirname(__file__), "..", "..", "data", "textbooks_structured.json")
PERSIST_DIR = os.path.join(os.path.dirname(__file__), "..", "..", "vector_store")

def ingest_knowledge():
    print(f"Reading structured agronomy knowledge base from: {KNOWLEDGE_JSON}")
    if not os.path.exists(KNOWLEDGE_JSON):
        raise FileNotFoundError(f"Knowledge base not found at {KNOWLEDGE_JSON}")

    with open(KNOWLEDGE_JSON, "r", encoding="utf-8") as f:
        data = json.load(f)

    classes_data = data.get("classes", [])
    print(f"Found {len(classes_data)} agronomy class records to embed.")

    os.makedirs(PERSIST_DIR, exist_ok=True)
    client = chromadb.PersistentClient(path=PERSIST_DIR)
    
    # Use default embedding function or all-MiniLM-L6-v2
    collection = client.get_or_create_collection(
        name="agronomy_textbooks",
        metadata={"description": "SIH-2026 Agronomy Knowledge Base for Crop Disease Advisory"}
    )

    ids = []
    documents = []
    metadatas = []

    for item in classes_data:
        cid = str(item["id"])
        disease = item["disease_name"]
        crop = item["crop"]
        
        # Build comprehensive semantic text chunk
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

    # Upsert into ChromaDB
    collection.upsert(
        ids=ids,
        documents=documents,
        metadatas=metadatas
    )

    print(f"Successfully ingested and indexed {len(documents)} agronomy records into ChromaDB at '{PERSIST_DIR}'!")

if __name__ == "__main__":
    ingest_knowledge()
