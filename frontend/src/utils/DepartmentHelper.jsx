import { useNavigate } from "react-router-dom";
import axios from "axios";
import Swal from 'sweetalert2'; // Import SweetAlert2

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
        selector: (row) => row.action,
    },
];

export const DepartmentButton = ({ Id, onDepartmentDelete }) => {
    const navigate = useNavigate();

    const handleDelete = async (id) => {
        // Use SweetAlert2 for the confirmation pop-up
        const result = await Swal.fire({
            title: 'Are you sure?',
            text: "You won't be able to revert this!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes, delete it!'
        });

        if (result.isConfirmed) {
            try {
                const response = await axios.delete(`http://backems-production.up.railway.app/api/department/${id}`, {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("token")}`
                    },
                });

                if (response.data.success) {
                    Swal.fire(
                        'Deleted!',
                        'Your department has been deleted.',
                        'success'
                    );
                    onDepartmentDelete();
                }
            } catch (error) {
                if (error.response && !error.response.data.success) {
                    Swal.fire(
                        'Error!',
                        error.response.data.error || 'An error occurred while deleting the department.',
                        'error'
                    );
                } else {
                    Swal.fire(
                        'Error!',
                        'An unexpected error occurred.',
                        'error'
                    );
                }
            }
        }
    };

    return (
        <div className="flex space-x-3">
            <button
                className="px-3 py-1 bg-teal-600 text-white"
                onClick={() => navigate(`/admin-dashboard/department/${Id}`)}
            >
                Edit
            </button>
            <button
                className="px-3 py-1 bg-red-600 text-white"
                onClick={() => handleDelete(Id)}
            >
                Delete
            </button>
        </div>
    );
};