import * as progressService from '../services/progress.service.js';
import { sendSuccess } from '../utils/response.js';

export const toggleProgress = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { lessonId } = req.params;
    const { isCompleted } = req.body;
    
    const progress = await progressService.toggleLessonProgress(userId, lessonId, isCompleted);
    return sendSuccess(res, 200, 'Lesson progress updated successfully', progress);
  } catch (error) {
    next(error);
  }
};

export const getCourseProgress = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { courseId } = req.params;
    
    const progress = await progressService.getCourseProgress(userId, courseId);
    return sendSuccess(res, 200, 'Course progress retrieved successfully', progress);
  } catch (error) {
    next(error);
  }
};
