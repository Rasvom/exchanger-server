import { Express } from 'express';
import userRoutes from '@routes/user.route';
import { errorHandler } from '@utils/errorHandler';
import { notFoundHandler } from '@utils/notFoundHandler';

export const configureRoutes = (app: Express): void => {
  app.use('/user-service', userRoutes);

  app.use(notFoundHandler);
  app.use(errorHandler);
};
