import { createUser } from "./user.js";
import jwt from "jsonwebtoken";
import NotFoundError from "../errors/not-found-error.js";
import UnauthorizedError from "../errors/unauthorized-error.js";
import User from "../models/user.js";
import { compare } from "bcrypt";

export const register = async (userData) => {
  const user = await createUser(userData);

  const token = jwt.sign(
    { userId: user._id.toString() },
    process.env.JWT_SECRET_KEY,
    {
      expiresIn: process.env.JWT_EXPIRES_IN,
    }
  );
  return {
    token,
    user,
  };
};
export const login = async (userData) => {
  const user = await User.findOne({ email: userData.email });
  if (!user) {
    throw new NotFoundError("This email is not registered");
  }
  const isPasswordValid = await compare(userData.password, user.password);
  if (!isPasswordValid) {
    throw new UnauthorizedError("Invalid credintials");
  }
  const token = jwt.sign(
    { userId: user._id.toString() },
    process.env.JWT_SECRET_KEY,
    {
      expiresIn: process.env.JWT_EXPIRES_IN,
    }
  );
  return {
    token,
    user,
  };
};
