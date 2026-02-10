import User from "../user/user.model.js";
import { hashPassword, comparePassword } from "../../utils/hash.js";
import { signToken } from "../../utils/jwt.js";

export const registerUser = async ({ username, password }) => {
  const existingUser = await User.findOne({ username });
  if (existingUser) {
    throw new Error("Username already exists");
  }

  const hashedPassword = await hashPassword(password);

  const user = await User.create({
    username,
    password: hashedPassword
  });

  return user;
};

export const loginUser = async ({ username, password }) => {
  const user = await User.findOne({ username });
  if (!user) {
    throw new Error("Invalid credentials");
  }

  const isMatch = await comparePassword(password, user.password);
  if (!isMatch) {
    throw new Error("Invalid credentials");
  }

  const token = signToken({ id: user._id });

  return {
    token,
    user: {
      id: user._id,
      username: user.username
    }
  };
};
