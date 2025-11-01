import { Router } from 'express';
import { managerControllers } from '@controllers/manager';
import { verifyManagerToken } from '@middlewares/managerAuth.middleware';

const router = Router();


router.post('/login', managerControllers.login);
router.post('/refresh', managerControllers.refreshTokens);

router.get('/profile', verifyManagerToken, managerControllers.getProfile);
router.get('/requests', verifyManagerToken, managerControllers.getAllRequests);
router.get('/requests/:requestId', verifyManagerToken, managerControllers.getRequestDetails);
router.patch('/requests/:requestId/status', verifyManagerToken, managerControllers.updateRequestStatus as any);

export default router; 