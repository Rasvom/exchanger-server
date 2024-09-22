import { Request, Response } from 'express';
import ConfirmationCode from '@models/ConfirmationCode.model';

export const verifyConfirmationCode = async (req: Request, res: Response) => {
  const { email, code } = req.body;

  try {
    const storedCode = await ConfirmationCode.findOne({ email });

    if (storedCode && storedCode.code === code) {
      await ConfirmationCode.deleteOne({ email });
      res.status(200);
    } else {
      res.status(400).json({ error: 'Неверный код' });
    }
  } catch (error) {
    if (error instanceof Error) {
      res.status(500).json({ error: `Error verifying code: ${error.message}` });
    } else {
      res.status(500).json({ error: 'An unknown error occurred during code verification' });
    }
  }
};
