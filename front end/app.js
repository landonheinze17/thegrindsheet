// The Grind Sheet - Main Application JavaScript

class GrindSheetApp {
    constructor() {
        this.currentUser = null;
        this.userData = null;
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.checkAuthStatus();
        this.hideLoadingScreen();
    }

    setupEventListeners() {
        // Auth form switches
        document.getElementById('showRegister')?.addEventListener('click', (e) => {
            e.preventDefault();
            this.showForm('register');
        });

        document.getElementById('showLogin')?.addEventListener('click', (e) => {
            e.preventDefault();
            this.showForm('login');
        });

        document.getElementById('showForgotPassword')?.addEventListener('click', (e) => {
            e.preventDefault();
            this.showForm('forgot-password');
        });

        document.getElementById('showLoginFromForgot')?.addEventListener('click', (e) => {
            e.preventDefault();
            this.showForm('login');
        });

        // Form submissions
        document.getElementById('loginForm')?.addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleLogin();
        });

        document.getElementById('registerForm')?.addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleRegister();
        });

        document.getElementById('forgotPasswordForm')?.addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleForgotPassword();
        });

        // Dashboard events
        document.getElementById('logoutBtn')?.addEventListener('click', () => {
            this.handleLogout();
        });

        document.getElementById('sessionForm')?.addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleAddSession();
        });
    }

    hideLoadingScreen() {
        setTimeout(() => {
            const loadingScreen = document.getElementById('loading-screen');
            const mainContent = document.getElementById('main-content');
            
            if (loadingScreen && mainContent) {
                loadingScreen.style.display = 'none';
                mainContent.style.display = 'block';
            }
        }, 1500);
    }

    showForm(formType) {
        const forms = ['login', 'register', 'forgot-password'];
        forms.forEach(form => {
            const element = document.getElementById(`${form}-form`);
            if (element) {
                element.style.display = form === formType ? 'block' : 'none';
            }
        });
    }

    async checkAuthStatus() {
        const token = localStorage.getItem('authToken');
        if (token) {
            try {
                const response = await this.apiCall('GET', '/api/verify-token');
                if (response.success) {
                    this.currentUser = response.user;
                    this.showDashboard();
                    await this.loadUserData();
                } else {
                    this.showAuth();
                }
            } catch (error) {
                console.error('Auth check failed:', error);
                this.showAuth();
            }
        } else {
            this.showAuth();
        }
    }

    showAuth() {
        document.getElementById('auth-container').style.display = 'flex';
        document.getElementById('dashboard').style.display = 'none';
    }

    showDashboard() {
        document.getElementById('auth-container').style.display = 'none';
        document.getElementById('dashboard').style.display = 'block';
        this.updateUserInfo();
    }

    updateUserInfo() {
        if (this.currentUser) {
            const userNameElement = document.getElementById('userName');
            if (userNameElement) {
                userNameElement.textContent = `Welcome, ${this.currentUser.name}`;
            }
        }
    }

    async handleLogin() {
        const email = document.getElementById('loginEmail').value;
        const password = document.getElementById('loginPassword').value;

        try {
            const response = await this.apiCall('POST', '/api/login', {
                email,
                password
            });

            if (response.success) {
                localStorage.setItem('authToken', response.token);
                this.currentUser = response.user;
                this.showDashboard();
                await this.loadUserData();
                this.showMessage('Login successful!', 'success');
            } else {
                this.showMessage(response.message || 'Login failed', 'error');
            }
        } catch (error) {
            this.showMessage('Login failed. Please try again.', 'error');
        }
    }

    async handleRegister() {
        const name = document.getElementById('registerName').value;
        const email = document.getElementById('registerEmail').value;
        const password = document.getElementById('registerPassword').value;
        const confirmPassword = document.getElementById('registerConfirmPassword').value;

        if (password !== confirmPassword) {
            this.showMessage('Passwords do not match', 'error');
            return;
        }

        try {
            const response = await this.apiCall('POST', '/api/register', {
                name,
                email,
                password
            });

            if (response.success) {
                this.showMessage('Registration successful! Please log in.', 'success');
                this.showForm('login');
                document.getElementById('registerForm').reset();
            } else {
                this.showMessage(response.message || 'Registration failed', 'error');
            }
        } catch (error) {
            this.showMessage('Registration failed. Please try again.', 'error');
        }
    }

    async handleForgotPassword() {
        const email = document.getElementById('forgotEmail').value;

        try {
            const response = await this.apiCall('POST', '/api/forgot-password', {
                email
            });

            if (response.success) {
                this.showMessage('Password reset link sent to your email!', 'success');
                this.showForm('login');
            } else {
                this.showMessage(response.message || 'Failed to send reset link', 'error');
            }
        } catch (error) {
            this.showMessage('Failed to send reset link. Please try again.', 'error');
        }
    }

    async handleLogout() {
        try {
            await this.apiCall('POST', '/api/logout');
        } catch (error) {
            console.error('Logout error:', error);
        } finally {
            localStorage.removeItem('authToken');
            this.currentUser = null;
            this.userData = null;
            this.showAuth();
            this.showMessage('Logged out successfully', 'success');
        }
    }

    async loadUserData() {
        try {
            const response = await this.apiCall('GET', '/api/data');
            if (response.success) {
                this.userData = response.data;
                this.updateDashboard();
            }
        } catch (error) {
            console.error('Failed to load user data:', error);
        }
    }

    updateDashboard() {
        if (!this.userData) return;

        const sessions = this.userData.sessions || [];
        
        // Update stats
        const totalSessions = sessions.length;
        const totalProfitLoss = sessions.reduce((sum, session) => sum + (session.cashOut - session.buyIn), 0);
        const winningSessions = sessions.filter(session => (session.cashOut - session.buyIn) > 0).length;
        const winRate = totalSessions > 0 ? (winningSessions / totalSessions * 100).toFixed(1) : 0;
        const avgSession = totalSessions > 0 ? (totalProfitLoss / totalSessions).toFixed(2) : 0;

        document.getElementById('totalSessions').textContent = totalSessions;
        document.getElementById('totalProfitLoss').textContent = `$${totalProfitLoss.toFixed(2)}`;
        document.getElementById('winRate').textContent = `${winRate}%`;
        document.getElementById('avgSession').textContent = `$${avgSession}`;

        // Update sessions list
        this.updateSessionsList(sessions);
    }

    updateSessionsList(sessions) {
        const sessionsList = document.getElementById('sessionsList');
        if (!sessionsList) return;

        if (sessions.length === 0) {
            sessionsList.innerHTML = '<p class="text-center">No sessions recorded yet. Add your first session above!</p>';
            return;
        }

        const sessionsHTML = sessions
            .sort((a, b) => new Date(b.date) - new Date(a.date))
            .map(session => {
                const profit = session.cashOut - session.buyIn;
                const profitClass = profit >= 0 ? 'positive' : 'negative';
                const profitSign = profit >= 0 ? '+' : '';
                
                return `
                    <div class="session-item">
                        <div class="session-header">
                            <span class="session-date">${new Date(session.date).toLocaleDateString()}</span>
                            <span class="session-profit ${profitClass}">${profitSign}$${profit.toFixed(2)}</span>
                        </div>
                        <div class="session-details">
                            <div class="session-detail">Duration: ${session.duration}h</div>
                            <div class="session-detail">Buy-in: $${session.buyIn.toFixed(2)}</div>
                            <div class="session-detail">Cash-out: $${session.cashOut.toFixed(2)}</div>
                        </div>
                        ${session.notes ? `<div class="session-notes">${session.notes}</div>` : ''}
                    </div>
                `;
            })
            .join('');

        sessionsList.innerHTML = sessionsHTML;
    }

    async handleAddSession() {
        const formData = {
            date: document.getElementById('sessionDate').value,
            duration: parseFloat(document.getElementById('sessionDuration').value),
            buyIn: parseFloat(document.getElementById('sessionBuyIn').value),
            cashOut: parseFloat(document.getElementById('sessionCashOut').value),
            notes: document.getElementById('sessionNotes').value
        };

        try {
            const response = await this.apiCall('POST', '/api/data', formData);
            if (response.success) {
                this.showMessage('Session added successfully!', 'success');
                document.getElementById('sessionForm').reset();
                await this.loadUserData();
            } else {
                this.showMessage(response.message || 'Failed to add session', 'error');
            }
        } catch (error) {
            this.showMessage('Failed to add session. Please try again.', 'error');
        }
    }

    async apiCall(method, endpoint, data = null) {
        const token = localStorage.getItem('authToken');
        const headers = {
            'Content-Type': 'application/json'
        };

        if (token) {
            headers['Authorization'] = `Bearer ${token}`;
        }

        const config = {
            method,
            headers,
            credentials: 'include'
        };

        if (data && method !== 'GET') {
            config.body = JSON.stringify(data);
        }

        const url = window.config.API_BASE_URL + endpoint;
        
        try {
            const response = await fetch(url, config);
            const result = await response.json();
            
            if (!response.ok) {
                throw new Error(result.message || 'API call failed');
            }
            
            return result;
        } catch (error) {
            console.error('API call error:', error);
            throw error;
        }
    }

    showMessage(message, type = 'info') {
        // Remove existing messages
        const existingMessages = document.querySelectorAll('.message');
        existingMessages.forEach(msg => msg.remove());

        // Create new message
        const messageElement = document.createElement('div');
        messageElement.className = `message ${type}`;
        messageElement.textContent = message;

        // Insert message at the top of the main content
        const mainContent = document.getElementById('main-content');
        if (mainContent) {
            mainContent.insertBefore(messageElement, mainContent.firstChild);
        }

        // Auto-remove after 5 seconds
        setTimeout(() => {
            if (messageElement.parentNode) {
                messageElement.remove();
            }
        }, 5000);
    }
}

// Initialize the app when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new GrindSheetApp();
});

// Set default date to today
document.addEventListener('DOMContentLoaded', () => {
    const dateInput = document.getElementById('sessionDate');
    if (dateInput) {
        const today = new Date().toISOString().split('T')[0];
        dateInput.value = today;
    }
}); 