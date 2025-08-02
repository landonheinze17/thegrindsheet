// Configuration for The Grind Sheet
const config = {
    // Replace this with your actual backend URL from Render
    API_BASE_URL: 'https://your-backend-url.onrender.com',
    
    // API endpoints
    ENDPOINTS: {
        LOGIN: '/api/login',
        REGISTER: '/api/register',
        FORGOT_PASSWORD: '/api/forgot-password',
        RESET_PASSWORD: '/api/reset-password',
        VERIFY_TOKEN: '/api/verify-reset-token',
        DATA: '/api/data',
        LOGOUT: '/api/logout',
        HEALTH: '/api/health'
    },
    
    // App settings
    APP_NAME: 'The Grind Sheet',
    VERSION: '1.0.0'
};

// Helper function to get full API URL
function getApiUrl(endpoint) {
    return config.API_BASE_URL + endpoint;
}

// Export for use in other files
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { config, getApiUrl };
} else {
    window.config = config;
    window.getApiUrl = getApiUrl;
} 