import { Request, Response, NextFunction } from 'express';
import { verify, JwtPayload } from 'jsonwebtoken';

declare module 'express-serve-static-core' {
  interface Request {
    user?: JwtPayload;
  }
}

export default async (req: Request, res: Response, next: NextFunction) => {
  try {
    const accessToken = req.headers.authorization?.split(' ')[1];
    const refreshToken = req.cookies.refreshToken;

    if (!accessToken) {
      return res.status(401).json({});
    }

    try {
      const decoded = verify(accessToken, process.env.SECRET_ACCESS_JWT!) as JwtPayload;
      req.user = decoded;
      return next();
    } catch (accessError) {
      if (!refreshToken) {
        return res.status(401).json({});
      }

      try {
        const decodedRefresh = verify(refreshToken, process.env.SECRET_REFRESH_JWT!) as JwtPayload;
        req.user = decodedRefresh;

        res.setHeader('X-Refresh-Tokens', 'true');
        return next();
      } catch (refreshError) {
        console.error('Ошибка проверки refreshToken:', refreshError);

        res.clearCookie('refreshToken', {
          httpOnly: true,
          secure: process.env.NODE_ENV === 'production',
          sameSite: 'strict',
        });

        return res.status(401).json({});
      }
    }
  } catch (error) {
    console.error('Ошибка проверки токенов:', error);
    return res.status(500).json({});
  }
};
