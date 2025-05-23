import { useNavigate } from "react-router-dom";
import axios from "axios";



export const columns = [
    {
        name: "S No",
        selector: (row) => row.sno,
    },
    {
        name: "Department Name",
        selector: (row) => row.dep_name,
        sortable: true,
    },
    {
        name: "Actions",
        selector: (row) => row.action,  // Change this to 'action' instead of 'actions'
    },
]


export const DepartmentButton = ({ Id, onDepartmentDelete }) => {
    const navigate = useNavigate(); // Add parentheses here to correctly call the hook
    const handleDelete = async (id) => {
        const confirm = window.confirm("Are you sure you want to delete this department?");
        if (confirm){
            try {
                
                const response = await axios.delete(`http://localhost:5000/api/department/${id}`, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`
                },
                });
                

                if(response.data.success) {
                    onDepartmentDelete(); // Call the onDepartmentDelete function passed as a prop
                        
                }
            }catch (error) {
                if (error.response && !error.response.data.success) {
                alert(error.response.data.error)
            }
            }
        }
    };
    return (
      <div className="flex space-x-3">
        <button
          className="px-3 py-1 bg-teal-600 text-white"
          onClick={() => navigate(`/admin-dashboard/department/${Id}`)}
 // Ensure the navigate function is called
        >
          Edit
        </button>
        <button className="px-3 py-1 bg-red-600 text-white"
        onClick={() => handleDelete(Id)}>Delete</button>
      </div>
    );
  };
  