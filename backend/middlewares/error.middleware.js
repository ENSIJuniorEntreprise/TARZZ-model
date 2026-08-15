const ApiError = require('../utils/ApiError');
const logger = require('../utils/logger');

const notFound = (req, _res, next) => {
  next(new ApiError(404, `Route not found: ${req.originalUrl}`));
};

const errorHandler = (err, req, res, _next) => {
  const statusCode = err.statusCode || 500;

  if (err.name === 'CastError') {
    return res.status(400).json({
      success: false,
      message: 'Invalid resource identifier',
    });
  }

  if (err.code === 11000) {
    return res.status(409).json({
      success: false,
      message: 'Duplicate value violates unique constraint',
      details: err.keyValue,
    });
  }

  if (err.name === 'ValidationError') {
    return res.status(400).json({
      success: false,
      message: 'Validation error',
      details: Object.values(err.errors).map(e => e.message),
    });
  }

  if (statusCode >= 500) {
    logger.error({ err, statusCode, path: req.originalUrl }, 'Unhandled server error');
  }

  return res.status(statusCode).json({
    success: false,
    message: err.message || 'Internal Server Error',
    details: err.details || null,
    stack: process.env.NODE_ENV === 'production' ? undefined : err.stack,
  });
};

module.exports = { notFound, errorHandler };
