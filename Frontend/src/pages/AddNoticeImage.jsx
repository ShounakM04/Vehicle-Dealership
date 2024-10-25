import React from "react";
import { useState } from "react";
import { toast } from 'react-toastify';

function AddNoticeImage() {

  const [images, setImages] = useState([]);
  const [uploading, setUploading] = useState(false);

  const handleImageChange = (e) => {
    setImages([...e.target.files]);
  };


  const handleUpload = async () => {
    setUploading(true);
    const formData = new FormData();
    images.forEach((image) => {
      formData.append('images[]', image);
    });
    // formData.append('carNumber', registrationNumber); // Add registration number to the form data
    //////////////////////
    //here logic of independent upload function should be applied and different insert query should be applied
    try {
      const response = await axios.post('http://localhost:8000/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data;
    } catch (error) {
      console.error("Image upload failed:", error);
      throw new Error("Image upload failed");
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();


    try {


      await handleUpload(); // Now upload images only after form submission
      toast.success("Car details added successfully!");
      //console.log(response.data);
    } catch (error) {
      if (error.status === 400) {
        if (error.message.includes("Registration number already exists")) {
          toast.error("Registration number already exists. Please enter a unique registration number.");
        } else {
          toast.error("Error submitting the form. Please check your inputs.");
        }
      } else {
        toast.error("An error occurred while saving details");
      }
      console.log(error);
    }
  };


  return (
    <div className="m-8">
      <form onSubmit={handleSubmit}>
        <h2 className="text-xl font-bold mb-2">Upload Notice Image </h2>
        <input
          type="file"
          multiple
          accept="image/*"
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

        <button
          type="submit"
          className={`bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline ${uploading ? 'opacity-50 cursor-not-allowed' : ''}`}
          disabled={uploading}
        >
          {uploading ? 'Uploading...' : 'Submit'}
        </button>
      </form>
    </div>

  )
}

export default AddNoticeImage;