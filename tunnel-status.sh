#!/bin/bash

echo "🌐 EC Results Dashboard - Tunnel Status"
echo "========================================"
echo ""

echo "✅ Backend Tunnel:"
echo "   URL: https://ska-ec-backend-2025.loca.lt"
echo "   Health Check: https://ska-ec-backend-2025.loca.lt/api/health"
echo "   Data API: https://ska-ec-backend-2025.loca.lt/api/google-sheets-data"
echo ""

echo "✅ Frontend Tunnel:"
echo "   URL: https://ska-ec-frontend-2025.loca.lt"
echo ""

echo "📋 Share these URLs:"
echo "   Main Dashboard: https://ska-ec-frontend-2025.loca.lt"
echo ""

echo "🔧 Local Access (for development):"
echo "   Frontend: http://localhost:3000"
echo "   Backend: http://localhost:5000"
echo ""

echo "📊 Tunnel Status:"
if curl -s https://ska-ec-backend-2025.loca.lt/api/health > /dev/null; then
    echo "   ✅ Backend: ONLINE"
else
    echo "   ❌ Backend: OFFLINE"
fi

if curl -s https://ska-ec-frontend-2025.loca.lt > /dev/null; then
    echo "   ✅ Frontend: ONLINE"
else
    echo "   ❌ Frontend: OFFLINE"
fi

echo ""
echo "🎉 Your EC Results Dashboard is live and accessible worldwide!"

