import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import { createServer } from 'http';
import { configureMiddleware } from './middlewares';
import { configureRoutes } from './routes';
import { connectToDatabase } from './config/database';
import { initWebSocket } from './config/websocket';

if (!process.env.PORT || !process.env.SECRET_ACCESS_JWT) {
  console.error('Отсутствуют необходимые переменные окружения');
  process.exit(1);
}

const app = express();
const httpServer = createServer(app);

const io = initWebSocket(httpServer);

configureMiddleware(app);

configureRoutes(app);

connectToDatabase(io);

const PORT = process.env.PORT;
httpServer.listen(PORT, () => {
  console.log(`Сервер запущен на порте ${PORT}`);
});
