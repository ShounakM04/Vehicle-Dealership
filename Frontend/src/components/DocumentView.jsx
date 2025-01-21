import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import axios from "axios";
import { FaTrashAlt } from 'react-icons/fa';
import { useParams, useNavigate } from 'react-router-dom'
import { FaFileAlt } from "react-icons/fa";
export default function DocumentView({ isOffice }) {
    const [fetchedImages, setFetchedImages] = useState([]);
    const [fetchedDescription, setFetchedDescription] = useState([]);
    const [fetchedUniqueIds, setFetchedUniqueIds] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedImageSerial, setSelectedImageSerial] = useState(null);
    const [isLoading, setIsLoading] = useState(false); // State for screen overlay


    const { id } = useParams();
    const navigate = useNavigate();

    // Initialize a state to track image errors for all documents
    const [imageErrors, setImageErrors] = useState({});

    // Handler function to update imageErrors state
    const handleImageError = (index) => {
        setImageErrors((prevErrors) => ({
            ...prevErrors,
            [index]: true, // Mark this index as having an image load error
        }));
    };


    const fetchImages = async () => {
        try {

            let folderPath = 'OfficeDocuments';
            if (id) {
                folderPath = `${id}/AdminDocuments`;
            }
            const response1 = await axios.get('http://localhost:8000/get-images', {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('authToken')}`
                },
                params: {
                    folderPath: folderPath
                }
            });
            setFetchedImages(response1.data);

            const response2 = await axios.get('http://localhost:8000/Description', {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('authToken')}`
                }
            });
            setFetchedDescription(response2.data.descriptions);
            setFetchedUniqueIds(response2.data.uniqueids);


            // console.log(response2.data);
            // console.log(response1.data);

        } catch (error) {
            console.error("Error fetching notice images:", error);
            toast.error("Failed to load notice images");
        }
    };

    // Call fetchImages on component mount
    useEffect(() => {
        fetchImages();
    }, []);


    const handleGoBack = () => {

        if (isOffice == true) {
            navigate("/dashboard");
        }
        else { navigate(`/dashboard/costReport/${id}`); }


    };

    const confirmDelete = (serialnum) => {
        setSelectedImageSerial(serialnum);
        setIsModalOpen(true);
    };

    const handleDelete = async () => {
        try {
            setIsLoading(true); // Start fade-up effect
            const deleteUrl = fetchedImages[selectedImageSerial];
            // console.log("Del : " + deleteUrl);

            // Extract the uniqueID from the URL
            let regex = /\/OfficeDocuments\/(\d+)\?/;

            if (!isOffice) {
                regex = new RegExp(`/${id}/AdminDocuments/(\\d+)\\?`);
            }
            const match = deleteUrl.match(regex);
            let uniqueID;

            if (match) {
                uniqueID = match[1];
                // console.log(uniqueID);
            } else {
                // console.log('No unique ID found');
            }

            let path = `OfficeDocuments/${uniqueID}`;

            if (!isOffice || isOffice != true) {
                path = `${id}/AdminDocuments/${uniqueID}`;
            }

            // console.log(uniqueID);

            await axios.delete(`http://localhost:8000/delete-image`, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('authToken')}`
                }, params: { path: path, uniqueID: uniqueID }
            });
            toast.success(`Notice image with serial number ${selectedImageSerial} deleted successfully!`);

            // Update the state to reflect the change
            setFetchedImages((prevImages) =>
                prevImages.filter((_, index) => index !== selectedImageSerial)
            );

        } catch (error) {
            console.error("Error deleting notice image:", error);
            toast.error("Failed to delete notice image");
        } finally {
            setIsLoading(false); // Remove fade-up effect
            setIsModalOpen(false);
            setSelectedImageSerial(null);
        }
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setSelectedImageSerial(null);
    };



    let descMap;

    return (
        <>
            <div className="container mx-auto pl-16 pr-16 pb-16 pt-8">

                <div className="mb-4">
                    <button
                        onClick={handleGoBack}
                        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:ring focus:ring-blue-300 transition"
                    >
                        Back to Dashboard
                    </button>



                    <div className="py-4 w-full">
                        {fetchedImages.length === 0 && (
                            <div className="flex flex-col items-center py-4">
                                <p>No Admin Documents Exist!</p>
                            </div>
                        )}


                        {/* Create a map of uniqueId to description */}
                        {(() => {
                            descMap = new Map();
                            fetchedUniqueIds.forEach((uniqueId, index) => {
                                descMap.set(uniqueId, fetchedDescription[index] || "No Description Available");
                            });
                            return null; // No UI change, only map creation
                        })()}

                        {/* Table-like structure */}
                        <div className="border border-gray-300 rounded-lg overflow-hidden">
                            {/* Table Header */}
                            <div className="flex bg-gray-200 text-gray-700 font-semibold py-4">
                                <div className="w-1/3 px-4 text-center border-r border-gray-300">Description</div>
                                <div className="w-2/3 px-4 text-center">Document (Click to Download)</div>
                            </div>

                            {/* Table Rows */}
                            {fetchedImages?.map((url, index) => {
                                let extractedUniqueid = null;

                                // Check and extract uniqueid for both types of paths
                                const officeDocMatch = url.match(/OfficeDocuments\/(\d+)/);
                                const adminDocMatch = url.match(/\/[A-Z0-9]+\/AdminDocuments\/(\d+)/);

                                if (officeDocMatch) {
                                    // Extract uniqueid from OfficeDocuments
                                    extractedUniqueid = officeDocMatch[1];
                                } else if (adminDocMatch) {
                                    // Extract uniqueid from AdminDocuments pattern
                                    extractedUniqueid = adminDocMatch[1];
                                }

                                // Fetch description from the map
                                const description = extractedUniqueid && descMap.has(extractedUniqueid)
                                    ? descMap.get(extractedUniqueid)
                                    : "No Description Available";

                                return (
                                    <div
                                        key={index}
                                        className="flex flex-col md:flex-row items-center justify-between w-full py-6 border-t"
                                    >
                                        {/* Description Column */}
                                        <div className="w-full md:w-1/3 px-4 text-center md:text-right border-r border-gray-300">
                                            <p className="text-md font-medium">{description}</p>
                                        </div>

                                        {/* Document Column */}
                                        <div className="w-full md:w-2/3 px-4 flex flex-col items-center">
                                            <div className="relative w-full md:w-3/4">
                                                <a
                                                    href={url}
                                                    download
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="block"
                                                >
                                                    {/* Attempt to load image */}
                                                    {!imageErrors[index] ? (
                                                        <img
                                                            src={url}
                                                            alt={`Document ${index + 1}`}
                                                            className="w-full rounded-lg shadow-lg cursor-pointer hover:opacity-80"
                                                            title="Click to Download Image"
                                                            onError={() => handleImageError(index)} // Handle error by updating state
                                                        />
                                                    ) : (
                                                        // Fallback to generic document icon
                                                        <div className="flex flex-col items-center justify-center border border-gray-300 rounded-lg p-4 shadow-lg">
                                                            <FaFileAlt className="text-gray-600 text-5xl mb-2" />
                                                            <p className="text-blue-500 underline">Click to Download</p>
                                                        </div>
                                                    )}
                                                </a>

                                                {/* Delete Button */}
                                                <div className="flex justify-end mt-2">
                                                    <button
                                                        className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-full focus:outline-none focus:ring focus:ring-blue-300 transition"
                                                        onClick={() => confirmDelete(index)}
                                                    >
                                                        <FaTrashAlt />
                                                    </button>
                                                </div>
                                            </div>
                                        </div>


                                    </div>
                                );
                            })}
                        </div>
                    </div>


                </div>

                {/* Confirmation Modal */}
                {isModalOpen && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                        <div className="bg-white p-6 rounded-lg shadow-lg max-w-sm w-full">
                            <h3 className="text-lg font-semibold mb-4">Are you sure you want to delete this image?</h3>
                            <div className="flex justify-end">
                                <button
                                    className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded mr-2"
                                    onClick={handleDelete}
                                    disabled={isLoading}
                                >
                                    Yes, Delete
                                </button>
                                <button
                                    className="bg-gray-300 hover:bg-gray-400 text-black font-bold py-2 px-4 rounded"
                                    onClick={closeModal}
                                    disabled={isLoading}
                                >
                                    Cancel
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>

        </>
    )
}