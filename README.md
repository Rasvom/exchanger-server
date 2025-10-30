# Exchanger Server API

Node.js/TypeScript backend for cryptocurrency exchange platform.

## Features

- RESTful API with documented endpoints
- TypeScript for type safety
- JWT authentication with access/refresh tokens
- Real-time updates via WebSocket (Socket.IO)
- MongoDB with change streams
- AWS S3 file storage
- Email notifications (SMTP)
- Auto-generated API documentation (Swagger/OpenAPI)
- Rate limiting for DDoS protection
- Security middleware (Helmet, CORS, input validation)
- Winston logger with file rotation
- Health check endpoint
- Jest testing framework
- Docker containerization

## Requirements

- Node.js >= 18
- MongoDB >= 6
- npm or yarn

## Installation

```bash
git clone <repository-url>
cd exchanger-server
npm install
cp .env.example .env
# Edit .env with your configuration
```

## Environment Variables

```env
# Server
PORT=3000
NODE_ENV=development

# Database
MONGODB=mongodb://localhost:27017/exchanger

# JWT Secrets
SECRET_ACCESS_JWT=your_access_secret
SECRET_REFRESH_JWT=your_refresh_secret

# Email (SMTP)
EMAIL_USER=your_email@mail.ru
EMAIL_PASS=your_password

# Frontend URLs
FRONTEND_URL=http://localhost:5173
CLIENT_URL=http://localhost:5173
ADMIN_URL=http://localhost:5174

# AWS S3
AWS_ACCESS_KEY_ID=your_access_key
AWS_SECRET_ACCESS_KEY=your_secret_key
AWS_REGION=us-east-1
AWS_BUCKET_NAME=your_bucket_name

# Logging
LOG_LEVEL=info
```

## Running the Application

### Development

```bash
npm run dev
```

### Production

```bash
npm run build
npm start
```

### Docker

```bash
docker-compose up -d
# View logs: docker-compose logs -f app
# Stop: docker-compose down
```

## API Documentation

After starting the server:
- Swagger UI: http://localhost:3000/api-docs
- Health Check: http://localhost:3000/health
- API Spec: http://localhost:3000/api-docs.json

## Project Structure

```
exchanger-server/
├── __tests__/
├── config/
│   ├── database.ts
│   ├── websocket.ts
│   ├── logger.ts
│   └── swagger.ts
├── controllers/
│   ├── user/
│   ├── manager/
│   ├── request/
│   ├── crypto/
│   ├── file/
│   └── health/
├── middlewares/
│   ├── auth.middleware.ts
│   ├── managerAuth.middleware.ts
│   ├── rateLimiter.middleware.ts
│   └── validation.middleware.ts
├── models/
├── routes/
├── services/
│   ├── cryptoService.ts
│   ├── mailService.ts
│   └── fileStorage.service.ts
├── types/
├── utils/
│   ├── asyncHandler.ts
│   └── errorHandler.ts
├── index.ts
├── Dockerfile
├── docker-compose.yml
└── jest.config.js
```

## Testing

```bash
# Run tests
npm test

# Watch mode
npm run test:watch

# With coverage
npm test -- --coverage
```

## API Endpoints

### Authentication

```
POST   /user-service/registration       # Register user
POST   /user-service/login              # User login
GET    /user-service/refresh-tokens     # Refresh tokens
GET    /user-service/profile            # User profile
```

### Manager/Admin

```
POST   /manager-service/login            # Manager login
GET    /manager-service/requests         # List requests
GET    /manager-service/requests/:id     # Request details
PATCH  /manager-service/requests/:id/status  # Update status
```

### Requests

```
GET    /requests                  # User requests (paginated)
GET    /requests/:id              # Request details
POST   /requests                  # Create request
```

### Crypto Assets

```
GET    /trade-asset-service/prices  # Crypto prices
GET    /trade-asset-service/assets  # Available assets
POST   /trade-asset-service/assets  # Create asset (admin)
```

### Files

```
POST   /file-service/upload       # Upload file
GET    /file-service/:cardNumber  # Get file by card
PATCH  /file-service/:id/verify   # Verify file (admin)
```

### System

```
GET    /health          # Health check
GET    /api-docs        # API documentation
```

## Security

- Helmet.js security headers
- CORS configuration
- Rate limiting
- JWT authentication
- Input validation
- Password hashing with bcrypt
- MongoDB injection protection

## Logging

Logs are stored in `logs/`:
- error.log
- combined.log
- exceptions.log
- rejections.log

## Deployment

### Manual

```bash
npm run build
# Set production environment variables
pm2 start dist/index.js --name exchanger-server
```

### Docker

```bash
docker build -t exchanger-server .
docker run -d -p 3000:3000 --env-file .env exchanger-server
```

### Production Checklist

- [ ] Set NODE_ENV=production
- [ ] Configure strong JWT secrets
- [ ] Set up CORS origins
- [ ] Configure MongoDB replica set
- [ ] Set up AWS S3 bucket policies
- [ ] Configure SSL/TLS
- [ ] Set up reverse proxy (nginx)
- [ ] Configure monitoring
- [ ] Set up log rotation
- [ ] Configure backups

## Contributing

1. Fork the repository
2. Create feature branch: `git checkout -b feature/name`
3. Commit changes: `git commit -m 'Add feature'`
4. Push: `git push origin feature/name`
5. Create Pull Request

## License

ISC

## Support

For support, create an issue or email support@example.com
