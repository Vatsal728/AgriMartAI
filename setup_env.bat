@echo off
setlocal enabledelayedexpansion

echo ================================================================
echo           AgriSmart AI - Automated 1-Click Setup
echo ================================================================
echo.

:: 1. Check for Python
python --version >nul 2>&1
if %errorlevel% neq 0 (
    echo [ERROR] Python is not installed or not in PATH!
    echo Please install Python 3.10+ from https://www.python.org/
    pause
    exit /b 1
)

:: 2. Create Virtual Environment (.venv) if not present
if not exist ".venv" (
    echo [STEP 1/3] Creating virtual environment (.venv)...
    python -m venv .venv
    if %errorlevel% neq 0 (
        echo [ERROR] Failed to create virtual environment!
        pause
        exit /b 1
    )
    echo [SUCCESS] Virtual environment created.
) else (
    echo [INFO] Virtual environment (.venv) already exists.
)

:: 3. Activate Virtual Environment
echo [STEP 2/3] Activating environment and upgrading pip...
call .venv\Scripts\activate.bat
python -m pip install --upgrade pip

:: 4. Install Dependencies from requirements.txt
echo [STEP 3/3] Installing all required AI packages...
python -m pip install -r requirements.txt

echo.
echo ================================================================
echo   [COMPLETE] All requirements installed successfully!
echo   To launch the Streamlit Web Dashboard:
echo      run_dashboard.bat
echo   Or run manually:
echo      .venv\Scripts\activate
echo      streamlit run app/frontend_app.py
echo ================================================================
echo.
pause
