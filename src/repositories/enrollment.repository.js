import pool from '../config/database.js';

export const findEnrollment = async (courseId, userId) => {
  const [rows] = await pool.execute(
    'SELECT * FROM course_members WHERE course_id = ? AND user_id = ?',
    [courseId, userId]
  );
  return rows.length > 0 ? rows[0] : null;
};

export const createEnrollment = async (courseId, userId) => {
  const conn = await pool.getConnection();
  try {
    await conn.beginTransaction();

    const [result] = await conn.execute(
      `INSERT INTO course_members (course_id, user_id, status, joined_at, created_at, updated_at)
       VALUES (?, ?, 'active', NOW(), NOW(), NOW())`,
      [courseId, userId]
    );

    await conn.commit();
    return result.insertId;
  } catch (error) {
    await conn.rollback();
    throw error;
  } finally {
    conn.release();
  }
};

export const deleteEnrollment = async (courseId, userId) => {
  await pool.execute(
    'DELETE FROM course_members WHERE course_id = ? AND user_id = ?',
    [courseId, userId]
  );
};

export const findMembersByCourseId = async (courseId, { limit, offset }) => {
  const [rows] = await pool.execute(
    `SELECT u.id, u.name, u.email, cm.status, cm.joined_at
     FROM course_members cm
     JOIN users u ON cm.user_id = u.id
     WHERE cm.course_id = ?
     ORDER BY cm.joined_at DESC
     LIMIT ? OFFSET ?`,
    [courseId, limit.toString(), offset.toString()]
  );
  return rows;
};

export const countMembersByCourseId = async (courseId) => {
  const [rows] = await pool.execute(
    'SELECT COUNT(*) as total FROM course_members WHERE course_id = ?',
    [courseId]
  );
  return rows[0].total;
};

export const findEnrolledCoursesByUserId = async (userId, { limit, offset }) => {
  const [rows] = await pool.execute(
    `SELECT c.id, c.title, c.slug, c.thumbnail, c.status, c.created_at,
            u.name as trainer_name, cm.status as enrollment_status, cm.joined_at
     FROM course_members cm
     JOIN courses c ON cm.course_id = c.id
     JOIN users u ON c.trainer_id = u.id
     WHERE cm.user_id = ?
     ORDER BY cm.joined_at DESC
     LIMIT ? OFFSET ?`,
    [userId, limit.toString(), offset.toString()]
  );
  return rows;
};

export const countEnrolledCoursesByUserId = async (userId) => {
  const [rows] = await pool.execute(
    'SELECT COUNT(*) as total FROM course_members WHERE user_id = ?',
    [userId]
  );
  return rows[0].total;
};
