import { body } from 'express-validator';

export const emailValidation = [body('email').isEmail().withMessage('Неверный формат email')];

export const registerValidation = [
  body('email').isEmail().withMessage('Неверный формат почты'),
  body('password').isLength({ min: 5 }).withMessage('Пароль должен быть минимум 5 символов'),
  body('fullName')
    .isLength({ min: 3 })
    .withMessage('ФИО должно быть минимум из 3 символов')
    .matches(/^[A-Za-zА-Яа-яЁё\s]+$/, 'i')
    .withMessage('ФИО должно содержать только буквы'),
];
