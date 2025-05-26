import Attendance from "../models/Attendance.js";
import Employee from "../models/Employee.js";

// Helper function to get the current date in IST (YYYY-MM-DD)
const getLocalDate = () => {
  const date = new Date();
  const options = { timeZone: 'Asia/Kolkata', year: 'numeric', month: '2-digit', day: '2-digit' };
  return new Date().toLocaleDateString('en-CA', options); // Directly return YYYY-MM-DD
};

const getAttendance = async (req, res) => {
  try {
    const date = getLocalDate(); // Use IST date
    // console.log('Backend Date (IST):', date); // Debug: Log the date used

    // Fetch all employees
    const employees = await Employee.find().populate(["department", "userId"]);
    // console.log('Employees Fetched:', employees.length); // Debug: Log number of employees

    if (!employees.length) {
      return res.status(404).json({ success: false, message: "No employees found" });
    }

    // Fetch existing attendance records for the date
    const attendanceRecords = await Attendance.find({ date }).populate({
      path: "employeeId",
      populate: ["department", "userId"],
    });
    // console.log('Attendance Records Fetched:', attendanceRecords.length); // Debug: Log number of records

    // Create a map of existing attendance records by employeeId
    const attendanceMap = new Map(
      attendanceRecords.map((record) => [record.employeeId._id.toString(), record])
    );

    // Build attendance data for all employees
    const attendance = employees.map((employee) => {
      const existingRecord = attendanceMap.get(employee._id.toString());
      if (existingRecord) {
        return existingRecord;
      }
      // Create a pseudo-record for employees without attendance
      return {
        employeeId: employee,
        date,
        status: null, // Default to null for unmarked attendance
      };
    });

    // console.log('Attendance Data:', attendance.map(record => ({
    //   employeeId: record.employeeId.employeeId,
    //   date: record.date,
    //   status: record.status
    // }))); // Debug: Log simplified attendance data

    res.status(200).json({ success: true, attendance });
  } catch (error) {
    console.error("Error in getAttendance:", error); // Debug: Log errors
    res.status(500).json({ success: false, message: "Failed to fetch attendance data: " + error.message });
  }
};

const updateAttendance = async (req, res) => {
  try {
    const { employeeId } = req.params; // This is the employeeId string
    const { status } = req.body;
    const date = getLocalDate(); // Use IST date
    console.log('Update Attendance Date (IST):', date); // Debug: Log the date used
    console.log('Update Request:', { employeeId, status }); // Debug: Log request data

    if (!status) {
      return res.status(400).json({ success: false, message: "Status is required" });
    }

    // Find the employee by employeeId
    const employee = await Employee.findOne({ employeeId });
    if (!employee) {
      console.log('Employee Not Found:', employeeId); // Debug: Log missing employee
      return res.status(404).json({ success: false, message: "Employee not found" });
    }

    // Check if attendance record exists, create if it doesn't
    let attendance = await Attendance.findOne({ employeeId: employee._id, date });
    if (!attendance) {
      attendance = new Attendance({
        employeeId: employee._id,
        date,
        status,
      });
    } else {
      attendance.status = status;
    }

    await attendance.save();

    // Populate the employee data in the response
    await attendance.populate({
      path: "employeeId",
      populate: ["department", "userId"],
    });

    console.log('Updated Attendance:', {
      employeeId: attendance.employeeId.employeeId,
      date: attendance.date,
      status: attendance.status
    }); // Debug: Log updated record

    res.status(200).json({ success: true, attendance });
  } catch (error) {
    console.error("Error in updateAttendance:", error); // Debug: Log errors
    res.status(500).json({ success: false, message: "Failed to update attendance: " + error.message });
  }
};

const attendanceReport = async (req, res) => {
  try {
    const { date, limit, skip } = req.query; // No default date
    // console.log('Attendance Report Query:', { date, limit, skip }); // Debug: Log query params

    const query = {};
    if (date && date !== 'all') {
      query.date = date;
    }

    // Get total records for pagination
    const total = await Attendance.countDocuments(query);
    // console.log('Total Records:', total); // Debug: Log total records

    const findQuery = Attendance.find(query)
      .populate({
        path: "employeeId",
        populate: ["department", "userId"],
      })
      .sort({ date: -1 });

    if (limit && skip !== undefined) {
      findQuery.limit(parseInt(limit)).skip(parseInt(skip));
    }

    const attendanceData = await findQuery.exec();

    // console.log('Attendance Report Records:', attendanceData.length); // Debug: Log number of records

    if (!attendanceData.length) {
      return res.status(200).json({ success: true, groupData: {}, total: 0 });
    }

    const groupData = attendanceData.reduce((result, record) => {
      if (!result[record.date]) {
        result[record.date] = [];
      }
      result[record.date].push({
        employeeId: record.employeeId.employeeId,
        employeeName: record.employeeId.userId.name,
        departmentName: record.employeeId.department.dep_name,
        status: record.status || "Not Marked",
      });
      return result;
    }, {});

    // console.log('Attendance Report Data:', groupData); // Debug: Log report data

    res.status(201).json({ success: true, groupData, total });
  } catch (error) {
    console.error("Error in attendanceReport:", error); // Debug: Log errors
    res.status(500).json({ success: false, message: "Failed to fetch attendance report: " + error.message });
  }
};

export { getAttendance, updateAttendance, attendanceReport };