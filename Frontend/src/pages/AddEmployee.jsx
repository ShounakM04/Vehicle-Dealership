import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from "react-toastify";

function AddEmployee() {
    const [username, setUsername] = useState('');
    const [userID, setUserID] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();
    const [errorMessage, setErrorMessage] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    async function loginHandler(event) {
        event.preventDefault();
        setErrorMessage('');
        if (username.trim() === '' || password.trim() === '') {
            alert('Please enter both username and password.');
            setUsername('');
            setPassword('');
            return;
        }

        const endpoint = "https://www.nikhilmotors.com/api/register?isEmployee=true";

        try {
            setIsLoading(true);
            const requestBody = {
                userID: userID.trim().toLowerCase(),
                userName: username.trim().toLowerCase(),
                userPassword: password.trim().toLowerCase(),
                userDesignation: 'Employee'
            };

            const response = await axios.post(endpoint, requestBody, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('authToken')}`
                }
            });
            // toast.success("Added Employee successfully", { position: "top-center", autoClose: 3000 });
            alert("Added Employee successfully");
            setIsLoading(false);
            navigate("/dashboard");
        } catch (error) {
            setIsLoading(false);
            if (error.response) {
                if (error.response.status === 400) {
                    setErrorMessage("User with the same userID or userName already exists.");
                } else if (error.response.status === 401) {
                    setErrorMessage("Unauthorized access.");
                } else {
                    setErrorMessage("An error occurred while registering. Please try again.");
                }
            } else if (error.request) {
                setErrorMessage("Server is not responding. Please try again later.");
            } else {
                setErrorMessage("There was an error during the registration process.");
            }
            toast.error("Registration failed.", { position: "top-center", autoClose: 2000 });
        }
    }

    return (
        <div className='flex items-center justify-center h-[calc(100vh-80px)] bg-blue-200'>
            <form className='bg-blue-50 shadow-lg rounded-lg p-8 w-full max-w-md'>
                <h2 className='text-center text-2xl font-semibold text-gray-800 mb-6'>
                    Employee Registration
                </h2>
                <div className='mb-4'>
                    <label className='block text-gray-700 font-medium mb-2'>User ID</label>
                    <input
                        type="text"
                        name="userID"
                        value={userID}
                        onChange={(event) => setUserID(event.target.value)}
                        className='w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none'
                        required
                    />
                </div>
                <div className='mb-4'>
                    <label className='block text-gray-700 font-medium mb-2'>Username</label>
                    <input
                        type="text"
                        name="username"
                        value={username}
                        onChange={(event) => setUsername(event.target.value)}
                        className='w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none'
                        required
                    />
                </div>
                <div className='mb-4'>
                    <label className='block text-gray-700 font-medium mb-2'>Password</label>
                    <input
                        type="password"
                        name="password"
                        value={password}
                        onChange={(event) => setPassword(event.target.value)}
                        className='w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none'
                        required
                    />
                </div>
                <button
                    type='submit'
                    onClick={loginHandler}
                    className='w-full py-2 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500'
                >
                    {isLoading ? "Registering..." : "Register"}
                </button>
                {errorMessage && (
                    <p className='mt-4 text-center text-red-600 text-sm'>{errorMessage}</p>
                )}
            </form>
        </div>
    );
}

export default AddEmployee;
