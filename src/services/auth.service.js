import * as userRepository from '../repositories/user.repository.js';
import { hashPassword, comparePassword } from '../utils/password.js';
import { generateAccessToken, generateRefreshToken } from '../utils/jwt.js';
import { AppError } from '../utils/AppError.js';

export const register = async (userData) => {
  const { name, email, password } = userData;

  // Check if email already exists
  const existingUser = await userRepository.findUserByEmail(email);
  if (existingUser) {
    throw new AppError('Email is already registered', 409);
  }

  // Hash password
  const passwordHash = await hashPassword(password);

  // Default role for registration is 'user'
  const user = await userRepository.createUser({
    name,
    email,
    passwordHash,
    role: 'user',
    isActive: true
  });

  return {
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role
  };
};

export const login = async (email, password) => {
  // Check if user exists
  const user = await userRepository.findUserByEmail(email);
  if (!user) {
    throw new AppError('Invalid email or password', 401);
  }

  // Check if user is active
  if (!user.is_active) {
    throw new AppError('User account is inactive', 403);
  }

  // Compare passwords
  const isMatch = await comparePassword(password, user.password_hash);
  if (!isMatch) {
    throw new AppError('Invalid email or password', 401);
  }

  // Generate tokens
  const payload = {
    userId: user.id,
    role: user.role
  };

  const accessToken = generateAccessToken(payload);
  const refreshToken = generateRefreshToken(payload);

  return {
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role
    },
    accessToken,
    refreshToken
  };
};

export const getMe = async (userId) => {
  const user = await userRepository.findUserById(userId);
  if (!user) {
    throw new AppError('User not found', 404);
  }

  return {
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
    is_active: user.is_active
  };
};
