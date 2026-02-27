import { User } from "./user.model.js";

const listUsers = async ({ page = 1, limit = 10 } = {}) => {
  const p = Math.max(Number(page) || 1, 1);
  const l = Math.min(Math.max(Number(limit) || 10, 1), 100);
  const skip = (p - 1) * l;

  const query = User.find().select("+active").skip(skip).limit(l).sort({ createdAt: -1 });
  const [items, total] = await Promise.all([query, User.countDocuments()]);

  const totalPages = total === 0 ? 0 : Math.ceil(total / l);

  return {
    items,
    meta: {
      page: p,
      limit: l,
      total,
      totalPages,
    },
  };
};

const getUserById = async (id) => {
  return User.findById(id).select("+active");
};

const updateUserByIdAdmin = async (id, data) => {
  const { password, passwordResetToken, passwordResetExpires, ...safe } = data;
  return User.findByIdAndUpdate(id, safe, { new: true, runValidators: true }).select("+active");
};

const deactivateUserById = async (id) => {
  return User.findByIdAndUpdate(id, { active: false }, { new: true }).select("+active");
};

export default { listUsers, deactivateUserById, getUserById, updateUserByIdAdmin };
