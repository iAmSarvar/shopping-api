import jwt from "jsonwebtoken";
import crypto from "crypto";
import { catchAsync } from "../../utils/catchAsync.js";
import { AppError } from "../../utils/AppError.js";
import authService from "./auth.service.js";
import { sendMail } from "../../utils/email.js";
import { User } from "../user/user.model.js";

const signToken = (userId) => {
  return jwt.sign({ id: userId }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || "7d",
  });
};

const register = catchAsync(async (req, res, next) => {
  if (!process.env.JWT_SECRET) return next(new AppError("JWT_SECRET is not set", 500));

  const user = await authService.createUser(req.body);

  const token = signToken(user._id);

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

  if (!user || user.active === false) return next(new AppError("Invalid email or password", 401));

  const ok = await user.comparePassword(password);
  if (!ok) return next(new AppError("Invalid email or password", 401));

  const token = signToken(user._id);

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

const forgotPassword = catchAsync(async (req, res, next) => {
  const { email } = req.body;

  const user = await authService.findUserPublicByEmail(email);

  if (!user) {
    return res.status(200).json({
      status: "success",
      message: "If that email exists, a reset link has been sent!",
    });
  }

  const resetToken = user.createPasswordResetToken();
  await user.save({ validateBeforeSave: false });

  const resetURL = `${process.env.CLIENT_ORIGIN}/reset-password/${resetToken}`;

  try {
    await sendMail({
      to: user.email,
      subject: "Reset your password",
      html: `
        <p>You requested a password reset.</p>
        <p>Click this link to reset your password (valid for 10 minutes):</p>
        <p><a href="${resetURL}">${resetURL}</a></p>
        <p>If you did not request this, ignore this email.</p>
      `,
    });

    res.status(200).json({
      status: "success",
      message: "If that email exists, a reset link has been sent.",
    });
  } catch (error) {
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    await user.save({ validateBeforeSave: false });

    return next(new AppError("Email could not be sent. Try again later.", 500));
  }
});

const resetPassword = catchAsync(async (req, res, next) => {
  const resetToken = req.params.token;

  const hashedToken = crypto.createHash("sha256").update(resetToken).digest("hex");

  const user = await User.findOne({
    passwordResetToken: hashedToken,
    passwordResetExpires: { $gt: Date.now() },
  }).select("+password");

  if (!user) {
    return next(new AppError("Token is invalid or has expired", 400));
  }

  user.password = req.body.password;

  user.passwordResetToken = undefined;
  user.passwordResetExpires = undefined;

  await user.save();

  // auto login after password change
  const token = signToken(user._id);

  res.status(200).json({
    status: "success",
    token,
    data: {
      user: { id: user._id, name: user.name, email: user.email, role: user.role },
    },
  });
});

// update password for logged in user
const updatePassword = catchAsync(async (req, res, next) => {
  const { currentPassword, newPassword } = req.body;
  const user = await User.findById(req.user._id).select("+password");

  const ok = await user.comparePassword(currentPassword);
  if (!ok) {
    return next(new AppError("Invalid password. Please try again!", 401));
  }

  user.password = newPassword;
  await user.save();

  const token = signToken(user._id);

  res.status(200).json({
    status: "success",
    token,
    message: "Password updated successfully",
  });
});

// Update user data
const updateMe = catchAsync(async (req, res, next) => {
  const updates = {};

  if (req.body.name !== undefined) updates.name = req.body.name;
  if (req.body.email !== undefined) updates.email = req.body.email;

  if (req.body.email && req.user.email === req.body.email.toLowerCase()) {
    return next(new AppError("You're already using this email.", 400));
  }

  const user = await User.findByIdAndUpdate(req.user._id, updates, {
    runValidators: true,
    new: true,
  });

  res.status(200).json({
    status: "success",
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

const deactivateMe = catchAsync(async (req, res) => {
  await User.findByIdAndUpdate(req.user._id, { active: false });

  res.status(204).json({
    status: "success",
    data: null,
  });
});

export default {
  register,
  login,
  getMe,
  forgotPassword,
  resetPassword,
  updatePassword,
  updateMe,
  deactivateMe,
};
