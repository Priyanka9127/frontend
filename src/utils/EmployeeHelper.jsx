import axios from 'axios';
import { useNavigate } from 'react-router-dom';

export const columns = [
  {
    name: 'S No',
    selector: (row) => row.sno,
    width: '100px', // Slightly wider for better alignment
  },
  {
    name: 'Name',
    selector: (row) => row.name,
    sortable: true,
    width: '150px', // Increased width for better readability
  },
  {
    name: 'Image',
    cell: (row) => (
      <div className="flex items-center justify-center">
        {row.profileImage ? (
          <img
            className="w-10 h-10 rounded-full object-cover border border-gray-200"
            src={`https://backems-production.up.railway.app/${row.profileImage}`}
            alt={`${row.name}'s profile`}
            onError={(e) => (e.target.src = 'httpss://via.placeholder.com/40?text=No+Image')} // Fallback image
          />
        ) : (
          <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center text-gray-500 text-xs">
            No Image
          </div>
        )}
      </div>
    ),
    selector: (row) => row.profileImage,
    width: '150px',
  },
  {
    name: 'Department',
    selector: (row) => row.dep_name,
    width: '180px', // Increased width to accommodate longer department names
  },
  {
    name: 'DOB',
    selector: (row) => row.dob,
    sortable: true,
    width: '200px',
  },
  {
    name: 'Actions',
    cell: (row) => <EmployeeButton Id={row._id} />,
     // Increased width to fit buttons comfortably
    center: true,
  },
];

export const fetchDepartments = async () => {
  let departments = [];
  try {
    const response = await axios.get('https://backems-production.up.railway.app/api/department', {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    });
    if (response.data.success) {
      departments = response.data.departments;
    }
  } catch (error) {
    if (error.response && !error.response.data.success) {
      alert(error.response.data.error);
    }
  }
  return departments;
};

export const getEmployees = async (id) => {
  let employees = [];
  try {
    const response = await axios.get(`https://backems-production.up.railway.app/api/employee/department/${id}`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    });
    if (response.data.success) {
      employees = response.data.employees;
    }
  } catch (error) {
    if (error.response && error.response.data && !error.response.data.success) {
      alert(error.response.data.error);
    } else {
      console.error('An unexpected error occurred:', error);
    }
  }
  return employees;
};

export const EmployeeButton = ({ Id }) => {
  const navigate = useNavigate();
  return (
    <div className="flex space-x-3 justify-center">
      <button
        className="px-4 py-1 bg-teal-600 text-white rounded-md hover:bg-teal-700 transition-all"
        onClick={() => navigate(`/admin-dashboard/employees/${Id}`)}
        title="View employee details"
      >
        View
      </button>
      <button
        className="px-4 py-1 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-all"
        onClick={() => navigate(`/admin-dashboard/employees/edit/${Id}`)}
        title="Edit employee details"
      >
        Edit
      </button>
      <button
        className="px-4 py-1 bg-yellow-600 text-white rounded-md hover:bg-yellow-700 transition-all"
        onClick={() => navigate(`/admin-dashboard/employees/salary/${Id}`)}
        title="View salary details"
      >
        Salary
      </button>
      <button
        className="px-4 py-1 bg-red-600 text-white rounded-md hover:bg-red-700 transition-all"
        onClick={() => navigate(`/admin-dashboard/employees/leaves/${Id}`)}
        title="View leave details"
      >
        Leave
      </button>
    </div>
  );
};