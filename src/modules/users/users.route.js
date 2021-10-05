import { Router } from 'express'
import controller from './users.controller'
import { authRole } from '../../middlewares/auth'

const router = Router()

router.post('/login', controller.login)
router.get('/list', authRole, controller.list)
router.post('/create', authRole, controller.create)
router.post('/register', controller.register)
router.put('/update/:_id', authRole, controller.update)
router.delete('/delete/:_id', authRole, controller.delete)
router.put('/change-status/:_id', authRole, controller.changeStatus)
router.put('/update-profile', authRole, controller.updateProfile)

export default router