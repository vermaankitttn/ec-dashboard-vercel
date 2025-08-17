#!/bin/bash

echo "🚀 Setting up ngrok for EC Results Dashboard..."

# Kill any existing ngrok processes
echo "🔄 Stopping any existing ngrok processes..."
pkill -f ngrok 2>/dev/null || true
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

# Start ngrok for backend
echo "🌐 Starting ngrok tunnel for backend (port 5000)..."
ngrok http 5000 > ngrok-backend.log 2>&1 &
BACKEND_PID=$!

# Wait for ngrok to start
sleep 5

# Get backend tunnel URL
echo "🔍 Getting backend tunnel URL..."
BACKEND_URL=$(curl -s http://localhost:4040/api/tunnels | jq -r '.tunnels[0].public_url' 2>/dev/null)

if [ "$BACKEND_URL" != "null" ] && [ -n "$BACKEND_URL" ]; then
    echo "✅ Backend tunnel created: $BACKEND_URL"
    
    # Update the photo mapping to use the ngrok URL
    echo "🔧 Updating photo URLs to use ngrok..."
    sed -i.bak "s|http://localhost:5000|$BACKEND_URL|g" src/utils/photoMapping.js
    
    echo "📝 Backend ngrok URL: $BACKEND_URL"
    echo "📝 Backend health check: $BACKEND_URL/api/health"
    echo "📝 Backend data API: $BACKEND_URL/api/google-sheets-data"
    
    echo ""
    echo "🎉 Setup complete!"
    echo ""
    echo "📋 Access URLs:"
    echo "   Frontend: http://localhost:3000"
    echo "   Backend API: $BACKEND_URL"
    echo "   ngrok Dashboard: http://localhost:4040"
    echo ""
    echo "🌐 To make the frontend accessible via ngrok as well, run:"
    echo "   ngrok http 3000"
    echo ""
    echo "📝 Note: The photo URLs have been updated to use the ngrok backend URL."
    echo "   You may need to restart the React app for changes to take effect."
    
else
    echo "❌ Failed to create backend tunnel"
    echo "📋 Check ngrok-backend.log for details"
    exit 1
fi
