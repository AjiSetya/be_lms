import * as progressRepository from '../repositories/progress.repository.js';
import * as lessonRepository from '../repositories/lesson.repository.js';
import * as moduleRepository from '../repositories/module.repository.js';
import * as enrollmentRepository from '../repositories/enrollment.repository.js';
import { AppError } from '../utils/AppError.js';

export const toggleLessonProgress = async (userId, lessonId, isCompleted) => {
  // Check if lesson exists
  const lesson = await lessonRepository.findLessonById(lessonId);
  if (!lesson) {
    throw new AppError('Lesson not found', 404);
  }

  // Check enrollment
  const module = await moduleRepository.findModuleById(lesson.module_id);
  const enrollment = await enrollmentRepository.findEnrollment(module.course_id, userId);
  
  if (!enrollment) {
    throw new AppError('You must enroll in this course to mark progress', 403);
  }

  // Update progress
  await progressRepository.upsertProgress(userId, lessonId, isCompleted);

  return progressRepository.findProgress(userId, lessonId);
};

export const getCourseProgress = async (userId, courseId) => {
   // Check enrollment
   const enrollment = await enrollmentRepository.findEnrollment(courseId, userId);
   if (!enrollment) {
     throw new AppError('You are not enrolled in this course', 403);
   }

   const totalLessons = await lessonRepository.countLessonsByCourseId(courseId);
   const completedLessons = await progressRepository.countCompletedLessonsByCourse(userId, courseId);
   
   let percentage = 0;
   if (totalLessons > 0) {
      percentage = Math.round((completedLessons / totalLessons) * 100);
   }

   return {
     totalLessons,
     completedLessons,
     percentage
   };
};
