import * as userService from '../services/user.service.js';
import { sendSuccess } from '../utils/response.js';

export const getUsers = async (req, res, next) => {
  try {
    const { page, limit, search } = req.query;
    const result = await userService.getUsers({ page, limit, search });
    return sendSuccess(res, 200, 'Users retrieved successfully', result.users, result.meta);
  } catch (error) {
    next(error);
  }
};

export const getUserById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const user = await userService.getUserById(id);
    return sendSuccess(res, 200, 'User retrieved successfully', user);
  } catch (error) {
    next(error);
  }
};

export const getMe = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const user = await userService.getUserById(userId);
    return sendSuccess(res, 200, 'My profile retrieved successfully', user);
  } catch (error) {
    next(error);
  }
};

export const updateMe = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const user = await userService.updateProfile(userId, req.body);
    return sendSuccess(res, 200, 'Profile updated successfully', user);
  } catch (error) {
    next(error);
  }
};

export const updateUserStatus = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { isActive } = req.body;
    const user = await userService.updateStatus(id, isActive);
    return sendSuccess(res, 200, 'User status updated successfully', user);
  } catch (error) {
    next(error);
  }
};
