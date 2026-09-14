@echo off
echo ================================================================
echo           Launching AgriSmart AI Dashboard...
echo ================================================================

:: Check for .venv
if exist ".venv\Scripts\activate.bat" (
    call .venv\Scripts\activate.bat
    streamlit run app/frontend_app.py --server.port 8502
) else (
    echo [WARNING] .venv not found. Running setup_env.bat first...
    call setup_env.bat
    call .venv\Scripts\activate.bat
    streamlit run app/frontend_app.py --server.port 8502
)
pause
