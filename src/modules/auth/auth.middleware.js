import util from "util";
import jwt from "jsonwebtoken";
import { AppError } from "../../utils/AppError.js";
import { catchAsync } from "../../utils/catchAsync.js";
import { User } from "../user/user.model.js";

const protect = catchAsync(async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
    token = req.headers.authorization.split(" ")[1];
  }

  if (!token) {
    return next(new AppError("You are not logged in", 401));
  }

  const decoded = await util.promisify(jwt.verify)(token, process.env.JWT_SECRET);

  const currentUser = await User.findById(decoded.id).select("+active");

  // check if user deleted their account
  if (currentUser.active === false) {
    return next(new AppError("Your account is deactivated", 401));
  }

  if (!currentUser) {
    return next(new AppError("User no longer exists", 401));
  }

  if (currentUser.changedPasswordAfter(decoded.iat)) {
    return next(new AppError("User recently changed password. Please login!"));
  }

  req.user = currentUser;
  next();
});

const restrictTo = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return next(new AppError("You don't have permission to perform this action", 403));
    }

    next();
  };
};

export { protect, restrictTo };
