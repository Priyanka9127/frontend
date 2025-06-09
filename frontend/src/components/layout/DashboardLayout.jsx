import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from '../dashboard/Navbar'; 
import AdminSidebar from '../dashboard/AdminSidebar'; 

const DashboardLayout = () => {
  const [isSidebarOpen, setSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setSidebarOpen(!isSidebarOpen);
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Pass isOpen and toggleSidebar to AdminSidebar */}
      <AdminSidebar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />
      
      {/* Main content area shifts when sidebar opens */}
      <div 
        className={`relative transition-all duration-300 ease-in-out 
                    ${isSidebarOpen ? 'md:ml-64' : 'ml-0'}`} 
      >
        {/* Pass isSidebarOpen to Navbar so it can conditionally hide its logo */}
        <Navbar toggleSidebar={toggleSidebar} isSidebarOpen={isSidebarOpen} />
        <main className="p-4 sm:p-6 lg:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;