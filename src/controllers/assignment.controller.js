import * as assignmentService from '../services/assignment.service.js';
import { sendSuccess } from '../utils/response.js';

export const getAssignment = async (req, res, next) => {
  try {
    const { lessonId } = req.params;
    const userId = req.user.id;
    const role = req.user.role;
    
    const assignment = await assignmentService.getAssignmentByLessonId(lessonId, userId, role);
    return sendSuccess(res, 200, 'Assignment retrieved successfully', assignment);
  } catch (error) {
    next(error);
  }
};

export const createAssignment = async (req, res, next) => {
  try {
    const trainerId = req.user.id;
    const { lessonId } = req.params;
    
    const assignment = await assignmentService.createAssignment(trainerId, lessonId, req.body);
    return sendSuccess(res, 201, 'Assignment created successfully', assignment);
  } catch (error) {
    next(error);
  }
};

export const updateAssignment = async (req, res, next) => {
  try {
    const trainerId = req.user.id;
    const { id } = req.params;
    
    const assignment = await assignmentService.updateAssignment(trainerId, id, req.body);
    return sendSuccess(res, 200, 'Assignment updated successfully', assignment);
  } catch (error) {
    next(error);
  }
};

export const deleteAssignment = async (req, res, next) => {
  try {
    const trainerId = req.user.id;
    const { id } = req.params;
    
    await assignmentService.deleteAssignment(trainerId, id);
    return sendSuccess(res, 200, 'Assignment deleted successfully');
  } catch (error) {
    next(error);
  }
};
