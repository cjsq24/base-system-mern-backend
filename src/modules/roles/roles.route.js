import { Router } from 'express';
import { auth, authRole } from '../../middlewares/auth.js';
import controller from './roles.controller';

const router = Router();

router.get('/list', auth, controller.list)
router.post('/create', authRole, controller.create)
router.put('/update/:_id', authRole, controller.update)
router.delete('/delete/:_id', authRole, controller.delete)
router.put('/change-status/:_id', authRole, controller.changeStatus)

export default router;