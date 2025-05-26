import React, { useEffect, useState } from 'react';
import { fetchDepartments } from '../../utils/EmployeeHelper';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';

const Edit = () => {
    const [employee, setEmployee] = useState({
        name: "",
        maritalStatus: "",
        designation: "",
        salary: 0,
        department: "", // Will store department ID
    });

    const [departments, setDepartments] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();
    const { id } = useParams();

    // Fetch Departments
    useEffect(() => {
        const getDepartments = async () => {
            try {
                const fetchedDepts = await fetchDepartments();
                setDepartments(fetchedDepts);
            } catch (err) {
                console.error("Failed to fetch departments:", err);
                setError("Failed to load departments.");
            }
        };
        getDepartments();
    }, []);

    // Fetch Employee data for editing
    useEffect(() => {
        const fetchEmployeeData = async () => {
            setLoading(true);
            setError(null); // Clear previous errors
            try {
                const response = await axios.get(`http://backems-production.up.railway.app/api/employee/${id}`, {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("token")}`
                    },
                });

                if (response.data.success) {
                    const empData = response.data.employee;
                    setEmployee({
                        name: empData.userId.name,
                        maritalStatus: empData.maritalStatus,
                        designation: empData.designation,
                        salary: empData.salary,
                        department: empData.department._id, // Set department ID
                    });
                } else {
                    setError(response.data.error || "Failed to fetch employee details for editing.");
                }
            } catch (err) {
                if (err.response && !err.response.data.success) {
                    setError(err.response.data.error);
                } else {
                    setError("Network error or server unavailable.");
                }
            } finally {
                setLoading(false);
            }
        };
        fetchEmployeeData();
    }, [id]); // Add id to dependency array

    const handleChange = (e) => {
        const { name, value } = e.target;
        setEmployee((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null); // Clear previous errors
        
        // Basic validation (can be expanded)
        if (!employee.name || !employee.maritalStatus || !employee.designation || employee.salary <= 0 || !employee.department) {
            setError("All fields are required and salary must be greater than 0.");
            return;
        }

        try {
            const response = await axios.put(
                `http://backems-production.up.railway.app/api/employee/${id}`, 
                employee, 
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("token")}`
                    }
                }
            );

            if (response.data.success) {
                navigate("/admin-dashboard/employees");
            } else {
                setError(response.data.error || "Failed to update employee.");
            }
        } catch (err) {
            if (err.response && err.response.data && err.response.data.error) {
                setError(err.response.data.error);
            } else {
                setError("An unexpected error occurred during update.");
            }
        }
    };

    if (loading || !departments) {
        return (
            <div className='flex items-center justify-center min-h-[calc(100vh-6rem)] text-gray-700 text-xl'>
                <p className="flex items-center space-x-2">
                    <svg className="animate-spin h-6 w-6 text-red-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    <span>Loading Form Data...</span>
                </p>
            </div>
        );
    }

    if (error) {
        return (
            <div className='flex items-center justify-center min-h-[calc(100vh-6rem)] text-red-600 text-xl font-semibold'>
                <p>Error: {error}</p>
            </div>
        );
    }

    return (
        <div className='max-w-4xl mx-auto mt-10 p-8 bg-white rounded-lg shadow-xl border border-gray-200'>
            <h2 className='text-2xl font-extrabold mb-8 text-center text-red-600 border-b-2 border-red-200 pb-4'>
                Edit Employee Details
            </h2>

            {/* Error message display */}
            {error && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-6" role="alert">
                    <strong className="font-bold">Error!</strong>
                    <span className="block sm:inline ml-2">{error}</span>
                </div>
            )}

            <form onSubmit={handleSubmit}>
                <div className='grid grid-cols-1 md:grid-cols-2 gap-6 mb-6'> {/* Adjusted gap and added mb-6 */}
                    {/* Name */}
                    <div>
                        <label htmlFor="name" className='block text-sm font-medium text-gray-700 mb-1'>Name</label>
                        <input 
                            type="text"
                            id="name"
                            name='name'
                            value={employee.name}
                            onChange={handleChange}
                            placeholder='Enter Name'
                            className='mt-1 p-2.5 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-red-500 focus:border-red-500 transition duration-150 ease-in-out'
                            required
                        /> 
                    </div>
                    
                    {/* Marital Status */}
                    <div>
                        <label htmlFor="maritalStatus" className='block text-sm font-medium text-gray-700 mb-1'>Marital Status</label>
                        <select
                            id="maritalStatus"
                            name='maritalStatus'
                            onChange={handleChange}
                            value={employee.maritalStatus}
                            className='mt-1 p-2.5 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-red-500 focus:border-red-500 transition duration-150 ease-in-out'
                            required
                        >
                            <option value="">Select Marital Status</option>
                            <option value="single">Single</option>
                            <option value="married">Married</option>
                        </select>
                    </div>

                    {/* Designation */}
                    <div>
                        <label htmlFor="designation" className='block text-sm font-medium text-gray-700 mb-1'>Designation</label>
                        <input 
                            type="text"
                            id="designation"
                            name='designation'
                            onChange={handleChange}
                            value={employee.designation}
                            placeholder='Enter Designation'
                            className='mt-1 p-2.5 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-red-500 focus:border-red-500 transition duration-150 ease-in-out'
                            required
                        />
                    </div>
                    
                    {/* Salary */}
                    <div>
                        <label htmlFor="salary" className='block text-sm font-medium text-gray-700 mb-1'>Salary</label>
                        <input 
                            type="number"
                            id="salary"
                            name='salary'
                            onChange={handleChange}
                            value={employee.salary}
                            placeholder='Enter Salary'
                            className='mt-1 p-2.5 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-red-500 focus:border-red-500 transition duration-150 ease-in-out'
                            required
                        />
                    </div>

                    {/* Department */}
                    <div className='md:col-span-2'> {/* Spans full width on medium screens */}
                        <label htmlFor="department" className='block text-sm font-medium text-gray-700 mb-1'>Department</label>
                        <select
                            id="department"
                            name='department'
                            onChange={handleChange} 
                            value={employee.department}          
                            className='mt-1 p-2.5 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-red-500 focus:border-red-500 transition duration-150 ease-in-out'
                            required
                        >
                            <option value="">Select Department</option>
                            {departments.map((dep) => (
                                <option key={dep._id} value={dep._id}>{dep.dep_name}</option>
                            ))}
                        </select>
                    </div>
                </div> {/* End of grid */}

                <button 
                    type='submit' 
                    className='w-full mt-3 flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-xl font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition duration-200 ease-in-out'
                >
                    Update Employee
                </button>
            </form>
        </div>
    );
};

export default Edit;