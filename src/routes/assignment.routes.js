import express from 'express';
import * as assignmentController from '../controllers/assignment.controller.js';
import { authenticate } from '../middlewares/auth.middleware.js';
import { authorize } from '../middlewares/role.middleware.js';
import { validate } from '../middlewares/validate.middleware.js';
import { createAssignmentValidator, updateAssignmentValidator } from '../validators/assignment.validator.js';

const router = express.Router();

// User & Trainer: get assignment for a lesson
router.get('/lessons/:lessonId/assignment', authenticate, assignmentController.getAssignment);

// Trainer only: create assignment for a lesson
router.post('/lessons/:lessonId/assignment', authenticate, authorize('trainer'), createAssignmentValidator, validate, assignmentController.createAssignment);

// Trainer only: update & delete assignment by ID
router.patch('/assignments/:id', authenticate, authorize('trainer'), updateAssignmentValidator, validate, assignmentController.updateAssignment);
router.delete('/assignments/:id', authenticate, authorize('trainer'), assignmentController.deleteAssignment);

export default router;
