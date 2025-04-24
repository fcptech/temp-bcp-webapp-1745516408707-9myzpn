import { logger } from '../utils/logger.js';

export const errorHandler = (err, req, res, next) => {
  logger.error('Error:', {
    error: err.message,
    stack: err.stack,
    path: req.path,
    method: req.method,
    ip: req.ip,
    user: req.user?.id
  });

  // Don't expose internal errors to client
  const clientError = {
    message: 'An error occurred',
    code: err.code || 'INTERNAL_ERROR'
  };

  if (process.env.NODE_ENV === 'development') {
    clientError.details = err.message;
    clientError.stack = err.stack;
  }

  res.status(err.status || 500).json(clientError);
};