import jwt from 'jsonwebtoken'
import bcrypt from 'bcryptjs'
import { query } from '../config/db.js'
import { AppError } from '../utils/AppError.js'

// -------------------------------------------------------
// POST /api/auth/register
// Body: { email, password, name }
// -------------------------------------------------------
export const register = async (req, res) => {
    const { email, password, name } = req.body

    if (!email || !password){
        throw new AppError('Email and password are required', 400)
    }

    const existing = await query(
        `select id from users where email = $1`,
        [email]
    )

    if (existing.rows.length > 0){
        throw new AppError('Email already registered', 409)
    }

    const password_hash = await bcrypt.hash(password, 12)

    const { rows } = await query(
        `insert into users (email, password_hash, name) values ($1, $2, $3)
        returning id, email, name, role`,
        [email, password_hash, name]
    )

    const token = jwt.sign(
        { userId: rows[0].id, role: rows[0].role },
        process.env.JWT_SECRET,
        { expiresIn: '7d' }
    )

    res.status(201).json({ user: rows[0], token })
}

// -------------------------------------------------------
// POST /api/auth/login
// Body: { email, password }
// -------------------------------------------------------
export const login = async (req, res) => {
  const { email, password } = req.body

  if (!email || !password) {
    throw new AppError('Email and password are required', 400)
  }

  const { rows } = await query(
    `select * from users where email = $1`,
    [email]
  )

  const valid = rows.length > 0 ? await bcrypt.compare(password, rows[0].password_hash) : false

  if (!rows.length || !valid){
    throw new AppError('Invalid credentials', 401)
  }

  const token = jwt.sign(
    { userId: rows[0].id, role: rows[0].role },
    process.env.JWT_SECRET,
    { expiresIn: '7d' }
  )

  res.json({
    user:{
        id: rows[0].id,
        email: rows[0].email,
        name: rows[0].name,
        role: rows[0].role
    },
    token
  })
}


export const getMe = async (req, res) => {
  const { rows } = await query(
    `select id, email, name, role, created_at from users where id = $1`,
    [req.user.userId]
  )

  if (!rows[0]){
    throw new AppError('User not found', 404)
  }

  res.json(rows[0])
}