import { Router } from 'express';
import {
  changePassword,
  getProfile,
  login,
  refreshTokens,
  registration,
  sendConfirmationCode,
  verifyConfirmationCode,
  updateProfile,
  changeEmail,
} from '@controllers/user';
import authMiddleware from '@middlewares/auth.middleware';
import handleValidationError from '@middlewares/handleValidationError';
import { emailValidation, registerValidation } from '@middlewares/validation.middleware';
import userValidMiddleware from '@middlewares/userValid.middleware';

const router = Router();

router.post(
  '/send-confirmation-code',
  emailValidation,
  handleValidationError,
  userValidMiddleware,
  sendConfirmationCode,
);
router.post('/verify-confirmation-code', userValidMiddleware, verifyConfirmationCode);
router.post(
  '/registration',
  registerValidation,
  userValidMiddleware,
  handleValidationError,
  registration,
);
router.post('/login', emailValidation, handleValidationError, login);
router.get('/profile', authMiddleware, getProfile);
router.post('/change-password', authMiddleware, changePassword);
router.put('/profile', authMiddleware, updateProfile);
router.post('/change-email', authMiddleware, changeEmail);
router.get('/refresh-tokens', refreshTokens);

export default router;
