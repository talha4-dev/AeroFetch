#!/bin/bash
# AeroFetch - Full Stack Startup (runs both servers)

echo "⚡ AeroFetch Full-Stack Launcher"
echo "================================"
echo ""

ROOT="$(dirname "$0")"

# Start backend in background
echo "🔧 Starting Backend (Flask)..."
bash "$ROOT/start-backend.sh" &
BACKEND_PID=$!

# Wait a moment for backend to initialize
sleep 3

# Start frontend
echo "🎨 Starting Frontend (Vite)..."
bash "$ROOT/start-frontend.sh" &
FRONTEND_PID=$!

echo ""
echo "✅ Both servers started!"
echo "   Backend  → http://localhost:5000"
echo "   Frontend → http://localhost:5173"
echo ""
echo "Press Ctrl+C to stop all servers."

# Wait for Ctrl+C
trap "kill $BACKEND_PID $FRONTEND_PID 2>/dev/null; exit 0" INT
wait
