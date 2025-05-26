// frontend/src/pages/Attendance.jsx

import React from 'react';
import { useState, useEffect } from 'react';
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
                const data = response.data.attendance.map((att) => ({
                    sno: sno++,
                    employeeId: att.employeeId.employeeId,
                    department: att.employeeId.department.dep_name,
                    name: att.employeeId.userId.name,
                    checkIn: att.checkIn, // Pass checkIn to DataTable column
                    checkOut: att.checkOut, // Pass checkOut to DataTable column
                    action: (
                        <AttendanceHelper
                            status={att.status}
                            employeeId={att.employeeId.employeeId}
                            statusChange={statusChange}
                            checkInTime={att.checkIn} // <--- NEW: Pass checkInTime to helper
                            checkOutTime={att.checkOut} // <--- NEW: Pass checkOutTime to helper
                        />
                    ),
                }));
                setAttendance(data);
                setFilteredAttendance(data);
            }
        } catch (error) {
            if (error.response && error.response.data && !error.response.data.success) {
                alert(error.response.data.error);
            } else {
                console.error('An unexpected error occurred during attendance fetch:', error);
                alert('Failed to fetch attendance data. Please try again.');
            }
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
            emp.name.toLowerCase().includes(searchText) || emp.employeeId.toLowerCase().includes(searchText)
        );
        setFilteredAttendance(records);
    };

    if (loading || filteredAttendance === null) {
        return <div className="p-6 text-center text-gray-700">Loading attendance data...</div>;
    }

    return (
        <div className="p-6">
            <div className="text-center">
                <h3 className="text-2xl font-bold">Manage Attendance</h3>
            </div>
            <div className="flex justify-between items-center mt-4">
                <input
                    type="text"
                    placeholder="Search By Name or Employee ID"
                    className="px-4 py-0.5 border"
                    onChange={handleFilter}
                />

                <p className="text-xl">
                    Mark Employees for{' '}
                    <span className="font-bold underline">
                        {new Date().toISOString().split('T')[0]}{' '}
                    </span>
                </p>
                <Link
                    to="/admin-dashboard/attendance-report"
                    className="px-4 py-1 bg-teal-600 rounded text-white"
                >
                    Attendance Report
                </Link>
            </div>
            <div className="mt-5">
                <DataTable
                    columns={columns}
                    data={filteredAttendance}
                    pagination
                    noDataComponent={<div className="p-4 text-gray-600">No attendance records for today.</div>}
                />
            </div>
        </div>
    );
};

export default Attendance;