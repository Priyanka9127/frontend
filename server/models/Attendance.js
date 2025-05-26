// backend/models/Attendance.js
import mongoose from 'mongoose';

const attendanceSchema = new mongoose.Schema({
    employeeId: { // <--- CONFIRM THIS FIELD NAME
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Employee',
        required: true
    },
    date: {
        type: String, // <--- CHANGED TO STRING AS PER YOUR CURRENT CODE'S BEHAVIOR
        required: true // e.g., "2025-05-25"
    },
    status: {
        type: String,
        enum: ['Present', 'Absent', 'Late', 'Half-Day', 'Sick'],
        default: 'Pending'
    },
    checkIn: {
        type: Date, // Keep Date for time, for sorting and proper formatting later
    },
    checkOut: {
        type: Date, // Keep Date for time
    },
}, { timestamps: true });

const Attendance = mongoose.model('Attendance', attendanceSchema);
export default Attendance;