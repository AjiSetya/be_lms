import express from 'express';
import * as lessonController from '../controllers/lesson.controller.js';
import { authenticate } from '../middlewares/auth.middleware.js';
import { authorize } from '../middlewares/role.middleware.js';
import { validate } from '../middlewares/validate.middleware.js';
import { createLessonValidator, updateLessonValidator } from '../validators/lesson.validator.js';

const router = express.Router();

// User & Trainer: get lessons by module (enrollment check in service for user)
router.get('/modules/:moduleId/lessons', authenticate, lessonController.getLessons);

// User & Trainer: get single lesson (enrollment check in service for user)
router.get('/lessons/:id', authenticate, lessonController.getLessonById);

// Trainer only
router.post('/modules/:moduleId/lessons', authenticate, authorize('trainer'), createLessonValidator, validate, lessonController.createLesson);
router.patch('/lessons/:id', authenticate, authorize('trainer'), updateLessonValidator, validate, lessonController.updateLesson);
router.delete('/lessons/:id', authenticate, authorize('trainer'), lessonController.deleteLesson);

export default router;
