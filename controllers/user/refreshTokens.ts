import { Request, Response } from 'express';
import { verify, sign } from 'jsonwebtoken';

export const refreshTokens = async (req: Request, res: Response) => {
  try {
    const refreshToken = req.cookies.refreshToken;
    if (!refreshToken) {
      return res.status(401).json({ error: 'Токен обновления отсутствует' });
    }

    const decoded = verify(refreshToken, process.env.SECRET_REFRESH_JWT!) as {
      id: string;
      email: string;
    };

    const newAccessToken = await sign(
      { id: decoded.id, email: decoded.email },
      process.env.SECRET_ACCESS_JWT!,
      {
        expiresIn: '1d',
      },
    );

    const newRefreshToken = await sign(
      { id: decoded.id, email: decoded.email },
      process.env.SECRET_REFRESH_JWT!,
      {
        expiresIn: '7d',
      },
    );

    res.cookie('refreshToken', newRefreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.status(200).json({ accessToken: newAccessToken });
  } catch (error) {
    res.clearCookie('refreshToken', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
    });

    return res.status(401).json({ error: 'Неверный или истекший токен обновления' });
  }
};
