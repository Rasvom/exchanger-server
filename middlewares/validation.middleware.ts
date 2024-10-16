import { body } from 'express-validator';

export const emailValidation = [body('email').isEmail().withMessage('Неверный формат email')];

export const registerValidation = [
  body('password')
    .isLength({ min: 6 })
    .withMessage('Пароль должен быть минимум 6 символов')
    .matches(/[A-Z]/)
    .withMessage('Пароль должен содержать хотя бы одну заглавную букву'),

  body('fullName')
    .isLength({ min: 3 })
    .withMessage('ФИО должно быть минимум из 3 символов')
    .matches(/^[A-Za-zА-Яа-яЁё\s]+$/, 'i')
    .withMessage('ФИО должно содержать только буквы'),
];
