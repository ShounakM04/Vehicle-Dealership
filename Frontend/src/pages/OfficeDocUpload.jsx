import React,{useState} from "react";
import { useNavigate } from "react-router-dom";
import { getUploadURL, uploadToS3 } from '../../utils/s3UploadFunctions.jsx';
import { toast } from "react-toastify";

const OfficeDocUpload = () => {

    const [images, setImages] = useState([]);
    const [uploading, setUploading] = useState(false);

    const navigate = useNavigate();


    const handleGoBack = () => {
        navigate('/driverdashboard');
    };

    const handleImageChange = (e) => {
        setImages([...e.target.files]);
    };

    

    const handleSubmit = async (e) => {
        e.preventDefault();


        try {
            // Upload images first
            await handleUpload();

            toast.success("Vehilce images added successfully!");
            navigate('/dashboard');
        } catch (error) {
            
                // Display error message in toast
                console.log("Error in adding Vehicle Images. Please try again!")
                toast.error("Error in adding Vehicle Images. Please try again!");
            
        }
    }

    const handleUpload = async () => {
        setUploading(true);

        try {
            

            // Handle other image uploads if necessary (similar to DisplayImage)
            for (let i = 0; i < images.length; i++) {
                const uniqueID = Date.now(); 
                const image = images[i];
                const imageFileName = `OfficeDocuments/${uniqueID}`;
                const imageUploadURL = await getUploadURL(image, imageFileName);
                await uploadToS3(imageUploadURL, image);
            }

            setUploading(false);
            return true;
        } catch (error) {
            setUploading(false);
            throw error;
        }
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
                </div>
                {/* Form for submitting the vehicle reg ID */}
                

                    <div className='mt-6'>
                        <h2 className="text-xl font-bold mb-2">Upload Images</h2>
                        <input
                            required
                            type="file"
                            accept="image/*"
                            multiple
                            onChange={handleImageChange}
                            className="mb-4"
                        />

                        <div className="flex flex-wrap gap-4 mb-5">
                            {images.map((image, index) => {
                                const imageURL = URL.createObjectURL(image);
                                return (
                                    <img
                                        key={index}
                                        src={imageURL}
                                        alt={`Preview ${index + 1}`}
                                        className="h-32 object-cover rounded-lg shadow-lg"
                                    />
                                );
                            })}
                        </div>
                    </div>
                    <button
                        onClick={handleSubmit}
                        className={`bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline ${uploading ? 'opacity-50 cursor-not-allowed' : ''}`}
                        disabled={uploading}
                    >
                        {uploading ? 'Uploading...' : 'Submit'}
                    </button>
             
            </div>
        </>
    )
}

export default OfficeDocUpload;