@echo off
title AgriSmart AI Dashboard
cd /d "%~dp0"
echo ================================================================
echo           Launching AgriSmart AI Dashboard...
echo ================================================================
echo.

set PY_EXE=python
if exist "e:\anaconda\python.exe" set PY_EXE=e:\anaconda\python.exe
if exist "%CONDA_PREFIX%\python.exe" set PY_EXE=%CONDA_PREFIX%\python.exe
if exist "%USERPROFILE%\anaconda3\python.exe" set PY_EXE=%USERPROFILE%\anaconda3\python.exe

echo Using Python: %PY_EXE%
"%PY_EXE%" -m streamlit run app/frontend_app.py --server.port 8502
pause
