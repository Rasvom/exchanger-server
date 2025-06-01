import { Request, Response } from 'express';
import RequestModel from '@models/Request.model';

export const getUserRequests = async (req: Request, res: Response) => {
  try {
    if (!req.user?.id) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const requests = await RequestModel.find({ user: req.user.id }).sort({ createdAt: -1 });

    res.status(200).json(requests);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Не удалось получить заявки' });
  }
};
