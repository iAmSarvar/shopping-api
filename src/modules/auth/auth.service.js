import { User } from "../user/user.model.js";

const createUser = async (data) => {
  return User.create(data);
};

const findUserByEmail = async (email) => {
  return User.findOne({ email }).select("+password");
};

const findUserPublicByEmail = async (email) => {
  return User.findOne({ email });
};

export default { createUser, findUserByEmail, findUserPublicByEmail };
