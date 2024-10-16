import { Request, Response } from 'express';
import User from '@models/User.model';
import { hash } from 'bcrypt';
import { validationResult } from 'express-validator';

export const registration = async (req: Request, res: Response) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json(errors.array());
    }

    const { email, password, fullName } = req.body;
    const hashPassword = await hash(password, Number(process.env.BCRYPT_ROUNDS));
    await User.create({ fullName, email, password: hashPassword });

    res.status(201).json({});
  } catch (error) {
    if (error instanceof Error) {
      res.status(500).json({ error: `Registration error: ${error.message}` });
    } else {
      res.status(500).json({ error: 'An unknown registration error occurred' });
    }
  }
};
