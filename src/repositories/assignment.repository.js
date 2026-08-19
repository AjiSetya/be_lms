import pool from '../config/database.js';

export const createAssignment = async (assignmentData) => {
  const { lessonId, title, description = null, deadline = null, maxScore = 100.00 } = assignmentData;
  const [result] = await pool.execute(
    'INSERT INTO assignments (lesson_id, title, description, deadline, max_score, created_at, updated_at) VALUES (?, ?, ?, ?, ?, NOW(), NOW())',
    [lessonId, title, description, deadline, maxScore]
  );
  return result.insertId;
};

export const findAssignmentById = async (id) => {
  const [rows] = await pool.execute('SELECT * FROM assignments WHERE id = ?', [id]);
  return rows.length > 0 ? rows[0] : null;
};

export const findAssignmentByLessonId = async (lessonId) => {
  const [rows] = await pool.execute('SELECT * FROM assignments WHERE lesson_id = ?', [lessonId]);
  return rows.length > 0 ? rows[0] : null;
};

export const updateAssignment = async (id, updateData) => {
  const fields = [];
  const params = [];

  for (const [key, value] of Object.entries(updateData)) {
    if (value !== undefined) {
      if (key === 'maxScore') fields.push('max_score = ?');
      else fields.push(`${key} = ?`);
      params.push(value);
    }
  }

  if (fields.length === 0) return;

  fields.push('updated_at = NOW()');
  params.push(id);

  await pool.execute(`UPDATE assignments SET ${fields.join(', ')} WHERE id = ?`, params);
};

export const deleteAssignment = async (id) => {
  await pool.execute('DELETE FROM assignments WHERE id = ?', [id]);
};
