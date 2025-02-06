import { Request, Response } from 'express';
import File from '@models/File.model';

export const getFileByCardNumber = async (req: Request, res: Response): Promise<void> => {
  try {
    const { cardNumber } = req.query;

    if (!cardNumber || typeof cardNumber !== 'string') {
      res.status(400).json({ error: 'Номер карты обязателен' });
      return;
    }

    const file = await File.findOne({ cardNumber });
    if (!file) {
      res.status(404).json({ error: 'Файл не найден' });
      return;
    }

    res.status(200).json(file);
  } catch (error) {
    console.error('Ошибка при получении файла:', error);
    res.status(500).json({ error: 'Ошибка сервера' });
  }
};
