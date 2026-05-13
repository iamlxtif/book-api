import { query } from '../config/db.js'

export const getAllUsers = async (req, res) => {
  const { rows } = await query(
    'SELECT id, email, name, role, created_at FROM users ORDER BY created_at DESC'
  )
  res.json(rows)
}