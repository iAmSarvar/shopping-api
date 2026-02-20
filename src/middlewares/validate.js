import { AppError } from "../utils/AppError.js";

const validate = (schema) => (req, res, next) => {
  const result = schema.safeParse(req.body);

  if (!result.success) {
    const message = result.error.issues
      .map((i) => {
        if (i.code === "invalid_type") {
          return `${i.path[0]} is required`;
        }
        return i.message;
      })
      .join(". ");
    return next(new AppError(message, 400));
  }

  req.body = result.data;
  next();
};

export { validate };
