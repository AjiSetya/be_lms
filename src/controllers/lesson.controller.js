import * as lessonService from '../services/lesson.service.js';
import { sendSuccess } from '../utils/response.js';

export const getLessons = async (req, res, next) => {
  try {
    const { moduleId } = req.params;
    const userId = req.user.id;
    const role = req.user.role;
    const lessons = await lessonService.getLessonsByModule(moduleId, userId, role);
    return sendSuccess(res, 200, 'Lessons retrieved successfully', lessons);
  } catch (error) {
    next(error);
  }
};

export const getLessonById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;
    const role = req.user.role;
    const lesson = await lessonService.getLessonById(id, userId, role);
    return sendSuccess(res, 200, 'Lesson retrieved successfully', lesson);
  } catch (error) {
    next(error);
  }
};

export const createLesson = async (req, res, next) => {
  try {
    const trainerId = req.user.id;
    const { moduleId } = req.params;
    const lesson = await lessonService.createLesson(trainerId, moduleId, req.body);
    return sendSuccess(res, 201, 'Lesson created successfully', lesson);
  } catch (error) {
    next(error);
  }
};

export const updateLesson = async (req, res, next) => {
  try {
    const trainerId = req.user.id;
    const { id } = req.params;
    const lesson = await lessonService.updateLesson(trainerId, id, req.body);
    return sendSuccess(res, 200, 'Lesson updated successfully', lesson);
  } catch (error) {
    next(error);
  }
};

export const deleteLesson = async (req, res, next) => {
  try {
    const trainerId = req.user.id;
    const { id } = req.params;
    await lessonService.deleteLesson(trainerId, id);
    return sendSuccess(res, 200, 'Lesson deleted successfully');
  } catch (error) {
    next(error);
  }
};
