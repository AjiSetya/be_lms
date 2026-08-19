import { body } from 'express-validator';

export const updateProfileValidator = [
  body('name')
    .optional()
    .notEmpty()
    .withMessage('Name cannot be empty')
    .isLength({ min: 3 })
    .withMessage('Name must be at least 3 characters long'),
  
  body('email')
    .optional()
    .notEmpty()
    .withMessage('Email cannot be empty')
    .isEmail()
    .withMessage('Must be a valid email address')
];

export const updateStatusValidator = [
  body('isActive')
    .notEmpty()
    .withMessage('isActive status is required')
    .isBoolean()
    .withMessage('isActive must be a boolean')
];
