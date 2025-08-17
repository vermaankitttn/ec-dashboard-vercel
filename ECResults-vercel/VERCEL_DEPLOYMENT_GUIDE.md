# Vercel Deployment Guide for EC Results Dashboard

## 🚀 **Prerequisites**

1. **GitHub Account**: You need a GitHub account
2. **Vercel Account**: Sign up at [vercel.com](https://vercel.com)
3. **Google Cloud Credentials**: Your `ec-results-credentials.json` file

## 📋 **Step-by-Step Deployment**

### **Step 1: Prepare GitHub Repository**

1. **Create a new GitHub repository:**
   - Go to [github.com](https://github.com)
   - Click "New repository"
   - Name: `ec-results-dashboard`
   - Make it **Public** (recommended for Vercel)
   - Don't initialize with README

2. **Push this code to GitHub:**
   ```bash
   cd ECResults-vercel
   git init
   git add .
   git commit -m "Initial commit for Vercel deployment"
   git remote add origin https://github.com/vermaankitttn/ec-results-dashboard.git
   git push -u origin main
   ```

### **Step 2: Set Up Vercel**

1. **Connect to Vercel:**
   - Go to [vercel.com](https://vercel.com)
   - Sign in with GitHub
   - Click "New Project"

2. **Import Repository:**
   - Select your `ec-results-dashboard` repository
   - Vercel will auto-detect it's a React app

3. **Configure Project:**
   - **Framework Preset**: Create React App
   - **Root Directory**: `./` (leave as default)
   - **Build Command**: `npm run build`
   - **Output Directory**: `build`
   - **Install Command**: `npm install`

### **Step 3: Environment Variables**

Add these environment variables in Vercel:

1. **Go to Project Settings → Environment Variables**
2. **Add the following variables:**

   ```
   GOOGLE_SHEETS_SPREADSHEET_ID=1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgvE2upms
   NODE_ENV=production
   ```

### **Step 4: Google Cloud Credentials**

1. **Create a new file in your repository:**
   - Name: `ec-results-credentials.json`
   - Copy your Google Cloud service account credentials into this file

2. **Add to .gitignore (if not already there):**
   ```
   ec-results-credentials.json
   ```

3. **Upload credentials to Vercel:**
   - Go to Project Settings → Environment Variables
   - Add as a file variable or paste the JSON content

### **Step 5: Deploy**

1. **Click "Deploy"**
2. **Wait for build to complete**
3. **Your app will be live at**: `https://your-project-name.vercel.app`

## 🔧 **Configuration Files**

### **vercel.json**
```json
{
  "version": 2,
  "builds": [
    {
      "src": "package.json",
      "use": "@vercel/static-build",
      "config": {
        "distDir": "build"
      }
    },
    {
      "src": "api/index.js",
      "use": "@vercel/node"
    }
  ],
  "routes": [
    {
      "src": "/api/(.*)",
      "dest": "/api/index.js"
    },
    {
      "src": "/candidates/(.*)",
      "dest": "/api/index.js"
    },
    {
      "src": "/(.*)",
      "dest": "/index.html"
    }
  ]
}
```

### **api/index.js**
- Serverless function for backend API
- Handles Google Sheets integration
- Serves candidate photos

## 🌐 **Important URLs**

- **Frontend**: `https://your-project-name.vercel.app`
- **API Health**: `https://your-project-name.vercel.app/api/health`
- **Google Sheets Data**: `https://your-project-name.vercel.app/api/google-sheets-data`
- **Candidate Photos**: `https://your-project-name.vercel.app/candidates/[PHOTO_NAME].png`

## 🔄 **Automatic Deployments**

- Every push to `main` branch will trigger a new deployment
- Vercel creates preview deployments for pull requests
- You can rollback to previous deployments anytime

## 🛠️ **Troubleshooting**

### **Common Issues:**

1. **Build Fails:**
   - Check if all dependencies are in `package.json`
   - Verify build command is correct

2. **API Not Working:**
   - Check environment variables
   - Verify Google Cloud credentials
   - Check Vercel function logs

3. **Photos Not Loading:**
   - Verify photos are in `public/candidates/`
   - Check file permissions
   - Verify API routes are working

### **Vercel Logs:**
- Go to Project → Functions → View Function Logs
- Check for any errors in the API function

## 📞 **Support**

If you encounter issues:
1. Check Vercel documentation
2. Review function logs
3. Verify all environment variables are set
4. Test API endpoints manually

## ✅ **Success Checklist**

- [ ] Repository pushed to GitHub
- [ ] Vercel project created
- [ ] Environment variables set
- [ ] Google Cloud credentials uploaded
- [ ] Build successful
- [ ] API endpoints working
- [ ] Photos loading correctly
- [ ] Frontend displaying data

Your EC Results Dashboard will be live and accessible worldwide! 🎉
