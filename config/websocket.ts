import { Server } from 'socket.io';
import { Server as HttpServer } from 'http';

export const initWebSocket = (httpServer: HttpServer): Server => {
  // Generate origins list, filtering out any undefined values
  const origins = [
    'http://localhost:5173', 
    'http://localhost:5174'
  ];
  
  if (process.env.CLIENT_URL) origins.push(process.env.CLIENT_URL);
  if (process.env.ADMIN_URL) origins.push(process.env.ADMIN_URL);
  
  const io = new Server(httpServer, {
    cors: {
      origin: origins,
      methods: ['GET', 'POST'],
      credentials: true
    },
  });
  
  // Set up socket connection
  io.on('connection', (socket) => {
    console.log('User connected:', socket.id);
    
    // Manager joining admin room
    socket.on('joinManagerRoom', () => {
      socket.join('managers');
      console.log(`Manager ${socket.id} joined managers room`);
    });
    
    // User joining personal room
    socket.on('joinUserRoom', (userId) => {
      if (userId) {
        socket.join(`user_${userId}`);
        console.log(`User ${socket.id} joined user_${userId} room`);
      }
    });
    
    socket.on('disconnect', () => {
      console.log('User disconnected:', socket.id);
    });
  });
  
  return io;
};
