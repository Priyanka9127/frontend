import express from 'express';
import authMiddleware from '../middleware/authMiddleware.js';
import { addLeave, getLeave, getLeaves, getLeaveDetail, updateLeave } from '../controllers/leaveController.js';

const router = express.Router();

router.post('/add', authMiddleware, addLeave);
// More specific routes first
router.get('/detail/:id', authMiddleware, getLeaveDetail); // Keep this at the top for details
router.get('/:id/:role', authMiddleware, getLeave); // This one is still specific to id and role
router.get('/', authMiddleware, getLeaves); // General "get all leaves"
router.put('/:id', authMiddleware, updateLeave);

export default router;