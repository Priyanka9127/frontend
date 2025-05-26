// frontend/src/components/Login.jsx

import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/authContext';

// Import your logo image
import logo from '../assets/my_logo.jpg'; // <--- ADJUST THIS PATH IF NECESSARY

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState(null);
    const {login} = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null); // Clear previous errors
        try {
            const response = await axios.post("http://localhost:5000/api/auth/login", { email, password });
            
            if(response.data.success) {
                login(response.data.user);
                localStorage.setItem("token", response.data.token);
                if(response.data.user.role === "admin"){
                    navigate("/admin-dashboard");
                } else {
                    navigate("/employee-dashboard");
                }
            }
        } catch (error) {
            if (error.response && !error.response.data.success) {
                setError(error.response.data.error);
            } else {
                setError("Server Error. Please try again later.");
            }
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
            {/* Main Container for the Login Card */}
            <div className="relative bg-white p-8 rounded-lg shadow-xl w-full max-w-md flex flex-col items-center">
                
                {/* Logo */}
                <div className="mb-6">
                    <img src={logo} alt="Company Logo" className="h-20 w-auto mx-auto" />
                </div>

                {/* Title */}
                <h2 className="text-3xl font-extrabold text-gray-900 mb-2">
                    Welcome Back!
                </h2>
                <p className="text-gray-600 text-center mb-6">
                    Sign in to your Employee Management System account.
                </p>

                {/* Error Message */}
                {error && (
                    <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4 w-full" role="alert">
                        <strong className="font-bold">Error!</strong>
                        <span className="block sm:inline ml-2">{error}</span>
                    </div>
                )}

                {/* Login Form */}
                <form onSubmit={handleSubmit} className="w-full">
                    <div className="mb-4">
                        <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Email address</label>
                        <input
                            type="email"
                            id="email"
                            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-red-500 focus:border-red-500 transition duration-150 ease-in-out"
                            placeholder="your.email@example.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>
                    <div className="mb-6">
                        <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                        <input
                            type="password"
                            id="password"
                            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-red-500 focus:border-red-500 transition duration-150 ease-in-out"
                            placeholder="••••••••"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>

                    <div className="flex items-center justify-between mb-6">
                        <label className="flex items-center text-sm text-gray-700">
                            <input
                                type="checkbox"
                                className="form-checkbox h-4 w-4 text-red-600 border-gray-300 rounded focus:ring-red-500"
                            />
                            <span className="ml-2">Remember me</span>
                        </label>
                        <a href="#" className="text-sm font-medium text-red-600 hover:text-red-700 transition duration-150 ease-in-out">
                            Forgot password?
                        </a>
                    </div>

                    <div>
                        <button
                            type="submit"
                            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-lg font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition duration-200 ease-in-out"
                        >
                            Log In
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default Login;