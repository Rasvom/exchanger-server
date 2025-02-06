import { Request, Response } from 'express';
import Crypto from '@models/TradeAsset.model';

export const getTradeAssets = async (req: Request, res: Response) => {
  try {
    const tradeAssets = await Crypto.find({}).select('-__v -_id');
    res.status(200).json(tradeAssets);
  } catch (error) {
    console.error('Ошибка при получении списка:', error);
    res.status(500).json({ error: 'Ошибка при получении списка' });
  }
};
