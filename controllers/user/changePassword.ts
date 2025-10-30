import { Request, Response } from 'express';
import User from '@models/User.model';
import { hash, compare } from 'bcrypt';

export const changePassword = async (req: Request, res: Response) => {
  try {
    const { oldPassword, newPassword } = req.body;
    const userEmail = req.user?.email;

    if (!oldPassword || !newPassword) {
      return res.status(400).json({ error: 'Old password and new password are required!' });
    }

    if (newPassword.length < 5) {
      return res.status(400).json({ error: 'Password must be at least 5 characters long!' });
    }

    const user = await User.findOne({ email: userEmail });
    if (!user) {
      return res.status(404).json({ error: 'User not found!' });
    }

    const isOldPasswordCorrect = await compare(oldPassword, user.password);
    if (!isOldPasswordCorrect) {
      return res.status(400).json({ error: 'Incorrect old password!' });
    }

    const hashNewPassword = await hash(newPassword, Number(process.env.BCRYPT_ROUNDS));
    await User.findOneAndUpdate({ email: userEmail }, { password: hashNewPassword }, { new: true });

    res.status(200).json({});
  } catch (error) {
    if (error instanceof Error) {
      res.status(500).json({ error: `Change password error: ${error.message}` });
    } else {
      res.status(500).json({ error: 'An unknown error occurred while changing the password' });
    }
  }
};
