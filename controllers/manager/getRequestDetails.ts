import { Request, Response } from 'express';
import RequestModel from '@models/Request.model';

export const getRequestDetails = async (req: Request, res: Response) => {
  try {
    const { requestId } = req.params;
    
    const request = await RequestModel.findById(requestId)
      .populate('user', 'email fullName')
      .populate('manager', 'fullName login');
    
    if (!request) {
      return res.status(404).json({ error: 'Заявка не найдена' });
    }
    
    res.status(200).json(request);
  } catch (error) {
    if (error instanceof Error) {
      res.status(500).json({ error: error.message });
    } else {
      res.status(500).json({ error: 'Произошла неизвестная ошибка' });
    }
  }
}; 