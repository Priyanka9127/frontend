// frontend/utils/AttendanceHelper.jsx
import axios from 'axios';
import React from 'react';

// --- No more CheckInButton or CheckOutButton as separate components ---
// We will put their logic directly into the DataTable column definitions.

// --- AttendanceHelper component (for Status actions) remains the same ---
export const AttendanceHelper = ({ status, employeeId, statusChange }) => {
    const markEmployeeStatus = async (newStatus, empId) => {
        try {
            const response = await axios.put(
                `http://localhost:5000/api/attendance/update/${empId}`,
                { status: newStatus }, // Only sending status
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('token')}`,
                    },
                }
            );

            if (response.data.success) {
                alert(`Attendance for Employee ID ${empId} marked as ${newStatus}.`);
                statusChange(); // Trigger a refetch in the parent component
            } else {
                alert(response.data.message || 'Failed to update attendance status.');
            }
        } catch (error) {
            console.error('Error marking employee attendance status:', error);
            alert(error.response?.data?.message || 'An error occurred while marking attendance status.');
        }
    };

    return (
        <div className="flex flex-row flex-wrap gap-1 items-center justify-center">
            {status === null || status === "Pending" ? (
                <>
                    <button
                        className='px-2 py-1 text-xs bg-green-500 text-white rounded hover:bg-green-600 disabled:opacity-50'
                        onClick={() => markEmployeeStatus("Present", employeeId)}
                        disabled={status === "Present"}
                    >
                        Present
                    </button>
                    <button
                        className='px-2 py-1 text-xs bg-red-500 text-white rounded hover:bg-red-600 disabled:opacity-50'
                        onClick={() => markEmployeeStatus("Absent", employeeId)}
                        disabled={status === "Absent"}
                    >
                        Absent
                    </button>
                    <button
                        className="px-2 py-1 text-xs bg-gray-500 text-white rounded hover:bg-gray-600 disabled:opacity-50"
                        onClick={() => markEmployeeStatus("Sick", employeeId)}
                        disabled={status === "Sick"}
                    >
                        Sick
                    </button>
                    <button
                        className="px-2 py-1 text-xs bg-yellow-500 text-black rounded hover:bg-yellow-600 disabled:opacity-50"
                        onClick={() => markEmployeeStatus("Leave", employeeId)}
                        disabled={status === "Leave"}
                    >
                        Leave
                    </button>
                </>
            ) : (
                <p className="bg-gray-100 w-24 text-center py-1.5 rounded-full text-sm font-semibold">{status}</p>
            )}
        </div>
    );
};

// --- Updated Column Definitions (Consolidated Time & Button Logic) ---
export const columns = [
    {
        name: 'S No',
        selector: (row) => row.sno,
        width: '60px',
    },
    {
        name: 'Name',
        selector: (row) => row.name,
        sortable: true,
        width: '150px',
    },
    {
        name: 'Emp ID',
        selector: (row) => row.employeeId,
        sortable: true,
        width: '100px',
    },
    {
        name: 'Department',
        selector: (row) => row.department,
        width: '150px',
    },
    {
        name: 'Check-in',
        cell: (row) => {
            // Logic for Check-in column: display time OR button
            const handleCheckIn = async () => {
                try {
                    const response = await axios.put(
                        `http://localhost:5000/api/attendance/update/${row.employeeId}`,
                        { action: 'check_in' },
                        {
                            headers: {
                                Authorization: `Bearer ${localStorage.getItem('token')}`,
                            },
                        }
                    );
                    if (response.data.success) {
                        alert(`Employee ID ${row.employeeId} checked in successfully!`);
                        row.statusChange(); // Trigger refetch
                    } else {
                        alert(response.data.message || 'Failed to check in.');
                    }
                } catch (error) {
                    console.error('Error during check-in:', error);
                    alert(error.response?.data?.message || 'An error occurred during check-in.');
                }
            };

            if (row.checkIn) {
                return <p className="text-sm font-semibold">{new Date(row.checkIn).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: true })}</p>;
            } else {
                return (
                    <button
                        className='px-3 py-1 text-sm bg-blue-600 text-white rounded hover:bg-blue-700'
                        onClick={handleCheckIn}
                    >
                        Check-in
                    </button>
                );
            }
        },
        center: true,
        ignoreRowClick: true,
        allowOverflow: true,
        button: true, // Mark as button column if it contains buttons
        width: '150px', // Adjusted width to accommodate button or time
    },
    {
        name: 'Check-out',
        cell: (row) => {
            // Logic for Check-out column: display time OR button
            const handleCheckOut = async () => {
                try {
                    const response = await axios.put(
                        `http://localhost:5000/api/attendance/update/${row.employeeId}`,
                        { action: 'check_out' },
                        {
                            headers: {
                                Authorization: `Bearer ${localStorage.getItem('token')}`,
                            },
                        }
                    );
                    if (response.data.success) {
                        alert(`Employee ID ${row.employeeId} checked out successfully!`);
                        row.statusChange(); // Trigger refetch
                    } else {
                        alert(response.data.message || 'Failed to check out.');
                    }
                } catch (error) {
                    console.error('Error during check-out:', error);
                    alert(error.response?.data?.message || 'An error occurred during check-out.');
                }
            };

            if (row.checkOut) {
                return <p className="text-sm font-semibold">{new Date(row.checkOut).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: true })}</p>;
            } else if (row.checkIn) {
                // Only show check-out button if checked in
                return (
                    <button
                        className='px-3 py-1 text-sm bg-purple-600 text-white rounded hover:bg-purple-700'
                        onClick={handleCheckOut}
                    >
                        Check-out
                    </button>
                );
            } else {
                return <p className="text-gray-400 text-sm">N/A</p>; // No check-in, so cannot check-out
            }
        },
        center: true,
        ignoreRowClick: true,
        allowOverflow: true,
        button: true, // Mark as button column if it contains buttons
        width: '150px', // Adjusted width to accommodate button or time
    },
    {
        name: 'Actions', // This column is ONLY for Status buttons
        selector: (row) => row.action,
        center: true,
        ignoreRowClick: true,
        allowOverflow: true,
        button: true,
        width: '200px',
    },
];