#!/bin/bash
set -euo pipefail

# === CONFIG ===
BACKEND_LOG="backend.log"
FRONTEND_LOG="frontend.log"

# === FUNCTIONS ===
start_backend() {
  echo "[INFO] Starting backend..."
  PORT=${PORT:-5001} nohup yarn start >> "$BACKEND_LOG" 2>&1 &
  echo $! > backend.pid
}

start_frontend() {
  echo "[INFO] Starting frontend..."
  nohup yarn dev >> "$FRONTEND_LOG" 2>&1 &
  echo $! > frontend.pid
}

stop_services() {
  echo "[INFO] Stopping services..."
  for pidfile in backend.pid frontend.pid; do
    if [[ -f $pidfile ]]; then
      kill "$(cat $pidfile)" 2>/dev/null || true
      rm -f "$pidfile"
    fi
  done
  echo "[INFO] Services stopped."
}

# === MAIN ===
#trap stop_services EXIT

echo "[INFO] Building project..."
yarn build

start_backend
start_frontend

echo "[INFO] App started (backend: $(cat backend.pid), frontend: $(cat frontend.pid))"
