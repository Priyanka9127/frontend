// models/Attendance.js
import mongoose from "mongoose";

const AttendanceSchema = new mongoose.Schema({
    date: {
        type: String,
        required: true
    },
    employeeId: { // Uppercase 'Id' as indicated by the error
        type: mongoose.Schema.Types.ObjectId,
        ref: "Employee",
        required: true
    },
    status: {
        type: String,
        enum: ["Present", "Absent", "Sick", "Leave"],
        default: null
    }
});

const Attendance = mongoose.model("Attendance", AttendanceSchema);
export default Attendance;