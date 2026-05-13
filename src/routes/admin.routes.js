import { Router } from 'express'
import { authenticate } from '../middleware/auth.js'
import { authorize } from '../middleware/authorize.js'
import { asyncHandler } from '../utils/asyncHandler.js'
import { getAllUsers } from '../controllers/admin.controller.js'

const router = Router()

// All routes in this router require admin
router.use(authenticate)
router.use(authorize('admin'))

router.get('/users', asyncHandler(getAllUsers))

export default router