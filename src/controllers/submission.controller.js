import * as submissionService from '../services/submission.service.js';
import { sendSuccess } from '../utils/response.js';

export const submitAssignment = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { assignmentId } = req.params;
    
    const submission = await submissionService.submitAssignment(userId, assignmentId, req.body);
    return sendSuccess(res, 201, 'Assignment submitted successfully', submission);
  } catch (error) {
    next(error);
  }
};

export const getMySubmission = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { assignmentId } = req.params;
    
    const submission = await submissionService.getMySubmission(userId, assignmentId);
    return sendSuccess(res, 200, 'Submission retrieved successfully', submission);
  } catch (error) {
    next(error);
  }
};

export const getSubmissionsForAssignment = async (req, res, next) => {
  try {
    const trainerId = req.user.id;
    const { assignmentId } = req.params;
    const { page, limit } = req.query;
    
    const result = await submissionService.getSubmissionsForAssignment(trainerId, assignmentId, { page, limit });
    return sendSuccess(res, 200, 'Submissions retrieved successfully', result.submissions, result.meta);
  } catch (error) {
    next(error);
  }
};

export const gradeSubmission = async (req, res, next) => {
  try {
    const trainerId = req.user.id;
    const { id } = req.params;
    
    const submission = await submissionService.gradeSubmission(trainerId, id, req.body);
    return sendSuccess(res, 200, 'Submission graded successfully', submission);
  } catch (error) {
    next(error);
  }
};
