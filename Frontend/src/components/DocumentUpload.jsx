// import React, { useState, useEffect } from "react";
// import { useNavigate, useParams } from "react-router-dom";
// import { getUploadURL, uploadToS3 } from '../../utils/s3UploadFunctions.jsx';
// import { toast } from "react-toastify";
// import axios from "axios";
// import { jwtDecode } from "jwt-decode";

// const DocumentUpload = ({ isOffice }) => {

//     const [images, setImages] = useState([]);
//     const [uploading, setUploading] = useState(false);
//     const [description, setDescription] = useState("");
//     const [isAdmin, setIsAdmin] = useState(false);
//     const [isEmployee, setIsEmployee] = useState(false);


//     const navigate = useNavigate();

//     const { id } = useParams();

//     // console.log(id);

//     function fetchRole() {
//         const token = localStorage.getItem("authToken");
//         let decodedToken;
//         if (token) {
//             try {
//                 decodedToken = jwtDecode(token);
//                 // console.log(decodedToken);
//             } catch (error) {
//                 console.error("Invalid token", error);
//             }
//         }
//         if (decodedToken?.isAdmin && decodedToken.isAdmin == true) {
//             setIsAdmin(true);
//         } else if (decodedToken?.isEmployee && decodedToken.isEmployee == true) {
//             setIsEmployee(true);
//         }
//     }

//     useEffect(() => {
//         fetchRole();
//     }, []);

//     const handleGoBack = () => {
//         if (isOffice) {
//             // navigate('/dashboard', { replace: true }); // Replace the current entry
//             navigate(-1);
//         } else if (!id) {
//             // navigate('/driverdashboard', { replace: true }); // Replace the current entry
//             navigate(-1);
//         } else {
//             // navigate(`/dashboard/costReport/${id}`, { replace: true }); // Replace the current entry
//             navigate(-1);
//         }
//     };


//     const handleImageChange = (e) => {
//         setImages([...e.target.files]);
//     };



//     const handleSubmit = async (e) => {
//         e.preventDefault();


//         try {
//             // Upload images first
//             await handleUpload();

//             // toast.success("Documents added successfully!");
//             // if (window.location.pathname.includes('/dashboard')) {
//             //     // If the current URL contains '/dashboard', navigate to '/dashboard'
//             //     navigate('/dashboard');
//             // } else {
//             //     // Otherwise, navigate to '/driverdashboard'
//             //     navigate('/driverdashboard');
//             // }

//             alert("Documents added successfully!");

//             handleGoBack();
//         } catch (error) {

//             // Display error message in toast
//             console.log("Error in adding Vehicle Images. Please try again!")
//             toast.error("Error in adding Vehicle Images. Please try again!");

//         }
//     }

//     const addDescription = async (uniqueID) => {
//         try {
//             let docType = (isOffice == true) ? "Office" : "Vehicle";

//             let docuploadedby;
//             if (isAdmin) {
//                 docuploadedby = "Admin";
//             }
//             else if (isEmployee) {
//                 docuploadedby = "Employee";
//             }

//             await axios.post('https://www.nikhilmotors.com/api/Description',
//                 {
//                     uniqueID: uniqueID,
//                     description: description,
//                     docType: docType,
//                     docuploadedby: docuploadedby
//                 },
//                 {
//                     headers: {
//                         Authorization: `Bearer ${localStorage.getItem('authToken')}`
//                     }
//                 }
//             );

//         } catch (error) {
//             console.log(`Error occured while saving Description : ${error}`);
//         }
//         return;
//     }

//     const handleUpload = async () => {
//         setUploading(true);

//         try {
//             let folder = 'OfficeDocuments';
//             if (id) {
//                 folder = `${id}/AdminDocuments`;
//             }

//             // Handle other image uploads if necessary (similar to DisplayImage)
//             for (let i = 0; i < images.length; i++) {
//                 const uniqueID = Date.now();
//                 const image = images[i];
//                 const imageFileName = `${folder}/${uniqueID}`;
//                 const imageUploadURL = await getUploadURL(image, imageFileName);
//                 await uploadToS3(imageUploadURL, image);
//                 // console.log("Descp : " + description)
//                 await addDescription(uniqueID);

//             }

//             setUploading(false);
//             return true;
//         } catch (error) {
//             setUploading(false);
//             throw error;
//         }
//     };




//     return (
//         <>
//             <div className="container mx-auto pl-16 pr-16 pb-16 pt-8">
//                 <div className="mb-4">
//                     <button
//                         onClick={handleGoBack}
//                         className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:ring focus:ring-blue-300 transition"
//                     >
//                         Back to Dashboard
//                     </button>
//                 </div>

//                 {id && <h2 className="text-xl font-bold mb-2 mt-2">Register Number : {id}</h2>
//                 }
//                 <div className='mt-6'>
//                     <h2 className="text-xl font-bold mb-2">Upload Documents</h2>
//                     <input
//                         required
//                         type="file"
//                         multiple
//                         onChange={handleImageChange}
//                         className="mb-4"
//                     />

//                     <div className="flex flex-wrap gap-4 mb-5">
//                         {images?.map((image, index) => {
//                             const imageURL = URL.createObjectURL(image);
//                             return (
//                                 <img
//                                     key={index}
//                                     src={imageURL}
//                                     alt={`Preview ${index + 1}`}
//                                     className="h-32 object-cover rounded-lg shadow-lg"
//                                 />
//                             );
//                         })}
//                     </div>
//                     <div className="mb-4">
//                         <label htmlFor="description" className="block text-gray-700 text-sm font-semibold mb-2">Description</label>
//                         <textarea
//                             id="description"
//                             className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring focus:ring-teal-300"
//                             value={description}
//                             onChange={(e) => setDescription(e.target.value)}

//                         />
//                     </div>
//                 </div>
//                 <button
//                     onClick={handleSubmit}
//                     className={`bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline ${uploading ? 'opacity-50 cursor-not-allowed' : ''}`}
//                     disabled={uploading}
//                 >
//                     {uploading ? 'Uploading...' : 'Submit'}
//                 </button>

//             </div>
//         </>
//     )
// }

// export default DocumentUpload;


import React, { useState, useRef, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getUploadURL, uploadToS3 } from '../../utils/s3UploadFunctions.jsx';
import { toast } from "react-toastify";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import { Camera, X } from 'lucide-react';

const DocumentUpload = ({ isOffice }) => {
    const [images, setImages] = useState([]);
    const [uploading, setUploading] = useState(false);
    const [description, setDescription] = useState("");
    const [isAdmin, setIsAdmin] = useState(false);
    const [isEmployee, setIsEmployee] = useState(false);

    const navigate = useNavigate();
    const { id } = useParams();
    const cameraInputRef = useRef(null);

    useEffect(() => {
        fetchRole();
    }, []);

    function fetchRole() {
        const token = localStorage.getItem("authToken");
        let decodedToken;
        if (token) {
            try {
                decodedToken = jwtDecode(token);
            } catch (error) {
                console.error("Invalid token", error);
            }
        }
        if (decodedToken?.isAdmin && decodedToken.isAdmin == true) {
            setIsAdmin(true);
        } else if (decodedToken?.isEmployee && decodedToken.isEmployee == true) {
            setIsEmployee(true);
        }
    }

    const handleImageChange = (e) => {
        const newFiles = Array.from(e.target.files);
        setImages(prevImages => [...prevImages, ...newFiles]);

        // Reset the input to allow re-selection of the same files
        if (e.target.type === 'file') {
            e.target.value = '';
        }
    };

    const removeImage = (indexToRemove) => {
        setImages(prevImages =>
            prevImages.filter((_, index) => index !== indexToRemove)
        );
    };

    const triggerCameraInput = () => {
        if (cameraInputRef.current) {
            cameraInputRef.current.click();
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            await handleUpload();
            alert("Documents added successfully!");
            navigate(-1);
        } catch (error) {
            toast.error("Error in adding Vehicle Images. Please try again!");
        }
    }

    const handleUpload = async () => {
        setUploading(true);

        try {
            let folder = 'OfficeDocuments';
            if (id) {
                folder = `${id}/AdminDocuments`;
            }

            for (let i = 0; i < images.length; i++) {
                const uniqueID = Date.now() + i;
                const image = images[i];
                const imageFileName = `${folder}/${uniqueID}`;
                const imageUploadURL = await getUploadURL(image, imageFileName);
                await uploadToS3(imageUploadURL, image);
                await addDescription(uniqueID);
            }

            setUploading(false);
            return true;
        } catch (error) {
            setUploading(false);
            throw error;
        }
    };

    const addDescription = async (uniqueID) => {
        try {
            let docType = (isOffice == true) ? "Office" : "Vehicle";
            let docuploadedby = isAdmin ? "Admin" : (isEmployee ? "Employee" : "");

            await axios.post('https://www.nikhilmotors.com/api/Description',
                {
                    uniqueID: uniqueID,
                    description: description,
                    docType: docType,
                    docuploadedby: docuploadedby
                },
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('authToken')}`
                    }
                }
            );
        } catch (error) {
            console.log(`Error occurred while saving Description : ${error}`);
        }
    }

    return (
        <div className="container mx-auto pl-16 pr-16 pb-16 pt-8">
            <div className="mb-4">
                <button
                    onClick={() => navigate(-1)}
                    className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:ring focus:ring-blue-300 transition"
                >
                    Back to Dashboard
                </button>
            </div>

            {id && <h2 className="text-xl font-bold mb-2 mt-2">Register Number : {id}</h2>}

            <div className="mt-6">
                <h2 className="text-xl font-bold mb-4">Upload Documents</h2>

                {/* Camera Capture Input */}
                <input
                    type="file"
                    ref={cameraInputRef}
                    multiple
                    accept="image/*"
                    capture="environment"
                    onChange={handleImageChange}
                    className="hidden"
                />

                {/* File Selection Input */}
                <div className="flex flex-col md:flex-row md:space-x-4 mb-4">
                    <button
                        type="button"
                        onClick={triggerCameraInput}
                        className="flex items-center bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 mb-2 md:mb-0"
                    >
                        <Camera className="mr-2" size={20} />
                        Camera
                    </button>

                    <label
                        htmlFor="fileInput"
                        className="flex items-center bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 cursor-pointer"
                    >
                        <input
                            id="fileInput"
                            type="file"
                            multiple
                            accept="image/*"
                            onChange={handleImageChange}
                            className="hidden"
                        />
                        Choose Files
                    </label>
                </div>

                {/* Image Preview Grid */}
                {images.length > 0 && (
                    <div className="grid grid-cols-3 gap-4 mb-5">
                        {images.map((image, index) => {
                            const imageURL = URL.createObjectURL(image);
                            return (
                                <div key={index} className="relative">
                                    <img
                                        src={imageURL}
                                        alt={`Preview ${index + 1}`}
                                        className="w-full h-32 object-cover rounded-lg shadow-lg"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => removeImage(index)}
                                        className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                                    >
                                        <X size={16} />
                                    </button>
                                </div>
                            );
                        })}
                    </div>
                )}

                <div className="mb-4">
                    <label htmlFor="description" className="block text-gray-700 text-sm font-semibold mb-2">
                        Description
                    </label>
                    <textarea
                        id="description"
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring focus:ring-teal-300"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        placeholder="Add a description for your images..."
                    />
                </div>
            </div>


            <button
                onClick={handleSubmit}
                className={`bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline ${uploading ? 'opacity-50 cursor-not-allowed' : ''}`}
                disabled={uploading || images.length === 0}
            >
                {uploading ? 'Uploading...' : 'Submit'}
            </button>
        </div>
    )
}

export default DocumentUpload;