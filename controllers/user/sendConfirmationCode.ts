import { Request, Response } from 'express';
import ConfirmationCode from '@models/ConfirmationCode.model';
import { sendConfirmationEmail } from '@services/mail.service';
import crypto from 'crypto';

export const sendConfirmationCode = async (req: Request, res: Response) => {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ error: 'Email is required' });
  }

  const code = crypto.randomInt(100000, 999999).toString();
  await ConfirmationCode.deleteOne({ email });

  const confirmationCode = new ConfirmationCode({ email, code });
  await confirmationCode.save();

  try {
    await sendConfirmationEmail(email, code);
    res.status(200).json({});
  } catch (error) {
    if (error instanceof Error) {
      res.status(500).json({ error: `Failed to send confirmation email: ${error.message}` });
    } else {
      res.status(500).json({ error: 'Failed to send confirmation email due to unknown error' });
    }
  }
};
