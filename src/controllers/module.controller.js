import * as moduleService from '../services/module.service.js';
import { sendSuccess } from '../utils/response.js';

export const getModules = async (req, res, next) => {
  try {
    const { courseId } = req.params;
    const modules = await moduleService.getModulesByCourse(courseId);
    return sendSuccess(res, 200, 'Modules retrieved successfully', modules);
  } catch (error) {
    next(error);
  }
};

export const createModule = async (req, res, next) => {
  try {
    const trainerId = req.user.id;
    const { courseId } = req.params;
    const module = await moduleService.createModule(trainerId, courseId, req.body);
    return sendSuccess(res, 201, 'Module created successfully', module);
  } catch (error) {
    next(error);
  }
};

export const updateModule = async (req, res, next) => {
  try {
    const trainerId = req.user.id;
    const { id } = req.params;
    const module = await moduleService.updateModule(trainerId, id, req.body);
    return sendSuccess(res, 200, 'Module updated successfully', module);
  } catch (error) {
    next(error);
  }
};

export const deleteModule = async (req, res, next) => {
  try {
    const trainerId = req.user.id;
    const { id } = req.params;
    await moduleService.deleteModule(trainerId, id);
    return sendSuccess(res, 200, 'Module deleted successfully');
  } catch (error) {
    next(error);
  }
};
