// backend/routes/attendance.js
import express from 'express';
import authMiddleware from '../middleware/authMiddleware.js';
// Make sure to import the new function:
import { getAttendance, updateAttendance, attendanceReport, downloadAttendanceCsv } from '../controllers/attendanceController.js';
import defaultAttendance from '../middleware/defaultAttendance.js'

const router = express.Router();

router.get('/', authMiddleware, defaultAttendance, getAttendance);
router.put('/update/:employeeId', authMiddleware, updateAttendance);
router.get('/report', authMiddleware, attendanceReport);
router.get('/download-csv', authMiddleware, downloadAttendanceCsv); // NEW ROUTE FOR CSV DOWNLOAD

export default router;