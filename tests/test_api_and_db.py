import os
import sys
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))

import pytest
from fastapi.testclient import TestClient
from src.api.main import app

client = TestClient(app)

def test_health_check():
    response = client.get("/health")
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "healthy"

def test_auth_me():
    response = client.get("/api/auth/me?email=desaivatshal72839@gmail.com")
    assert response.status_code == 200
    data = response.json()
    assert data["email"] == "desaivatshal72839@gmail.com"
    assert "Desai" in data["full_name"]

def test_get_farms():
    response = client.get("/api/farms")
    assert response.status_code == 200
    farms = response.json()
    assert isinstance(farms, list)

def test_get_saved_answers():
    response = client.get("/api/saved-answers")
    assert response.status_code == 200
    answers = response.json()
    assert isinstance(answers, list)

def test_weather():
    response = client.get("/api/weather?location=Ahmedabad")
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "success"
    assert "location" in data
