import pool from '../config/database.js';

export const findProgress = async (userId, lessonId) => {
  const [rows] = await pool.execute(
    'SELECT * FROM lesson_progress WHERE user_id = ? AND lesson_id = ?',
    [userId, lessonId]
  );
  return rows.length > 0 ? rows[0] : null;
};

export const upsertProgress = async (userId, lessonId, isCompleted) => {
  const completedAt = isCompleted ? 'NOW()' : 'NULL';
  const [result] = await pool.execute(
    `INSERT INTO lesson_progress (user_id, lesson_id, is_completed, completed_at, created_at, updated_at)
     VALUES (?, ?, ?, ${completedAt}, NOW(), NOW())
     ON DUPLICATE KEY UPDATE
     is_completed = VALUES(is_completed),
     completed_at = VALUES(completed_at),
     updated_at = NOW()`,
    [userId, lessonId, isCompleted ? 1 : 0]
  );
  return result;
};

// useful for getting overall progress
export const countCompletedLessonsByCourse = async (userId, courseId) => {
  const [rows] = await pool.execute(
    `SELECT COUNT(*) as total
     FROM lesson_progress lp
     JOIN lessons l ON lp.lesson_id = l.id
     JOIN modules m ON l.module_id = m.id
     WHERE lp.user_id = ? AND m.course_id = ? AND lp.is_completed = 1`,
    [userId, courseId]
  );
  return rows[0].total;
};
