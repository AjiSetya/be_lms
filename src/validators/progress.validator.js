import { body } from 'express-validator';

export const progressValidator = [
  body('isCompleted')
    .isBoolean().withMessage('isCompleted must be a boolean')
];
