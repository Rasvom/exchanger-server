import mongoose from 'mongoose';
import { Server } from 'socket.io';

export const connectToDatabase = (io: Server): void => {
  if (!process.env.MONGODB) {
    console.error('Отсутствуют необходимые переменные окружения');
    process.exit(1);
  }

  mongoose
    .connect(process.env.MONGODB)
    .then(() => {
      console.log('Успешно подключено к MongoDB');
      setupChangeStream(io);
    })
    .catch((err) => console.error('Ошибка подключения к MongoDB:', err));
};

const setupChangeStream = (io: Server): void => {
  const requestCollection = mongoose.connection.collection('requests');
  const changeStream = requestCollection.watch();

  changeStream.on('change', async () => {
    try {
      const activeRequests = await requestCollection.find({ active: true }).toArray();
      io.emit('activeRequests', activeRequests);
    } catch (err) {
      console.error('Ошибка получения активных заявок:', err);
    }
  });
};
