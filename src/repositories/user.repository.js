import pool from '../config/database.js';

export const findUserByEmail = async (email) => {
  const [rows] = await pool.execute(
    'SELECT * FROM users WHERE email = ?',
    [email]
  );
  return rows.length > 0 ? rows[0] : null;
};

export const findUserById = async (id) => {
  const [rows] = await pool.execute(
    'SELECT * FROM users WHERE id = ?',
    [id]
  );
  return rows.length > 0 ? rows[0] : null;
};

export const createUser = async (userData) => {
  const { name, email, passwordHash, role = 'user', isActive = true } = userData;
  const [result] = await pool.execute(
    'INSERT INTO users (name, email, password_hash, role, is_active, created_at, updated_at) VALUES (?, ?, ?, ?, ?, NOW(), NOW())',
    [name, email, passwordHash, role, isActive]
  );
  
  return {
    id: result.insertId,
    name,
    email,
    role,
    isActive
  };
};

export const findAllUsers = async ({ limit, offset, search }) => {
  let query = 'SELECT id, name, email, role, profile_photo, is_active, created_at, updated_at FROM users';
  const queryParams = [];

  if (search) {
    query += ' WHERE name LIKE ? OR email LIKE ?';
    queryParams.push(`%${search}%`, `%${search}%`);
  }

  query += ' ORDER BY created_at DESC LIMIT ? OFFSET ?';
  queryParams.push(limit.toString(), offset.toString());

  const [rows] = await pool.execute(query, queryParams);
  return rows;
};

export const countUsers = async (search) => {
  let query = 'SELECT COUNT(*) as total FROM users';
  const queryParams = [];

  if (search) {
    query += ' WHERE name LIKE ? OR email LIKE ?';
    queryParams.push(`%${search}%`, `%${search}%`);
  }

  const [rows] = await pool.execute(query, queryParams);
  return rows[0].total;
};

export const updateUser = async (id, updateData) => {
  const { name, email, role, password_hash, profile_photo } = updateData;
  await pool.execute(
    'UPDATE users SET name = ?, email = ?, role = ?, password_hash = ?, profile_photo = ?, updated_at = NOW() WHERE id = ?',
    [name, email, role, password_hash, profile_photo, id]
  );
};

export const updateUserStatus = async (id, isActive) => {
  await pool.execute(
    'UPDATE users SET is_active = ?, updated_at = NOW() WHERE id = ?',
    [isActive, id]
  );
};
