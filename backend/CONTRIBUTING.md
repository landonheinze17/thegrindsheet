# Contributing to The Grind Sheet

Thank you for your interest in contributing to The Grind Sheet! We welcome contributions from the community and appreciate your help in making this poker tracking application even better.

## 🤝 How to Contribute

### Reporting Bugs
- Use the [GitHub Issues](https://github.com/yourusername/the-grind-sheet/issues) page
- Include a clear description of the bug
- Provide steps to reproduce the issue
- Include your browser and operating system information
- Add screenshots if applicable

### Suggesting Features
- Use the [GitHub Issues](https://github.com/yourusername/the-grind-sheet/issues) page
- Clearly describe the feature you'd like to see
- Explain why this feature would be useful
- Include mockups or examples if possible

### Code Contributions
1. **Fork the repository**
2. **Create a feature branch**
   ```bash
   git checkout -b feature/your-feature-name
   ```
3. **Make your changes**
4. **Test your changes thoroughly**
5. **Commit your changes**
   ```bash
   git commit -m "feat: add new feature description"
   ```
6. **Push to your fork**
   ```bash
   git push origin feature/your-feature-name
   ```
7. **Create a Pull Request**

## 📋 Development Guidelines

### Code Style
- Use consistent indentation (2 spaces)
- Follow JavaScript best practices
- Add comments for complex logic
- Use meaningful variable and function names

### Commit Messages
Follow the [Conventional Commits](https://www.conventionalcommits.org/) format:
- `feat:` for new features
- `fix:` for bug fixes
- `docs:` for documentation changes
- `style:` for formatting changes
- `refactor:` for code refactoring
- `test:` for adding tests
- `chore:` for maintenance tasks

### Testing
- Test all new features thoroughly
- Ensure existing functionality still works
- Test on different browsers if applicable
- Test the mobile responsiveness

### Security
- Never commit sensitive information (passwords, API keys)
- Follow security best practices
- Validate all user inputs
- Sanitize data before storing

## 🛠️ Development Setup

### Prerequisites
- Node.js (version 14 or higher)
- npm or yarn
- Git

### Local Development
1. **Clone your fork**
   ```bash
   git clone https://github.com/yourusername/the-grind-sheet.git
   cd the-grind-sheet
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp env-template.txt .env
   # Edit .env with your configuration
   ```

4. **Start development server**
   ```bash
   npm run dev
   ```

5. **Make your changes and test**

## 📁 Project Structure

```
the-grind-sheet/
├── server.js              # Main server file
├── package.json           # Dependencies and scripts
├── landing.html           # Landing page for potential customers
├── login.html             # Login and registration page
├── poker.html             # Main poker tracking application
├── reset-password.html    # Password reset page
├── README.md              # Project documentation
├── CONTRIBUTING.md        # This file
├── LICENSE                # MIT License
├── Dockerfile             # Docker configuration
├── .dockerignore          # Docker ignore file
├── env-template.txt       # Environment variables template
├── users.json             # User data (auto-generated)
├── userData.json          # Poker data (auto-generated)
└── resetTokens.json       # Password reset tokens (auto-generated)
```

## 🧪 Testing Guidelines

### Manual Testing Checklist
- [ ] User registration and login
- [ ] Password reset functionality
- [ ] Session tracking and statistics
- [ ] Bankroll management
- [ ] Goal setting and tracking
- [ ] Data export/import
- [ ] Mobile responsiveness
- [ ] Security features (rate limiting, etc.)

### Browser Testing
Test on the following browsers:
- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

### Mobile Testing
- Test on iOS Safari
- Test on Android Chrome
- Verify responsive design

## 🔒 Security Considerations

### When Contributing
- Never expose sensitive information in code
- Validate all user inputs
- Use parameterized queries (when database is added)
- Follow OWASP security guidelines
- Test for common vulnerabilities

### Reporting Security Issues
If you discover a security vulnerability, please:
1. **Do not** create a public issue
2. Email us at thegrindsheetteam@gmail.com
3. Include detailed information about the vulnerability
4. We will respond within 48 hours

## 📝 Documentation

### Code Documentation
- Add JSDoc comments for functions
- Document complex algorithms
- Include examples for API endpoints
- Keep README.md updated

### User Documentation
- Update user-facing documentation
- Add screenshots for new features
- Include step-by-step instructions
- Keep setup instructions current

## 🎯 Areas for Contribution

### High Priority
- Database integration (PostgreSQL/MongoDB)
- Advanced analytics and reporting
- Mobile app development
- Performance optimization
- Security enhancements

### Medium Priority
- Additional chart types
- Export formats (PDF, Excel)
- Social features
- Tournament tracking
- Multi-currency support

### Low Priority
- UI/UX improvements
- Additional themes
- Integration with poker sites
- Advanced goal tracking

## 🏆 Recognition

Contributors will be recognized in:
- The project README
- Release notes
- GitHub contributors page
- Special mentions in documentation

## 📞 Getting Help

If you need help with contributing:
- Check existing issues and pull requests
- Join our community discussions
- Email us at thegrindsheetteam@gmail.com
- Review the documentation

## 📄 License

By contributing to The Grind Sheet, you agree that your contributions will be licensed under the MIT License.

---

Thank you for contributing to The Grind Sheet! 🃏💰 