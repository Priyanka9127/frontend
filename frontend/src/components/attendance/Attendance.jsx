import React from 'react'
import { useState } from 'react'
import { useEffect } from 'react'
import { Link } from 'react-router-dom'
// EmployeeButton is NOT needed here directly, as it's used within columns
// import { EmployeeButton } from '../../utils/EmployeeHelper'
import DataTable from 'react-data-table-component'
import axios from 'axios'
import { columns, AttendanceHelper } from '../../utils/AttendanceHelper' // This imports your column definitions

const Attendance = () => {
    const [attendance, setAttendance] = useState([])
    const [loading, setLoading] = useState(false)
    const [filteredAttendance, setFilteredAttendance] = useState(null)

    const statusChange = () => {
      fetchAttendance();
    }

    const fetchAttendance = async () => {
      setLoading(true)
      try {
        const response = await axios.get('http://localhost:5000/api/attendance', {
          headers: {
            "Authorization": `Bearer ${localStorage.getItem("token")}`
          }
        })
        if (response.data.success) {
          let sno = 1;
          const data = response.data.attendance.map((att) => ({
              employeeId: att.employeeId.employeeId,
              sno: sno++,
              department: att.employeeId.department.dep_name,
              name: att.employeeId.userId.name,
              action: <AttendanceHelper status={att.status} employeeId={att.employeeId.employeeId} statusChange={statusChange}/>,
            }));
                setAttendance(data)
                setFilteredAttendance(data)
              }
            } catch (error) {
                if (error.response && error.response.data && !error.response.data.success) {
                    alert(error.response.data.error)
                } else {
                    console.error("An unexpected error occurred during employee fetch:", error); // Log unexpected errors
                }
            }
            finally {
                setLoading(false)
            }
        };


    useEffect(() => {      
        fetchAttendance()
    }, []); // Empty dependency array means this runs once on component mount

    const handleFilter = (e) => {
      const searchText = e.target.value.toLowerCase();
      const records = attendance.filter((emp) =>
        emp.employeeId.toLowerCase().includes(searchText)
      );
      setFilteredAttendance(records);
    };

    if (!filteredAttendance){
      return <div>Loading ...</div>
    }

    return (
        <div className='p-6'>
    <div className='text-center'>
        <h3 className='text-2xl font-bold '>
            Manage Attendance
        </h3>
    </div>
    <div className='flex justify-between items-center mt-4'>
        <input type="text"
        placeholder="Search By Name"
        className='px-4 py-0.5 border '
        onChange={handleFilter}
        />

        <p className='text-xl'>
          Mark Employees for <span className='font-bold underline'>{new Date().toISOString().split("T")[0]}{" "}</span>
        </p>
        <Link 
        to="/admin-dashboard/attendance-report" 
        className='px-4 py-1 bg-teal-600 rounded text-white'>
        Attendance Report
        </Link>
    </div>
    <div className='mt-5'> {/* This div wraps your DataTable */}
        <DataTable
        columns={columns}
        data={filteredAttendance}
        pagination/>
    </div>
</div>
    )
}


export default Attendance;
