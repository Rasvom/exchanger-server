import { Request, Response } from 'express';
import File from '@models/File.model';
import RequestModel from '@models/Request.model';

export const getUserVerifiedFiles = async (req: Request, res: Response) => {
  try {
    if (!req.user?.id) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    // Получаем все уникальные номера карт пользователя из его заявок
    const userRequests = await RequestModel.find(
      { user: req.user.id },
      { receiveAccountNumber: 1, _id: 0 },
    ).distinct('receiveAccountNumber');

    // Очищаем номера карт от пробелов
    const cleanCardNumbers = userRequests
      .map((cardNumber) => (cardNumber ? cardNumber.replace(/\s/g, '') : ''))
      .filter(Boolean);

    if (cleanCardNumbers.length === 0) {
      return res.status(200).json([]);
    }

    // Получаем файлы для этих номеров карт
    const verifiedFiles = await File.find({
      cardNumber: { $in: cleanCardNumbers },
    }).sort({ createdAt: -1 });

    // Группируем файлы по номеру карты и берем последний для каждой карты
    const filesByCard = new Map();
    verifiedFiles.forEach((file) => {
      if (
        !filesByCard.has(file.cardNumber) ||
        new Date((file as any).createdAt) >
          new Date((filesByCard.get(file.cardNumber) as any).createdAt)
      ) {
        filesByCard.set(file.cardNumber, file);
      }
    });

    // Преобразуем в массив с дополнительной информацией
    const result = Array.from(filesByCard.values()).map((file) => ({
      _id: file._id,
      cardNumber: file.cardNumber,
      isVerified: file.isVerified,
      url: file.url,
      originalName: file.originalName,
      createdAt: file.createdAt,
      // Маскируем номер карты для отображения
      displayCardNumber: file.cardNumber.replace(/(\d{4})(\d{4})(\d{4})(\d{4})/, '$1 **** **** $4'),
    }));

    res.status(200).json(result);
  } catch (error) {
    console.error('Error fetching user verified files:', error);
    res.status(500).json({ error: 'Не удалось получить верифицированные файлы' });
  }
};
