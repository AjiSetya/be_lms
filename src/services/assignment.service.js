import * as assignmentRepository from '../repositories/assignment.repository.js';
import * as lessonRepository from '../repositories/lesson.repository.js';
import * as moduleRepository from '../repositories/module.repository.js';
import * as courseRepository from '../repositories/course.repository.js';
import * as enrollmentRepository from '../repositories/enrollment.repository.js';
import { AppError } from '../utils/AppError.js';

// Helper: verify trainer owns the course that this lesson belongs to
const verifyLessonOwnership = async (lessonId, trainerId) => {
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

export const getAssignmentByLessonId = async (lessonId, userId, role) => {
  const lesson = await lessonRepository.findLessonById(lessonId);
  if (!lesson) throw new AppError('Lesson not found', 404);

  if (role !== 'trainer') {
    // For users, check enrollment
    const module = await moduleRepository.findModuleById(lesson.module_id);
    const enrollment = await enrollmentRepository.findEnrollment(module.course_id, userId);
    if (!enrollment) {
      throw new AppError('You must enroll in this course to view assignments', 403);
    }
  }

  return assignmentRepository.findAssignmentByLessonId(lessonId);
};

export const createAssignment = async (trainerId, lessonId, assignmentData) => {
  await verifyLessonOwnership(lessonId, trainerId);

  // Each lesson can only have one assignment (due to UNI key)
  const existing = await assignmentRepository.findAssignmentByLessonId(lessonId);
  if (existing) {
    throw new AppError('An assignment already exists for this lesson', 409);
  }

  const assignmentId = await assignmentRepository.createAssignment({
    lessonId,
    title: assignmentData.title,
    description: assignmentData.description,
    deadline: assignmentData.deadline,
    maxScore: assignmentData.maxScore,
  });

  return assignmentRepository.findAssignmentById(assignmentId);
};

export const updateAssignment = async (trainerId, assignmentId, updateData) => {
  const assignment = await assignmentRepository.findAssignmentById(assignmentId);
  if (!assignment) throw new AppError('Assignment not found', 404);

  await verifyLessonOwnership(assignment.lesson_id, trainerId);

  const fields = {};
  if (updateData.title !== undefined) fields.title = updateData.title;
  if (updateData.description !== undefined) fields.description = updateData.description;
  if (updateData.deadline !== undefined) fields.deadline = updateData.deadline;
  if (updateData.maxScore !== undefined) fields.maxScore = updateData.maxScore;

  await assignmentRepository.updateAssignment(assignmentId, fields);
  return assignmentRepository.findAssignmentById(assignmentId);
};

export const deleteAssignment = async (trainerId, assignmentId) => {
  const assignment = await assignmentRepository.findAssignmentById(assignmentId);
  if (!assignment) throw new AppError('Assignment not found', 404);

  await verifyLessonOwnership(assignment.lesson_id, trainerId);
  
  await assignmentRepository.deleteAssignment(assignmentId);
};
