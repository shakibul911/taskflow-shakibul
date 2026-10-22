@echo off
echo ========================================================
echo Starting Task-Flow (FastAPI Backend + React Frontend)...
echo ========================================================

REM 1. Start FastAPI Backend in a new window
echo [1/2] Starting FastAPI backend on http://localhost:8000...
start "Task-Flow Backend (FastAPI)" cmd /k "cd /d %~dp0backend && .\venv\Scripts\python.exe run.py"

REM 2. Start React Frontend in a new window
echo [2/2] Starting React Vite frontend on http://localhost:5173...
start "Task-Flow Frontend (React)" cmd /k "cd /d %~dp0frontend && npm run dev"

REM 3. Wait 3 seconds and open the web app in browser
timeout /t 3 /nobreak >nul
start http://localhost:5173

echo.
echo ========================================================
echo Task-Flow is now running!
echo Backend:  http://localhost:8000 (Swagger docs at /docs)
echo Frontend: http://localhost:5173
echo ========================================================

