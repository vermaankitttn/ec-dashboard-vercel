# 🌐 EC Results Dashboard - Tunnel Access Guide

## 🔑 Your Tunnel Password

**Password: `122.161.72.231`**

## 📋 How to Access Your Dashboard

### For You (Developer):
1. Go to: **https://ska-ec-frontend-2025.loca.lt**
2. Enter the tunnel password: **`122.161.72.231`**
3. Click "Click to Submit"
4. You'll see your dashboard!

### For Others (Visitors):
1. Share this URL: **https://ska-ec-frontend-2025.loca.lt**
2. Tell them the password: **`122.161.72.231`**
3. They enter the password and click submit
4. They can access your dashboard!

## 🔒 Why This Password is Required

Localtunnel now requires a password to prevent abuse. The password is your public IP address (`122.161.72.231`).

## 📱 Quick Share Instructions

**Send this to your team:**

```
🌐 EC Results Dashboard is Live!

🔗 URL: https://ska-ec-frontend-2025.loca.lt
🔑 Password: 122.161.72.231

Steps:
1. Click the URL
2. Enter the password
3. Click "Click to Submit"
4. View the dashboard!

✅ Real-time data from Google Sheets
✅ All candidate photos
✅ Auto-refresh every 1 minute
✅ Auto-switch tabs every 15 seconds
```

## 🛠️ If Tunnels Stop Working

If the tunnels stop working, restart them:

```bash
# Kill existing tunnels
pkill -f localtunnel

# Start backend
lt --port 5000 --subdomain ska-ec-backend-2025 --local-host localhost

# Start frontend (in another terminal)
lt --port 3000 --subdomain ska-ec-frontend-2025 --local-host localhost
```

## ✅ Status Check

Run this to check if tunnels are working:
```bash
./tunnel-status.sh
```

---
**🎉 Your dashboard is now secure and accessible worldwide!**

