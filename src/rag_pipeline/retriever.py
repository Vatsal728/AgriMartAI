"""
RAG Semantic Retriever for AgriSmart AI
Queries ChromaDB vector database to retrieve grounded agronomic remedies, pathogen info, and expert Q&A.
"""

import os
import sys
import json
import chromadb

try:
    from src.rag_pipeline.ingest_vector_db import FastLocalAgronomyEmbeddingFunction
except ImportError:
    sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "..")))
    from src.rag_pipeline.ingest_vector_db import FastLocalAgronomyEmbeddingFunction

PERSIST_DIR = os.path.join(os.path.dirname(__file__), "..", "..", "vector_store")
FALLBACK_JSON = os.path.join(os.path.dirname(__file__), "..", "..", "data", "textbooks_structured.json")

class AgronomyRetriever:
    def __init__(self, persist_dir=PERSIST_DIR):
        self.persist_dir = persist_dir
        self.textbook_collection = None
        self.qa_collection = None
        self.embedding_fn = FastLocalAgronomyEmbeddingFunction()
        self._fallback_data = None
        self._init_db()

    def _init_db(self):
        try:
            if os.path.exists(self.persist_dir) and len(os.listdir(self.persist_dir)) > 0:
                client = chromadb.PersistentClient(path=self.persist_dir)
                self.textbook_collection = client.get_collection(
                    name="agronomy_textbooks",
                    embedding_function=self.embedding_fn
                )
                try:
                    self.qa_collection = client.get_collection(
                        name="agriculture_qa_knowledge",
                        embedding_function=self.embedding_fn
                    )
                except Exception:
                    pass
        except Exception as e:
            print(f"[RAG Init Notice] Using JSON fallback: {e}")
            self._load_fallback()

    def _load_fallback(self):
        if os.path.exists(FALLBACK_JSON):
            with open(FALLBACK_JSON, "r", encoding="utf-8") as f:
                self._fallback_data = json.load(f).get("classes", [])

    def retrieve_guidance(self, disease_name: str, query_context: str = "") -> dict:
        """
        Retrieves grounded advisory context from the ChromaDB vector database.
        """
        if self.textbook_collection is not None:
            try:
                query_text = f"{disease_name} symptoms remedies organic chemical treatments {query_context}"
                results = self.textbook_collection.query(
                    query_texts=[query_text],
                    n_results=1
                )
                if results and results.get("documents") and len(results["documents"][0]) > 0:
                    top_doc = results["documents"][0][0]
                    metadata = results["metadatas"][0][0]
                    return {
                        "disease_name": metadata.get("disease_name", disease_name),
                        "crop": metadata.get("crop", "Unknown"),
                        "retrieved_context": top_doc,
                        "source": "ICAR/TNAU Standard Agronomy Database (ChromaDB Vector Store)"
                    }
            except Exception as e:
                print(f"[RAG Query Exception] {e}")

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
                        "source": "ICAR/TNAU Structured Knowledge Base"
                    }

        return {
            "disease_name": disease_name,
            "crop": disease_name.split()[0] if disease_name else "Unknown",
            "retrieved_context": f"Maintain standard crop sanitation and consult a local agricultural extension officer for {disease_name}.",
            "source": "Default Guidance"
        }

    def search_qa_database(self, query: str, n_results: int = 3) -> list:
        """Searches the 5,000+ agricultural expert Q&A knowledge base (ChromaDB + Fast JSON Fallback)."""
        # 1. Try ChromaDB Vector Search
        if self.qa_collection is not None:
            try:
                res = self.qa_collection.query(
                    query_texts=[query],
                    n_results=n_results
                )
                if res and res.get("documents") and len(res["documents"][0]) > 0:
                    return res["documents"][0]
            except Exception as e:
                print(f"[QA Search Error] {e}")

        # 2. Fast Fallback over agriculture_qa_huggingface.json
        qa_file = os.path.join(os.path.dirname(__file__), "..", "..", "data", "agriculture_qa_huggingface.json")
        if os.path.exists(qa_file):
            try:
                with open(qa_file, "r", encoding="utf-8") as f:
                    qa_data = json.load(f)
                
                query_words = [w.lower() for w in query.split() if len(w) > 2]
                scored_hits = []
                for item in qa_data[:3000]:
                    q_text = item.get("question", "").lower()
                    score = sum(2 if w in q_text else 0 for w in query_words)
                    if score > 0:
                        scored_hits.append((score, f"Question: {item.get('question', '')}\nAnswer: {item.get('answer', '')}"))
                
                scored_hits.sort(key=lambda x: x[0], reverse=True)
                return [h[1] for h in scored_hits[:n_results]]
            except Exception as e:
                print(f"[QA Fallback Error] {e}")

# Global Singleton Instance & Helper Functions for Zero-Error Access
_GLOBAL_RETRIEVER = None

def get_global_retriever() -> AgronomyRetriever:
    global _GLOBAL_RETRIEVER
    if _GLOBAL_RETRIEVER is None:
        _GLOBAL_RETRIEVER = AgronomyRetriever()
    return _GLOBAL_RETRIEVER

def search_agri_qa(query: str, n_results: int = 3) -> list:
    """Standalone robust function to search the 25,410 agricultural Q&A database."""
    return get_global_retriever().search_qa_database(query, n_results=n_results)

def retrieve_agri_guidance(disease_name: str, query_context: str = "") -> dict:
    """Standalone robust function to retrieve ICAR treatment protocols."""
    return get_global_retriever().retrieve_guidance(disease_name, query_context=query_context)

if __name__ == "__main__":
    retriever = AgronomyRetriever()
    res = retriever.retrieve_guidance("Tomato Early Blight")
    print("\n--- Retrieved Guidance from ChromaDB Vector Store ---")
    print(res["retrieved_context"])
    print("\n--- Testing QA Search ---")
    qa_hits = search_agri_qa("aphids problem in sugarcane")
    for hit in qa_hits:
        print(f"\nHit:\n{hit}")
