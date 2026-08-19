import express from 'express';
import * as courseController from '../controllers/course.controller.js';
import * as enrollmentController from '../controllers/enrollment.controller.js';
import { authenticate } from '../middlewares/auth.middleware.js';
import { authorize } from '../middlewares/role.middleware.js';
import { validate } from '../middlewares/validate.middleware.js';
import { createCourseValidator, updateCourseValidator } from '../validators/course.validator.js';

const router = express.Router();

// Public (authenticated users can browse published courses)
router.get('/', authenticate, courseController.getCourses);
router.get('/:id', authenticate, courseController.getCourseById);

// Trainer only
router.get('/trainer/my', authenticate, authorize('trainer'), courseController.getMyCourses);
router.post('/', authenticate, authorize('trainer'), createCourseValidator, validate, courseController.createCourse);
router.patch('/:id', authenticate, authorize('trainer'), updateCourseValidator, validate, courseController.updateCourse);
router.delete('/:id', authenticate, authorize('trainer'), courseController.deleteCourse);

// Enrollment — User
router.post('/:courseId/enroll', authenticate, authorize('user'), enrollmentController.enroll);
router.delete('/:courseId/enroll', authenticate, authorize('user'), enrollmentController.unenroll);

// Course Members — Trainer only
router.get('/:courseId/members', authenticate, authorize('trainer'), enrollmentController.getCourseMembers);

export default router;
