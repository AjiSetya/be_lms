import pool from '../config/database.js';

export const createCourse = async (courseData) => {
  const { trainerId, title, slug, description = null, thumbnail = null, status = 'draft' } = courseData;
  const [result] = await pool.execute(
    'INSERT INTO courses (trainer_id, title, slug, description, thumbnail, status, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, NOW(), NOW())',
    [trainerId, title, slug, description, thumbnail, status]
  );
  return result.insertId;
};

export const findCourseById = async (id) => {
  const [rows] = await pool.execute(
    'SELECT c.*, u.name as trainer_name FROM courses c JOIN users u ON c.trainer_id = u.id WHERE c.id = ?',
    [id]
  );
  return rows.length > 0 ? rows[0] : null;
};

export const findCourseBySlug = async (slug) => {
  const [rows] = await pool.execute(
    'SELECT * FROM courses WHERE slug = ?',
    [slug]
  );
  return rows.length > 0 ? rows[0] : null;
};

export const findAllCourses = async ({ limit, offset, search, status = 'published' }) => {
  let query = 'SELECT c.id, c.title, c.slug, c.thumbnail, c.description, c.status, c.created_at, u.name as trainer_name FROM courses c JOIN users u ON c.trainer_id = u.id WHERE c.status = ?';
  const queryParams = [status];

  if (search) {
    query += ' AND (c.title LIKE ? OR c.description LIKE ?)';
    queryParams.push(`%${search}%`, `%${search}%`);
  }

  query += ' ORDER BY c.created_at DESC LIMIT ? OFFSET ?';
  queryParams.push(limit.toString(), offset.toString());

  const [rows] = await pool.execute(query, queryParams);
  return rows;
};

export const countAllCourses = async ({ search, status = 'published' }) => {
  let query = 'SELECT COUNT(*) as total FROM courses c WHERE c.status = ?';
  const queryParams = [status];

  if (search) {
    query += ' AND (c.title LIKE ? OR c.description LIKE ?)';
    queryParams.push(`%${search}%`, `%${search}%`);
  }

  const [rows] = await pool.execute(query, queryParams);
  return rows[0].total;
};

export const findCoursesByTrainerId = async (trainerId, { limit, offset, search }) => {
  let query = 'SELECT id, title, slug, thumbnail, status, created_at FROM courses WHERE trainer_id = ?';
  const queryParams = [trainerId];

  if (search) {
    query += ' AND title LIKE ?';
    queryParams.push(`%${search}%`);
  }

  query += ' ORDER BY created_at DESC LIMIT ? OFFSET ?';
  queryParams.push(limit.toString(), offset.toString());

  const [rows] = await pool.execute(query, queryParams);
  return rows;
};

export const countCoursesByTrainerId = async (trainerId, search) => {
  let query = 'SELECT COUNT(*) as total FROM courses WHERE trainer_id = ?';
  const queryParams = [trainerId];

  if (search) {
    query += ' AND title LIKE ?';
    queryParams.push(`%${search}%`);
  }

  const [rows] = await pool.execute(query, queryParams);
  return rows[0].total;
};

export const updateCourse = async (id, updateData) => {
  const fields = [];
  const params = [];

  for (const [key, value] of Object.entries(updateData)) {
    if (value !== undefined) {
      fields.push(`${key} = ?`);
      params.push(value);
    }
  }

  if (fields.length === 0) return;

  fields.push('updated_at = NOW()');
  params.push(id);

  const query = `UPDATE courses SET ${fields.join(', ')} WHERE id = ?`;
  await pool.execute(query, params);
};

export const deleteCourse = async (id) => {
  await pool.execute('DELETE FROM courses WHERE id = ?', [id]);
};
