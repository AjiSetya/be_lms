import { body } from 'express-validator';

export const createAssignmentValidator = [
  body('title')
    .notEmpty().withMessage('Title is required')
    .isLength({ max: 150 }).withMessage('Title must be at most 150 characters'),

  body('description')
    .optional({ nullable: true }),

  body('deadline')
    .optional({ nullable: true })
    .isISO8601().withMessage('Deadline must be a valid ISO8601 date'),

  body('maxScore')
    .optional()
    .isFloat({ min: 0 }).withMessage('maxScore must be a non-negative number'),
];

export const updateAssignmentValidator = [
  body('title')
    .optional()
    .notEmpty().withMessage('Title cannot be empty')
    .isLength({ max: 150 }).withMessage('Title must be at most 150 characters'),

  body('description')
    .optional({ nullable: true }),

  body('deadline')
    .optional({ nullable: true })
    .isISO8601().withMessage('Deadline must be a valid ISO8601 date'),

  body('maxScore')
    .optional()
    .isFloat({ min: 0 }).withMessage('maxScore must be a non-negative number'),
];
