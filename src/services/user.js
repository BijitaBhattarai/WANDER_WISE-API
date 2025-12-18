import User from "../models/user.js";
import NotFoundError from "../errors/not-found-error.js";

const createUser = async (userData) => {
  const user = await User.create(userData);
  return user;
};

const getAllUsers = async (query) => {
  const {
    page = 1,
    limit = 10,
    search = "",
    sort = "createdAt",
    order = "desc",
  } = query;
  let where = {};
  if (search) {
    where.$or = [
      { name: { $regex: search, $options: "i" } },
      { email: { $regex: search, $options: "i" } },
    ];
  }
  const total = await User.countDocuments(where);
  const totalPages = Math.ceil(total / limit);
  const users = await User.find(where)
    .skip((page - 1) * limit)
    .limit(limit)
    .sort({ [sort]: order });
  return {
    users,
    total: users.length,
    limit: +limit,
    totalPages,
  };
};

const getUserById = async (userId) => {
  const user = await User.findById(userId);
  if (!user) {
    throw new NotFoundError("User not found");
  }
};

const updateUserById = async (id, userData) => {
  const user = await User.findByIdAndUpdate(
    id,
    {
      ...(userData.name && { name: userData.name }),
      ...(userData.email && { email: userData.email }),
      ...(userData.password && { password: userData.password }),
    },
    { new: true, runValidators: true }
  );
  if (!user) {
    throw new NotFoundError("User not found");
  }
  const { password, ...userWithoutPassword } = user.toObject();
  return userWithoutPassword;
};

const deleteUserById = async (id) => {
  const user = await User.findByIdAndDelete(id);
  if (!user) {
    throw new NotFoundError("User not found");
  }
  return { message: "User deleted successfully" };
};

export { createUser, getAllUsers, getUserById, updateUserById, deleteUserById };
