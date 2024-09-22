import dotenv from 'dotenv';
dotenv.config();
import express, { json, urlencoded, Request, Response } from 'express';

import cors from 'cors';
import mongoose from 'mongoose';
import { createServer } from 'http';
import { Server } from 'socket.io';
import userRoutes from '@routes/user.route';

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: 'http://localhost:5173',
    methods: ['GET', 'POST'],
  },
});

// Проверка обязательных переменных окружения
if (!process.env.MONGODB || !process.env.PORT || !process.env.SECRET_ACCSESS_JWT) {
  console.error('Отсутствуют необходимые переменные окружения');
  process.exit(1);
}

// Middleware
app.use(cors());
app.use(json());
app.use(urlencoded({ extended: true }));

// Используем маршруты с префиксом
app.use('/user-service', userRoutes);

// Подключение к MongoDB
mongoose
  .connect(process.env.MONGODB)
  .then(() => {
    console.log('Успешно соединились с сервером MongoDB');

    // Настройка Change Stream для отслеживания изменений в коллекции заявок
    const requestCollection = mongoose.connection.collection('requests');
    const changeStream = requestCollection.watch();

    changeStream.on('change', async () => {
      // Запрос всех активных заявок из базы данных
      try {
        const activeRequests = await requestCollection.find({ active: true }).toArray();
        // Отправка обновления всем подключенным клиентам
        io.emit('activeRequests', activeRequests);
      } catch (err) {
        console.error('Ошибка при получении активных заявок:', err);
      }
    });
  })
  .catch((err) => console.error('Ошибка при соединении с сервером MongoDB', err));

// Обработка ошибок в Express
app.use((err: Error, req: Request, res: Response) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Внутренняя ошибка сервера' });
});

// Запуск сервера
httpServer.listen(process.env.PORT, () => {
  console.log(`Сервер запущен успешно на порте ${process.env.PORT}`);
});
