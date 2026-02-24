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

const login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) return next(new AppError("Please enter email and password", 400));

  const user = await authService.findUserByEmail(email);

  if (!user) return next(new AppError("Invalid email or password", 401));

  const ok = await user.comparePassword(password);
  if (!ok) return next(new AppError("Invalid email or password", 401));

  const token = sighToken(user._id);

  res.status(200).json({
    status: "success",
    token,
    data: {
      user: { id: user._id, name: user.name, email: user.email, role: user.role },
    },
  });
});

const getMe = (req, res) => {
  res.status(200).json({
    status: "success",
    data: {
      user: {
        id: req.user._id,
        name: req.user.name,
        email: req.user.email,
        role: req.user.role,
      },
    },
  });
};

export default { register, login, getMe };
