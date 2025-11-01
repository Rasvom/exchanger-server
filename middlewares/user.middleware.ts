import { Request, Response, NextFunction } from 'express';
import { verify, JwtPayload } from 'jsonwebtoken';

declare module 'express-serve-static-core' {
  interface Request {
    user?: JwtPayload;
  }
}

export default (req: Request, res: Response, next: NextFunction) => {
  const accessToken = req.headers.authorization?.split(' ')[1];
  const refreshToken = req.cookies?.refreshToken;

  if (accessToken) {
    try {
      req.user = verify(accessToken, process.env.SECRET_ACCESS_JWT!) as JwtPayload;
    } catch (error) {
      console.warn('Недействительный accessToken:', error);
    }
  } else if (refreshToken) {
    try {
      req.user = verify(refreshToken, process.env.SECRET_REFRESH_JWT!) as JwtPayload;
    } catch (error) {
      console.warn('Недействительный refreshToken:', error);
    }
  }

  next();
};
