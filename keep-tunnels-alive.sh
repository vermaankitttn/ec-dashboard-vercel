#!/bin/bash

echo "🔄 Tunnel Monitor Started - Keeping tunnels alive..."
echo "Press Ctrl+C to stop monitoring"
echo ""

# Function to check if tunnel is working
check_tunnel() {
    local url=$1
    local name=$2
    
    if curl -s --max-time 10 "$url" > /dev/null 2>&1; then
        echo "✅ $name: ONLINE"
        return 0
    else
        echo "❌ $name: OFFLINE"
        return 1
    fi
}

# Function to restart backend tunnel
restart_backend_tunnel() {
    echo "🔄 Restarting backend tunnel..."
    pkill -f "lt --port 5000" 2>/dev/null
    sleep 3
    lt --port 5000 --subdomain ska-ec-backend-2025 --local-host localhost > /dev/null 2>&1 &
    sleep 10
    echo "✅ Backend tunnel restarted"
}

# Function to restart frontend tunnel
restart_frontend_tunnel() {
    echo "🔄 Restarting frontend tunnel..."
    pkill -f "lt --port 3000" 2>/dev/null
    sleep 3
    lt --port 3000 --subdomain ska-ec-frontend-2025 --local-host localhost > /dev/null 2>&1 &
    sleep 10
    echo "✅ Frontend tunnel restarted"
}

# Main monitoring loop
while true; do
    echo ""
    echo "🔍 Checking tunnels at $(date '+%H:%M:%S')..."
    
    # Check backend
    if ! check_tunnel "https://ska-ec-backend-2025.loca.lt/api/health" "Backend"; then
        restart_backend_tunnel
    fi
    
    # Check frontend
    if ! check_tunnel "https://ska-ec-frontend-2025.loca.lt" "Frontend"; then
        restart_frontend_tunnel
    fi
    
    echo "⏰ Next check in 5 minutes..."
    sleep 300  # Check every 5 minutes
done

