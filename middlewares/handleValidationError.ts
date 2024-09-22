import { Request, Response, NextFunction } from 'express';
import { validationResult } from 'express-validator';

export default (req: Request, res: Response, next: NextFunction) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    const firstError = errors.array({ onlyFirstError: true })[0].msg;
    return res.status(400).json({
      error: firstError,
    });
  }

  next();
};
