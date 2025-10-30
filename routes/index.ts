import { Express } from 'express';
import userRoutes from '@routes/user.route';
import fileRoutes from '@routes/file.route';
import tradeAssetRoute from '@routes/tradeAsset.route';
import requestRoutes from '@routes/request.route';
import managerRoutes from '@routes/manager.route';
import { errorHandler } from '@utils/errorHandler';
import { notFoundHandler } from '@utils/notFoundHandler';
import { healthCheck } from '@controllers/health';

export const configureRoutes = (app: Express): void => {
  app.get('/health', healthCheck);
  
  app.use('/user-service', userRoutes);
  app.use('/file-service', fileRoutes);
  app.use('/trade-asset-service', tradeAssetRoute);
  app.use('/requests', requestRoutes);
  app.use('/manager-service', managerRoutes);

  app.use(notFoundHandler);
  app.use(errorHandler);
};
