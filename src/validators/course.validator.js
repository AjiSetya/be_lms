import { body } from 'express-validator';

export const createCourseValidator = [
  body('title')
    .notEmpty()
    .withMessage('Title is required')
    .isLength({ max: 150 })
    .withMessage('Title must be at most 150 characters'),

  body('description')
    .optional({ nullable: true }),

  body('thumbnail')
    .optional({ nullable: true })
    .isURL()
    .withMessage('Thumbnail must be a valid URL'),

  body('status')
    .optional()
    .isIn(['draft', 'published', 'archived'])
    .withMessage('Status must be draft, published, or archived'),
];

export const updateCourseValidator = [
  body('title')
    .optional()
    .notEmpty()
    .withMessage('Title cannot be empty')
    .isLength({ max: 150 })
    .withMessage('Title must be at most 150 characters'),

  body('description')
    .optional({ nullable: true }),

  body('thumbnail')
    .optional({ nullable: true })
    .isURL()
    .withMessage('Thumbnail must be a valid URL'),

  body('status')
    .optional()
    .isIn(['draft', 'published', 'archived'])
    .withMessage('Status must be draft, published, or archived'),
];
