import { Express, json, urlencoded } from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import helmet from 'helmet';
import morgan from 'morgan';
import logger from '@config/logger';
import { apiLimiter } from './rateLimiter.middleware';

export const configureMiddleware = (app: Express): void => {
  app.use(helmet());
  app.use('/api/', apiLimiter);
  
  const morganFormat = process.env.NODE_ENV === 'production' ? 'combined' : 'dev';
  app.use(
    morgan(morganFormat, {
      stream: {
        write: (message: string) => logger.http(message.trim()),
      },
    }),
  );

  const allowedOrigins = process.env.ALLOWED_ORIGINS ? process.env.ALLOWED_ORIGINS.split(',') : [];
  
  app.use(
    cors({
      origin: allowedOrigins,
      credentials: true,
      exposedHeaders: ['X-Refresh-Tokens'],
    }),
  );

  app.use((req, res, next) => {
    res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
    res.setHeader('Pragma', 'no-cache');
    res.setHeader('Expires', '0');
    res.setHeader('Surrogate-Control', 'no-store');
    next();
  });

  app.use(cookieParser());
  app.use(json());
  app.use(urlencoded({ extended: true }));
};
