import { Request, Response } from 'express';
import RequestModel from '@models/Request.model';

export const getRequest = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const request = await RequestModel.findById(id);

    if (!request) {
      return res.status(404).json({ error: 'Заявка не найдена' });
    }

    res.status(200).json(request);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Не удалось получить заявку' });
  }
};
