import { Request, Response } from 'express';
import File from '@models/File.model';
import { yandexClient } from '@config/yandexClient';
import { PutObjectCommand } from '@aws-sdk/client-s3';
import { v4 as uuid } from 'uuid';

export const uploadFile = async (req: Request, res: Response): Promise<void> => {
  try {
    if (!req.file) {
      res.status(400).json({ error: 'Файл не найден в запросе' });
      return;
    }
    const { originalname, mimetype, size } = req.file;
    const { cardNumber } = req.body;

    if (!cardNumber) {
      res.status(400).json({ error: 'Номер карты обязателен' });
      return;
    }

    const fileExtension = originalname.split('.').pop(); // Извлекаем расширение файла
    const fileName = `${uuid()}.${fileExtension}`;

    // Загрузка файла в Yandex Object Storage
    const fileBuffer = req.file.buffer;
    const command = new PutObjectCommand({
      Bucket: process.env.YANDEX_BUCKET_NAME!,
      Key: fileName,
      Body: fileBuffer,
      ContentType: mimetype,
    });

    await yandexClient.send(command);

    const fileUrl = `https://${process.env.YANDEX_BUCKET_NAME}.storage.yandexcloud.net/${fileName}`;

    // Сохранение данных о файле в MongoDB
    const savedFile = await File.create({
      originalName: originalname,
      fileName,
      url: fileUrl,
      cardNumber,
      mimeType: mimetype,
      size,
      createdAt: new Date(),
    });

    res.status(201).json({ message: 'Файл успешно загружен', data: savedFile });
  } catch (error) {
    console.error('Ошибка загрузки файла:', error);
    res.status(500).json({ error: 'Ошибка загрузки файла' });
  }
};
