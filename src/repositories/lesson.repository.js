import pool from '../config/database.js';

export const createLesson = async (lessonData) => {
  const { moduleId, title, description = null, content = null, type = 'material', videoUrl = null, sortOrder } = lessonData;
  const [result] = await pool.execute(
    'INSERT INTO lessons (module_id, title, description, content, type, video_url, sort_order, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?, NOW(), NOW())',
    [moduleId, title, description, content, type, videoUrl, sortOrder]
  );
  return result.insertId;
};

export const findLessonById = async (id) => {
  const [rows] = await pool.execute(
    'SELECT * FROM lessons WHERE id = ?',
    [id]
  );
  return rows.length > 0 ? rows[0] : null;
};

export const findLessonsByModuleId = async (moduleId) => {
  const [rows] = await pool.execute(
    'SELECT * FROM lessons WHERE module_id = ? ORDER BY sort_order ASC, created_at ASC',
    [moduleId]
  );
  return rows;
};

export const findLessonsByModuleIdWithProgress = async (moduleId, userId) => {
  const [rows] = await pool.execute(
    `SELECT l.*, COALESCE(lp.is_completed, 0) as is_completed, lp.completed_at
     FROM lessons l
     LEFT JOIN lesson_progress lp ON l.id = lp.lesson_id AND lp.user_id = ?
     WHERE l.module_id = ?
     ORDER BY l.sort_order ASC, l.created_at ASC`,
    [userId, moduleId]
  );
  return rows;
};

export const getMaxSortOrder = async (moduleId) => {
  const [rows] = await pool.execute(
    'SELECT COALESCE(MAX(sort_order), 0) as max_order FROM lessons WHERE module_id = ?',
    [moduleId]
  );
  return rows[0].max_order;
};

export const updateLesson = async (id, updateData) => {
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

  await pool.execute(`UPDATE lessons SET ${fields.join(', ')} WHERE id = ?`, params);
};

export const deleteLesson = async (id) => {
  await pool.execute('DELETE FROM lessons WHERE id = ?', [id]);
};

export const countLessonsByCourseId = async (courseId) => {
  const [rows] = await pool.execute(
    `SELECT COUNT(*) as total FROM lessons l
     JOIN modules m ON l.module_id = m.id
     WHERE m.course_id = ?`,
    [courseId]
  );
  return rows[0].total;
};
