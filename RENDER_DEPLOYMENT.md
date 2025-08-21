# 🚀 Render.com Deployment Guide

## 📁 Project Structure (Single Web Service)

Your project is now configured as a **single full-stack application** ready for Render.com deployment:

```
ECResults/
├── src/                    # React frontend source
├── public/                 # Static assets & candidate images  
├── build/                  # Built React app (created by npm run build)
├── server.js              # Express server (serves API + frontend)
├── package.json           # Dependencies & scripts
├── ec-results-credentials.json  # Google Sheets credentials
└── README.md              # Documentation
```

## 🎯 Deployment Settings for Render.com

### **Service Type:** Web Service

### **Build & Deploy Settings:**
- **Build Command:** `npm run build`
- **Start Command:** `npm start` 
- **Node Version:** 18+ (Render will auto-detect)

### **Environment Variables:**
You'll need to set this in Render.com dashboard:

```
GOOGLE_CREDENTIALS=<paste your ec-results-credentials.json content here>
```

## 🔧 How It Works

1. **Build Process:** 
   - `npm run build` creates optimized React production files in `/build`
   
2. **Server Process:**
   - `npm start` runs `node server.js`
   - Server serves API endpoints (`/api/*`)
   - Server serves React app from `/build` for all other routes
   - Server serves candidate images from `/public/candidates`

## 📋 Deploy Steps

1. **Push to GitHub:** Ensure your code is in a GitHub repository

2. **Create Render Service:**
   - Go to [render.com](https://render.com)
   - Create new "Web Service"
   - Connect your GitHub repository
   - Use the settings above

3. **Set Environment Variables:**
   - In Render dashboard, go to Environment
   - Add `GOOGLE_CREDENTIALS` with your JSON content

4. **Deploy:**
   - Render will automatically build and deploy
   - Your app will be available at: `https://your-app-name.onrender.com`

## ✅ Verification

After deployment, test these endpoints:
- `https://your-app.onrender.com` - React frontend
- `https://your-app.onrender.com/api/health` - Backend health check
- `https://your-app.onrender.com/api/google-sheets-data` - Data API

## 🛠️ Local Development

- **Frontend only:** `npm run dev` (React dev server on :3000)
- **Full stack:** `npm start` (Production mode on :5000)
- **Build for production:** `npm run build`

## 📝 Notes

- Google Sheets credentials are loaded from environment variable
- Candidate images served with proper CORS headers for mobile
- Single service = easier management & lower cost on Render
- Automatic HTTPS & CDN included with Render
