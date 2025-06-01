import { Request, Response } from 'express';
import User from '@models/User.model';
import ConfirmationCode from '@models/ConfirmationCode.model';

export const changeEmail = async (req: Request, res: Response) => {
  try {
    const { newEmail, code } = req.body;
    const currentUserEmail = req.user?.email;

    if (!newEmail || !code) {
      return res.status(400).json({ error: 'New email and confirmation code are required!' });
    }

    // Проверяем код подтверждения
    const storedCode = await ConfirmationCode.findOne({ email: newEmail });
    if (!storedCode || storedCode.code !== code) {
      return res.status(400).json({ error: 'Invalid confirmation code!' });
    }

    // Проверяем, что новый email не занят другим пользователем
    const existingUser = await User.findOne({ email: newEmail });
    if (existingUser) {
      return res.status(400).json({ error: 'Email already exists!' });
    }

    // Обновляем email пользователя
    const updatedUser = await User.findOneAndUpdate(
      { email: currentUserEmail },
      { email: newEmail },
      { new: true },
    ).select('email fullName -_id');

    // Удаляем использованный код подтверждения
    await ConfirmationCode.deleteOne({ email: newEmail });

    res.status(200).json(updatedUser);
  } catch (error) {
    if (error instanceof Error) {
      res.status(500).json({ error: `Change email error: ${error.message}` });
    } else {
      res.status(500).json({ error: 'An unknown error occurred while changing email' });
    }
  }
};
