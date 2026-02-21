#!/bin/bash
# AeroFetch - Frontend Startup Script

echo "🎨 Starting AeroFetch Frontend..."
echo ""

cd "$(dirname "$0")/frontend"

echo "📦 Installing npm dependencies..."
npm install

echo ""
echo "🌐 Starting Vite dev server on http://localhost:5173"
echo "   Press Ctrl+C to stop."
echo ""

npm run dev
