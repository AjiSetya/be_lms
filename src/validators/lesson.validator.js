import { body } from 'express-validator';

export const createLessonValidator = [
  body('title')
    .notEmpty().withMessage('Title is required')
    .isLength({ max: 150 }).withMessage('Title must be at most 150 characters'),

  body('description')
    .optional({ nullable: true }),

  body('content')
    .optional({ nullable: true }),

  body('type')
    .optional()
    .isIn(['material', 'video']).withMessage('Type must be material or video'),

  body('videoUrl')
    .optional({ nullable: true })
    .isURL().withMessage('videoUrl must be a valid URL'),

  body('sortOrder')
    .optional()
    .isInt({ min: 0 }).withMessage('sortOrder must be a non-negative integer'),
];

export const updateLessonValidator = [
  body('title')
    .optional()
    .notEmpty().withMessage('Title cannot be empty')
    .isLength({ max: 150 }).withMessage('Title must be at most 150 characters'),

  body('description')
    .optional({ nullable: true }),

  body('content')
    .optional({ nullable: true }),

  body('type')
    .optional()
    .isIn(['material', 'video']).withMessage('Type must be material or video'),

  body('videoUrl')
    .optional({ nullable: true })
    .isURL().withMessage('videoUrl must be a valid URL'),

  body('sortOrder')
    .optional()
    .isInt({ min: 0 }).withMessage('sortOrder must be a non-negative integer'),
];
