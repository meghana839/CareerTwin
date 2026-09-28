export const errorHandler = (err, req, res, next) => {
  console.error('[API Error]:', err.message);

  const statusCode = res.statusCode !== 200 ? res.statusCode : 500;
  res.status(statusCode).json({
    success: false,
    message: err.message || 'An unexpected server error occurred.',
    // Never expose stack trace in production or sensitive credentials
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
};
