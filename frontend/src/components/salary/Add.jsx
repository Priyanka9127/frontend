import React, { useEffect, useState } from 'react'
import { fetchDepartments, getEmployees } from '../../utils/EmployeeHelper';
import axios from 'axios'
import { useNavigate} from 'react-router-dom'

const Add = () => {
    const [salary, setSalary] = useState({
        employeeId: "",
        basicSalary: 0,
        allowances: 0,
        deductions: 0,
        payDate: "",
    });

    const [departments, setDepartments] = useState(null);
    const [employees, setEmployees] = useState([]);
    const navigate = useNavigate()


    useEffect(() => {
            const getDepartments = async () => {
            const departments = await fetchDepartments();
            setDepartments(departments);
            };
            getDepartments();
        }, []);
    
    const handleDepartment = async (e) => {
        const emps = await getEmployees(e.target.value);
        setEmployees(emps);

    }


    const handleChange = (e) => {
        const { name, value } = e.target;
            setSalary((prevData) => ({
                ...prevData,
                [name]: value,
            }));
        
    };

    const handleSubmit = async (e) => {
        e.preventDefault()
        
        try {
            const response = await axios.post(
                "http://backems-production.up.railway.app/api/salary/add", 
                salary, 
                {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`
                }
            })

            if (response.data.success) {
                navigate("/admin-dashboard/employees")
            }
        } catch (error) {
            if (error.response && !error.response.data.success) {
                alert(error.response.data.error || "An error occurred") // Fallback message if error.response.data.error is undefined
            } else {
                alert("Something went wrong")
            }
        }
    }


  return (
    <> {departments ? ( 
    <div className='max-w-4xl mx-auto mt-10 p-8 bg-white rounded-lg shadow-xl border border-gray-200'>
        <h2 className='text-2xl font-extrabold mb-8 text-center text-red-600 border-b-2 border-red-200 pb-4'>Add Salary</h2>

        
        <form onSubmit={handleSubmit}>
            <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
               
                    {/* Department */}
                <div >
                    <label className='block text-sm font-medium text-gray-700'>Department</label>
                    <select
                    name='department'
                    onChange={handleDepartment}                   
                    className='mt-1 p-2 block w-full border border-gray-300 rounded-md '
                    required
                    >
                        <option value="">Select Department </option>
                        {departments.map((dep) => (
                            <option key={dep._id} value={dep._id} >{dep.dep_name}</option>
                        ))}
                    </select>
                    </div>
                    {/* employee */}
                <div >
                    <label className='block text-sm font-medium text-gray-700'>Employee</label>
                    <select
                    name='employeeId'
                    onChange={handleChange}                  
                    className='mt-1 p-2 block w-full border border-gray-300 rounded-md '
                    required
                    >
                        <option value="">Select Employee </option>
                        {employees.map((emp) => (
                            <option key={emp._id} value={emp._id} >{emp.employeeId}</option>
                        ))}
                    </select>
                    </div>
                
                {/* Designation */}
                <div>
                    <label className='block text-sm font-medium text-gray-700'>Basic Salary</label>
                    <input 
                    type="number"
                    name='basicSalary'
                    onChange={handleChange}
                    placeholder='Enter Basic Salary'
                    className='mt-1 p-2 block w-full border border-gray-300 rounded-md '
                    required
                    />
                    </div>
                
                {/* Salary */}
                <div>
                    <label className='block text-sm font-medium text-gray-700'>Allowances</label>
                    <input 
                    type="number"
                    name='allowances'
                    onChange={handleChange}
                    placeholder='Enter Allowances'
                    className='mt-1 p-2 block w-full border border-gray-300 rounded-md '
                    required
                    />
                    </div>
                {/* deduction */}
                <div>
                    <label className='block text-sm font-medium text-gray-700'>Deductions</label>
                    <input 
                    type="number"
                    name='deductions'
                    onChange={handleChange}
                    placeholder='Enter Deductions'
                    className='mt-1 p-2 block w-full border border-gray-300 rounded-md '
                    required
                    />
                    </div>
                {/* pay date */}
                <div>
                    <label className='block text-sm font-medium text-gray-700'>Pay Date</label>
                    <input 
                    type="date"
                    name='payDate'
                    onChange={handleChange}
                    className='mt-1 p-2 block w-full border border-gray-300 rounded-md '
                    required
                    />
                    </div>

               
             

                </div>
                <button 
                type='submit' 
                className='w-full mt-3 flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-lg font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition duration-200 ease-in-out'>
                Add Salary
                </button>
        </form>
      
    </div>
    ) : <div>Loading ....</div>} </>
  );
};

export default Add
