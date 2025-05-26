import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import DataTable from 'react-data-table-component';
import axios from 'axios';
import { columns, AttendanceHelper } from '../../utils/AttendanceHelper';

const Attendance = () => {
  const [attendance, setAttendance] = useState([]);
  const [loading, setLoading] = useState(false);
  const [filteredAttendance, setFilteredAttendance] = useState(null);

  const statusChange = () => {
    fetchAttendance();
  };

  const fetchAttendance = async () => {
    setLoading(true);
    try {
      const response = await axios.get('http://localhost:5000/api/attendance', {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      if (response.data.success) {
        let sno = 1;
        const data = response.data.attendance.map((att) => {
          console.log('Attendance Record:', att); // Debug: Log each record
          return {
            employeeId: att.employeeId.employeeId,
            sno: sno++,
            department: att.employeeId.department.dep_name,
            name: att.employeeId.userId.name,
            action: (
              <AttendanceHelper
                status={att.status ?? null} // Handle undefined status
                employeeId={att.employeeId.employeeId}
                statusChange={statusChange}
              />
            ),
          };
        });
        
        setAttendance(data);
        setFilteredAttendance(data);
      }
    } catch (error) {
      if (error.response && error.response.data && !error.response.data.success) {
        alert(error.response.data.message);
      } else {
        console.error('An unexpected error occurred during employee fetch:', error);
      }
      setFilteredAttendance([]); // Fallback to empty array on error
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAttendance();
  }, []);

  const handleFilter = (e) => {
    const searchText = e.target.value.toLowerCase();
    const records = attendance.filter((emp) =>
      emp.name.toLowerCase().includes(searchText) // Filter by name
    );
    setFilteredAttendance(records);
  };

  // Format date in IST
  const getLocalDate = () => {
  const date = new Date();
  const options = { timeZone: 'Asia/Kolkata', year: 'numeric', month: '2-digit', day: '2-digit' };
  return new Date().toLocaleDateString('en-CA', options); // Directly return YYYY-MM-DD
};

  if (!filteredAttendance) {
    return <div>Loading ...</div>;
  }

  return (
    <div className="p-6">
      <div className="text-center">
        <h3 className="text-2xl font-bold">Manage Attendance</h3>
      </div>
      <div className="flex justify-between items-center mt-4">
        <input
          type="text"
          placeholder="Search By Name"
          className="px-4 py-0.5 border"
          onChange={handleFilter}
        />
        <p className="text-xl">
          Mark Employees for{' '}
          <span className="font-bold underline">
            {getLocalDate()}
          </span>
        </p>
        <Link
          to="/admin-dashboard/attendance-report"
          className="px-4 py-1 bg-red-600 rounded text-white"
        >
          Attendance Report
        </Link>
      </div>
      <div className="mt-5">
        <DataTable columns={columns} data={filteredAttendance} pagination />
      </div>
    </div>
  );
};

export default Attendance;