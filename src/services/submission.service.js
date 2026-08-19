import * as submissionRepository from '../repositories/submission.repository.js';
import * as assignmentRepository from '../repositories/assignment.repository.js';
import * as lessonRepository from '../repositories/lesson.repository.js';
import * as moduleRepository from '../repositories/module.repository.js';
import * as courseRepository from '../repositories/course.repository.js';
import * as enrollmentRepository from '../repositories/enrollment.repository.js';
import { AppError } from '../utils/AppError.js';

const parsePagination = (page, limit) => {
  const parsedPage = Math.max(parseInt(page, 10) || 1, 1);
  const parsedLimit = Math.min(Math.max(parseInt(limit, 10) || 10, 1), 100);
  const offset = (parsedPage - 1) * parsedLimit;
  return { parsedPage, parsedLimit, offset };
};

// Helper: verify trainer owns the course that this assignment belongs to
const verifyAssignmentOwnership = async (assignmentId, trainerId) => {
  const assignment = await assignmentRepository.findAssignmentById(assignmentId);
  if (!assignment) throw new AppError('Assignment not found', 404);

  const lesson = await lessonRepository.findLessonById(assignment.lesson_id);
  const module = await moduleRepository.findModuleById(lesson.module_id);
  const course = await courseRepository.findCourseById(module.course_id);

  if (course.trainer_id !== trainerId) {
    throw new AppError('Forbidden: You are not the owner of this course', 403);
  }

  return { assignment, lesson, module, course };
};

// Helper: verify user is enrolled in the course that this assignment belongs to
const verifyEnrollmentForAssignment = async (assignmentId, userId) => {
  const assignment = await assignmentRepository.findAssignmentById(assignmentId);
  if (!assignment) throw new AppError('Assignment not found', 404);

  const lesson = await lessonRepository.findLessonById(assignment.lesson_id);
  const module = await moduleRepository.findModuleById(lesson.module_id);
  const enrollment = await enrollmentRepository.findEnrollment(module.course_id, userId);

  if (!enrollment) {
    throw new AppError('You must enroll in this course to submit assignments', 403);
  }

  return { assignment, lesson, module };
};

export const submitAssignment = async (userId, assignmentId, submissionData) => {
  const { assignment } = await verifyEnrollmentForAssignment(assignmentId, userId);

  // Check deadline
  if (assignment.deadline && new Date() > new Date(assignment.deadline)) {
    throw new AppError('Assignment deadline has passed', 400);
  }

  // Check if already submitted
  const existing = await submissionRepository.findSubmissionByAssignmentAndUser(assignmentId, userId);
  
  if (existing) {
    // Update existing submission if it hasn't been reviewed yet
    if (existing.score !== null) {
      throw new AppError('Cannot update submission after it has been graded', 400);
    }
    
    await submissionRepository.updateSubmission(existing.id, {
      content: submissionData.content,
      fileUrl: submissionData.fileUrl,
    });
    return submissionRepository.findSubmissionById(existing.id);
  }

  // Create new submission
  const submissionId = await submissionRepository.createSubmission({
    assignmentId,
    userId,
    content: submissionData.content,
    fileUrl: submissionData.fileUrl,
  });

  return submissionRepository.findSubmissionById(submissionId);
};

export const getMySubmission = async (userId, assignmentId) => {
  await verifyEnrollmentForAssignment(assignmentId, userId);
  return submissionRepository.findSubmissionByAssignmentAndUser(assignmentId, userId);
};

export const getSubmissionsForAssignment = async (trainerId, assignmentId, { page, limit }) => {
  await verifyAssignmentOwnership(assignmentId, trainerId);

  const { parsedPage, parsedLimit, offset } = parsePagination(page, limit);
  const submissions = await submissionRepository.findSubmissionsByAssignmentId(assignmentId, {
    limit: parsedLimit,
    offset,
  });
  const total = await submissionRepository.countSubmissionsByAssignmentId(assignmentId);

  return {
    submissions,
    meta: {
      page: parsedPage,
      limit: parsedLimit,
      total,
      totalPages: Math.ceil(total / parsedLimit),
    },
  };
};

export const gradeSubmission = async (trainerId, submissionId, gradeData) => {
  const submission = await submissionRepository.findSubmissionById(submissionId);
  if (!submission) throw new AppError('Submission not found', 404);

  const { assignment } = await verifyAssignmentOwnership(submission.assignment_id, trainerId);

  if (gradeData.score > parseFloat(assignment.max_score)) {
    throw new AppError(`Score cannot exceed max score of ${assignment.max_score}`, 400);
  }

  await submissionRepository.updateSubmission(submissionId, {
    score: gradeData.score,
    feedback: gradeData.feedback,
    reviewedBy: trainerId,
  });

  return submissionRepository.findSubmissionById(submissionId);
};
