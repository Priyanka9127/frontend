import { useNavigate } from "react-router-dom"

export const columns = [
    {
        name: "S No",
        selector: (row) =>row.sno,
        width: "100px",
        
    },
    {
        name: "Emp ID",
        selector: (row) => row.employeeId,
        width: "130px",
    },
    {
       name: "Name",
        selector: (row) => row.name,
        width: "130px", 
    },
    {
       name: "Leave Type",
        selector: (row) => row.leaveType,
        width: "150px", 
    },
    {
       name: "Department",
        selector: (row) => row.department,
        width: "180px", 
    },
    {
       name: "Days",
        selector: (row) => row.days,
        width: "100px", 
    },
    {
       name: "Status",
        selector: (row) => row.status,
        width: "140px", 
    },
    {
       name: "Action",
        selector: (row) => row.action,
        
        center: true, 
    },
];


export const LeaveButtons = ({ Id }) => {
    const navigate = useNavigate();

    const handleView = (id) => {
        navigate(`/admin-dashboard/leaves/${id}`);
    };
    return(
        <button
        className="px-4 py-1 bg-red-500 rounded text-white hover:bg-red-600"
        onClick={() => handleView(Id)}>
            View
        </button>
    );
};