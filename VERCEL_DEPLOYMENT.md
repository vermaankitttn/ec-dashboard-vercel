# 🚀 Vercel Deployment Guide for EC Results Dashboard

## 📋 Prerequisites

1. **GitHub Account**: You need a GitHub account
2. **Vercel Account**: Sign up at [vercel.com](https://vercel.com)
3. **Google Sheets API**: Your credentials file should be ready

## 🔧 Step-by-Step Deployment

### Step 1: Prepare Your Repository

1. **Create a GitHub Repository**:
   ```bash
   git init
   git add .
   git commit -m "Initial commit for Vercel deployment"
   ```

2. **Push to GitHub**:
   ```bash
   git remote add origin https://github.com/YOUR_USERNAME/ec-results-dashboard.git
   git push -u origin main
   ```

### Step 2: Set Up Vercel

1. **Go to Vercel Dashboard**: Visit [vercel.com/dashboard](https://vercel.com/dashboard)

2. **Import Project**:
   - Click "New Project"
   - Select "Import Git Repository"
   - Choose your GitHub repository

3. **Configure Project**:
   - **Framework Preset**: Other
   - **Root Directory**: `./` (leave as default)
   - **Build Command**: `npm run build`
   - **Output Directory**: `build`
   - **Install Command**: `npm install`

### Step 3: Environment Variables

In Vercel dashboard, go to your project settings and add these environment variables:

1. **Google Sheets Credentials**:
   - Go to "Environment Variables" section
   - Add a new variable:
     - **Name**: `GOOGLE_SHEETS_CREDENTIALS`
     - **Value**: Copy the entire content of your `ec-results-credentials.json` file
     - **Environment**: Production, Preview, Development

2. **Spreadsheet URL** (optional):
   - **Name**: `SPREADSHEET_URL`
   - **Value**: Your Google Sheets URL
   - **Environment**: Production, Preview, Development

### Step 4: Deploy

1. **Click "Deploy"** in Vercel dashboard
2. **Wait for build** to complete (usually 2-3 minutes)
3. **Your app will be live** at the provided Vercel URL

## 🔗 Important URLs

After deployment, your app will be available at:
- **Main App**: `https://your-project-name.vercel.app`
- **API Health**: `https://your-project-name.vercel.app/api/health`
- **Google Sheets Data**: `https://your-project-name.vercel.app/api/google-sheets-data`
- **Photos**: `https://your-project-name.vercel.app/candidates/[PHOTO_NAME].png`

## ⚙️ Configuration Files

The following files have been created/updated for Vercel:

1. **`vercel.json`**: Vercel configuration
2. **`api/index.js`**: Serverless API functions
3. **`package.json`**: Updated with build scripts
4. **`src/utils/photoMapping.js`**: Updated photo URLs

## 🔄 Automatic Deployments

Once set up, Vercel will automatically:
- Deploy when you push to GitHub
- Create preview deployments for pull requests
- Handle environment variables securely

## 🛠️ Troubleshooting

### Common Issues:

1. **Build Fails**:
   - Check if all dependencies are in `package.json`
   - Ensure `ec-results-credentials.json` is properly configured

2. **API Not Working**:
   - Verify environment variables are set correctly
   - Check Google Sheets API permissions

3. **Photos Not Loading**:
   - Ensure photos are in `public/candidates/` directory
   - Check file permissions

### Support:
- Vercel Documentation: [vercel.com/docs](https://vercel.com/docs)
- Vercel Community: [github.com/vercel/vercel/discussions](https://github.com/vercel/vercel/discussions)

## 🎉 Success!

Once deployed, your EC Results Dashboard will be:
- ✅ Live and accessible worldwide
- ✅ Automatically updated from Google Sheets
- ✅ Mobile-friendly
- ✅ Fast and reliable
- ✅ Free hosting (within limits)

Your app URL will be: `https://your-project-name.vercel.app`
