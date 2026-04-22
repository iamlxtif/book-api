import { query } from "../config/db.js"
import { NotFoundError } from "../utils/AppError.js"

let books = [
  { id: 1, title: 'The Pragmatic Programmer', author: 'Hunt & Thomas', year: 1999 },
  { id: 2, title: 'Clean Code', author: 'Robert Martin', year: 2008 },
]

export const getbooks = async (req, res) => {
    const search = req.query.search || '' 
    const page = parseInt(req.query.page) || 1
    const limit = parseInt(req.query.limit) || 10
    const offset = (page - 1) * limit
    
    const { rows } = await query(
        `select * from books
        where lower(title) like lower($1) or lower(author) like lower($1)
        order by created_at desc
        limit $2 offset $3`,
        [`%${search}%`, limit, offset]
    )

    const { rows: countRows } = await query(
        `select count(*) from books
        where lower(title) like lower($1) or lower(author) like lower($1)`,
        [`%${search}%`]
    )

    const total = parseInt(countRows[0].count)
    
    res.json({
        data: rows,
        pagination: {
            total,
            page,
            limit,
            pages: Math.ceil(total / limit)
        }
    })
}

export const getbook = async (req, res) => {
    const bookId = parseInt(req.params.id)
    const {rows} = await query(
        `select * from books
        where id = $1`, 
        [bookId]
    )
    if(!rows[0]) throw new NotFoundError('Book')
    res.json(rows[0])
}

export const createBook = async (req, res) => {
    const {title, author, year } = req.body
    const { rows } = await query(
        `insert into books(title, author, year)
        values ($1, $2, $3)
        returning *`,
        [title, author, year]
    )
    res.status(201).json(rows[0])
}

export const updateBook = async (req, res) => {
    const bookId = parseInt(req.params.id)
    const {title, author, year} = req.body
    const {rows} = await query(
        `update books
        set title = $1, author = $2, year = $3
        where id = $4
        returning *`,
        [title, author, year, bookId]
    )
    res.json(rows[0])
}

export const deleteBook = async (req,res) => {
    const bookId = parseInt(req.params.id)
    const { rows } = await query(
        `delete from books where id = $1
        returning *`,
        [bookId]
    )
    if(!rows[0]) throw new NotFoundError('Book')
    res.json(rows)
}