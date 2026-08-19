import { body } from 'express-validator';

export const submitAssignmentValidator = [
  body('content')
    .optional({ nullable: true }),

  body('fileUrl')
    .optional({ nullable: true })
    .isURL().withMessage('fileUrl must be a valid URL'),

  body().custom((value, { req }) => {
    if (!req.body.content && !req.body.fileUrl) {
      throw new Error('Either content or fileUrl must be provided');
    }
    return true;
  }),
];

export const gradeSubmissionValidator = [
  body('score')
    .notEmpty().withMessage('Score is required')
    .isFloat({ min: 0 }).withMessage('Score must be a non-negative number'),

  body('feedback')
    .optional({ nullable: true }),
];
