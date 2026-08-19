import * as enrollmentRepository from '../repositories/enrollment.repository.js';
import * as courseRepository from '../repositories/course.repository.js';
import { AppError } from '../utils/AppError.js';

const parsePagination = (page, limit) => {
  const parsedPage = Math.max(parseInt(page, 10) || 1, 1);
  const parsedLimit = Math.min(Math.max(parseInt(limit, 10) || 10, 1), 100);
  const offset = (parsedPage - 1) * parsedLimit;
  return { parsedPage, parsedLimit, offset };
};

export const enrollCourse = async (userId, courseId) => {
  // Check if course exists
  const course = await courseRepository.findCourseById(courseId);
  if (!course) {
    throw new AppError('Course not found', 404);
  }

  // Prevent joining draft or archived courses
  if (course.status !== 'published') {
    throw new AppError('You can only enroll in published courses', 400);
  }

  // Prevent duplicate enrollment
  const existingEnrollment = await enrollmentRepository.findEnrollment(courseId, userId);
  if (existingEnrollment) {
    throw new AppError('You are already enrolled in this course', 409);
  }

  const enrollmentId = await enrollmentRepository.createEnrollment(courseId, userId);

  return {
    enrollmentId,
    courseId,
    userId,
    status: 'active',
  };
};

export const unenrollCourse = async (userId, courseId) => {
  // Check if course exists
  const course = await courseRepository.findCourseById(courseId);
  if (!course) {
    throw new AppError('Course not found', 404);
  }

  // Check if user is enrolled
  const enrollment = await enrollmentRepository.findEnrollment(courseId, userId);
  if (!enrollment) {
    throw new AppError('You are not enrolled in this course', 404);
  }

  await enrollmentRepository.deleteEnrollment(courseId, userId);
};

export const getCourseMembers = async (trainerId, courseId, { page, limit }) => {
  // Check course exists and trainer owns it
  const course = await courseRepository.findCourseById(courseId);
  if (!course) {
    throw new AppError('Course not found', 404);
  }

  if (course.trainer_id !== trainerId) {
    throw new AppError('Forbidden: You are not the owner of this course', 403);
  }

  const { parsedPage, parsedLimit, offset } = parsePagination(page, limit);

  const members = await enrollmentRepository.findMembersByCourseId(courseId, {
    limit: parsedLimit,
    offset,
  });
  const total = await enrollmentRepository.countMembersByCourseId(courseId);

  return {
    members,
    meta: {
      page: parsedPage,
      limit: parsedLimit,
      total,
      totalPages: Math.ceil(total / parsedLimit),
    },
  };
};

export const getMyEnrolledCourses = async (userId, { page, limit }) => {
  const { parsedPage, parsedLimit, offset } = parsePagination(page, limit);

  const courses = await enrollmentRepository.findEnrolledCoursesByUserId(userId, {
    limit: parsedLimit,
    offset,
  });
  const total = await enrollmentRepository.countEnrolledCoursesByUserId(userId);

  return {
    courses,
    meta: {
      page: parsedPage,
      limit: parsedLimit,
      total,
      totalPages: Math.ceil(total / parsedLimit),
    },
  };
};

export const checkEnrollment = async (userId, courseId) => {
  return enrollmentRepository.findEnrollment(courseId, userId);
};
