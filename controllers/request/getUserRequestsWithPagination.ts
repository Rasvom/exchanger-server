import { Response } from 'express';
import RequestModel from '@models/Request.model';
import {
  AuthenticatedRequest,
  RequestFilters,
  SortOptions,
  RequestStats,
} from '../../types';

export const getUserRequestsWithPagination = async (
  req: AuthenticatedRequest,
  res: Response,
) => {
  try {
    if (!req.user?.id) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const skip = (page - 1) * limit;

    const sortBy = (req.query.sortBy as string) || 'createdAt';
    const sortOrder = req.query.sortOrder === 'asc' ? 1 : -1;
    const sortOptions: SortOptions = {
      [sortBy]: sortOrder,
    };

    const filters: RequestFilters = { user: req.user.id };

    if (req.query.status && req.query.status !== 'all') {
      filters.status = req.query.status as string;
    }

    if (req.query.dateFrom || req.query.dateTo) {
      filters.createdAt = {};
      if (req.query.dateFrom) {
        filters.createdAt.$gte = new Date(req.query.dateFrom as string);
      }
      if (req.query.dateTo) {
        const dateTo = new Date(req.query.dateTo as string);
        dateTo.setHours(23, 59, 59, 999);
        filters.createdAt.$lte = dateTo;
      }
    }

    if (req.query.amountFrom || req.query.amountTo) {
      filters.$or = [];
      const amountFilter: { $gte?: number; $lte?: number } = {};

      if (req.query.amountFrom) {
        amountFilter.$gte = parseFloat(req.query.amountFrom as string);
      }
      if (req.query.amountTo) {
        amountFilter.$lte = parseFloat(req.query.amountTo as string);
      }

      filters.$or.push({ sendAmount: amountFilter });
      filters.$or.push({ receiveAmount: amountFilter });
    }

    if (req.query.search) {
      const searchRegex = new RegExp(req.query.search as string, 'i');
      filters.$or = filters.$or || [];
      filters.$or.push(
        { email: searchRegex },
        { sendAccountNumber: searchRegex },
        { receiveAccountNumber: searchRegex },
        { recipientName: searchRegex },
      );
    }

    const [requests, totalCount] = await Promise.all([
      RequestModel.find(filters)
        .sort(sortOptions)
        .skip(skip)
        .limit(limit)
        .populate('manager', 'fullName email')
        .lean(),
      RequestModel.countDocuments(filters),
    ]);

    const stats = await RequestModel.aggregate([
      { $match: { user: req.user.id } },
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 },
          totalSendAmount: { $sum: '$sendAmount' },
          totalReceiveAmount: { $sum: '$receiveAmount' },
        },
      },
    ]);

    const response = {
      requests,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(totalCount / limit),
        totalCount,
        limit,
        hasNextPage: page < Math.ceil(totalCount / limit),
        hasPrevPage: page > 1,
      },
      stats: stats.reduce((acc: RequestStats, stat: any) => {
        acc[stat._id] = {
          count: stat.count,
          totalSendAmount: stat.totalSendAmount,
          totalReceiveAmount: stat.totalReceiveAmount,
        };
        return acc;
      }, {}),
      filters: {
        status: req.query.status || 'all',
        dateFrom: req.query.dateFrom || null,
        dateTo: req.query.dateTo || null,
        amountFrom: req.query.amountFrom || null,
        amountTo: req.query.amountTo || null,
        search: req.query.search || '',
        sortBy,
        sortOrder: req.query.sortOrder || 'desc',
      },
    };

    res.status(200).json(response);
  } catch (error) {
    console.error('Error fetching user requests:', error);
    res.status(500).json({ error: 'Не удалось получить заявки' });
  }
};
