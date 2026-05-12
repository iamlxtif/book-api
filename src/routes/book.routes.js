import {Router} from 'express'
import { createBook, deleteBook, getbook, getbooks, updateBook } from '../controllers/books.controller.js'
import { validate } from '../middleware/validate.js'
import { createBookValidator } from '../validators/book.validators.js'
import { writeLimiter } from '../middleware/rateLimiter.js'
import { authenticate } from '../middleware/auth.js'

const router = Router()

router.get('/', getbooks)
router.get('/:id', getbook)
router.post('/', authenticate, createBookValidator, writeLimiter, validate, createBook)
router.put('/:id', authenticate, writeLimiter, updateBook)
router.delete('/:id', authenticate, writeLimiter, deleteBook)

export default router