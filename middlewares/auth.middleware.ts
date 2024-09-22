import { Request, Response, NextFunction } from 'express';
import { verify, JwtPayload } from 'jsonwebtoken';

declare module 'express-serve-static-core' {
  interface Request {
    user?: JwtPayload;
  }
}

export default async (req: Request, res: Response, next: NextFunction) => {
  try {
    const token = req.cookies.accessToken;

    if (!token) {
      return res.status(401).json({ error: 'Токен не найден' });
    }

    try {
      const decoded = verify(token, process.env.SECRET_ACCSESS_JWT!) as JwtPayload;
      req.user = decoded;
      next();
    } catch (error) {
      return res.status(401).json({ error: 'Неверный или истекший токен' });
    }
  } catch (error) {
    if (error instanceof Error) {
      return res.status(500).json({ error: `Validation error: ${error.message}` });
    } else {
      return res.status(500).json({ error: 'An unknown error occurred' });
    }
  }
};
