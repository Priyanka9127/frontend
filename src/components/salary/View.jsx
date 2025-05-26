import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../../context/authContext';

const View = () => {
  const [salaries, setSalaries] = useState(null);
  const [filteredSalaries, setFilteredSalaries] = useState(null);
  const { id } = useParams();
  let sno = 1;
  const { user } = useAuth(); // Destructure user from useAuth

  const fetchSalaries = async () => {
    if (!user || !user.role) {
      console.error('User or role is not defined');
      return;
    }
    try {
      const response = await axios.get(`https://backems-production.up.railway.app/api/salary/${id}/${user.role}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      if (response.data.success) {
        setSalaries(response.data.salary);
        setFilteredSalaries(response.data.salary);
      }
    } catch (error) {
      console.error('Error fetching salaries:', error.message);
      if (error.response && !error.response.data.success) {
        console.error(error.response.data.message);
      }
    }
  };

  useEffect(() => {
    if (user && user.role) {
      fetchSalaries();
    }
  }, [user]); // Re-run when user changes

  const filterSalaries = (q) => {
    if (!salaries) return;
    const filteredRecords = salaries.filter((salary) =>
      salary.employeeId.employeeId.toLowerCase().includes(q.toLowerCase())
    );
    setFilteredSalaries(filteredRecords);
  };

  return (
    <>
      {filteredSalaries === null ? (
        <div>Loading...</div>
      ) : (
        <div className="overflow-x-auto p-5">
          <div className="text-center">
            <h2 className="text-2xl font-bold">Salary History</h2>
          </div>
          <div className="flex justify-end my-3">
            <input
              type="text"
              placeholder="Search by Employee ID"
              className="border px-2 rounded-md py-0.5 border-gray-300"
              onChange={(e) => filterSalaries(e.target.value)} // Pass the input value
            />
          </div>

          {filteredSalaries.length > 0 ? (
            <table className="w-full text-sm text-left text-gray-700 mt-6 border border-gray-200 rounded-md overflow-hidden shadow-sm">
              <thead className="text-xs text-gray-700 uppercase bg-gray-100">
                <tr>
                  <th className="px-4 py-2 border-b border-gray-200">SNO</th>
                  <th className="px-4 py-2 border-b border-gray-200">Emp ID</th>
                  <th className="px-4 py-2 border-b border-gray-200">Salary</th>
                  <th className="px-4 py-2 border-b border-gray-200">Allowance</th>
                  <th className="px-4 py-2 border-b border-gray-200">Deduction</th>
                  <th className="px-4 py-2 border-b border-gray-200">Total</th>
                  <th className="px-4 py-2 border-b border-gray-200">Pay Date</th>
                </tr>
              </thead>
              <tbody>
                {filteredSalaries.map((salary) => (
                  <tr
                    key={salary._id}
                    className="bg-white text-gray-700 font-medium border-b border-gray-100 hover:bg-gray-50 transition-colors duration-200"
                  >
                    <td className="px-4 py-2">{sno++}</td>
                    <td className="px-4 py-2">{salary.employeeId.employeeId}</td>
                    <td className="px-4 py-2">{salary.basicSalary}</td>
                    <td className="px-4 py-2">{salary.allowances}</td>
                    <td className="px-4 py-2">{salary.deductions}</td>
                    <td className="px-4 py-2">{salary.netSalary}</td>
                    <td className="px-4 py-2">{new Date(salary.payDate).toLocaleDateString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <div>No Records</div>
          )}
        </div>
      )}
    </>
  );
};

export default View;