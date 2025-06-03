import React from 'react'
import { useAuth } from '../../context/authContext'

const Navbar = () => {
    const {user, logout} = useAuth()
  return (
    // Changed bg-teal-600 to bg-red-700
    <div className='flex items-center text-white justify-between bg-red-600 h-12 px-5'> 
        <p>Welcome {user.name}</p>
        {/* Changed bg-teal-700 to bg-red-800 and hover:bg-teal-800 to hover:bg-red-900 */}
        <button className='px-4 py-1 bg-red-800 hover:bg-red-900 rounded mx-2' onClick={logout}>Logout</button>
    </div>
  )
}

export default Navbar
