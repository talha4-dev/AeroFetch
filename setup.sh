#!/bin/bash
# AeroFetch — One-Time Setup Script
# Run this ONCE after extracting the zip, before using start-all.sh

set -e

ROOT="$(cd "$(dirname "$0")" && pwd)"
echo ""
echo "========================================"
echo "  🚀 AeroFetch — First-Time Setup"
echo "========================================"
echo ""

# ─── Python Virtual Environment ───────────────────────────────────────────────
echo "📦 Step 1/2: Setting up Python virtual environment..."
cd "$ROOT"

if [ -d "venv" ]; then
  echo "   ✅ Virtual environment already exists, skipping creation."
else
  python3 -m venv venv
  echo "   ✅ Virtual environment created."
fi

echo "   📥 Installing Python dependencies from requirements.txt..."
"$ROOT/venv/bin/pip" install --upgrade pip -q
"$ROOT/venv/bin/pip" install -r "$ROOT/backend/requirements.txt"
echo "   ✅ Python dependencies installed."
echo ""

# ─── Node / Frontend ──────────────────────────────────────────────────────────
echo "📦 Step 2/2: Installing frontend Node.js dependencies..."
cd "$ROOT/frontend"

if ! command -v node &>/dev/null; then
  echo ""
  echo "   ⚠️  Node.js is not installed. Please install Node.js (v18+) from https://nodejs.org"
  echo "   Then re-run this setup script."
  exit 1
fi

npm install
echo "   ✅ Frontend dependencies installed."
echo ""

# ─── Done ─────────────────────────────────────────────────────────────────────
echo "========================================"
echo "  ✅ Setup Complete!"
echo "========================================"
echo ""
echo "To start AeroFetch, run:"
echo "   chmod +x start-all.sh && ./start-all.sh"
echo ""
echo "Or start them individually:"
echo "   ./start-backend.sh   (Flask API on http://localhost:5000)"
echo "   ./start-frontend.sh  (Vite UI  on http://localhost:5173)"
echo ""
