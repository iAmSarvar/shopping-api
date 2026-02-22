import { AppError } from "../utils/AppError.js";

const validateQuery = (schema) => (req, res, next) => {
  const result = schema.safeParse(req.query);

  if (!result.success) {
    const message = result.error.issues
      .map((i) => {
        if (i.code === "invalid_type") {
          return `Invalid input for ${i.path[0]}`;
        }
        return i.message;
      })
      .join(". ");
    return next(new AppError(message, 400));
  }

  req.validatedQuery = result.data;
  next();
};

export { validateQuery };
