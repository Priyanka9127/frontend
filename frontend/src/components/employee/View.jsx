import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

const View = () => {
    const { id } = useParams();
    const [employee, setEmployee] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchEmployee = async () => {
            setLoading(true);
            setError(null);
            try {
                const response = await axios.get(`http://backems-production.up.railway.app/api/employee/${id}`, {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("token")}`
                    },
                });

                if (response.data.success) {
                    setEmployee(response.data.employee);
                } else {
                    setError(response.data.error || "Failed to fetch employee details.");
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
        fetchEmployee();
    }, [id]);

    if (loading) {
        return (
            <div className='flex items-center justify-center min-h-[calc(100vh-6rem)] text-gray-700 text-xl'>
                <p className="flex items-center space-x-2">
                    <svg className="animate-spin h-6 w-6 text-red-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    <span>Loading Employee Details...</span>
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

    if (!employee) {
        return (
            <div className='flex items-center justify-center min-h-[calc(100vh-6rem)] text-gray-500 text-xl'>
                <p>No employee data found.</p>
            </div>
        );
    }

    // Helper component for a detail item
    const DetailItem = ({ label, value }) => (
        <div className='relative flex items-center pl-4'> {/* Increased pl-4 for the line */}
            {/* The vertical red line */}
            <div className='absolute left-0 top-1/2 -translate-y-1/2 w-1.5 h-4/5 bg-red-600 rounded-full'></div> 
            <div className='flex flex-col'>
                <p className='text-md font-semibold text-gray-500'>{label}:</p>
                <p className='text-xl font-bold text-gray-900'>{value}</p>
            </div>
        </div>
    );

    return (
        <div className='max-w-5xl mx-auto mt-10 p-8 bg-white rounded-lg shadow-xl border border-gray-200'>
            <h3 className='text-2xl font-extrabold mb-8 text-center text-red-600 border-b-2 border-red-200 pb-4'>
                Employee Profile
            </h3>
            
            <div className='grid grid-cols-1 md:grid-cols-3 gap-8 items-center'>
                {/* Profile Image Section */}
                <div className='md:col-span-1 flex justify-center'>
                    <img 
                        src={`http://backems-production.up.railway.app/${employee.userId.profileImage}`} 
                        alt={employee.userId.name} 
                        className="rounded-full w-64 h-64 object-cover border-4 border-red-600 shadow-lg transform transition-transform duration-300 hover:scale-105"
                    />
                </div>

                {/* Employee Details Section */}
                <div className='md:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-y-6 gap-x-8'>
                    <DetailItem label="Name" value={employee.userId.name} />
                    <DetailItem label="Employee ID" value={employee.employeeId} />
                    <DetailItem label="Email" value={employee.userId.email} />
                    <DetailItem label="Date of Birth" value={new Date(employee.dob).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })} />
                    <DetailItem label="Gender" value={employee.gender} />
                    <DetailItem label="Department" value={employee.department.dep_name} />
                    <DetailItem label="Designation" value={employee.designation} />
                    <DetailItem label="Marital Status" value={employee.maritalStatus} />
                    <DetailItem label="Salary" value={`$${employee.salary.toLocaleString()}`} />
                    <DetailItem label="Role" value={employee.userId.role.charAt(0).toUpperCase() + employee.userId.role.slice(1)} /> {/* Capitalize role */}
                </div>
            </div>
        </div>
    );
};

export default View;