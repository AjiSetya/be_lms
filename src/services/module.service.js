import * as moduleRepository from '../repositories/module.repository.js';
import * as courseRepository from '../repositories/course.repository.js';
import { AppError } from '../utils/AppError.js';

// Helper: resolve course ownership from a module
const resolveCourseOwnership = async (moduleId, trainerId) => {
  const module = await moduleRepository.findModuleById(moduleId);
  if (!module) throw new AppError('Module not found', 404);

  const course = await courseRepository.findCourseById(module.course_id);
  if (!course) throw new AppError('Course not found', 404);

  if (course.trainer_id !== trainerId) {
    throw new AppError('Forbidden: You are not the owner of this course', 403);
  }

  return { module, course };
};

export const getModulesByCourse = async (courseId) => {
  const course = await courseRepository.findCourseById(courseId);
  if (!course) throw new AppError('Course not found', 404);

  return moduleRepository.findModulesByCourseId(courseId);
};

export const createModule = async (trainerId, courseId, moduleData) => {
  const course = await courseRepository.findCourseById(courseId);
  if (!course) throw new AppError('Course not found', 404);

  if (course.trainer_id !== trainerId) {
    throw new AppError('Forbidden: You are not the owner of this course', 403);
  }

  // Auto-increment sort_order
  const maxOrder = await moduleRepository.getMaxSortOrder(courseId);
  const sortOrder = moduleData.sortOrder ?? maxOrder + 1;

  const moduleId = await moduleRepository.createModule({
    courseId,
    title: moduleData.title,
    description: moduleData.description,
    sortOrder,
  });

  return moduleRepository.findModuleById(moduleId);
};

export const updateModule = async (trainerId, moduleId, updateData) => {
  const { module } = await resolveCourseOwnership(moduleId, trainerId);

  const fields = {};
  if (updateData.title !== undefined) fields.title = updateData.title;
  if (updateData.description !== undefined) fields.description = updateData.description;
  if (updateData.sortOrder !== undefined) fields.sort_order = updateData.sortOrder;

  await moduleRepository.updateModule(moduleId, fields);
  return moduleRepository.findModuleById(moduleId);
};

export const deleteModule = async (trainerId, moduleId) => {
  await resolveCourseOwnership(moduleId, trainerId);
  await moduleRepository.deleteModule(moduleId);
};
