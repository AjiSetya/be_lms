import * as lessonRepository from '../repositories/lesson.repository.js';
import * as moduleRepository from '../repositories/module.repository.js';
import * as courseRepository from '../repositories/course.repository.js';
import * as enrollmentRepository from '../repositories/enrollment.repository.js';
import { AppError } from '../utils/AppError.js';

// Helper: resolve course ownership from lesson → module → course
const resolveLessonOwnership = async (lessonId, trainerId) => {
  const lesson = await lessonRepository.findLessonById(lessonId);
  if (!lesson) throw new AppError('Lesson not found', 404);

  const module = await moduleRepository.findModuleById(lesson.module_id);
  if (!module) throw new AppError('Module not found', 404);

  const course = await courseRepository.findCourseById(module.course_id);
  if (!course) throw new AppError('Course not found', 404);

  if (course.trainer_id !== trainerId) {
    throw new AppError('Forbidden: You are not the owner of this course', 403);
  }

  return { lesson, module, course };
};

// Helper: resolve module and check user enrollment
const resolveModuleEnrollment = async (moduleId, userId) => {
  const module = await moduleRepository.findModuleById(moduleId);
  if (!module) throw new AppError('Module not found', 404);

  const course = await courseRepository.findCourseById(module.course_id);
  if (!course) throw new AppError('Course not found', 404);

  if (course.status !== 'published') {
    throw new AppError('Course is not available', 404);
  }

  const enrollment = await enrollmentRepository.findEnrollment(module.course_id, userId);
  if (!enrollment) {
    throw new AppError('You must enroll in this course to view lessons', 403);
  }

  return { module, course };
};

export const getLessonsByModule = async (moduleId, userId, role) => {
  // Trainer can view any module in their courses without enrollment
  if (role === 'trainer') {
    const module = await moduleRepository.findModuleById(moduleId);
    if (!module) throw new AppError('Module not found', 404);
    return lessonRepository.findLessonsByModuleId(moduleId);
  }

  // User must be enrolled
  await resolveModuleEnrollment(moduleId, userId);
  return lessonRepository.findLessonsByModuleIdWithProgress(moduleId, userId);
};

export const getLessonById = async (lessonId, userId, role) => {
  const lesson = await lessonRepository.findLessonById(lessonId);
  if (!lesson) throw new AppError('Lesson not found', 404);

  if (role === 'trainer') return lesson;

  // For users, check enrollment
  const module = await moduleRepository.findModuleById(lesson.module_id);
  const enrollment = await enrollmentRepository.findEnrollment(module.course_id, userId);
  if (!enrollment) {
    throw new AppError('You must enroll in this course to view this lesson', 403);
  }

  return lesson;
};

export const createLesson = async (trainerId, moduleId, lessonData) => {
  const module = await moduleRepository.findModuleById(moduleId);
  if (!module) throw new AppError('Module not found', 404);

  const course = await courseRepository.findCourseById(module.course_id);
  if (!course) throw new AppError('Course not found', 404);

  if (course.trainer_id !== trainerId) {
    throw new AppError('Forbidden: You are not the owner of this course', 403);
  }

  const maxOrder = await lessonRepository.getMaxSortOrder(moduleId);
  const sortOrder = lessonData.sortOrder ?? maxOrder + 1;

  const lessonId = await lessonRepository.createLesson({
    moduleId,
    title: lessonData.title,
    description: lessonData.description,
    content: lessonData.content,
    type: lessonData.type,
    videoUrl: lessonData.videoUrl,
    sortOrder,
  });

  return lessonRepository.findLessonById(lessonId);
};

export const updateLesson = async (trainerId, lessonId, updateData) => {
  await resolveLessonOwnership(lessonId, trainerId);

  const fields = {};
  if (updateData.title !== undefined) fields.title = updateData.title;
  if (updateData.description !== undefined) fields.description = updateData.description;
  if (updateData.content !== undefined) fields.content = updateData.content;
  if (updateData.type !== undefined) fields.type = updateData.type;
  if (updateData.videoUrl !== undefined) fields.video_url = updateData.videoUrl;
  if (updateData.sortOrder !== undefined) fields.sort_order = updateData.sortOrder;

  await lessonRepository.updateLesson(lessonId, fields);
  return lessonRepository.findLessonById(lessonId);
};

export const deleteLesson = async (trainerId, lessonId) => {
  await resolveLessonOwnership(lessonId, trainerId);
  await lessonRepository.deleteLesson(lessonId);
};
