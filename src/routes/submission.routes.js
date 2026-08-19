import express from 'express';
import * as submissionController from '../controllers/submission.controller.js';
import { authenticate } from '../middlewares/auth.middleware.js';
import { authorize } from '../middlewares/role.middleware.js';
import { validate } from '../middlewares/validate.middleware.js';
import { submitAssignmentValidator, gradeSubmissionValidator } from '../validators/submission.validator.js';

const router = express.Router();

// User only: Submit assignment
router.post('/assignments/:assignmentId/submissions', authenticate, authorize('user'), submitAssignmentValidator, validate, submissionController.submitAssignment);

// User only: Get my submission
router.get('/assignments/:assignmentId/submissions/my', authenticate, authorize('user'), submissionController.getMySubmission);

// Trainer only: Get all submissions for an assignment
router.get('/assignments/:assignmentId/submissions', authenticate, authorize('trainer'), submissionController.getSubmissionsForAssignment);

// Trainer only: Grade a submission
router.patch('/submissions/:id/grade', authenticate, authorize('trainer'), gradeSubmissionValidator, validate, submissionController.gradeSubmission);

export default router;
