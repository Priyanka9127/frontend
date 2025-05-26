// AdminDashboard.jsx
import React from 'react'
import {useAuth} from '../context/authContext'
import AdminSidebar from '../components/dashboard/AdminSidebar'
import Navbar from '../components/dashboard/Navbar'
import AdminSummary from '../components/dashboard/AdminSummary' // This is correct
import { Outlet } from 'react-router-dom'

const AdminDashboard = () => {
  const {user } = useAuth()

  return (
    <div className='flex'>
      <AdminSidebar />
      <div className="flex-1 ml-64 bg-gray-100 h-screen">
        <Navbar />
        {/* The AdminSummary component will be rendered here via Outlet */}
        <Outlet />
      </div>
    </div>
  )
}

export default AdminDashboard