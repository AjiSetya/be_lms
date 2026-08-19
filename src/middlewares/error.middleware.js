import { env } from '../config/env.js';
import { sendError } from '../utils/response.js';

export const errorHandler = (err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const message = err.isOperational ? err.message : 'Internal Server Error';
  
  if (!err.isOperational) {
    console.error('[Error]', err);
  }

  const errors = err.errors || null;

  sendError(res, statusCode, message, errors);
};
