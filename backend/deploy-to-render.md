# 🚀 Deploy to Render - Step by Step

## Step 1: Prepare Your Backend Files ✅
Your backend files are ready in the `backend` folder:
- ✅ server.js
- ✅ package.json
- ✅ package-lock.json
- ✅ .env
- ✅ users.json
- ✅ userData.json
- ✅ resetTokens.json

## Step 2: Create Render Account
1. Go to [render.com](https://render.com)
2. Click "Get Started"
3. Sign up with GitHub or email

## Step 3: Create New Web Service
1. Click "New Web Service"
2. Choose "Build and deploy from a Git repository"
3. Connect your GitHub account (if not already connected)
4. Select your repository
5. Set the **Root Directory** to: `backend`

## Step 4: Configure Service Settings
Fill in these details:
- **Name**: `the-grind-sheet-backend`
- **Environment**: `Node`
- **Region**: Choose closest to you
- **Branch**: `main` (or your default branch)
- **Build Command**: `npm install`
- **Start Command**: `node server.js`
- **Plan**: Free

## Step 5: Add Environment Variables
Click "Advanced" and add these environment variables:

| Key | Value |
|-----|-------|
| `NODE_ENV` | `production` |
| `JWT_SECRET` | `your-super-secure-32-character-secret-key-here` |
| `JWT_EXPIRES_IN` | `7d` |
| `EMAIL_USER` | `thegrindsheetteam@gmail.com` |
| `EMAIL_PASS` | `your-gmail-app-password` |
| `EMAIL_FROM` | `thegrindsheetteam@gmail.com` |
| `EMAIL_HOST` | `smtp.gmail.com` |
| `EMAIL_PORT` | `587` |
| `ALLOWED_ORIGINS` | `https://your-netlify-site.netlify.app` |
| `RATE_LIMIT_WINDOW_MS` | `900000` |
| `RATE_LIMIT_MAX_REQUESTS` | `100` |
| `AUTH_RATE_LIMIT_MAX_REQUESTS` | `5` |
| `LOG_LEVEL` | `info` |
| `ENABLE_REQUEST_LOGGING` | `true` |

## Step 6: Deploy
1. Click "Create Web Service"
2. Wait for deployment (usually 2-5 minutes)
3. You'll see a green checkmark when it's ready

## Step 7: Get Your Backend URL
- Your service will be available at: `https://your-app-name.onrender.com`
- Copy this URL - you'll need it for the frontend

## Step 8: Test Your Backend
Visit: `https://your-app-name.onrender.com/api/health`
You should see: `{"status":"ok","message":"Server is running"}`

## Step 9: Update Frontend Configuration
Once you have your backend URL, update:
1. `front end/config.js` - Replace `your-backend-url.onrender.com`
2. `front end/netlify.toml` - Replace `your-backend-url.onrender.com`

## Troubleshooting
- **Build fails**: Check that all files are in the `backend` folder
- **Environment variables**: Make sure to add them in Render dashboard
- **Email not working**: Verify your Gmail app password is correct
- **CORS errors**: Update `ALLOWED_ORIGINS` with your Netlify URL

## Cost: $0/month (Free tier)
- 750 hours/month free
- Auto-sleep after 15 minutes of inactivity
- Wakes up automatically when accessed 