import * as courseRepository from '../repositories/course.repository.js';
import { generateSlug } from '../utils/slug.js';
import { AppError } from '../utils/AppError.js';

const parsePagination = (page, limit) => {
  const parsedPage = Math.max(parseInt(page, 10) || 1, 1);
  const parsedLimit = Math.min(Math.max(parseInt(limit, 10) || 10, 1), 100);
  const offset = (parsedPage - 1) * parsedLimit;
  return { parsedPage, parsedLimit, offset };
};

export const getCourses = async ({ page, limit, search }) => {
  const { parsedPage, parsedLimit, offset } = parsePagination(page, limit);

  const courses = await courseRepository.findAllCourses({ limit: parsedLimit, offset, search });
  const total = await courseRepository.countAllCourses({ search });

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

export const getCourseById = async (id) => {
  const course = await courseRepository.findCourseById(id);
  if (!course) {
    throw new AppError('Course not found', 404);
  }
  return course;
};

export const getMyCourses = async (trainerId, { page, limit, search }) => {
  const { parsedPage, parsedLimit, offset } = parsePagination(page, limit);

  const courses = await courseRepository.findCoursesByTrainerId(trainerId, {
    limit: parsedLimit,
    offset,
    search,
  });
  const total = await courseRepository.countCoursesByTrainerId(trainerId, search);

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

export const createCourse = async (trainerId, courseData) => {
  const { title, description, thumbnail, status = 'draft' } = courseData;

  // Generate unique slug
  let slug = generateSlug(title);
  const existingSlug = await courseRepository.findCourseBySlug(slug);
  if (existingSlug) {
    slug = `${slug}-${Date.now()}`;
  }

  const courseId = await courseRepository.createCourse({
    trainerId,
    title,
    slug,
    description,
    thumbnail,
    status,
  });

  return courseRepository.findCourseById(courseId);
};

export const updateCourse = async (trainerId, courseId, updateData) => {
  const course = await courseRepository.findCourseById(courseId);
  if (!course) {
    throw new AppError('Course not found', 404);
  }

  // Ownership check
  if (course.trainer_id !== trainerId) {
    throw new AppError('Forbidden: You are not the owner of this course', 403);
  }

  const fieldsToUpdate = {};

  if (updateData.title !== undefined) {
    fieldsToUpdate.title = updateData.title;
    // Regenerate slug if title changed
    let slug = generateSlug(updateData.title);
    const existing = await courseRepository.findCourseBySlug(slug);
    if (existing && existing.id !== courseId) {
      slug = `${slug}-${Date.now()}`;
    }
    fieldsToUpdate.slug = slug;
  }

  if (updateData.description !== undefined) fieldsToUpdate.description = updateData.description;
  if (updateData.thumbnail !== undefined) fieldsToUpdate.thumbnail = updateData.thumbnail;
  if (updateData.status !== undefined) fieldsToUpdate.status = updateData.status;

  await courseRepository.updateCourse(courseId, fieldsToUpdate);
  return courseRepository.findCourseById(courseId);
};

export const deleteCourse = async (trainerId, courseId) => {
  const course = await courseRepository.findCourseById(courseId);
  if (!course) {
    throw new AppError('Course not found', 404);
  }

  // Ownership check
  if (course.trainer_id !== trainerId) {
    throw new AppError('Forbidden: You are not the owner of this course', 403);
  }

  await courseRepository.deleteCourse(courseId);
};
