import bcrypt from "bcryptjs";
import Employee from "../models/Employee.js";
import User from "../models/User.js";
import multer from "multer";
import path from "path";
import fs from "fs";
import Department from "../models/Department.js";



// Ensure upload folder exists
const uploadPath = "public/uploads";
if (!fs.existsSync(uploadPath)) {
  fs.mkdirSync(uploadPath, { recursive: true });
}

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "public/uploads");
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});

const upload = multer({ storage: storage });

const addEmployee = async (req, res) => {
  try {
    const {
      name,
      email,
      employeeId,
      dob,
      gender,
      maritalStatus,
      designation,
      department,
      salary,
      password,
      role,
    } = req.body;


    if (!name || !email || !password || !employeeId || !department || !salary) {
      return res.status(400).json({ success: false, error: "Missing required fields" });
    }

    const user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ success: false, error: "User with this email already exists" });
    }

    const hashPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      name,
      email,
      password: hashPassword,
      role,
      profileImage: req.file ? req.file.filename : ""

    });

    const savedUser = await newUser.save();

    const newEmployee = new Employee({
      userId: savedUser._id,
      employeeId,
      dob,
      gender,
      maritalStatus,
      designation,
      department,
      salary,
    });
    

    await newEmployee.save();
    return res.status(200).json({ success: true, message: "Employee added successfully" });

  } catch (error) {
    console.error("Add Employee Error:", error);
    return res.status(500).json({ success: false, error: "Server error in adding employee" });
  }
};

const getEmployees = async (req, res) => {
  try {
    const employees = await Employee.find()
      .populate({ path: 'userId', select: '-password' })
      .populate('department');
    return res.status(200).json({ success: true, employees });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, error: "Server error in getting employees" });
  }
};

const getEmployee = async (req, res) => {
  const { id } = req.params;
  try {
    let employee;
      employee = await Employee.findById({_id:id})
      .populate({ path: 'userId', select: '-password' })
      .populate('department');

    if (!employee) {
      employee= await Employee.findOne({userId: id})
      .populate({ path: 'userId', select: '-password' })
      .populate('department');
    }

    return res.status(200).json({ success: true, employee });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, error: "Server error in getting employee" });
  }
};

const updateEmployee = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      name,
      maritalStatus,
      designation,
      department,
      salary,
    } = req.body;

    const employee = await Employee.findById(id);
    if (!employee) {
      return res.status(404).json({ success: false, error: "Employee not found" });
    }

    const user = await User.findById(employee.userId);
    if (!user) {
      return res.status(404).json({ success: false, error: "User not found" });
    }

    const userUpdateData = { name };
    if (req.file) {
      userUpdateData.profileImage = req.file.filename;
    }

    await User.findByIdAndUpdate(user._id, userUpdateData, { new: true });

    const updatedEmployee = await Employee.findByIdAndUpdate(id, {
      maritalStatus,
      designation,
      department,
      salary
    }, { new: true });

    return res.status(200).json({ success: true, message: "Employee updated successfully", updatedEmployee });

  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, error: "Server error in updating employee" });
  }
};

const fetchEmployeesByDepId = async (req, res) => {
  const { id } = req.params;
  try {
    const employees = await Employee.find({ department: id })
  .populate({ path: "userId", select: "-password" });

    return res.status(200).json({ success: true, employees });
  } catch (error) {
    return res.status(500).json({ success: false, error: "Server error in getting employeebyDepId" });
  }

}

export { addEmployee, upload, getEmployees, getEmployee, updateEmployee, fetchEmployeesByDepId };
