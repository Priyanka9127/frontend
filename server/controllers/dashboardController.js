// backend/controllers/dashboardController.js
import Department from "../models/Department.js";
import Employee from "../models/Employee.js"
import Leave from "../models/Leave.js";


const getSummary = async (req, res) => {
    try {
        const totalEmployees = await Employee.countDocuments();
        const totalDepartments = await Department.countDocuments();

        const totalSalariesResult = await Employee.aggregate([
            { $group: { _id: null, totalSalary: { $sum: "$salary" } } }
        ]);
        const totalSalary = totalSalariesResult.length > 0 ? totalSalariesResult[0].totalSalary : 0;

        const employeeAppliedForLeave = await Leave.distinct('employeeId');

        const leaveStatusResults = await Leave.aggregate([
            {
                $group: {
                    _id: "$status",
                    count: { $sum: 1 }
                }
            }
        ]);

        const leaveSummary = {
            appliedFor: employeeAppliedForLeave.length,
            approved: leaveStatusResults.find(item => item._id === "Approved")?.count || 0,
            rejected: leaveStatusResults.find(item => item._id === "Rejected")?.count || 0,
            pending: leaveStatusResults.find(item => item._id === "Pending")?.count || 0,
        };

        // --- YOU NEED TO ADD THIS BLOCK ---
        const employeeDistributionByDepartment = await Employee.aggregate([
            {
                $group: {
                    _id: '$department', // Group by department ObjectId
                    employeeCount: { $sum: 1 } // Count employees in each group
                }
            },
            {
                $lookup: { // Join with the Department collection to get department names
                    from: 'departments', // This should be the actual collection name in MongoDB (usually lowercase and plural of model name 'Department')
                    localField: '_id',
                    foreignField: '_id',
                    as: 'departmentInfo'
                }
            },
            {
                $unwind: { // Deconstruct the array created by $lookup, preserving documents even if no match
                    path: '$departmentInfo',
                    preserveNullAndEmptyArrays: true // Keep original document if no departmentInfo found
                }
            },
            {
                $project: { // Project to get the desired output format
                    _id: 0, // Exclude _id
                    // Use 'dep_name' from departmentInfo, or a default string if no match
                    departmentName: { $ifNull: ['$departmentInfo.dep_name', 'Unknown Department'] },
                    employeeCount: 1 // Include employeeCount
                }
            }
        ]);
        // --- END OF BLOCK TO ADD ---

        return res.status(200).json({
            success: true,
            totalEmployees,
            totalDepartments,
            totalSalary,
            leaveSummary,
            employeeDistributionByDepartment // <--- Make sure you return this in the response
        });

    } catch (error) {
        console.error('Error fetching dashboard summary:', error.message);
        return res.status(500).json({ success: false, error: "Failed to fetch dashboard summary" });
    }
}

export {getSummary}