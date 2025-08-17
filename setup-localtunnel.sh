#!/bin/bash

echo "🚀 Setting up localtunnel for EC Results Dashboard..."

# Kill any existing localtunnel processes
echo "🔄 Stopping any existing localtunnel processes..."
pkill -f localtunnel 2>/dev/null || true
sleep 2

# Check if backend is running
echo "🔍 Checking if backend is running..."
if curl -s http://localhost:5000/api/health > /dev/null; then
    echo "✅ Backend is running on port 5000"
else
    echo "❌ Backend is not running. Please start it first with: node server.js"
    exit 1
fi

# Check if frontend is running
echo "🔍 Checking if frontend is running..."
if curl -s http://localhost:3000 > /dev/null; then
    echo "✅ Frontend is running on port 3000"
else
    echo "❌ Frontend is not running. Please start it first with: npm start"
    exit 1
fi

# Start localtunnel for backend
echo "🌐 Starting localtunnel for backend (port 5000)..."
lt --port 5000 --subdomain ec-results-backend > localtunnel-backend.log 2>&1 &
BACKEND_PID=$!

# Wait for localtunnel to start
sleep 5

# Start localtunnel for frontend
echo "🌐 Starting localtunnel for frontend (port 3000)..."
lt --port 3000 --subdomain ec-results-frontend > localtunnel-frontend.log 2>&1 &
FRONTEND_PID=$!

# Wait for localtunnel to start
sleep 5

echo ""
echo "🎉 Setup complete!"
echo ""
echo "📋 Access URLs:"
echo "   Frontend: https://ec-results-frontend.loca.lt"
echo "   Backend API: https://ec-results-backend.loca.lt"
echo "   Backend health check: https://ec-results-backend.loca.lt/api/health"
echo "   Backend data API: https://ec-results-backend.loca.lt/api/google-sheets-data"
echo ""
echo "📝 Note: You may need to update the photo URLs in src/utils/photoMapping.js"
echo "   to use the new backend URL: https://ec-results-backend.loca.lt"
echo ""
echo "🔧 To update photo URLs, run:"
echo "   sed -i.bak 's|http://localhost:5000|https://ec-results-backend.loca.lt|g' src/utils/photoMapping.js"
echo ""
echo "📊 Log files:"
echo "   Backend tunnel: localtunnel-backend.log"
echo "   Frontend tunnel: localtunnel-frontend.log"

