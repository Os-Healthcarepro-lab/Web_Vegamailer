# Contributing to Vegamailer

Thank you for your interest in contributing to Vegamailer! This document provides guidelines and instructions for contributing.

## 🚀 Getting Started

1. Fork the repository
2. Clone your fork: `git clone https://github.com/YOUR_USERNAME/Web_Vegamailer.git`
3. Add upstream remote: `git remote add upstream https://github.com/Os-Healthcarepro-lab/Web_Vegamailer.git`
4. Run setup: `.\setup.ps1` (Windows) or `npm install` (Mac/Linux)

## 📋 Development Workflow

### 1. Create a Branch

Always create a new branch for your work:

```bash
git checkout -b feature/your-feature-name
# or
git checkout -b fix/bug-description
```

Branch naming conventions:
- `feature/` - New features
- `fix/` - Bug fixes
- `docs/` - Documentation updates
- `refactor/` - Code refactoring
- `test/` - Adding or updating tests

### 2. Make Your Changes

- Write clean, readable code
- Follow the existing code style
- Add comments for complex logic
- Update documentation as needed

### 3. Test Your Changes

Before committing, ensure:

```powershell
# Run linter
npm run lint

# Start dev server and test manually
.\dev.ps1

# Run health check
.\healthcheck.ps1
```

### 4. Commit Your Changes

We follow conventional commits:

```bash
git add .
git commit -m "feat: add new email template builder"
git commit -m "fix: resolve campaign analytics bug"
git commit -m "docs: update API documentation"
```

Commit message format:
- `feat:` - New feature
- `fix:` - Bug fix
- `docs:` - Documentation changes
- `style:` - Code style changes (formatting, etc.)
- `refactor:` - Code refactoring
- `test:` - Adding or updating tests
- `chore:` - Maintenance tasks

### 5. Push and Create Pull Request

```bash
git push origin feature/your-feature-name
```

Then create a Pull Request on GitHub with:
- Clear title and description
- Reference any related issues
- Screenshots (if UI changes)
- Testing steps

## 🎨 Code Style Guidelines

### JavaScript/React

- Use ES6+ features
- Use functional components with hooks
- Prefer `const` over `let`, avoid `var`
- Use meaningful variable names
- Keep functions small and focused
- Use async/await over promises

Example:
```javascript
// Good
const fetchCampaigns = async () => {
  try {
    const response = await api.getCampaigns();
    return response.data;
  } catch (error) {
    logger.error('Failed to fetch campaigns:', error);
    throw error;
  }
};

// Avoid
function getCampaigns() {
  return api.getCampaigns().then(function(response) {
    return response.data;
  }).catch(function(error) {
    console.log(error);
  });
}
```

### React Components

- One component per file
- Use named exports for components
- Props should be destructured
- Use PropTypes or TypeScript for type checking

Example:
```jsx
// Good
export const CampaignCard = ({ title, description, status }) => {
  return (
    <div className="campaign-card">
      <h3>{title}</h3>
      <p>{description}</p>
      <Badge status={status} />
    </div>
  );
};

// Avoid
export default function Component(props) {
  return (
    <div>
      <h3>{props.title}</h3>
      <p>{props.description}</p>
    </div>
  );
}
```

### CSS/Tailwind

- Use Tailwind utility classes when possible
- Keep custom CSS minimal
- Use semantic class names
- Follow mobile-first approach

## 📁 Project Structure

```
apps/
├── web/                    # Frontend React app
│   ├── src/
│   │   ├── components/    # Reusable components
│   │   ├── pages/         # Page components
│   │   ├── hooks/         # Custom hooks
│   │   ├── contexts/      # React contexts
│   │   └── lib/           # Utilities
│   └── public/            # Static assets
│
├── api/                   # Backend Express API
│   └── src/
│       ├── routes/        # API endpoints
│       ├── middleware/    # Express middleware
│       ├── utils/         # Utility functions
│       └── constants/     # Constants
│
└── pocketbase/           # Database
    ├── pb_hooks/         # Database hooks
    └── pb_migrations/    # Schema migrations
```

## 🐛 Reporting Bugs

When reporting bugs, include:

1. **Description** - Clear description of the bug
2. **Steps to Reproduce** - Detailed steps
3. **Expected Behavior** - What should happen
4. **Actual Behavior** - What actually happens
5. **Environment** - OS, Node version, browser
6. **Screenshots** - If applicable
7. **Error Logs** - Console errors or server logs

## ✨ Suggesting Features

For feature requests:

1. Check if it's already suggested
2. Provide clear use case
3. Explain expected behavior
4. Include mockups if UI-related

## 📝 Documentation

When adding features:

- Update README.md if needed
- Add JSDoc comments for functions
- Update API documentation
- Add code comments for complex logic

## ✅ Pull Request Checklist

Before submitting:

- [ ] Code follows project style guidelines
- [ ] Self-review of code completed
- [ ] Comments added for complex code
- [ ] Documentation updated
- [ ] No console.log or debugging code
- [ ] Linter passes (`npm run lint`)
- [ ] Manual testing completed
- [ ] PR description is clear and complete

## 🔍 Code Review Process

1. All PRs require review before merging
2. Address all review comments
3. Keep PRs focused and small
4. Respond to feedback promptly

## 📜 License

By contributing, you agree that your contributions will be licensed under the same license as the project.

## ❓ Questions?

If you have questions:
- Open an issue with the `question` label
- Contact the maintainers

## 🙏 Thank You!

Your contributions make Vegamailer better for everyone. We appreciate your time and effort!
