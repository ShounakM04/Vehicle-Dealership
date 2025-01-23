// import React, { useState } from 'react';
// import { useNavigate } from 'react-router-dom';
// import axios from 'axios';
// import { jwtDecode } from "jwt-decode";
// import { toast } from "react-toastify";


// function AddDriver() {
//     const [username, setUsername] = useState('');
//     const [userID, setUserID] = useState('');
//     const [password, setPassword] = useState('');
//     const navigate = useNavigate();
//     const [errorMessage, setErrorMessage] = useState('');
//     const [isLoading, setIsLoading] = useState(false);



//     async function loginHandler(event) {
//         event.preventDefault();
//         setErrorMessage('');
//         if (username.trim() === '' || password.trim() === '') {
//             alert('Please enter both username and password.');
//             setUsername('');
//             setPassword('');
//             return;
//         }

//         const endpoint = "http://localhost:8000/register?isDriver=true"; // Update with your actual endpoint

//         try {
//             setIsLoading(true);
//             // Trim and convert username and password to lowercase
//             const trimmedUserID = userID.trim().toLowerCase();
//             const trimmedUsername = username.trim().toLowerCase();
//             const trimmedPassword = password.trim().toLowerCase();
//             // Prepare the body with the necessary fields
//             const requestBody = {
//                 userID: trimmedUserID,
//                 userName: trimmedUsername,  // Assuming 'userName' is the same as 'userID'
//                 userPassword: trimmedPassword,
//                 userDesignation: 'Driver'   // Hardcoded as 'Driver'
//             };

//             const response = await axios.post(endpoint, requestBody,
//                 {
//                     headers: {
//                         Authorization: `Bearer ${localStorage.getItem('authToken')}`
//                     }
//                 });
//             toast.success("Added Driver successfully", { position: "top-center", autoClose: 3000 });
//             setIsLoading(false);
//             navigate("/dashboard");
//         } catch (error) {
//             // Hide loader when there's an error
//             setIsLoading(false);

//             if (error.response) {
//                 // Server responded with a status other than 2xx
//                 console.error("Registration failed: ", error.response.data);

//                 // Check for specific error codes and set corresponding error messages
//                 if (error.response.status === 400) {
//                     setErrorMessage("User with the same userID or userName already exists.");
//                 } else if (error.response.status === 401) {
//                     setErrorMessage("Unauthorized access.");
//                 } else {
//                     setErrorMessage("An error occurred while registering. Please try again.");
//                 }
//             } else if (error.request) {
//                 // Request was made but no response was received
//                 console.error("No response received: ", error.request);
//                 setErrorMessage("Server is not responding. Please try again later.");
//             } else {
//                 // Something else happened in setting up the request
//                 console.error("Error setting up the request: ", error.message);
//                 setErrorMessage("There was an error during the registration process.");
//             }

//             // Show error notification
//             toast.error("Registration failed.", { position: "top-center", autoClose: 2000 });
//         }

//     }


//     return (
//         <div className='flex items-center justify-center h-[calc(100vh-80px)] bg-gradient-to-r from-green-400 to-blue-500 p-4'>
//             <form className='bg-white shadow-lg rounded-lg p-6 sm:p-8 w-full max-w-md' onSubmit={loginHandler}>
//                 <div className='mb-6 sm:mb-8 text-center font-bold text-2xl sm:text-4xl text-gray-800'>
//                     <p>Driver Registration</p>
//                 </div>
//                 <div className='mb-4 sm:mb-6'>
//                     <label className='block mb-2 text-gray-700 font-medium'>USER ID:</label>
//                     <input
//                         type="text"
//                         name="userID"
//                         value={userID}
//                         className='w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500'
//                         required
//                         onChange={(event) => { setUserID(event.target.value) }}
//                     />
//                 </div>
//                 <div className='mb-4 sm:mb-6'>
//                     <label className='block mb-2 text-gray-700 font-medium'>USERNAME:</label>
//                     <input
//                         type="text"
//                         name="username"
//                         value={username}
//                         className='w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500'
//                         required
//                         onChange={(event) => { setUsername(event.target.value) }}
//                     />
//                 </div>
//                 <div className='mb-4 sm:mb-6'>
//                     <label className='block mb-2 text-gray-700 font-medium'>PASSWORD:</label>
//                     <input
//                         type="password"
//                         name="password"
//                         value={password}
//                         className='w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500'
//                         required
//                         onChange={(event) => { setPassword(event.target.value) }}
//                     />
//                 </div>
//                 <div className='text-center'>
//                     <button
//                         type='submit'
//                         className='w-full px-3 py-2 bg-green-500 text-white font-bold rounded-lg hover:bg-green-600 transition-colors duration-300'
//                     >
//                         {isLoading ? (
//                             <span className="loader">Registering...</span> // Simple text loader, you can add a spinner here
//                         ) : (
//                             "Register"
//                         )}
//                     </button>
//                 </div>

//                 {/* Display error message */}
//                 {errorMessage && <p className='mt-4 text-red-600 text-center'>{errorMessage}</p>}
//             </form>
//         </div>
//     );
// }

// export default AddDriver;


import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from "react-toastify";

function AddDriver() {
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

        const endpoint = "http://localhost:8000/register?isDriver=true";

        try {
            setIsLoading(true);
            const requestBody = {
                userID: userID.trim().toLowerCase(),
                userName: username.trim().toLowerCase(),
                userPassword: password.trim().toLowerCase(),
                userDesignation: 'Driver'
            };

            const response = await axios.post(endpoint, requestBody, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('authToken')}`
                }
            });
            // toast.success("Added Driver successfully", { position: "top-center", autoClose: 3000 });
            alert("Added Driver successfully!");
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
                    Driver Registration
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

export default AddDriver;
