import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import { createServer } from 'http';
import { configureMiddleware } from './middlewares';
import { configureRoutes } from './routes';
import { connectToDatabase } from './config/database';
import { initWebSocket } from './config/websocket';
import { fetchCryptoPrices } from '@services/cryptoService';
import { REFRESH_INTERVAL } from '@config/crypto';
import { setupSwagger } from '@config/swagger';
import logger from '@config/logger';

if (!process.env.PORT || !process.env.SECRET_ACCESS_JWT) {
  console.error('Отсутствуют необходимые переменные окружения');
  process.exit(1);
}

const app = express();
const httpServer = createServer(app);

const io = initWebSocket(httpServer);

app.set('io', io);

configureMiddleware(app);
setupSwagger(app);

configureRoutes(app);

connectToDatabase(io);

setInterval(fetchCryptoPrices, REFRESH_INTERVAL);

const PORT = process.env.PORT;
httpServer.listen(PORT, () => {
  logger.info(`Сервер запущен на порте ${PORT}`);
  logger.info(`Swagger документация: http://localhost:${PORT}/api-docs`);
  logger.info(`Health check: http://localhost:${PORT}/health`);
});

process.on('SIGTERM', () => {
  logger.info('SIGTERM получен, завершение работы...');
  httpServer.close(() => {
    logger.info('HTTP сервер закрыт');
    process.exit(0);
  });
});

export default app;
