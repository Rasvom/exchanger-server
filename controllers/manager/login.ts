import { Request, Response } from 'express';
import Manager from '@models/Manager.model';
import { compare } from 'bcrypt';
import { sign } from 'jsonwebtoken';

export const login = async (req: Request, res: Response) => {
  try {
    const { login, password } = req.body;
    const manager = await Manager.findOne({ login });

    if (!manager) {
      return res.status(400).json({ error: 'Неверный логин или пароль' });
    }

    const valid = await compare(password, manager.password);

    if (!valid) {
      return res.status(400).json({ error: 'Неверный логин или пароль' });
    }

    const payload = { id: manager._id, login: manager.login, role: 'manager' };
    const accessToken = sign(payload, process.env.SECRET_MANAGER_ACCESS_JWT!, {
      expiresIn: '1d',
    });

    const refreshToken = sign(payload, process.env.SECRET_MANAGER_REFRESH_JWT!, {
      expiresIn: '7d',
    });

    res.cookie('managerRefreshToken', refreshToken, {
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