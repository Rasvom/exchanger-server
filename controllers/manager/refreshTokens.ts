import { Request, Response } from 'express';
import { verify, sign } from 'jsonwebtoken';
import Manager from '@models/Manager.model';

interface JwtPayload {
  id: string;
  login: string;
  role: string;
}

export const refreshTokens = async (req: Request, res: Response) => {
  try {
    const refreshToken = req.cookies.managerRefreshToken;

    if (!refreshToken) {
      return res.status(401).json({ error: 'Refresh token not provided' });
    }

    const decodedToken = verify(
      refreshToken,
      process.env.SECRET_MANAGER_REFRESH_JWT!
    ) as JwtPayload;

    const manager = await Manager.findById(decodedToken.id);

    if (!manager) {
      return res.status(401).json({ error: 'Manager not found' });
    }

    const payload = {
      id: manager._id,
      login: manager.login,
      role: 'manager',
    };

    const newAccessToken = sign(payload, process.env.SECRET_MANAGER_ACCESS_JWT!, {
      expiresIn: '1d',
    });

    const newRefreshToken = sign(
      payload,
      process.env.SECRET_MANAGER_REFRESH_JWT!,
      {
        expiresIn: '7d',
      }
    );

    res.cookie('managerRefreshToken', newRefreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.status(200).json({ accessToken: newAccessToken });
  } catch (error) {
    return res.status(401).json({ error: 'Invalid refresh token' });
  }
}; 