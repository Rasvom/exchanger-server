import { Router } from 'express';
import { uploadMiddleware } from '@middlewares/fileUpload.middleware';
import { uploadFile } from '@controllers/file/uploadFile';
import { getFileByCardNumber } from '@controllers/file/getFileByCardNumber';
import { verifyFile } from '@controllers/file/verifyFile';
import { getUserVerifiedFiles } from '@controllers/file/getUserVerifiedFiles';
import authMiddleware from '@middlewares/auth.middleware';

const router = Router();

router.post('/upload', uploadMiddleware.single('file'), uploadFile);
router.get('/', getFileByCardNumber);
router.get('/user/verified', authMiddleware, getUserVerifiedFiles);
router.post('/verify', verifyFile);

export default router;
