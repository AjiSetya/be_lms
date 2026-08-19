import pool from '../config/database.js';

export const createSubmission = async (submissionData) => {
  const { assignmentId, userId, content = null, fileUrl = null } = submissionData;
  const [result] = await pool.execute(
    'INSERT INTO submissions (assignment_id, user_id, content, file_url, submitted_at, created_at, updated_at) VALUES (?, ?, ?, ?, NOW(), NOW(), NOW())',
    [assignmentId, userId, content, fileUrl]
  );
  return result.insertId;
};

export const updateSubmission = async (id, updateData) => {
  const fields = [];
  const params = [];

  for (const [key, value] of Object.entries(updateData)) {
    if (value !== undefined) {
      if (key === 'fileUrl') fields.push('file_url = ?');
      else if (key === 'reviewedBy') fields.push('reviewed_by = ?');
      else fields.push(`${key} = ?`);
      params.push(value);
    }
  }

  if (fields.length === 0) return;

  // If score or feedback is being updated, it means it's being reviewed
  if (updateData.score !== undefined || updateData.feedback !== undefined) {
    fields.push('reviewed_at = NOW()');
  }

  fields.push('updated_at = NOW()');
  params.push(id);

  await pool.execute(`UPDATE submissions SET ${fields.join(', ')} WHERE id = ?`, params);
};

export const findSubmissionById = async (id) => {
  const [rows] = await pool.execute('SELECT * FROM submissions WHERE id = ?', [id]);
  return rows.length > 0 ? rows[0] : null;
};

export const findSubmissionByAssignmentAndUser = async (assignmentId, userId) => {
  const [rows] = await pool.execute(
    'SELECT * FROM submissions WHERE assignment_id = ? AND user_id = ?',
    [assignmentId, userId]
  );
  return rows.length > 0 ? rows[0] : null;
};

export const findSubmissionsByAssignmentId = async (assignmentId, { limit, offset }) => {
  const [rows] = await pool.execute(
    `SELECT s.*, u.name as user_name, u.email as user_email
     FROM submissions s
     JOIN users u ON s.user_id = u.id
     WHERE s.assignment_id = ?
     ORDER BY s.submitted_at DESC
     LIMIT ? OFFSET ?`,
    [assignmentId, limit.toString(), offset.toString()]
  );
  return rows;
};

export const countSubmissionsByAssignmentId = async (assignmentId) => {
  const [rows] = await pool.execute(
    'SELECT COUNT(*) as total FROM submissions WHERE assignment_id = ?',
    [assignmentId]
  );
  return rows[0].total;
};
