import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../../context/authContext';

const List = () => {
  const [leaves, setLeaves] = useState(null);
  let sno = 1; // Kept as-is per your request
  const { id } = useParams();
  const user = useAuth();

  const fetchLeaves = async () => {
    if (!user || !user.user || !user.user.role) { // Fixed: Use user.user.role
      console.error('User or role is not defined');
      return;
    }
    try {
      const response = await axios.get(`http://backems-production.up.railway.app/api/leave/${id}/${user.user.role}`, { // Fixed: Use user.user.role
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      if (response.data.success) {
        setLeaves(response.data.leaves);
      }
    } catch (error) {
      if (error.response && !error.response.data.success) {
        alert(error.response.data.message); // Fixed: Show server error message
      } else {
        alert('An error occurred while fetching leaves'); // Fallback for other errors
      }
    }
  };

  useEffect(() => {
    fetchLeaves();
  }, [user]); // Added user to dependencies to re-run when user is available

  if (!leaves) {
    return <div>Loading....</div>;
  }

  return (
    <div className="p-6">
      <div className="text-center">
        <h3 className="text-2xl font-bold">Manage Leaves</h3>
      </div>
      <div className="flex justify-between items-center">
        <input
          type="text"
          placeholder="Search By Name"
          className="px-4 py-0.5 border"
        />
        {user && user.user && user.user.role === 'employee' && (
          <Link to="/employee-dashboard/add-leave" className="px-4 py-1 bg-red-600 rounded text-white">
            Add New Leave
          </Link>
        )}
      </div>

      <table className="w-full text-sm text-left text-gray-700 mt-6 border border-gray-200 rounded-md overflow-hidden shadow-sm">
        <thead className="text-xs text-gray-700 uppercase bg-gray-100">
          <tr>
            <th className="px-4 py-2 border-b border-gray-200">SNO</th>
            <th className="px-4 py-2 border-b border-gray-200">Leave Type</th>
            <th className="px-4 py-2 border-b border-gray-200">From</th>
            <th className="px-4 py-2 border-b border-gray-200">To</th>
            <th className="px-4 py-2 border-b border-gray-200">Description</th>
            <th className="px-4 py-2 border-b border-gray-200">Status</th>
          </tr>
        </thead>
        <tbody>
          {leaves.map((leave) => (
            <tr key={leave._id} className="bg-white border-b border-gray-100 hover:bg-gray-50">
              <td className="px-4 py-2">{sno++}</td> {/* Kept as-is per your request */}
              <td className="px-4 py-2">{leave.leaveType}</td>
              <td className="px-4 py-2">{new Date(leave.startDate).toLocaleDateString()}</td>
              <td className="px-4 py-2">{new Date(leave.endDate).toLocaleDateString()}</td>
              <td className="px-4 py-2">{leave.reason}</td>
              <td className="px-4 py-2">{leave.status}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default List;