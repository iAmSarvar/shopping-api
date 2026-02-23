import jwt from "jsonwebtoken";
import { catchAsync } from "../../utils/catchAsync.js";
import { AppError } from "../../utils/AppError.js";
import authService from "./auth.service.js";

const sighToken = (userId) => {
  return jwt.sign({ id: userId }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || "7d",
  });
};

const register = catchAsync(async (req, res, next) => {
  if (!process.env.JWT_SECRET) return next(new AppError("JWT_SECRET is not set", 500));

  const user = await authService.createUser(req.body);

  const token = sighToken(user._id);

  res.status(201).json({
    status: "success",
    token,
    data: {
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    },
  });
});

export default { register };
