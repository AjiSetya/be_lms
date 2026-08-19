import * as userRepository from '../repositories/user.repository.js';
import { AppError } from '../utils/AppError.js';
import { hashPassword } from '../utils/password.js';

export const getUsers = async ({ page = 1, limit = 10, search = '' }) => {
  const parsedPage = parseInt(page, 10) || 1;
  const parsedLimit = parseInt(limit, 10) || 10;
  
  // Ensure reasonable limits
  const finalLimit = Math.min(Math.max(parsedLimit, 1), 100);
  const offset = (parsedPage - 1) * finalLimit;

  const users = await userRepository.findAllUsers({ limit: finalLimit, offset, search });
  const total = await userRepository.countUsers(search);

  return {
    users,
    meta: {
      page: parsedPage,
      limit: finalLimit,
      total,
      totalPages: Math.ceil(total / finalLimit)
    }
  };
};

export const getUserById = async (id) => {
  const user = await userRepository.findUserById(id);
  if (!user) {
    throw new AppError('User not found', 404);
  }
  
  // Exclude password_hash
  const { password_hash, ...userWithoutPassword } = user;
  return userWithoutPassword;
};

export const updateProfile = async (id, updateData) => {
  const user = await userRepository.findUserById(id);
  if (!user) {
    throw new AppError('User not found', 404);
  }

  // Check if new email is already taken by another user
  if (updateData.email && updateData.email !== user.email) {
    const existingUser = await userRepository.findUserByEmail(updateData.email);
    if (existingUser) {
      throw new AppError('Email is already in use by another account', 409);
    }
  }

  const finalUpdateData = {
    name: updateData.name || user.name,
    email: updateData.email || user.email,
    role: updateData.role || user.role,
    password_hash: updateData.password ? await hashPassword(updateData.password) : user.password_hash,
    profile_photo: updateData.profilePhoto !== undefined ? updateData.profilePhoto : user.profile_photo
  };

  await userRepository.updateUser(id, finalUpdateData);
  
  return {
    id,
    name: finalUpdateData.name,
    email: finalUpdateData.email,
    role: finalUpdateData.role,
    profilePhoto: finalUpdateData.profile_photo
  };
};

export const updateStatus = async (id, isActive) => {
  const user = await userRepository.findUserById(id);
  if (!user) {
    throw new AppError('User not found', 404);
  }

  await userRepository.updateUserStatus(id, isActive);
  
  return {
    id,
    name: user.name,
    email: user.email,
    is_active: isActive
  };
};
