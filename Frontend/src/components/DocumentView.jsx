import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import axios from "axios";
import { useParams, useNavigate } from 'react-router-dom'

export default function DocumentView() {
    const [fetchedImages, setFetchedImages] = useState([]);
    const { id } = useParams();
    const navigate = useNavigate();


    const fetchImages = async () => {
        try {

            let folderPath = 'OfficeDocuments';
            if (id) {
                folderPath = `${id}/AdminDocuments`;
            }
            const response = await axios.get('https://vehicle-dealership.vercel.app/dashboard/get-images', {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('authToken')}`
                },
                params: {
                    folderPath: folderPath
                }
            });
            setFetchedImages(response.data);
            console.log(response.data);
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

        navigate('/dashboard');


    };

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

                    {fetchedImages.length == 0 &&
                        <div className="flex flex-col items-center py-4">
                            <p>No Admin Images Exists!</p>
                        </div>
                    }
                    <div className="flex flex-col items-center py-4">
                        {fetchedImages && fetchedImages.map((url, index) => (
                            <img
                                key={index}
                                src={url}
                                alt={`Document ${index + 1}`}
                                className="w-1/2 mb-4 rounded-lg shadow-lg"
                            />
                        ))}
                    </div>
                </div>
            </div>

        </>
    )
}