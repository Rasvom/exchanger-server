import { Response } from 'express';
import { AuthenticatedRequest } from '../../types';
import Manager from '@models/Manager.model';

export const getProfile = async (req: AuthenticatedRequest, res: Response) => {
  try {
    if (!req.manager) {
      return res.status(401).json({ error: 'Не авторизован' });
    }
    
    const managerId = req.manager.id;
    
    const manager = await Manager.findById(managerId).select('-password');
    
    if (!manager) {
      return res.status(404).json({ error: 'Менеджер не найден' });
    }
    
    res.status(200).json(manager);
  } catch (error) {
    if (error instanceof Error) {
      res.status(500).json({ error: error.message });
    } else {
      res.status(500).json({ error: 'Произошла неизвестная ошибка' });
    }
  }
}; 