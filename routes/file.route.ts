import { Router } from 'express';
import { uploadMiddleware } from '@middlewares/fileUpload.middleware';
import { uploadFile } from '@controllers/file/uploadFile';
import { getFileByCardNumber } from '@controllers/file/getFileByCardNumber';

const router = Router();

router.post('/upload', uploadMiddleware.single('file'), uploadFile);
router.get('/', getFileByCardNumber);

export default router;
