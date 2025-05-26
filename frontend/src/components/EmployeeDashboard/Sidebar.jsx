// frontend/src/components/Sidebar.jsx

import React from 'react'
import { NavLink } from 'react-router-dom'
import { FaBuilding, FaCalendarAlt, FaCog, FaMoneyBillWave, FaTachometerAlt, FaUsers } from 'react-icons/fa'
import { useAuth } from '../../context/authContext'

// Import your logo image
import logo from '../../assets/allll__02 (1).png'; // <--- Make sure this path is correct

const Sidebar = () => {
  const {user} =useAuth()
  return (
    
    <div className='bg-gray-800 text-white h-screen fixed left-0 top-0 bottom-0 space-y-2 w-64'>
        {/* Logo Section: Replaced text with image, updated background color */}
        <div className='bg-red-600 h-12 flex items-center justify-center p-2'> {/* Changed bg-teal-600 to bg-red-900, added p-2 */}
            <img src={logo} alt="Company Logo" className="h-10 w-auto" /> {/* Added img tag */}
        </div>
        <div>
        <NavLink
  to="/employee-dashboard"
  className={({ isActive }) =>
            // Using red-600 for active state, which should be #ff0000 based on your tailwind.config.js
            `${isActive ? "bg-red-600" : ""} flex items-center space-x-4 block py-2.5 px-4 rounded mx-2`
          }
  end
>
  <FaTachometerAlt />
  <span>Dashboard</span>
</NavLink>

            <NavLink 
            to={`/employee-dashboard/profile/${user._id}`}
            className={({ isActive }) =>
            `${isActive ? "bg-red-600" : ""} flex items-center space-x-4 block py-2.5 px-4 rounded mx-2`
          }>
                <FaUsers />
                <span>My profile</span>
            </NavLink>
            <NavLink to={`/employee-dashboard/leaves/${user._id}`}
             className={({ isActive }) =>
            `${isActive ? "bg-red-600" : ""} flex items-center space-x-4 block py-2.5 px-4 rounded mx-2`
          }>
                <FaBuilding />
                <span>Leaves</span>
            </NavLink>
            <NavLink to={`/employee-dashboard/salary/${user._id}`}
            className={({ isActive }) =>
            `${isActive ? "bg-red-600" : ""} flex items-center space-x-4 block py-2.5 px-4 rounded mx-2`
          }>
                <FaCalendarAlt />
                <span>Salary</span>
            </NavLink>
            
            
            <NavLink to="/employee-dashboard/setting" 
            className={({ isActive }) =>
            `${isActive ? "bg-red-600" : ""} flex items-center space-x-4 block py-2.5 px-4 rounded mx-2`
          }>
                <FaCog />
                <span>Setting</span>
            </NavLink>
        </div>
    </div>
  )
}

export default Sidebar