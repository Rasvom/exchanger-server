import { Request, Response } from 'express';
import User from '@models/User.model';

export const updateProfile = async (req: Request, res: Response) => {
  try {
    const { fullName } = req.body;
    const userEmail = req.user?.email;

    if (!fullName || fullName.length < 3) {
      return res.status(400).json({ error: 'Full name must be at least 3 characters long!' });
    }

    const updatedUser = await User.findOneAndUpdate(
      { email: userEmail },
      { fullName },
      { new: true },
    ).select('email fullName -_id');

    res.status(200).json(updatedUser);
  } catch (error) {
    if (error instanceof Error) {
      res.status(500).json({ error: `Update profile error: ${error.message}` });
    } else {
      res.status(500).json({ error: 'An unknown error occurred while updating profile' });
    }
  }
};
