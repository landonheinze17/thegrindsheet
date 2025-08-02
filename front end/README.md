# The Grind Sheet - Frontend

This is the frontend application for The Grind Sheet, a professional poker bankroll tracking application.

## 🚀 Quick Deploy to Netlify

### Option 1: Drag & Drop (Easiest)
1. Go to [netlify.com](https://netlify.com) and sign up/login
2. Drag and drop the entire `front end` folder to the Netlify deploy area
3. Your site will be live in seconds!

### Option 2: Git Deployment
1. Push this code to a GitHub repository
2. Connect your GitHub repo to Netlify
3. Set the build settings:
   - Build command: `echo "No build required"`
   - Publish directory: `.`
4. Deploy!

## ⚙️ Configuration

### Backend URL Setup
Before deploying, update the backend URL in `config.js`:

```javascript
const config = {
    API_BASE_URL: 'https://your-backend-url.onrender.com',
    // ... rest of config
};
```

Replace `your-backend-url.onrender.com` with your actual backend URL from Render or your preferred hosting service.

### Environment Variables (Optional)
If you want to use environment variables, you can set them in Netlify:
- Go to Site settings > Environment variables
- Add: `REACT_APP_API_URL` = your backend URL

## 📁 File Structure

```
front end/
├── index.html          # Main application entry point
├── styles.css          # All CSS styles
├── app.js             # Main JavaScript application
├── config.js          # Configuration and API endpoints
├── netlify.toml       # Netlify deployment configuration
├── package.json       # Project dependencies
└── README.md          # This file
```

## 🔧 Local Development

1. Install dependencies:
   ```bash
   npm install
   ```

2. Start local server:
   ```bash
   npm start
   ```

3. Open http://localhost:3000 in your browser

## 🌐 Features

- **Modern UI**: Clean, professional design with poker theme
- **Responsive**: Works on desktop, tablet, and mobile
- **Authentication**: Login, register, and password reset
- **Session Tracking**: Add and view poker sessions
- **Statistics**: Real-time profit/loss calculations
- **Secure**: JWT authentication and secure API calls

## 🔒 Security

- JWT token-based authentication
- Secure API communication
- CORS properly configured
- Security headers enabled
- Input validation and sanitization

## 📱 Browser Support

- Chrome (recommended)
- Firefox
- Safari
- Edge
- Mobile browsers

## 🐛 Troubleshooting

### Common Issues

1. **API calls failing**: Check that your backend URL is correct in `config.js`
2. **CORS errors**: Ensure your backend has CORS properly configured
3. **Authentication issues**: Verify JWT tokens are being sent correctly

### Getting Help

- Check the browser console for error messages
- Verify your backend is running and accessible
- Ensure all environment variables are set correctly

## 📄 License

MIT License - see LICENSE file for details

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

---

**The Grind Sheet Team** - Professional Poker Bankroll Tracking 