import pool from '../config/database.js';

export const createModule = async (moduleData) => {
  const { courseId, title, description = null, sortOrder } = moduleData;
  const [result] = await pool.execute(
    'INSERT INTO modules (course_id, title, description, sort_order, created_at, updated_at) VALUES (?, ?, ?, ?, NOW(), NOW())',
    [courseId, title, description, sortOrder]
  );
  return result.insertId;
};

export const findModuleById = async (id) => {
  const [rows] = await pool.execute(
    'SELECT * FROM modules WHERE id = ?',
    [id]
  );
  return rows.length > 0 ? rows[0] : null;
};

export const findModulesByCourseId = async (courseId) => {
  const [rows] = await pool.execute(
    'SELECT * FROM modules WHERE course_id = ? ORDER BY sort_order ASC, created_at ASC',
    [courseId]
  );
  return rows;
};

export const getMaxSortOrder = async (courseId) => {
  const [rows] = await pool.execute(
    'SELECT COALESCE(MAX(sort_order), 0) as max_order FROM modules WHERE course_id = ?',
    [courseId]
  );
  return rows[0].max_order;
};

export const updateModule = async (id, updateData) => {
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

  await pool.execute(`UPDATE modules SET ${fields.join(', ')} WHERE id = ?`, params);
};

export const deleteModule = async (id) => {
  await pool.execute('DELETE FROM modules WHERE id = ?', [id]);
};
