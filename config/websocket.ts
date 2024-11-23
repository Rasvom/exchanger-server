import { Server } from 'socket.io';
import { Server as HttpServer } from 'http';

export const initWebSocket = (httpServer: HttpServer): Server => {
  const io = new Server(httpServer, {
    cors: {
      origin: 'http://localhost:5173',
      methods: ['GET', 'POST'],
    },
  });
  return io;
};
