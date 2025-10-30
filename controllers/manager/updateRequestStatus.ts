import { Response } from 'express';
import RequestModel from '@models/Request.model';
import { Server } from 'socket.io';
import { AuthenticatedRequest, UpdateRequestData, VALID_REQUEST_STATUSES } from '../../types';

export const updateRequestStatus = async (
  req: AuthenticatedRequest,
  res: Response,
) => {
  try {
    const { requestId } = req.params;
    const { status, cancelReason } = req.body;
    // @ts-ignore - added by middleware
    const managerId = req.manager.id;
    
    if (!VALID_REQUEST_STATUSES.includes(status)) {
      return res.status(400).json({ error: 'Некорректный статус' });
    }
    
    const request = await RequestModel.findById(requestId);
    
    if (!request) {
      return res.status(404).json({ error: 'Заявка не найдена' });
    }
    
    const updateData: UpdateRequestData = { 
      status,
      manager: managerId,
    };
    
    if (status === 'CANCELED') {
      if (!cancelReason) {
        return res.status(400).json({ error: 'Необходимо указать причину отмены' });
      }
      updateData.cancelReason = cancelReason;
    }
    
    const updatedRequest = await RequestModel.findByIdAndUpdate(
      requestId,
      updateData,
      { new: true }
    ).populate('user', 'email fullName').populate('manager', 'fullName login');
    
    const io = req.app.get('io') as Server;
    io.emit('requestStatusChanged', {
      requestId,
      status,
      updatedRequest
    });
    
    if (request.user) {
      io.to(`user_${request.user.toString()}`).emit('userRequestStatusChanged', {
        requestId,
        status,
        updatedRequest
      });
    }
    
    res.status(200).json(updatedRequest);
  } catch (error) {
    if (error instanceof Error) {
      res.status(500).json({ error: error.message });
    } else {
      res.status(500).json({ error: 'Произошла неизвестная ошибка' });
    }
  }
}; 