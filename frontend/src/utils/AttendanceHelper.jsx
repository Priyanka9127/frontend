// AttendanceHelper.jsx
import axios from 'axios';
import React from 'react';

export const columns = [
  {
    name: 'S No',
    selector: (row) => row.sno,
    width: '100px',
  },
  {
    name: 'Name',
    selector: (row) => row.name,
    sortable: true,
    width: '120px',
  },
  {
    name: 'Emp ID',
    selector: (row) => row.employeeId,
    sortable: true,
    width: '120px',
  },
  {
    name: 'Department',
    selector: (row) => row.department,
    width: '150px',
  },
  {
    name: 'Actions',
    selector: (row) => row.action,
    center: true,
  },
];

export const AttendanceHelper = ({ status, employeeId, statusChange }) => {
  const markEmployee = async (status, employeeId) => {
    const response = await axios.put(`http://localhost:5000/api/attendance/update/${employeeId}`, {status}, {
        headers: {
            "Authorization": `Bearer ${localStorage.getItem("token")}`
          }
    } )
    if(response.data.success) {
        statusChange()
    }
  }

  return (
    <div>
      {status == null ? (
        <div className='flex space-x-8'>
          <button 
          className='px-4 py-2 bg-green-500 text-white'
          onClick={() => markEmployee("Present", employeeId)}>
          Present</button>
          <button 
          className='px-4 py-2 bg-red-500 text-white'
          onClick={() => markEmployee("Absent", employeeId)}>
            Absent</button>
          <button 
          className="px-4 py-2 bg-gray-500 text-white"
          onClick={() => markEmployee("Sick", employeeId)}>
            Sick</button>
          <button 
          className="px-4 py-2 bg-yellow-500 text-black"
          onClick={() => markEmployee("Leave", employeeId)}>
            Leave</button>
        </div>
      ) : (
        <p className="bg-gray-100 w-20 text-center py-2 rounded">{status}</p>
      )}
    </div>
  );
};