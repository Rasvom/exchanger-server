import { Request, Response } from 'express';
import File from '@models/File.model';

export const verifyFile = async (req: Request, res: Response) => {
  try {
    const { cardNumber } = req.body;

    if (!cardNumber) {
      return res.status(400).json({ error: 'Номер карты обязателен' });
    }

    const file = await File.findOne({ cardNumber });

    if (!file) {
      return res.status(404).json({ error: 'Файл не найден' });
    }

    file.isVerified = true;
    await file.save();

    res.status(200).json({ message: 'Файл успешно верифицирован', file });
  } catch (error) {
    console.error('Ошибка при верификации файла:', error);
    res.status(500).json({ error: 'Ошибка сервера' });
  }
};
