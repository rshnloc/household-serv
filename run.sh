#!/usr/bin/env bash
set -e

DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" >/dev/null 2>&1 && pwd )"
cd "$DIR"

echo "========================================================"
echo " Starting HomeAssist AI - Household Services Marketplace"
echo "========================================================"

# Check Python environment
if [ ! -d "backend/venv" ]; then
    echo "Creating Python virtual environment..."
    python3 -m venv backend/venv
    echo "Installing backend dependencies..."
    backend/venv/bin/pip install -r requirements.txt
fi

# Check Node environment
if [ ! -d "frontend/node_modules" ]; then
    echo "Installing frontend dependencies..."
    cd frontend && npm install && cd ..
fi

echo "Starting FastAPI Backend on http://127.0.0.1:8000 ..."
PYTHONPATH=backend backend/venv/bin/uvicorn app.main:app --host 127.0.0.1 --port 8000 &
BACKEND_PID=$!

echo "Starting Vite Frontend on http://127.0.0.1:5173 ..."
cd frontend && npm run dev -- --host 127.0.0.1 --port 5173 &
FRONTEND_PID=$!

trap "kill $BACKEND_PID $FRONTEND_PID 2>/dev/null || true" EXIT

wait
