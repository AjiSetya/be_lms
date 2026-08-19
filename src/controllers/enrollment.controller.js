import * as enrollmentService from '../services/enrollment.service.js';
import { sendSuccess } from '../utils/response.js';

export const enroll = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { courseId } = req.params;
    const result = await enrollmentService.enrollCourse(userId, courseId);
    return sendSuccess(res, 201, 'Enrolled in course successfully', result);
  } catch (error) {
    next(error);
  }
};

export const unenroll = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { courseId } = req.params;
    await enrollmentService.unenrollCourse(userId, courseId);
    return sendSuccess(res, 200, 'Unenrolled from course successfully');
  } catch (error) {
    next(error);
  }
};

export const getCourseMembers = async (req, res, next) => {
  try {
    const trainerId = req.user.id;
    const { courseId } = req.params;
    const { page, limit } = req.query;
    const result = await enrollmentService.getCourseMembers(trainerId, courseId, { page, limit });
    return sendSuccess(res, 200, 'Course members retrieved successfully', result.members, result.meta);
  } catch (error) {
    next(error);
  }
};

export const getMyEnrolledCourses = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { page, limit } = req.query;
    const result = await enrollmentService.getMyEnrolledCourses(userId, { page, limit });
    return sendSuccess(res, 200, 'Enrolled courses retrieved successfully', result.courses, result.meta);
  } catch (error) {
    next(error);
  }
};
