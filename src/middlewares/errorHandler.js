import mongoose from "mongoose";
import { ZodError } from "zod";

// Helpers
const normalizeMongooseCastError = (err) => {
  return {
    statusCode: 400,
    message: `Invalid ${err.path}: ${err.value}`,
  };
};

const normalizeMongooseValidationError = (err) => {
  const messages = Object.values(err.errors || {}).map((e) => e.message);
  return {
    statusCode: 400,
    message: messages.length ? messages.join(". ") : "Invalid input data",
  };
};

const normalizeMongoDuplicateKeyError = (err) => {
  // err.keyValue example: { email: "test@mail.com" }
  const fields = err.keyValue ? Object.entries(err.keyValue) : [];
  const fieldStr = fields.length
    ? fields.map(([k, v]) => `${k}: ${v}`).join(", ")
    : "duplicate value";

  return {
    statusCode: 409,
    message: `Duplicate field value (${fieldStr}). Please use another value.`,
  };
};

const normalizeZodError = (err) => {
  const message = err.issues
    .map((i) => {
      // nicer "required" messages
      if (i.code === "invalid_type" && i.received === "undefined") {
        const field = i.path?.[0] ?? "field";
        return `${field} is required`;
      }
      return i.message;
    })
    .join(". ");

  return {
    statusCode: 400,
    message: message || "Invalid input",
  };
};

export const errorHandler = (err, req, res, next) => {
  const isDev = process.env.NODE_ENV === "development";

  let statusCode = err.statusCode || 500;
  let message = err.message || "Something went wrong!";

  // Invalid object id
  if (err instanceof mongoose.Error.CastError) {
    const out = normalizeMongooseCastError(err);
    statusCode = out.statusCode;
    message = out.message;
  }

  // Schema validation error
  if (err instanceof mongoose.Error.ValidationError) {
    const out = normalizeMongooseValidationError(err);
    statusCode = out.statusCode;
    message = out.message;
  }

  // Duplicate error
  if (err && err.code === 11000) {
    const out = normalizeMongoDuplicateKeyError(err);
    statusCode = out.statusCode;
    message = out.message;
  }

  // Zod validation error
  if (err instanceof ZodError) {
    const out = normalizeZodError(err);
    statusCode = out.statusCode;
    message = out.message;
  }

  // Jwt error
  if (err.name === "JsonWebTokenError") {
    statusCode = 401;
    message = "Invalid token. Please login again.";
  }

  if (err.name === "TokenExpiredError") {
    statusCode = 401;
    message = "Your token has expired. Please login again.";
  }

  const isOperational = err.isOperational === true;

  if (!isDev && !isOperational && statusCode === 500) {
    message = "Internal server error";
  }

  res.status(statusCode).json({
    status: `${statusCode}`.startsWith("4") ? "fail" : "error",
    message,
    ...(isDev ? { stack: err.stack, name: err.name } : {}),
  });
};
