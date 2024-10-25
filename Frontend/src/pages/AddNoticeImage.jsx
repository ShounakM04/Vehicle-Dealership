import React, { useState, useEffect } from "react";
import { toast } from 'react-toastify';
import axios from "axios";
import { FaTrashAlt } from 'react-icons/fa'; 

function AddNoticeImage() {
  const [images, setImages] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [fetchedImages, setFetchedImages] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedImageSerial, setSelectedImageSerial] = useState(null);

  // Fetch images function to be called on mount and after upload
  const fetchImages = async () => {
    try {
      const response = await axios.get('http://localhost:8000/dashboard/get-notice');
      setFetchedImages(response.data);  
    } catch (error) {
      console.error("Error fetching notice images:", error);
      toast.error("Failed to load notice images");
    }
  };

  // Call fetchImages on component mount
  useEffect(() => {
    fetchImages();
  }, []); 

  const handleImageChange = (e) => {
    setImages([...e.target.files]);
  };

  const handleUpload = async () => {
    setUploading(true);
    const formData = new FormData();
    images.forEach((image) => {
      formData.append('images[]', image);
    });
    formData.append('carNumber', 'MH00AB0000');

    try {
      const response = await axios.post('http://localhost:8000/dashboard/add-notice', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      setImages([]);
      toast.success("Notice Images added successfully!");
      fetchImages(); // Re-fetch images after successful upload
      return response.data;
    } catch (error) {
      console.error("Notice Image upload failed:", error);
      throw new Error("Notice Image upload failed");
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (images.length === 0) {
      toast.error("Please select images to upload.");
      return;
    }

    try {
      await handleUpload();
    } catch (error) {
      if (error.response && error.response.status === 400) {
        if (error.response.data.includes("Registration number already exists")) {
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

  const confirmDelete = (serialnum) => {
    setSelectedImageSerial(serialnum);
    setIsModalOpen(true);
  };

  const handleDelete = async () => {
    try {
      await axios.delete(`http://localhost:8000/dashboard/delete-notice`, {
        params: { serialnum: selectedImageSerial }
      });
      toast.success(`Notice image with serial number ${selectedImageSerial} deleted successfully!`);
      setFetchedImages(fetchedImages.filter(image => image.serialnum !== selectedImageSerial));
    } catch (error) {
      console.error("Error deleting notice image:", error);
      toast.error("Failed to delete notice image");
    } finally {
      setIsModalOpen(false);
      setSelectedImageSerial(null);
    }
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedImageSerial(null);
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

      {/* Display fetched images in cards with a delete button */}
      <div className="mt-8">
        <h2 className="text-xl font-bold mb-4">Uploaded Notice Images</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {fetchedImages.map((image, index) => (
            <div key={index} className="relative border rounded-lg p-4 shadow-lg">
              <img
                src={image.image_urls}
                alt={`Notice ${index + 1}`}
                className="h-48 w-full object-cover rounded-lg"
              />
              <button
                onClick={() => confirmDelete(image.serialnum)}
                className="absolute top-2 right-2 bg-red-500 hover:bg-red-700 text-white p-2 rounded-full"
              >
                <FaTrashAlt />
              </button>
            </div>
          ))}
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
              >
                Yes, Delete
              </button>
              <button
                className="bg-gray-300 hover:bg-gray-400 text-black font-bold py-2 px-4 rounded"
                onClick={closeModal}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default AddNoticeImage;
