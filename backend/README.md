# The Grind Sheet - Backend

This is the backend API for The Grind Sheet poker tracking application.

## Deployment to Render

### 1. Create a Render Account
- Go to [render.com](https://render.com)
- Sign up for a free account

### 2. Create New Web Service
- Click "New Web Service"
- Connect your GitHub repository (or use manual deploy)
- Select the `backend` folder

### 3. Configure the Service
- **Name**: `the-grind-sheet-backend`
- **Environment**: `Node`
- **Build Command**: `npm install`
- **Start Command**: `node server.js`
- **Plan**: Free

### 4. Environment Variables
Add these environment variables in Render:

```
NODE_ENV=production
JWT_SECRET=your-super-secure-32-character-secret-key-here
JWT_EXPIRES_IN=7d
EMAIL_USER=thegrindsheetteam@gmail.com
EMAIL_PASS=your-gmail-app-password
EMAIL_FROM=thegrindsheetteam@gmail.com
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
ALLOWED_ORIGINS=https://your-netlify-site.netlify.app
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
AUTH_RATE_LIMIT_MAX_REQUESTS=5
LOG_LEVEL=info
ENABLE_REQUEST_LOGGING=true
```

### 5. Deploy
- Click "Create Web Service"
- Wait for deployment to complete
- Copy your service URL (e.g., `https://your-app.onrender.com`)

### 6. Update Frontend
- Update `front end/config.js` with your backend URL
- Update `front end/netlify.toml` with your backend URL

## API Endpoints

- `POST /api/register` - User registration
- `POST /api/login` - User login
- `POST /api/forgot-password` - Password reset request
- `POST /api/reset-password` - Password reset
- `GET /api/verify-reset-token/:token` - Verify reset token
- `GET /api/data` - Get user data
- `POST /api/data` - Save user data
- `POST /api/logout` - User logout
- `GET /api/health` - Health check

## Cost
- **Free Tier**: 750 hours/month
- **Paid Plans**: Starting at $7/month 