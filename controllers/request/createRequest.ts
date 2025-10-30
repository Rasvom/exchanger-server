import { Request, Response } from 'express';
import RequestModel from '@models/Request.model';
import File from '@models/File.model';
import { sendRequestEmail } from '@services/mail.service';
import mongoose from 'mongoose';

export const createRequest = async (req: Request, res: Response) => {
  const session = await mongoose.startSession();

  try {
    await session.withTransaction(async () => {
      const {
        sendMethod,
        sendAccountNumber,
        sendAmount,
        receiveMethod,
        receiveAccountNumber,
        receiveAmount,
        email,
        phoneNumber,
        recipientName,
        telegramLink,
      } = req.body;

      if (
        !sendMethod ||
        !sendAmount ||
        !receiveMethod ||
        !receiveAccountNumber ||
        !receiveAmount ||
        !email
      ) {
        throw new Error('Отсутствуют обязательные поля');
      }

      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        throw new Error('Неверный формат email адреса');
      }

      const cleanCardNumber = receiveAccountNumber.replace(/\s/g, '');
      const verifiedFile = await File.findOne({
        cardNumber: cleanCardNumber,
        isVerified: true,
      }).session(session);

      const status = verifiedFile ? 'PROCESSING' : 'PENDING_VERIFICATION';

      const newRequest = new RequestModel({
        user: req.user?.id || null,
        sendMethod,
        sendAccountNumber,
        sendAmount,
        receiveMethod,
        receiveAccountNumber,
        receiveAmount,
        email,
        phoneNumber,
        recipientName,
        telegramLink,
        status,
      });

      await newRequest.save({ session });

      try {
        await sendRequestEmail(email, newRequest._id.toString());
      } catch (emailError) {
        console.error('Email sending failed:', emailError);

        if (emailError && typeof emailError === 'object' && 'responseCode' in emailError) {
          const mailError = emailError as any;
          if (mailError.responseCode === 550) {
            throw new Error(
              'Недействительный email адрес. Проверьте правильность введенного email.',
            );
          }
        }
        throw new Error(
          'Не удалось отправить уведомление на email. Проверьте корректность адреса.',
        );
      }

      res.status(201).json(newRequest);
    });
  } catch (error) {
    console.error('Request creation error:', error);

    let errorMessage = 'Не удалось создать заявку';

    if (error instanceof Error) {
      errorMessage = error.message;
    }

    res.status(400).json({ error: errorMessage });
  } finally {
    await session.endSession();
  }
};
