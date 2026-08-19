import express from 'express';
import * as progressController from '../controllers/progress.controller.js';
import { authenticate } from '../middlewares/auth.middleware.js';
import { authorize } from '../middlewares/role.middleware.js';
import { validate } from '../middlewares/validate.middleware.js';
import { progressValidator } from '../validators/progress.validator.js';

const router = express.Router();

// Only users can mark progress
router.post('/lessons/:lessonId/progress', authenticate, authorize('user'), progressValidator, validate, progressController.toggleProgress);
router.get('/courses/:courseId/progress', authenticate, authorize('user'), progressController.getCourseProgress);

export default router;
