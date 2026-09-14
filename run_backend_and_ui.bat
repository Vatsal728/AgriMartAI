@echo off
title AgriSmart AI - FastAPI Backend & Web UI
cd /d "%~dp0"
echo =========================================================
echo    AgriSmart AI - FastAPI Backend & Web Application
echo =========================================================
echo.
echo Starting FastAPI server at http://localhost:8000 ...
echo Interactive OpenAPI Swagger docs at http://localhost:8000/docs
echo.
python -m uvicorn src.api.main:app --host 0.0.0.0 --port 8000 --reload
pause
