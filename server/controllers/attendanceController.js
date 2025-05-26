// backend/controllers/attendanceController.js
import Attendance from "../models/Attendance.js";
import Employee from "../models/Employee.js";
import User from "../models/User.js";
import Department from "../models/Department.js";

const getAttendance = async (req, res) => {
    try {
        const date = new Date().toISOString().split('T')[0]; // Current date as 'YYYY-MM-DD' string

        const attendance = await Attendance.find({ date })
        .populate({
            path: "employeeId", // Confirm this matches your Attendance schema
            populate: [
                { path: "department", select: "dep_name" },
                { path: "userId", select: "name" }
            ]
        });
        // The 'attendance' array here should contain checkIn and checkOut if they exist in the DB
        // You can add a console.log here to verify:
        // console.log("Backend getAttendance data sample:", attendance.length > 0 ? attendance[0] : "No data");
        res.status(200).json({ success: true, attendance });
    } catch (error) {
        console.error("Error in getAttendance:", error.message);
        res.status(500).json({ success: false, message: error.message });
    }
};


const updateAttendance = async (req, res) => {
    try {
        const { employeeId } = req.params; // Custom employeeId string from frontend URL
        const { status, action } = req.body; // New status OR action (e.g., 'check_in', 'check_out') from frontend payload

        const todayDateString = new Date().toISOString().split('T')[0]; // Current date as 'YYYY-MM-DD' string

        const employee = await Employee.findOne({ employeeId }); // Find employee by their custom employeeId string

        if (!employee) {
            return res.status(404).json({ success: false, message: "Employee not found." });
        }

        // Find the attendance record for today for this specific employee
        // We use findOneAndUpdate with upsert: true to either find and update, or create if not found.
        let attendanceRecord = await Attendance.findOneAndUpdate(
            { employeeId: employee._id, date: todayDateString },
            {}, // Empty update object for now, we'll build it
            { new: true, upsert: true, setDefaultsOnInsert: true } // Return new doc, create if not found, apply defaults
        );

        // Debugging logs: (REMOVED THESE)
        // console.log(`Processing update for Employee ID: ${employeeId}, Date: ${todayDateString}`);
        // console.log(`Received payload - Status: ${status}, Action: ${action}`);


        // --- Handle Status Updates ---
        if (status) {
            attendanceRecord.status = status;
            // Optionally, clear check-in/out if marked Absent/Sick/Leave
            if (status === 'Absent' || status === 'Sick' || status === 'Leave') {
                attendanceRecord.checkIn = null;
                attendanceRecord.checkOut = null;
            }
            // console.log(`Status updated to: ${status}`); // REMOVED
        }

        // --- Handle Check-in/Check-out Actions ---
        if (action === 'check_in') {
            if (!attendanceRecord.checkIn) {
                attendanceRecord.checkIn = new Date(); // Set current timestamp
                // console.log(`Check-in recorded for ${employeeId} at ${attendanceRecord.checkIn}`); // REMOVED
            } else {
                // console.log(`Employee ${employeeId} already checked in.`); // REMOVED
                return res.status(200).json({ success: false, message: "Already checked in." });
            }
        } else if (action === 'check_out') {
            if (attendanceRecord.checkIn && !attendanceRecord.checkOut) {
                // Can only check out if checked in and not already checked out
                attendanceRecord.checkOut = new Date(); // Set current timestamp
                // console.log(`Check-out recorded for ${employeeId} at ${attendanceRecord.checkOut}`); // REMOVED

                // Optional: If you want to automatically set status to 'Present' upon check-out
                // if (attendanceRecord.status === 'Pending' || attendanceRecord.status === 'Late') {
                //     attendanceRecord.status = 'Present';
                // }
            } else if (!attendanceRecord.checkIn) {
                // console.log(`Employee ${employeeId} cannot check out, not checked in.`); // REMOVED
                return res.status(200).json({ success: false, message: "Cannot check out: Not checked in." });
            } else {
                // console.log(`Employee ${employeeId} already checked out.`); // REMOVED
                return res.status(200).json({ success: false, message: "Already checked out." });
            }
        }

        await attendanceRecord.save(); // Save the updated record

        res.status(200).json({ success: true, attendance: attendanceRecord });

    } catch (error) {
        console.error("Error in updateAttendance:", error.message);
        res.status(500).json({ success: false, message: error.message });
    }
};

const attendanceReport = async (req, res) => {
    try {
        const { date, limit = 5, skip = 0 } = req.query;
        const query = {};

        // If date is provided, filter by that specific date string
        if (date) {
            query.date = date;
            // console.log(`Backend: Filtering attendance report by specific date: ${date}`); // REMOVED
        } else {
            // If no date is provided, do NOT add date to query, fetch all
            // console.log("Backend: Fetching all attendance records (no date filter)."); // REMOVED
        }

        // Get total count for pagination (for the *filtered* or *all* records)
        const totalCount = await Attendance.countDocuments(query);
        // console.log(`Backend: Total records found for query: ${totalCount}`); // REMOVED

        const attendanceData = await Attendance.find(query)
            .populate({
                path: "employeeId", // CONFIRM THIS MATCHES YOUR ATTENDANCE SCHEMA
                populate: [
                    { path: "department", select: "dep_name" },
                    { path: "userId", select: "name" }
                ]
            })
            .sort({ date: -1, 'employeeId.employeeId': 1 }) // Sort by date descending, then employee ID ascending
            .limit(parseInt(limit))
            .skip(parseInt(skip));

        // console.log(`Backend: Attendance data fetched: ${attendanceData.length} records`); // REMOVED
        // if (attendanceData.length > 0) {
        //     console.log("Backend: First record example (populated):", JSON.stringify(attendanceData[0], null, 2));
        // }

        const groupData = attendanceData.reduce((result, record) => {
            const recordDate = record.date; // Use the string date directly
            if (!result[recordDate]) {
                result[recordDate] = [];
            }
            result[recordDate].push({
                employeeId: record.employeeId?.employeeId,
                employeeName: record.employeeId?.userId?.name,
                departmentName: record.employeeId?.department?.dep_name,
                status: record.status || "Not Marked",
                checkIn: record.checkIn, // Include checkIn
                checkOut: record.checkOut, // Include checkOut
            });
            return result;
        }, {});

        // console.log("Backend: Grouped Data (first 5 entries):", Object.keys(groupData).slice(0, 5).map(key => ({ [key]: groupData[key].length }))); // REMOVED

        return res.status(200).json({ success: true, groupData, total: totalCount });

    } catch (error) {
        console.error("CRITICAL ERROR in attendanceReport:", error.message);
        res.status(500).json({ success: false, message: error.message });
    }
};

// --- Function to Download Attendance as CSV ---
const downloadAttendanceCsv = async (req, res) => {
    try {
        const { date } = req.query; // Date as a string (YYYY-MM-DD)

        if (!date) {
            return res.status(400).json({ success: false, error: 'Date parameter is required for CSV download.' });
        }

        const records = await Attendance.find({ date }) // Query by date string directly
            .populate({
                path: 'employeeId', // CONFIRM THIS MATCHES YOUR ATTENDANCE SCHEMA
                select: 'employeeId userId designation department',
                populate: [
                    { path: 'userId', model: 'User', select: 'name' },
                    { path: 'department', model: 'Department', select: 'dep_name' }
                ]
            })
            .sort({ 'employeeId.employeeId': 1 }); // Sort by employee ID for consistent order

        if (records.length === 0) {
            return res.status(200).json({ success: true, message: 'No attendance records found for the specified date.' });
        }

        // --- Generate CSV String ---
        let csv = "Date,Employee ID,Employee Name,Department,Designation,Status,Check-in,Check-out\n"; // CSV Header

        records.forEach(record => {
            const recordDate = record.date || 'N/A'; // Already a YYYY-MM-DD string
            const employeeId = record.employeeId?.employeeId || 'N/A';
            const employeeName = record.employeeId?.userId?.name || 'N/A';
            const departmentName = record.employeeId?.department?.dep_name || 'N/A';
            const designation = record.employeeId?.designation || 'N/A';
            const status = record.status || 'N/A';
            const checkIn = record.checkIn ? new Date(record.checkIn).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: true }) : 'N/A';
            const checkOut = record.checkOut ? new Date(record.checkOut).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: true }) : 'N/A';

            const escapeCsv = (val) => {
                const str = String(val || '').replace(/"/g, '""');
                return `"${str}"`;
            };

            csv += `${escapeCsv(recordDate)},${escapeCsv(employeeId)},${escapeCsv(employeeName)},${escapeCsv(departmentName)},${escapeCsv(designation)},${escapeCsv(status)},${escapeCsv(checkIn)},${escapeCsv(checkOut)}\n`;
        });

        // --- Set Headers and Send CSV ---
        res.setHeader('Content-Type', 'text/csv');
        res.setHeader('Content-Disposition', `attachment; filename=attendance_report_${date}.csv`);
        res.status(200).send(csv);

    } catch (error) {
        console.error('Error generating CSV report:', error.message);
        res.status(500).json({ success: false, error: 'Failed to generate CSV report.' });
    }
};

// Export all functions at once
export { getAttendance, updateAttendance, attendanceReport, downloadAttendanceCsv };