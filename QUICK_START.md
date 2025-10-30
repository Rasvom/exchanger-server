# Quick Start Guide

Get your development environment up and running in 5 minutes!

## Prerequisites Check

```bash
# Check Node.js version (need >= 18)
node --version

# Check npm version
npm --version

# Check MongoDB (if running locally)
mongod --version
```

## 1. Installation

```bash
# Clone the repository
git clone <repository-url>
cd exchanger-server

# Install dependencies
npm install
```

⏱️ **Expected time**: 2-3 minutes

## 2. Environment Setup

```bash
# Copy environment template
cp .env.example .env
```

Edit `.env` with your configuration:

```env
PORT=3000
NODE_ENV=development
MONGODB=mongodb://localhost:27017/exchanger
SECRET_ACCESS_JWT=your_secret_here_change_in_production
SECRET_REFRESH_JWT=your_refresh_secret_here_change_in_production
```

**Minimum required variables:**
- `PORT`
- `MONGODB`
- `SECRET_ACCESS_JWT`
- `SECRET_REFRESH_JWT`

⏱️ **Expected time**: 1 minute

## 3. Database Setup

### Option A: Local MongoDB

```bash
# Start MongoDB (if installed locally)
mongod

# In another terminal, verify connection
mongosh
```

### Option B: Docker MongoDB

```bash
# Run only MongoDB from docker-compose
docker-compose up mongodb -d
```

### Option C: MongoDB Atlas (Cloud)

1. Create free cluster at [mongodb.com/atlas](https://mongodb.com/atlas)
2. Get connection string
3. Update `MONGODB` in `.env`

⏱️ **Expected time**: 1-2 minutes

## 4. Start Development Server

```bash
npm run dev
```

You should see:

```
Сервер запущен на порте 3000
Swagger документация: http://localhost:3000/api-docs
Health check: http://localhost:3000/health
Успешно подключено к MongoDB
```

⏱️ **Expected time**: 10 seconds

## 5. Verify Installation

### Health Check

```bash
curl http://localhost:3000/health
```

Expected response:
```json
{
  "status": "OK",
  "database": {
    "status": "connected"
  }
}
```

### Swagger Documentation

Open in browser: http://localhost:3000/api-docs

## 6. Create Test User (Optional)

```bash
curl -X POST http://localhost:3000/user-service/registration \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "Test123",
    "fullName": "Test User"
  }'
```

## 7. Create Manager Account (Optional)

```bash
npm run create-manager
```

Follow the prompts to create a manager account.

---

## Quick Commands

```bash
# Development with hot reload
npm run dev

# Build for production
npm run build

# Run production build
npm start

# Run tests
npm test

# Run tests in watch mode
npm run test:watch

# Create manager account
npm run create-manager
```

---

## Docker Quick Start

### Run Everything with Docker

```bash
# Build and start all services
docker-compose up -d

# View logs
docker-compose logs -f app

# Stop services
docker-compose down
```

### Services Available:
- **App**: http://localhost:3000
- **MongoDB**: localhost:27017
- **API Docs**: http://localhost:3000/api-docs

---

## Common Issues & Solutions

### Issue: Port 3000 already in use

**Solution:**
```bash
# Change PORT in .env
PORT=3001
```

### Issue: Cannot connect to MongoDB

**Solution:**
```bash
# Check if MongoDB is running
ps aux | grep mongod

# Or start MongoDB
mongod

# Or use Docker
docker-compose up mongodb -d
```

### Issue: Module not found errors

**Solution:**
```bash
# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install
```

### Issue: TypeScript errors

**Solution:**
```bash
# Rebuild
npm run build
```

---

## Development Workflow

1. **Start dev server**: `npm run dev`
2. **Make changes** to code
3. **Server auto-restarts** (nodemon)
4. **Test changes** via Swagger or curl
5. **Run tests**: `npm test`
6. **Commit changes**: `git commit -m "feat: description"`

---

## Next Steps

1. ✅ Explore Swagger docs: http://localhost:3000/api-docs
2. ✅ Read [API_EXAMPLES.md](./API_EXAMPLES.md) for request examples
3. ✅ Check [README.md](./README.md) for full documentation
4. ✅ Review [CONTRIBUTING.md](./CONTRIBUTING.md) if contributing
5. ✅ Set up proper environment variables for production

---

## Production Deployment Quick Start

```bash
# 1. Set production environment
export NODE_ENV=production

# 2. Build application
npm run build

# 3. Start with PM2
npm install -g pm2
pm2 start dist/index.js --name exchanger-server

# 4. Monitor
pm2 status
pm2 logs exchanger-server
```

Or use Docker:

```bash
docker build -t exchanger-server .
docker run -d -p 3000:3000 --env-file .env exchanger-server
```

---

## Getting Help

- 📚 Full docs: [README.md](./README.md)
- 🔧 API examples: [API_EXAMPLES.md](./API_EXAMPLES.md)
- 🐛 Report issues: GitHub Issues
- 💬 Ask questions: GitHub Discussions

---

**Happy coding! 🚀**
