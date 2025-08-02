require('dotenv').config();
const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const path = require('path');
const fs = require('fs').promises;
const { createTransport } = require('nodemailer');
const crypto = require('crypto');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-this-in-production';

// Email configuration (you'll need to set these up)
const EMAIL_USER = process.env.EMAIL_USER || 'your-email@gmail.com';
const EMAIL_PASS = process.env.EMAIL_PASS || 'your-app-password';
const EMAIL_FROM = process.env.EMAIL_FROM || 'your-email@gmail.com';

// Password reset tokens storage (in production, use a database)
const resetTokensFile = 'resetTokens.json';

// Security middleware
app.use(helmet({
    contentSecurityPolicy: {
        directives: {
            defaultSrc: ["'self'"],
            styleSrc: ["'self'", "'unsafe-inline'", "https://cdn.jsdelivr.net"],
            scriptSrc: ["'self'", "'unsafe-inline'", "https://cdn.jsdelivr.net"],
            imgSrc: ["'self'", "data:", "https:"],
            connectSrc: ["'self'"],
            fontSrc: ["'self'", "https://cdn.jsdelivr.net"],
            objectSrc: ["'none'"],
            mediaSrc: ["'self'"],
            frameSrc: ["'none'"],
        },
    },
    hsts: {
        maxAge: 31536000,
        includeSubDomains: true,
        preload: true
    }
}));

// Rate limiting
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // limit each IP to 100 requests per windowMs
    message: 'Too many requests from this IP, please try again later.',
    standardHeaders: true,
    legacyHeaders: false,
});

const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 5, // limit each IP to 5 auth requests per windowMs
    message: 'Too many authentication attempts, please try again later.',
    standardHeaders: true,
    legacyHeaders: false,
});

// CORS configuration
app.use(cors({
    origin: process.env.ALLOWED_ORIGINS ? process.env.ALLOWED_ORIGINS.split(',') : ['http://localhost:3000'],
    credentials: true
}));

// Middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.static('.', {
    maxAge: '1h',
    etag: true
}));

// Apply rate limiting
app.use('/api/', limiter);
app.use('/api/login', authLimiter);
app.use('/api/register', authLimiter);
app.use('/api/forgot-password', authLimiter);

// Request logging middleware
app.use((req, res, next) => {
    console.log(`${new Date().toISOString()} - ${req.method} ${req.path} - IP: ${req.ip}`);
    next();
});

// Data storage (in production, use a real database)
const usersFile = 'users.json';
const dataFile = 'userData.json';

// Initialize data files if they don't exist
async function initializeFiles() {
    try {
        await fs.access(usersFile);
    } catch {
        await fs.writeFile(usersFile, JSON.stringify({}));
    }
    
    try {
        await fs.access(dataFile);
    } catch {
        await fs.writeFile(dataFile, JSON.stringify({}));
    }
    
    try {
        await fs.access(resetTokensFile);
    } catch {
        await fs.writeFile(resetTokensFile, JSON.stringify({}));
    }
}

// Load users from file
async function loadUsers() {
    try {
        const data = await fs.readFile(usersFile, 'utf8');
        return JSON.parse(data);
    } catch {
        return {};
    }
}

// Save users to file
async function saveUsers(users) {
    await fs.writeFile(usersFile, JSON.stringify(users, null, 2));
}

// Load user data from file
async function loadUserData() {
    try {
        const data = await fs.readFile(dataFile, 'utf8');
        return JSON.parse(data);
    } catch {
        return {};
    }
}

// Save user data to file
async function saveUserData(userData) {
    await fs.writeFile(dataFile, JSON.stringify(userData, null, 2));
}

// Load reset tokens from file
async function loadResetTokens() {
    try {
        const data = await fs.readFile(resetTokensFile, 'utf8');
        return JSON.parse(data);
    } catch {
        return {};
    }
}

// Save reset tokens to file
async function saveResetTokens(tokens) {
    await fs.writeFile(resetTokensFile, JSON.stringify(tokens, null, 2));
}

// Generate reset token
function generateResetToken() {
    return crypto.randomBytes(32).toString('hex');
}

// Email transporter setup
function createEmailTransporter() {
    return createTransport({
        service: 'gmail',
        auth: {
            user: EMAIL_USER,
            pass: EMAIL_PASS
        },
        tls: {
            rejectUnauthorized: false
        }
    });
}

// Authentication middleware
function authenticateToken(req, res, next) {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        return res.status(401).json({ message: 'Access token required' });
    }

    jwt.verify(token, JWT_SECRET, (err, user) => {
        if (err) {
            return res.status(403).json({ message: 'Invalid or expired token' });
        }
        req.user = user;
        next();
    });
}

// Input validation functions
function validateEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

function validatePassword(password) {
    return password && password.length >= 8;
}

function validateName(name) {
    return name && name.trim().length >= 2 && name.trim().length <= 50;
}

function validateAmount(amount) {
    const num = parseFloat(amount);
    return !isNaN(num) && num >= 0 && num <= 1000000;
}

function validateSessionData(session) {
    return session.date && session.gameType && session.stakes && 
           validateAmount(session.result) && session.duration > 0;
}

// Error handling middleware
app.use((err, req, res, next) => {
    console.error('Error:', err);
    
    if (err.type === 'entity.parse.failed') {
        return res.status(400).json({ error: 'Invalid JSON format' });
    }
    
    if (err.code === 'LIMIT_FILE_SIZE') {
        return res.status(413).json({ error: 'File too large' });
    }
    
    res.status(500).json({ error: 'Internal server error' });
});

// Health check endpoint
app.get('/api/health', (req, res) => {
    res.json({
        status: 'healthy',
        timestamp: new Date().toISOString(),
        uptime: process.uptime(),
        version: require('./package.json').version
    });
});

// Routes

// Serve landing page as default
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'landing.html'));
});

// Serve login page
app.get('/login', (req, res) => {
    res.sendFile(path.join(__dirname, 'login.html'));
});

// Serve test page
app.get('/test', (req, res) => {
    res.sendFile(path.join(__dirname, 'test.html'));
});

// Serve reset password page
app.get('/reset-password.html', (req, res) => {
    res.sendFile(path.join(__dirname, 'reset-password.html'));
});

// Register endpoint
app.post('/api/register', async (req, res) => {
    console.log('Registration request received:', req.body);
    try {
        const { name, email, password } = req.body;

        if (!name || !email || !password) {
            console.log('Missing required fields:', { name: !!name, email: !!email, password: !!password });
            return res.status(400).json({ message: 'All fields are required' });
        }

        if (password.length < 6) {
            console.log('Password too short:', password.length);
            return res.status(400).json({ message: 'Password must be at least 6 characters' });
        }

        const users = await loadUsers();

        if (users[email]) {
            console.log('User already exists:', email);
            return res.status(400).json({ message: 'User already exists' });
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create user
        users[email] = {
            name,
            email,
            password: hashedPassword,
            createdAt: new Date().toISOString()
        };

        await saveUsers(users);
        console.log('User created successfully:', email);

        res.status(201).json({ message: 'User created successfully' });
    } catch (error) {
        console.error('Registration error:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Login endpoint
app.post('/api/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ message: 'Email and password are required' });
        }

        const users = await loadUsers();
        const user = users[email];

        if (!user) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        const validPassword = await bcrypt.compare(password, user.password);

        if (!validPassword) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        // Create JWT token
        const token = jwt.sign(
            { email: user.email, name: user.name },
            JWT_SECRET,
            { expiresIn: '7d' }
        );

        res.json({
            token,
            user: {
                name: user.name,
                email: user.email
            }
        });
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Verify token endpoint
app.get('/api/verify', authenticateToken, (req, res) => {
    res.json({ user: req.user });
});

// Get user data endpoint
app.get('/api/data', authenticateToken, async (req, res) => {
    try {
        const userData = await loadUserData();
        const userEmail = req.user.email;
        
        if (!userData[userEmail]) {
            userData[userEmail] = {
                sessions: [],
                goals: [],
                transactions: []
            };
            await saveUserData(userData);
        }

        res.json(userData[userEmail]);
    } catch (error) {
        console.error('Get data error:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Save user data endpoint
app.post('/api/data', authenticateToken, async (req, res) => {
    try {
        const { sessions, goals, transactions } = req.body;
        const userEmail = req.user.email;

        const userData = await loadUserData();
        userData[userEmail] = {
            sessions: sessions || [],
            goals: goals || [],
            transactions: transactions || []
        };

        await saveUserData(userData);

        res.json({ message: 'Data saved successfully' });
    } catch (error) {
        console.error('Save data error:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Logout endpoint
app.post('/api/logout', (req, res) => {
    res.json({ message: 'Logged out successfully' });
});

// Forgot password endpoint
app.post('/api/forgot-password', async (req, res) => {
    try {
        const { email } = req.body;

        if (!email) {
            return res.status(400).json({ message: 'Email is required' });
        }

        const users = await loadUsers();
        const user = users[email];

        if (!user) {
            // Don't reveal if user exists or not for security
            return res.json({ message: 'If an account with that email exists, a password reset link has been sent.' });
        }

        // Generate reset token
        const resetToken = generateResetToken();
        const resetTokens = await loadResetTokens();
        
        // Store token with expiration (1 hour)
        resetTokens[resetToken] = {
            email: email,
            expires: new Date(Date.now() + 60 * 60 * 1000).toISOString() // 1 hour
        };
        
        await saveResetTokens(resetTokens);

        // Create reset URL
        const resetUrl = `http://localhost:${PORT}/reset-password.html?token=${resetToken}`;

        // Send email (or show in console for development)
        if (EMAIL_USER === 'test@example.com') {
            // Development mode - show reset link in console
            console.log('\n=== PASSWORD RESET LINK ===');
            console.log(`Reset URL: ${resetUrl}`);
            console.log('=== END RESET LINK ===\n');
        } else {
            // Production mode - send actual email
            const transporter = createEmailTransporter();
            const mailOptions = {
                from: EMAIL_FROM,
                to: email,
                subject: 'Password Reset Request - The Grind Sheet',
                html: `
                    <h2>Password Reset Request</h2>
                    <p>Hello ${user.name},</p>
                                         <p>You requested a password reset for your The Grind Sheet account.</p>
                    <p>Click the link below to reset your password:</p>
                    <a href="${resetUrl}" style="background: #007bff; color: white; padding: 10px 20px; text-decoration: none; border-radius: 4px;">Reset Password</a>
                    <p>This link will expire in 1 hour.</p>
                    <p>If you didn't request this reset, please ignore this email.</p>
                                         <p>Best regards,<br>The Grind Sheet Team</p>
                `
            };

            await transporter.sendMail(mailOptions);
        }

        res.json({ message: 'If an account with that email exists, a password reset link has been sent.' });
    } catch (error) {
        console.error('Forgot password error:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Reset password endpoint
app.post('/api/reset-password', async (req, res) => {
    try {
        const { token, password } = req.body;

        if (!token || !password) {
            return res.status(400).json({ message: 'Token and password are required' });
        }

        if (password.length < 6) {
            return res.status(400).json({ message: 'Password must be at least 6 characters' });
        }

        const resetTokens = await loadResetTokens();
        const resetData = resetTokens[token];

        if (!resetData) {
            return res.status(400).json({ message: 'Invalid or expired reset token' });
        }

        // Check if token is expired
        if (new Date() > new Date(resetData.expires)) {
            // Remove expired token
            delete resetTokens[token];
            await saveResetTokens(resetTokens);
            return res.status(400).json({ message: 'Reset token has expired' });
        }

        // Update user password
        const users = await loadUsers();
        const user = users[resetData.email];

        if (!user) {
            return res.status(400).json({ message: 'User not found' });
        }

        // Hash new password
        const hashedPassword = await bcrypt.hash(password, 10);
        user.password = hashedPassword;
        
        await saveUsers(users);

        // Remove used token
        delete resetTokens[token];
        await saveResetTokens(resetTokens);

        res.json({ message: 'Password has been reset successfully' });
    } catch (error) {
        console.error('Reset password error:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Verify reset token endpoint
app.get('/api/verify-reset-token/:token', async (req, res) => {
    try {
        const { token } = req.params;
        const resetTokens = await loadResetTokens();
        const resetData = resetTokens[token];

        if (!resetData) {
            return res.status(400).json({ message: 'Invalid reset token' });
        }

        // Check if token is expired
        if (new Date() > new Date(resetData.expires)) {
            return res.status(400).json({ message: 'Reset token has expired' });
        }

        res.json({ message: 'Valid reset token' });
    } catch (error) {
        console.error('Verify reset token error:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Start server
initializeFiles().then(() => {
    app.listen(PORT, () => {
        console.log(`Server running on http://localhost:${PORT}`);
        console.log('Landing page: http://localhost:3000');
        console.log('Login page: http://localhost:3000/login');
        console.log('Poker tracker: http://localhost:3000/poker.html');
    });
}).catch(error => {
    console.error('Failed to initialize server:', error);
}); 