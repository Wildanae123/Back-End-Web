// src/middlewares/errorMiddleware.js

// 404 Not Found Handler
// This function should be placed BEFORE the module.exports line
const notFoundMiddleware = (req, res, next) => {
  const error = new Error(`Not Found - ${req.originalUrl}`);
  res.status(404);
  next(error);
};

// Global Error Handling Middleware
// This function must also be placed BEFORE the module.exports line
const errorMiddleware = (err, req, res, next) => {
  // Use the response's status code if it's already set, otherwise default to 500
  const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  res.status(statusCode);
  res.json({
    message: err.message,
    // Only show the stack trace in development mode for security reasons
    stack: process.env.NODE_ENV === "production" ? "🥞" : err.stack,
  });
};

// Now that both functions are declared above, we can safely export them.
module.exports = {
  notFoundMiddleware,
  errorMiddleware,
};
