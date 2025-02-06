import { Request, Response } from 'express';
import TradeAsset from '@models/TradeAsset.model';

// Функция для создания новой криптовалюты
export const createTradeAsset = async (req: Request, res: Response) => {
  try {
    const { name, symbol, img, active, assetType } = req.body;

    if (!name || !symbol || !img || !assetType) {
      return res.status(400).json({ error: 'Необходимо указать name, symbol и img, assetType' });
    }

    const newTradeAsset = new TradeAsset({
      name,
      symbol,
      img,
      active: active ?? true,
      assetType,
    });

    await newTradeAsset.save();

    res.status(201).json({ message: 'Криптовалюта успешно создана', crypto: newTradeAsset });
  } catch (error) {
    console.error('Ошибка при создании криптовалюты:', error);
    res.status(500).json({ error: 'Ошибка при создании криптовалюты' });
  }
};
