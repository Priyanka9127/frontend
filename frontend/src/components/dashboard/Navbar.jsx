import React, { useState } from 'react';
import { useAuth } from '../../context/authContext';
import { NavLink } from 'react-router-dom';
import { FaChevronDown, FaBars, FaTimes } from 'react-icons/fa'; // Import FaTimes for close icon
import logo from '../../assets/allll__02 (1).png';

// The Navbar now accepts a 'toggleSidebar' and 'isSidebarOpen' prop
const Navbar = ({ toggleSidebar, isSidebarOpen }) => { 
  const { user, logout } = useAuth();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const userInitial = user.name ? user.name.charAt(0).toUpperCase() : 'U';

  return (
    <div className="flex items-center justify-between h-16 bg-white px-5 text-black shadow-md">
      
      {/* LEFT SECTION: Contains the sidebar toggle icon and conditionally rendered logo */}
      <div className="flex items-center space-x-4">
        {/* Sidebar Toggle Icon */}
        <button
          onClick={toggleSidebar}
          className="text-gray-600 hover:text-red-600 focus:outline-none"
          aria-label="Toggle sidebar"
        >
          {isSidebarOpen ? <FaTimes className="h-6 w-6" /> : <FaBars className="h-6 w-6" />}
        </button>

        {/* Conditionally render your Logo: Hide it when the sidebar is open */}
        {!isSidebarOpen && <img src={logo} alt="Company Logo" className="h-10 w-auto" />}
      </div>

      {/* RIGHT SECTION: This is your original user profile dropdown code, completely unchanged. */}
      <div className="relative">
        <button
          className="flex items-center space-x-2 focus:outline-none"
          onClick={toggleDropdown}
          aria-label="User profile dropdown"
        >
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-red-500 rounded-full flex items-center justify-center text-white font-semibold">
              {userInitial}
            </div>
            <span className="hidden md:block">Hello, {user.name}</span>
          </div>
          <FaChevronDown className={`transition-transform duration-200 ${isDropdownOpen ? 'rotate-180' : ''}`} />
        </button>

        {/* Dropdown Menu */}
        {isDropdownOpen && (
          <div className="absolute right-0 mt-2 w-64 bg-white text-black rounded-lg shadow-lg z-50">
            <div className="p-4 border-b border-gray-200">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-red-500 rounded-full flex items-center justify-center text-white font-semibold">
                  {userInitial}
                </div>
                <div>
                  <p className="font-semibold">{user.name}</p>
                  <p className="text-sm text-gray-600">{user.email}</p>
                </div>
              </div>
            </div>
            <div className="p-2">
              <button
                className="block w-full text-center py-2 mt-2 border bg-red-600 border-gray-300 text-white rounded hover:bg-red-700 transition-colors duration-200"
                onClick={() => {
                  setIsDropdownOpen(false);
                  logout();
                }}
              >
                Log Out
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Navbar;