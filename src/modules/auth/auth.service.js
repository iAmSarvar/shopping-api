import { User } from "../user/user.model.js";

const createUser = async (data) => {
  return User.create(data);
};

const findUserByEmail = async (email) => {
  return User.findOne({ email }).select("+password");
};

export default { createUser, findUserByEmail };
