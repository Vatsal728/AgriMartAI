import pytest
import os
import sys

PROJECT_ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), ".."))
if PROJECT_ROOT not in sys.path:
    sys.path.insert(0, PROJECT_ROOT)

from src.rag_pipeline.retriever import AgronomyRetriever
from src.cv_pipeline.predict import predict

@pytest.fixture
def retriever():
    return AgronomyRetriever()

def test_cotton_yellowing_query(retriever):
    res = retriever.answer_query("my cotton plants leaves are turning yello which spray should i do of which medicine")
    text = res["response"]
    assert "Cotton" in text or "kapas" in text.lower()
    assert "Apple" not in text
    assert "Tomato" not in text
    assert "🌿" in text
    assert any(chem in text for chem in ["Imidacloprid", "Acetamiprid", "Flonicamid", "Neem", "Diafenthiuron"])

def test_cotton_with_tomato_history(retriever):
    mock_history = [
        {"role": "user", "content": "My tomato leaves have yellow virus"},
        {"role": "assistant", "content": "Protocol for Tomato leaf yellow virus"}
    ]
    res = retriever.answer_query('"my cotton plants leaves are turning yello which spray should i do of which medicine"', history=mock_history)
    text = res["response"]
    assert "Cotton" in text
    assert "Tomato" not in text
    assert "🌿" in text

def test_sugarcane_query(retriever):
    res = retriever.answer_query("sugarcane red rot control treatment and medicine")
    text = res["response"]
    assert "Sugarcane" in text
    assert "Red Rot" in text
    assert "Tomato" not in text
    assert "Apple" not in text

def test_rice_query(retriever):
    res = retriever.answer_query("rice blast disease treatment spray")
    text = res["response"]
    assert "Rice" in text
    assert "Blast" in text
    assert "Tomato" not in text

def test_wheat_query(retriever):
    res = retriever.answer_query("wheat yellow rust disease medicine")
    text = res["response"]
    assert "Wheat" in text
    assert "Yellow Rust" in text
    assert "Tomato" not in text

def test_vision_predict_phototest():
    test_img = os.path.join(PROJECT_ROOT, "tests", "phototest", "tomato_early_blight_sample.png")
    if os.path.exists(test_img):
        res = predict(test_img)
        assert res["status"] in ["success", "fallback"]
        assert "confidence" in res
