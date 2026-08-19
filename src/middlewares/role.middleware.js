import { sendError } from '../utils/response.js';

export const authorize = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req.user || !req.user.role) {
      return sendError(res, 401, 'Unauthorized: User role not found');
    }

    if (!allowedRoles.includes(req.user.role)) {
      return sendError(res, 403, 'Forbidden: Insufficient permissions');
    }

    next();
  };
};
