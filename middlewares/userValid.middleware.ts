import { Request, Response, NextFunction } from 'express';
import User from '@models/User.model';

export default async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email } = req.body;
    const isEmailFree = await User.findOne({ email });

    if (isEmailFree) {
      return res.status(400).json({ error: 'Пользователь с такой почтой уже существует' });
    }

    next();
  } catch (error) {
    if (error instanceof Error) {
      return res.status(500).json({ error: `Validation error: ${error.message}` });
    } else {
      return res.status(500).json({ error: 'An unknown error occurred' });
    }
  }
};
