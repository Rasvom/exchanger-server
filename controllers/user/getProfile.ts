import { Request, Response } from 'express';
import User from '@models/User.model';

export const getProfile = async (req: Request, res: Response) => {
  try {
    const user = await User.findById(req.user?.id).select('email fullName -_id');
    res.status(200).json(user);
  } catch (error) {
    if (error instanceof Error) {
      res.status(500).json({ error: `Get user error: ${error.message}` });
    } else {
      res.status(500).json({ error: 'An unknown error occurred while retrieving user profile' });
    }
  }
};
