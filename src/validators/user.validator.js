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
    .withMessage('Must be a valid email address'),
    
  body('password')
    .optional()
    .notEmpty()
    .withMessage('Password cannot be empty')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters long'),

  body('role')
    .optional()
    .isIn(['user', 'trainer'])
    .withMessage('Role must be user or trainer'),

  body('profilePhoto')
    .optional({ nullable: true })
    .isURL()
    .withMessage('Profile photo must be a valid URL')
];

export const updateStatusValidator = [
  body('isActive')
    .notEmpty()
    .withMessage('isActive status is required')
    .isBoolean()
    .withMessage('isActive must be a boolean')
];
