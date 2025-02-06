import { Express } from 'express';
import userRoutes from '@routes/user.route';
import fileRoutes from '@routes/file.route';
import tradeAssetRoute from '@routes/tradeAsset.route';
import { errorHandler } from '@utils/errorHandler';
import { notFoundHandler } from '@utils/notFoundHandler';

export const configureRoutes = (app: Express): void => {
  app.use('/user-service', userRoutes);
  app.use('/file-service', fileRoutes);
  app.use('/trade-asset-service', tradeAssetRoute);

  app.use(notFoundHandler);
  app.use(errorHandler);
};
