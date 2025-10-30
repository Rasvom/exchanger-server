import { Request, Response } from 'express';
import RequestModel from '@models/Request.model';
import { RequestFilters } from '../../types';

export const getAllRequests = async (req: Request, res: Response) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const status = req.query.status as string || null;
    
    const skip = (page - 1) * limit;
    
    const query: RequestFilters = {};
    
    if (status) {
      query.status = status;
    }
    
    const requests = await RequestModel.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .populate('user', 'email fullName')
      .populate('manager', 'fullName login');
      
    const total = await RequestModel.countDocuments(query);
    
    res.status(200).json({
      requests,
      pagination: {
        total,
        page,
        limit,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    if (error instanceof Error) {
      res.status(500).json({ error: error.message });
    } else {
      res.status(500).json({ error: 'Произошла неизвестная ошибка' });
    }
  }
}; 