import ValidationError from "../errors/validation-error.js";

const errorMiddleware = (err, _, res, __) => {
  if (err instanceof ValidationError) {
    return res.status(err.statusCode).json({
      success: false,
      message: err.message,
      errors: err.errors,
    });
  }
  const statusCode = err.statusCode ?? res.statusCode ?? 500;
  res.status(statusCode).json({
    success: false,
    message: err.message || "Something went wrong",
    ...(process.env.NODE_ENV !== "production" && { stack: err.stack }),
    error: err.errors
      ? Object.values(err.errors).map((error) => error.message)
      : null,
  });
};
export default errorMiddleware;
