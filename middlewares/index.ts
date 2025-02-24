import { Express, json, urlencoded } from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';

export const configureMiddleware = (app: Express): void => {
  app.use(
    cors({
      origin: ['http://192.168.31.92:5173', 'http://localhost:5173'],
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
