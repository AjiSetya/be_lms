import { body } from 'express-validator';

export const createModuleValidator = [
  body('title')
    .notEmpty().withMessage('Title is required')
    .isLength({ max: 150 }).withMessage('Title must be at most 150 characters'),

  body('description')
    .optional({ nullable: true }),

  body('sortOrder')
    .optional()
    .isInt({ min: 0 }).withMessage('sortOrder must be a non-negative integer'),
];

export const updateModuleValidator = [
  body('title')
    .optional()
    .notEmpty().withMessage('Title cannot be empty')
    .isLength({ max: 150 }).withMessage('Title must be at most 150 characters'),

  body('description')
    .optional({ nullable: true }),

  body('sortOrder')
    .optional()
    .isInt({ min: 0 }).withMessage('sortOrder must be a non-negative integer'),
];
