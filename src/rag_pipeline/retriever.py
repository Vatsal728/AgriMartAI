"""
RAG Semantic Retriever for AgriSmart AI
Queries ChromaDB vector database to retrieve grounded agronomic remedies and prevention rules.
"""

import os
import json
import chromadb

PERSIST_DIR = os.path.join(os.path.dirname(__file__), "..", "..", "vector_store")
FALLBACK_JSON = os.path.join(os.path.dirname(__file__), "..", "..", "data", "textbooks_structured.json")

class AgronomyRetriever:
    def __init__(self, persist_dir=PERSIST_DIR):
        self.persist_dir = persist_dir
        self.collection = None
        self._fallback_data = None
        self._init_db()

    def _init_db(self):
        try:
            if os.path.exists(self.persist_dir) and len(os.listdir(self.persist_dir)) > 0:
                client = chromadb.PersistentClient(path=self.persist_dir)
                self.collection = client.get_collection(name="agronomy_textbooks")
        except Exception as e:
            print(f"[RAG Init Notice] ChromaDB direct load notice: {e}. Using JSON fallback.")
            self._load_fallback()

    def _load_fallback(self):
        if os.path.exists(FALLBACK_JSON):
            with open(FALLBACK_JSON, "r", encoding="utf-8") as f:
                self._fallback_data = json.load(f).get("classes", [])

    def retrieve_guidance(self, disease_name: str, query_context: str = "") -> dict:
        """
        Retrieves grounded advisory context for a given disease name and optional query context.
        """
        # Try ChromaDB query
        if self.collection is not None:
            try:
                query_text = f"{disease_name} symptoms remedies organic chemical treatments {query_context}"
                results = self.collection.query(
                    query_texts=[query_text],
                    n_results=2
                )
                if results and results["documents"] and len(results["documents"][0]) > 0:
                    top_doc = results["documents"][0][0]
                    metadata = results["metadatas"][0][0]
                    return {
                        "disease_name": metadata.get("disease_name", disease_name),
                        "crop": metadata.get("crop", "Unknown"),
                        "retrieved_context": top_doc,
                        "source": "ChromaDB Vector Store (Indexed Agronomy Textbooks)"
                    }
            except Exception as e:
                print(f"[RAG Query Error] {e}")

        # Fallback to direct structured JSON lookup
        if self._fallback_data is None:
            self._load_fallback()

        if self._fallback_data:
            for item in self._fallback_data:
                if item["disease_name"].lower() == disease_name.lower():
                    context = (
                        f"Crop: {item['crop']}\n"
                        f"Disease: {item['disease_name']}\n"
                        f"Pathogen: {item.get('pathogen', 'N/A')}\n"
                        f"Symptoms: {item.get('symptoms', 'N/A')}\n"
                        f"Organic Remedies: {item.get('organic_treatment', 'N/A')}\n"
                        f"Chemical Control: {item.get('chemical_treatment', 'N/A')}\n"
                        f"Prevention: {item.get('prevention', 'N/A')}\n"
                        f"Weather Action Rule: {item.get('weather_action_rule', 'N/A')}"
                    )
                    return {
                        "disease_name": item["disease_name"],
                        "crop": item["crop"],
                        "retrieved_context": context,
                        "details": item,
                        "source": "Agronomy Knowledge Base JSON"
                    }

        return {
            "disease_name": disease_name,
            "crop": disease_name.split()[0] if disease_name else "Unknown",
            "retrieved_context": f"Maintain standard crop sanitation and consult a local agricultural extension officer for {disease_name}.",
            "source": "Default Guidance"
        }

if __name__ == "__main__":
    retriever = AgronomyRetriever()
    res = retriever.retrieve_guidance("Tomato Brown Spots")
    print("\n--- Retrieved Guidance ---")
    print(res["retrieved_context"])
