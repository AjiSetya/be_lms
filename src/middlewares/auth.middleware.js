import { verifyAccessToken } from '../utils/jwt.js';
import { findUserById } from '../repositories/user.repository.js';
import { sendError } from '../utils/response.js';

export const authenticate = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return sendError(res, 401, 'Unauthorized: No token provided');
    }

    const token = authHeader.split(' ')[1];
    if (!token) {
      return sendError(res, 401, 'Unauthorized: Invalid token format');
    }

    const decoded = verifyAccessToken(token);
    
    // Check if user still exists and is active
    const user = await findUserById(decoded.userId);
    if (!user) {
      return sendError(res, 401, 'Unauthorized: User not found');
    }
    
    if (!user.is_active) {
      return sendError(res, 403, 'Forbidden: User account is inactive');
    }

    req.user = {
      id: user.id,
      role: user.role
    };

    next();
  } catch (error) {
    return sendError(res, 401, 'Unauthorized: Invalid or expired token');
  }
};
