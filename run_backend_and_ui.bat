@echo off
title AgriSmart AI - FastAPI Backend & Web UI
cd /d "%~dp0"
echo =========================================================
echo    AgriSmart AI - FastAPI Backend & Web Application
echo =========================================================
echo.

set PY_EXE=python
if exist "e:\anaconda\python.exe" set PY_EXE=e:\anaconda\python.exe
if exist "%CONDA_PREFIX%\python.exe" set PY_EXE=%CONDA_PREFIX%\python.exe
if exist "%USERPROFILE%\anaconda3\python.exe" set PY_EXE=%USERPROFILE%\anaconda3\python.exe

echo Using Python: %PY_EXE%
echo Starting FastAPI server at http://localhost:8000 ...
echo Interactive OpenAPI Swagger docs at http://localhost:8000/docs
echo.
"%PY_EXE%" -m uvicorn src.api.main:app --host 0.0.0.0 --port 8000 --reload
pause
