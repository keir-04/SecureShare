const multer = require("multer");

const errorHandler = (err, _req, res, _next) => {
  const statusCode = err.statusCode || (err.name === "ValidationError" ? 400 : 500);

  if (err instanceof multer.MulterError) {
    return res.status(400).json({ message: err.message });
  }

  return res.status(statusCode).json({
    message: err.message || "Internal server error",
    ...(process.env.NODE_ENV !== "production" && { stack: err.stack }),
  });
};

module.exports = errorHandler;
