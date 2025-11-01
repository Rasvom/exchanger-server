import { Response, NextFunction } from 'express';
import { verify } from 'jsonwebtoken';
import Manager from '@models/Manager.model';
import { AuthenticatedRequest } from '../types';

interface JwtPayload {
  id: string;
  login: string;
  role: string;
  iat: number;
  exp: number;
}

export const verifyManagerToken = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      return res.status(401).json({ error: 'No authorization header' });
    }

    const token = authHeader.split(' ')[1];

    if (!token) {
      return res.status(401).json({ error: 'No token provided' });
    }

    const decodedToken = verify(
      token,
      process.env.SECRET_MANAGER_ACCESS_JWT!
    ) as JwtPayload;

    if (decodedToken.role !== 'manager') {
      return res.status(403).json({ error: 'Not authorized as manager' });
    }

    const manager = await Manager.findById(decodedToken.id);

    if (!manager) {
      return res.status(401).json({ error: 'Manager not found' });
    }

    req.manager = {
      id: decodedToken.id,
      login: decodedToken.login
    };

    next();
  } catch (error) {
    return res.status(401).json({ error: 'Invalid token' });
  }
}; 