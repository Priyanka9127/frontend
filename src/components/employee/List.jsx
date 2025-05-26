import React from 'react'
import { useState } from 'react'
import { useEffect } from 'react'
import { Link } from 'react-router-dom'
// EmployeeButton is NOT needed here directly, as it's used within columns
// import { EmployeeButton } from '../../utils/EmployeeHelper'
import DataTable from 'react-data-table-component'
import axios from 'axios'
import { columns } from '../../utils/EmployeeHelper' // This imports your column definitions

const List = () => {
    const [employees, setEmployees] = useState([])
    const [empLoading, setEmpLoading] = useState(false)
    const [filteredEmployee, setFilteredEmployees] = useState([])

    useEffect(() => {
        const fetchEmployees = async () => {
            setEmpLoading(true)
            try {
                const response = await axios.get('https://backems-production.up.railway.app/api/employee', {
                    headers: {
                        "Authorization": `Bearer ${localStorage.getItem("token")}`
                    }
                })
                if (response.data.success) {
                    let sno = 1;
                    const data = response.data.employees.map((emp) => (
                        {
                            _id: emp._id, // Keep this! It's used by the EmployeeButton in the 'Actions' column
                            sno: sno++,
                            // Use optional chaining (?.) for nested properties to prevent errors
                            // if 'department' or 'userId' or their sub-properties are sometimes missing
                            dep_name: emp.department?.dep_name || 'N/A',
                            name: emp.userId?.name || 'N/A',
                            dob: new Date(emp.dob).toLocaleDateString(),
                            // *** CORRECTED LINE FOR IMAGE: Pass only the string path here ***
                            profileImage: emp.userId?.profileImage || '',
                            // *** CORRECTED LINE FOR ACTIONS: REMOVE this 'action' property ***
                            // The 'columns' definition (in EmployeeHelper.jsx) will handle
                            // rendering the EmployeeButton using the 'cell' property.
                        }
                    ));
                    setEmployees(data)
                    setFilteredEmployees(data)
                }
            } catch (error) {
                if (error.response && error.response.data && !error.response.data.success) {
                    alert(error.response.data.error)
                } else {
                    console.error("An unexpected error occurred during employee fetch:", error); // Log unexpected errors
                }
            }
            finally {
                setEmpLoading(false)
            }
        };
        fetchEmployees()
    }, []); // Empty dependency array means this runs once on component mount

    const handleFilter = (e) => {
        const records = employees.filter((emp) => (
            emp.name.toLowerCase().includes(e.target.value.toLowerCase())
        ))
        setFilteredEmployees(records)
    }

    return (
        <div className='p-6'>
    <div className='text-center'>
        <h3 className='text-2xl font-bold '>
            Manage Employee
        </h3>
    </div>
    <div className='flex justify-between items-center '>
        <input type="text"
        placeholder="Search By Name"
        className='px-4 py-0.5 border '
        onChange={handleFilter}
        />
        <Link to="/admin-dashboard/add-employee" className='px-4 py-1 bg-red-600 rounded text-white'>Add New Employee</Link>
    </div>
    <div className='mt-5'> {/* This div wraps your DataTable */}
        <DataTable
        columns={columns}
        data={filteredEmployee}
        pagination/>
    </div>
</div>
    )
}

export default List