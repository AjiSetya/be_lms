import express from 'express';
import * as moduleController from '../controllers/module.controller.js';
import { authenticate } from '../middlewares/auth.middleware.js';
import { authorize } from '../middlewares/role.middleware.js';
import { validate } from '../middlewares/validate.middleware.js';
import { createModuleValidator, updateModuleValidator } from '../validators/module.validator.js';

const router = express.Router();

// Both trainer and user can list modules of a course (user must be enrolled - enforced in service)
// These routes are nested under /courses/:courseId/modules
router.get('/courses/:courseId/modules', authenticate, moduleController.getModules);

// Trainer only
router.post('/courses/:courseId/modules', authenticate, authorize('trainer'), createModuleValidator, validate, moduleController.createModule);
router.patch('/modules/:id', authenticate, authorize('trainer'), updateModuleValidator, validate, moduleController.updateModule);
router.delete('/modules/:id', authenticate, authorize('trainer'), moduleController.deleteModule);

export default router;
