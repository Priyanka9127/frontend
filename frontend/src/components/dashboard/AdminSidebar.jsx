// frontend/src/components/dashboard/AdminSidebar.jsx

import React from 'react';
import { NavLink } from 'react-router-dom';
import { FaBuilding, FaCalendarAlt, FaCog, FaMoneyBillWave, FaRegCalendarAlt, FaTachometerAlt, FaUsers } from 'react-icons/fa';
import { AiOutlineFileText } from 'react-icons/ai';

import logo from '../../assets/allll__02 (1).png'; 

// Accept `isOpen` prop to control visibility and `toggleSidebar` if needed within the sidebar
const AdminSidebar = ({ isOpen, toggleSidebar }) => { 
  return (
    // Adjust width and positioning based on isOpen state.
    // For "display in place of logo", the sidebar will likely need to cover the logo's area.
    // The 'w-64' is for the open state. For the closed state, you might want 'w-0' or a very narrow width.
    <div 
      className={`bg-white text-black h-screen fixed left-0 top-0 bottom-0 transition-all duration-300 ease-in-out 
                  ${isOpen ? 'w-64' : 'w-0 overflow-hidden'}`} // w-0 and overflow-hidden will hide it
    >
      {/* Conditionally render content based on isOpen */}
      {isOpen && (
        <>
          {/* Original Logo Section (if you want it at the top of the open sidebar) */}
          <div className='bg-white h-12 flex items-center justify-center p-2 border-spacing-1 border-b border-gray-200'>
            <img src={logo} alt="Company Logo" className="h-10 w-auto" />
          </div>

          {/* Navigation Links - These are always visible when the sidebar is open */}
          <div className='space-y-2 mt-2'> {/* Added mt-2 for spacing */}
            <NavLink
              to="/admin-dashboard"
              className={({ isActive }) =>
                `flex items-center space-x-4 block py-2.5 px-4 rounded mx-2 transition-colors duration-200 
                ${isActive ? "bg-red-600 text-white" : "text-gray-700 hover:bg-gray-200 hover:text-gray-900"}`
              }
              end
            >
              <FaTachometerAlt />
              <span>Dashboard</span>
            </NavLink>

            <NavLink to="/admin-dashboard/employees"
              className={({ isActive }) =>
                `flex items-center space-x-4 block py-2.5 px-4 rounded mx-2 transition-colors duration-200 
                ${isActive ? "bg-red-600 text-white" : "text-gray-700 hover:bg-gray-200 hover:text-gray-900"}`
              }>
              <FaUsers />
              <span>Employee</span>
            </NavLink>

            <NavLink to="/admin-dashboard/departments"
              className={({ isActive }) =>
                `flex items-center space-x-4 block py-2.5 px-4 rounded mx-2 transition-colors duration-200 
                ${isActive ? "bg-red-600 text-white" : "text-gray-700 hover:bg-gray-200 hover:text-gray-900"}`
              }>
              <FaBuilding />
              <span>Department</span>
            </NavLink>

            <NavLink to="/admin-dashboard/leaves"
              className={({ isActive }) =>
                `flex items-center space-x-4 block py-2.5 px-4 rounded mx-2 transition-colors duration-200 
                ${isActive ? "bg-red-600 text-white" : "text-gray-700 hover:bg-gray-200 hover:text-gray-900"}`
              }>
              <FaCalendarAlt />
              <span>Leave</span>
            </NavLink>

            <NavLink to="/admin-dashboard/salary/add"
              className={({ isActive }) =>
                `flex items-center space-x-4 block py-2.5 px-4 rounded mx-2 transition-colors duration-200 
                ${isActive ? "bg-red-600 text-white" : "text-gray-700 hover:bg-gray-200 hover:text-gray-900"}`
              }>
              <FaMoneyBillWave />
              <span>Salary</span>
            </NavLink>

            <NavLink
              to={`/admin-dashboard/attendance`}
              className={({ isActive }) =>
                `flex items-center space-x-4 block py-2.5 px-4 rounded mx-2 transition-colors duration-200 
                ${isActive ? "bg-red-600 text-white" : "text-gray-700 hover:bg-gray-200 hover:text-gray-900"}`
              }>
              <FaRegCalendarAlt />
              <span>Attendance</span>
            </NavLink>

            <NavLink
              to={`/admin-dashboard/attendance-report`}
              className={({ isActive }) =>
                `flex items-center space-x-4 block py-2.5 px-4 rounded mx-2 transition-colors duration-200 
                ${isActive ? "bg-red-600 text-white" : "text-gray-700 hover:bg-gray-200 hover:text-gray-900"}`
              }>
              <AiOutlineFileText />
              <span>Attendance Report</span>
            </NavLink>

            <NavLink to="/admin-dashboard/setting"
              className={({ isActive }) =>
                `flex items-center space-x-4 block py-2.5 px-4 rounded mx-2 transition-colors duration-200 
                ${isActive ? "bg-red-600 text-white" : "text-gray-700 hover:bg-gray-200 hover:text-gray-900"}`
              }>
              <FaCog />
              <span>Setting</span>
            </NavLink>
          </div>
        </>
      )}
    </div>
  );
}

export default AdminSidebar;