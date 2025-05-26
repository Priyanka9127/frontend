import React from 'react'
import { FaUser } from 'react-icons/fa'
import { useAuth } from '../../context/authContext'

const SummaryCard = () => {
    const {user} = useAuth()
  return (
    // Outer padding for spacing
    <div className='p-6'>
        {/* Main card container with rounded corners, shadow, and a subtle background */}
        <div className='rounded-xl overflow-hidden shadow-lg bg-white transform transition-all duration-300 hover:scale-100 hover:shadow-2xl'>
            <div className='flex items-center'>
                {/* Icon section with red background, prominent icon, and rounded left edge */}
                {/* Changed bg-teal-600 to bg-red-700, added rounded-l-xl for matching card shape */}
                <div className={`text-5xl flex-shrink-0 flex justify-center items-center bg-red-600 text-white p-4 rounded-l-xl`}>
                    <FaUser className="drop-shadow-md"/> {/* Added drop-shadow for icon */}
                </div>
                {/* Content section with padding and improved typography */}
                <div className='pl-6 py-4 flex-grow'> {/* Increased padding-left */}
                    <p className='text-lg font-semibold text-gray-700'>Welcome Back,</p>
                    <p className='text-xl font-extrabold text-gray-900 leading-tight'>{user.name}</p> {/* Increased font size and boldness */}
                </div>
            </div>
        </div>
    </div>
  )
}

export default SummaryCard