import { Request, Response } from 'express';
import { getCachedPrices } from '@services/cryptoService';

export const getCryptoPrices = (req: Request, res: Response) => {
  try {
    const prices = getCachedPrices();
    if (Object.keys(prices).length === 0) {
      return res.status(404).json({ error: 'Нет данных о криптовалютах' });
    }
    res.status(200).json(prices);
  } catch (error) {
    console.error('Ошибка при получении курсов:', error);
    res.status(500).json({ error: 'Ошибка при получении курсов' });
  }
};
