import { Request, Response } from 'express';
import User from '@models/User.model';
import { hash } from 'bcrypt';

export const changePassword = async (req: Request, res: Response) => {
  try {
    const { password } = req.body;
    const userEmail = req.user?.email;

    if (password.length < 5) {
      return res.status(400).json({ error: 'Password must be at least 5 characters long!' });
    }

    const hashPassword = await hash(password, Number(process.env.BCRYPT_ROUNDS));
    await User.findOneAndUpdate({ email: userEmail }, { password: hashPassword }, { new: true });
    res.status(200).json({});
  } catch (error) {
    if (error instanceof Error) {
      res.status(500).json({ error: `Change password error: ${error.message}` });
    } else {
      res.status(500).json({ error: 'An unknown error occurred while changing the password' });
    }
  }
};
