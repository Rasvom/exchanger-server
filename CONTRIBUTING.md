# Contributing to Exchanger Server

Thank you for your interest in contributing! This document provides guidelines and instructions for contributing to this project.

## Table of Contents

- [Code of Conduct](#code-of-conduct)
- [Getting Started](#getting-started)
- [Development Workflow](#development-workflow)
- [Coding Standards](#coding-standards)
- [Commit Messages](#commit-messages)
- [Pull Request Process](#pull-request-process)
- [Testing Guidelines](#testing-guidelines)

## Code of Conduct

- Be respectful and inclusive
- Focus on constructive feedback
- Help others learn and grow
- Maintain professionalism

## Getting Started

### Prerequisites

- Node.js >= 18
- MongoDB >= 6
- Git
- Code editor (VS Code recommended)

### Setup

1. **Fork the repository**
   ```bash
   # Click "Fork" on GitHub
   ```

2. **Clone your fork**
   ```bash
   git clone https://github.com/YOUR_USERNAME/exchanger-server.git
   cd exchanger-server
   ```

3. **Add upstream remote**
   ```bash
   git remote add upstream https://github.com/ORIGINAL_OWNER/exchanger-server.git
   ```

4. **Install dependencies**
   ```bash
   npm install
   ```

5. **Setup environment**
   ```bash
   cp .env.example .env
   # Edit .env with your configuration
   ```

6. **Run tests**
   ```bash
   npm test
   ```

7. **Start development server**
   ```bash
   npm run dev
   ```

## Development Workflow

### Creating a Feature Branch

```bash
# Update main branch
git checkout main
git pull upstream main

# Create feature branch
git checkout -b feature/your-feature-name
```

### Branch Naming

- `feature/` - New features
- `fix/` - Bug fixes
- `docs/` - Documentation changes
- `refactor/` - Code refactoring
- `test/` - Test additions or fixes
- `chore/` - Maintenance tasks

Examples:
- `feature/add-redis-caching`
- `fix/jwt-expiration-bug`
- `docs/update-api-documentation`

## Coding Standards

### TypeScript

- **Always use TypeScript** - No JavaScript files in `src/`
- **Strict typing** - Avoid `any`, use proper types
- **Interfaces over types** - Prefer `interface` for object shapes
- **Export types** - Make reusable types available

```typescript
// ❌ Bad
const data: any = fetchData();

// ✅ Good
interface UserData {
  id: string;
  name: string;
}
const data: UserData = fetchData();
```

### Code Style

- **Use Prettier** - Format code automatically
- **Use ESLint** - Follow linting rules
- **Consistent naming**:
  - `camelCase` for variables and functions
  - `PascalCase` for classes and interfaces
  - `UPPER_CASE` for constants
  - Prefix interfaces with `I` if needed

```typescript
// ✅ Good examples
const userName = 'John';
interface UserProfile {}
class UserService {}
const MAX_RETRY_COUNT = 3;
```

### File Organization

```
controllers/
  user/
    login.ts
    register.ts
    index.ts  # Export all from this module
```

- One controller per file
- Export from `index.ts`
- Keep files under 300 lines

### Error Handling

```typescript
// ✅ Use asyncHandler wrapper
export const createUser = asyncHandler(async (req, res) => {
  // Your code
  // Errors automatically caught
});

// ✅ Throw operational errors
if (!user) {
  throw new AppError('User not found', 404);
}
```

### Logging

```typescript
import logger from '@config/logger';

// ✅ Use appropriate log levels
logger.info('User logged in', { userId: user.id });
logger.warn('Failed login attempt', { email });
logger.error('Database error', { error: err.message });
```

### Validation

```typescript
// ✅ Use express-validator
export const createUserValidation = [
  body('email').isEmail().withMessage('Invalid email'),
  body('password').isLength({ min: 6 }),
];
```

## Commit Messages

Follow [Conventional Commits](https://www.conventionalcommits.org/):

```
<type>(<scope>): <subject>

<body>

<footer>
```

### Types

- `feat:` - New feature
- `fix:` - Bug fix
- `docs:` - Documentation
- `style:` - Formatting
- `refactor:` - Code restructuring
- `test:` - Tests
- `chore:` - Maintenance

### Examples

```
feat(auth): add two-factor authentication

Implemented TOTP-based 2FA for enhanced security.
Users can enable 2FA in profile settings.

Closes #123
```

```
fix(api): resolve memory leak in websocket handler

Fixed event listener cleanup that caused memory leak
after prolonged websocket connections.

Fixes #456
```

```
docs(readme): update installation instructions

Added Docker setup section and troubleshooting guide.
```

## Pull Request Process

### Before Submitting

- [ ] Code follows style guidelines
- [ ] All tests pass: `npm test`
- [ ] New tests added for new features
- [ ] Documentation updated
- [ ] No console.log statements
- [ ] Types are properly defined
- [ ] ESLint passes: `npm run lint` (if configured)

### Submitting

1. **Push to your fork**
   ```bash
   git push origin feature/your-feature-name
   ```

2. **Create Pull Request**
   - Go to GitHub
   - Click "New Pull Request"
   - Select your branch
   - Fill out PR template

3. **PR Title Format**
   ```
   feat(scope): brief description
   ```

4. **PR Description Should Include**
   - What changed
   - Why it changed
   - How to test
   - Screenshots (if UI changes)
   - Related issues

### PR Template

```markdown
## Description
Brief description of changes

## Type of Change
- [ ] Bug fix
- [ ] New feature
- [ ] Breaking change
- [ ] Documentation update

## Testing
- [ ] Unit tests pass
- [ ] Integration tests pass
- [ ] Manual testing completed

## Checklist
- [ ] Code follows style guidelines
- [ ] Self-review completed
- [ ] Comments added for complex code
- [ ] Documentation updated
- [ ] No new warnings generated
```

### Review Process

- Maintainers will review within 2-3 days
- Address feedback promptly
- Keep discussions professional
- Be open to suggestions

## Testing Guidelines

### Writing Tests

```typescript
describe('User Service', () => {
  describe('createUser', () => {
    it('should create user with valid data', async () => {
      const userData = { email: 'test@example.com', password: 'password123' };
      const user = await createUser(userData);
      
      expect(user).toBeDefined();
      expect(user.email).toBe(userData.email);
    });
    
    it('should throw error with invalid email', async () => {
      const userData = { email: 'invalid', password: 'password123' };
      
      await expect(createUser(userData)).rejects.toThrow();
    });
  });
});
```

### Test Coverage

- Aim for 80%+ coverage
- Test edge cases
- Test error scenarios
- Mock external dependencies

```bash
# Run tests with coverage
npm test -- --coverage
```

### Test Organization

```
__tests__/
  unit/
    services/
      userService.test.ts
  integration/
    api/
      auth.test.ts
  utils/
    helpers.test.ts
```

## Documentation

### Code Comments

```typescript
/**
 * Creates a new user account
 * @param userData - User registration data
 * @returns Created user object
 * @throws {AppError} If email already exists
 */
export const createUser = async (userData: UserData): Promise<User> => {
  // Implementation
};
```

### API Documentation

- Update Swagger annotations for new endpoints
- Include request/response examples
- Document error responses

```typescript
/**
 * @swagger
 * /api/users:
 *   post:
 *     summary: Create new user
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/User'
 */
```

## Questions?

- Open an issue for bugs
- Start a discussion for questions
- Join our Discord/Slack (if available)

## License

By contributing, you agree that your contributions will be licensed under the same license as the project (ISC).

---

**Thank you for contributing! 🎉**
