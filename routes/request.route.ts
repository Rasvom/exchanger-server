import { Router } from 'express';
import { createRequest } from '@controllers/request/createRequest';
import { getUserRequests } from '@controllers/request/getUserRequests';
import { getUserRequestsWithPagination } from '@controllers/request/getUserRequestsWithPagination';
import { getRequest } from '@controllers/request/getRequest';
import authMiddleware from '@middlewares/auth.middleware';
import userMiddleware from '@middlewares/user.middleware';

const router = Router();

router.post('/create', userMiddleware, createRequest as any);
router.get('/user', authMiddleware, getUserRequests as any);
router.get('/user/paginated', authMiddleware, getUserRequestsWithPagination as any);
router.get('/:id', getRequest);

export default router;
