import * as courseService from '../services/course.service.js';
import { sendSuccess } from '../utils/response.js';

// Public / User
export const getCourses = async (req, res, next) => {
  try {
    const { page, limit, search } = req.query;
    const result = await courseService.getCourses({ page, limit, search });
    return sendSuccess(res, 200, 'Courses retrieved successfully', result.courses, result.meta);
  } catch (error) {
    next(error);
  }
};

export const getCourseById = async (req, res, next) => {
  try {
    const course = await courseService.getCourseById(req.params.id);
    return sendSuccess(res, 200, 'Course retrieved successfully', course);
  } catch (error) {
    next(error);
  }
};

// Trainer
export const getMyCourses = async (req, res, next) => {
  try {
    const trainerId = req.user.id;
    const { page, limit, search } = req.query;
    const result = await courseService.getMyCourses(trainerId, { page, limit, search });
    return sendSuccess(res, 200, 'My courses retrieved successfully', result.courses, result.meta);
  } catch (error) {
    next(error);
  }
};

export const createCourse = async (req, res, next) => {
  try {
    const trainerId = req.user.id;
    const course = await courseService.createCourse(trainerId, req.body);
    return sendSuccess(res, 201, 'Course created successfully', course);
  } catch (error) {
    next(error);
  }
};

export const updateCourse = async (req, res, next) => {
  try {
    const trainerId = req.user.id;
    const courseId = req.params.id;
    const course = await courseService.updateCourse(trainerId, courseId, req.body);
    return sendSuccess(res, 200, 'Course updated successfully', course);
  } catch (error) {
    next(error);
  }
};

export const deleteCourse = async (req, res, next) => {
  try {
    const trainerId = req.user.id;
    const courseId = req.params.id;
    await courseService.deleteCourse(trainerId, courseId);
    return sendSuccess(res, 200, 'Course deleted successfully');
  } catch (error) {
    next(error);
  }
};
