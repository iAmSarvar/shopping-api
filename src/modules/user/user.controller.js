import { catchAsync } from "../../utils/catchAsync.js";
import { AppError } from "../../utils/AppError.js";
import userService from "./user.service.js";

const getUsers = catchAsync(async (req, res) => {
  const { items, meta } = await userService.listUsers(req.validatedQuery || req.query);

  res.status(200).json({
    status: "success",
    meta,
    results: items.length,
    data: items.map((u) => ({
      id: u._id,
      name: u.name,
      email: u.email,
      role: u.role,
      active: u.active,
      createdAt: u.createdAt,
    })),
  });
});

const getUser = catchAsync(async (req, res, next) => {
  const user = await userService.getUserById(req.params.id);
  if (!user) return next(new AppError("User not found", 404));

  res.status(200).json({
    status: "success",
    data: {
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        active: user.active,
        createdAt: user.createdAt,
      },
    },
  });
});

const updateUser = catchAsync(async (req, res, next) => {
  const user = await userService.updateUserByIdAdmin(req.params.id, req.body);
  if (!user) return next(new AppError("User not found", 404));

  res.status(200).json({
    status: "success",
    data: {
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        active: user.active,
      },
    },
  });
});

const deleteUser = catchAsync(async (req, res, next) => {
  const user = await userService.deactivateUserById(req.params.id);
  if (!user) return next(new AppError("User not found", 404));

  res.status(204).json({ status: "success", data: null });
});

export default { getUsers, getUser, updateUser, deleteUser };
