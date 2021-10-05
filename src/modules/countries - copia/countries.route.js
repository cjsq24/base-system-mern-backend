import { Router } from 'express'
import controller from './countries.controller'

const router = Router()

router.get('/list', controller.list)
router.post('/create', controller.create)
router.put('/update/:_id', controller.update)
router.delete('/delete/:_id', controller.delete)
router.put('/change-status/:_id', controller.changeStatus)

export default router