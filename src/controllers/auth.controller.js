import * as authService from '../services/auth.service.js';
import { sendSuccess } from '../utils/response.js';

export const register = async (req, res, next) => {
  try {
    const user = await authService.register(req.body);
    return sendSuccess(res, 201, 'Registration successful', user);
  } catch (error) {
    next(error);
  }
};

export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const data = await authService.login(email, password);
    return sendSuccess(res, 200, 'Login successful', data);
  } catch (error) {
    next(error);
  }
};

export const getMe = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const user = await authService.getMe(userId);
    return sendSuccess(res, 200, 'User profile retrieved successfully', user);
  } catch (error) {
    next(error);
  }
};
