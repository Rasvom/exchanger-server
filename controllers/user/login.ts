import { Request, Response } from 'express';
import User from '@models/User.model';
import { compare } from 'bcrypt';
import { sign } from 'jsonwebtoken';

export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    const candidate = await User.findOne({ email });

    if (!candidate) {
      return res.status(400).json({ error: 'Неправильный логин или пароль' });
    }

    const valid = await compare(password, candidate.password);

    if (!valid) {
      return res.status(400).json({ error: 'Неправильный логин или пароль' });
    }

    const payload = { id: candidate._id, email: candidate.email };
    const accessToken = sign(payload, process.env.SECRET_ACCESS_JWT!, {
      expiresIn: '1m',
    });

    const refreshToken = sign(payload, process.env.SECRET_REFRESH_JWT!, {
      expiresIn: '7d',
    });

    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.status(200).json({ accessToken });
  } catch (error) {
    if (error instanceof Error) {
      res.status(500).json({ error: `Login error: ${error.message}` });
    } else {
      res.status(500).json({ error: 'An unknown login error occurred' });
    }
  }
};
