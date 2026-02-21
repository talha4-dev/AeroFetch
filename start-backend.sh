#!/bin/bash
# AeroFetch - Backend Startup Script

echo "🚀 Starting AeroFetch Backend..."
echo ""

ROOT="$(cd "$(dirname "$0")" && pwd)"
cd "$ROOT/backend"

# Use venv Python if available (all packages already installed)
VENV_PYTHON="$ROOT/venv/bin/python3"
if [ -f "$VENV_PYTHON" ]; then
  PYTHON="$VENV_PYTHON"
  echo "✅ Using existing virtual environment"
else
  PYTHON="python3"
  echo "📦 Installing Python dependencies..."
  python3 -m ensurepip --upgrade 2>/dev/null || true
  python3 -m pip install -r requirements.txt 2>&1
fi

echo "🌐 Starting Flask server on http://localhost:5000"
echo "   Press Ctrl+C to stop."
echo ""

"$PYTHON" app.py
