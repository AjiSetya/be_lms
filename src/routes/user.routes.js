import express from 'express';
import * as userController from '../controllers/user.controller.js';
import * as enrollmentController from '../controllers/enrollment.controller.js';
import { authenticate } from '../middlewares/auth.middleware.js';
import { authorize } from '../middlewares/role.middleware.js';
import { validate } from '../middlewares/validate.middleware.js';
import { updateProfileValidator, updateStatusValidator } from '../validators/user.validator.js';

const router = express.Router();

// Publicly accessible to authenticated users (both trainer & user)
router.get('/me', authenticate, userController.getMe);
router.get('/me/courses', authenticate, authorize('user'), enrollmentController.getMyEnrolledCourses);
router.patch('/me', authenticate, updateProfileValidator, validate, userController.updateMe);

// Trainer only routes
router.get('/', authenticate, authorize('trainer'), userController.getUsers);
router.get('/:id', authenticate, authorize('trainer'), userController.getUserById);
router.patch('/:id/status', authenticate, authorize('trainer'), updateStatusValidator, validate, userController.updateUserStatus);

export default router;
