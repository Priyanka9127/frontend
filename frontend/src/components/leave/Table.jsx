import React, { useEffect, useState } from 'react'
import { LeaveButtons, columns } from '../../utils/LeaveHelper'; // Corrected import
import DataTable from 'react-data-table-component';
// import { columns } from '../../utils/DepartmentHelper'; // This import is incorrect for leave columns
import axios from 'axios';

const Table = () => {

    const [leaves, setLeaves] = useState(null)
    const [filteredLeaves, setFilteredLeaves] = useState(null)

    const fetchLeaves = async () => {
        try {
        const response = await axios.get('http://localhost:5000/api/leave', {
          headers: {
            "Authorization": `Bearer ${localStorage.getItem("token")}`
          }
        })
        if(response.data.success) {
          let sno =1;
          const data = response.data.leaves.map((leave) => (
            {
              _id: leave._id,
              sno: sno++,
              employeeId: leave.employeeId.employeeId,
              name: leave.employeeId.userId.name,
              leaveType: leave.leaveType,
              department: leave.employeeId.department.dep_name, // Use dep_name as per your populate select
              // Corrected calculation for days
              days: Math.max(0, Math.ceil((new Date(leave.endDate) - new Date(leave.startDate)) / (1000 * 60 * 60 * 24)) + 1),
              status: leave.status,
              action: (<LeaveButtons Id={leave._id} />),
            }
          ));
          setLeaves(data)
          setFilteredLeaves(data)
        }
      }catch (error) {
        if (error.response && !error.response.data.success) {
          alert(error.response.data.error)
      } else {
          console.error("Error fetching leaves:", error);
          alert("An error occurred while fetching leaves.");
      }
    }
    }

    useEffect(() => {
        fetchLeaves()
    }, [])

    // Add a dependency on `leaves` for potential re-fetching if data changes (optional, depending on your needs)
    // useEffect(() => {
    //   fetchLeaves();
    // }, [leaves]);

    const filterByInput = (e) => {
        const data = leaves.filter(leave => leave.employeeId.toLowerCase().includes(e.target.value.toLowerCase()));
        setFilteredLeaves(data)
    }
    const filterByButton = (status) => {
        const data = leaves.filter(leave => leave.status
            .toLowerCase()
            .includes(status.toLowerCase())
        );
        setFilteredLeaves(data)
    }


  return (
    <>
    {filteredLeaves ? (
    <div className='p-6'>
        <div className='text-center'>
        <h3 className='text-2xl font-bold '>
          Manage Leaves
        </h3>
      </div>
      <div className='flex justify-between items-center '>
        <input type="text"
        placeholder="Search By Emp Id"
        className='px-4 py-0.5 border'
        onChange={filterByInput}

        />
        <div className='space-x-3'>
        <button className='px-2 py-1 bg-teal-600 text-white hover:bg-teal-700 rounded mx-2'
        onClick={() => filterByButton("Pending")}>
        Pending
        </button>
        <button className='px-2 py-1 bg-teal-600 text-white hover:bg-teal-700 rounded mx-2'
        onClick={() => filterByButton("Approved")}>
        Approved
        </button>
        <button className='px-2 py-1 bg-teal-600 text-white hover:bg-teal-700 rounded mx-2'
        onClick={() => filterByButton("Rejected")}>
        Rejected
        </button>
        </div>
      </div>
        <div className='mt-4'>
      <DataTable columns={columns} data={filteredLeaves} pagination/></div>
    </div>
    ) : <div> Loading...</div>}
    </>
  )
}

export default Table