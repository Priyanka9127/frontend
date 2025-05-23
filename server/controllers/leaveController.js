import Employee from '../models/Employee.js';
import Leave from '../models/Leave.js';

const addLeave = async (req, res) => {
  try {
    const { userId, leaveType, startDate, endDate, reason } = req.body;
    const employee = await Employee.findOne({ userId });

    const newLeave = new Leave({ // Fixed: Added 'new' keyword to create Leave instance
      employeeId: employee._id,
      leaveType,
      startDate,
      endDate,
      reason,
    });
    await newLeave.save();

    return res.status(200).json({ success: true });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'leave add server error' });
  }
};

const getLeave = async (req, res) => {
  try {
    const { id, role } = req.params;
    let leaves;
    if (role === 'admin') {
      leaves = await Leave.find({ employeeId: id });
    } else {
      const employee = await Employee.findOne({ userId: id });
      if (!employee) { // Added error handling for missing employee
        return res.status(404).json({ success: false, message: 'Employee not found' });
      }
      leaves = await Leave.find({ employeeId: employee._id });
    }

    return res.status(200).json({ success: true, leaves });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'leave fetch server error' }); // Fixed error message
  }
};

const getLeaves = async (req, res) => {
  try {
    const leaves = await Leave.find().populate({
      path: 'employeeId',
      populate: [
        {
          path: 'department',
          select: 'dep_name',
        },
        {
          path: 'userId',
          select: 'name',
        },
      ],
    });

    return res.status(200).json({ success: true, leaves });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'leaves fetch server error' }); // Fixed error message
  }
};

const getLeaveDetail = async (req, res) => {
  try {
    const { id } = req.params;
    const leave = await Leave.findById({ _id: id }).populate({
      path: 'employeeId',
      populate: [
        {
          path: 'department',
          select: 'dep_name',
        },
        {
          path: 'userId',
          select: 'name profileImage', // Fixed: Added space between 'name' and 'profileImage'
        },
      ],
    });

    // Add this check: If leave is not found, return 404
    if (!leave) {
        return res.status(404).json({ success: false, message: 'Leave not found' });
    }

    return res.status(200).json({ success: true, leave });
  } catch (error) {
    console.error("Error in getLeaveDetail:", error); // <-- ADD THIS LINE
    return res.status(500).json({ success: false, message: 'leave detail fetch server error' });
  }
};

const updateLeave = async (req, res) => {
  try {
    const { id } = req.params;
    const leave = await Leave.findByIdAndUpdate({ _id: id }, { status: req.body.status });
    if (!leave) {
      return res.status(404).json({ success: false, message: 'leave not found' }); // Fixed typo: 'founded' to 'found'
    }
    return res.status(200).json({ success: true });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'leave update server error' });
  }
};

export { addLeave, getLeave, getLeaves, getLeaveDetail, updateLeave };