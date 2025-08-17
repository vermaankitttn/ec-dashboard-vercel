#!/bin/bash

echo "🏆 EC Results Dashboard - Full Stack App"
echo "======================================="
echo ""

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js first."
    echo "   Download from: https://nodejs.org/"
    exit 1
fi

# Check if npm is installed
if ! command -v npm &> /dev/null; then
    echo "❌ npm is not installed. Please install npm first."
    exit 1
fi

echo "✅ Node.js version: $(node --version)"
echo "✅ npm version: $(npm --version)"
echo ""

# Check if credentials file exists
if [ ! -f "ec-results-credentials.json" ]; then
    echo "❌ Google Sheets credentials file not found!"
    echo "   Please ensure 'ec-results-credentials.json' is in the root directory"
    echo "   This file should contain your Google Service Account credentials"
    exit 1
fi

echo "✅ Google Sheets credentials found"
echo ""

# Check if node_modules exists
if [ ! -d "node_modules" ]; then
    echo "📦 Installing dependencies..."
    npm install
    echo ""
fi

# Function to cleanup background processes
cleanup() {
    echo ""
    echo "🛑 Stopping all processes..."
    kill $BACKEND_PID $FRONTEND_PID 2>/dev/null
    exit 0
}

# Set up signal handlers
trap cleanup SIGINT SIGTERM

echo "🚀 Starting backend server..."
echo "   Backend will run on http://localhost:5000"
echo ""

# Start backend server in background
node server.js &
BACKEND_PID=$!

# Wait a moment for backend to start
sleep 3

echo "🚀 Starting React frontend..."
echo "   Frontend will run on http://localhost:3000"
echo ""

# Start React app in background
npm start &
FRONTEND_PID=$!

echo "✅ Both servers are starting..."
echo ""
echo "📊 Backend API: http://localhost:5000"
echo "🏠 Frontend App: http://localhost:3000"
echo "🏥 Health Check: http://localhost:5000/api/health"
echo ""
echo "Press Ctrl+C to stop both servers"
echo ""

# Wait for both processes
wait

