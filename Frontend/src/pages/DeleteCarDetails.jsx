import React, { useState } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css'; // Import the CSS for toast notifications
import Modal from 'react-modal'; // Import the react-modal package

// Set up the root element for the modal
Modal.setAppElement('#root');

function DeleteCarDetails() {
  const [deleteID, setDeleteID] = useState(''); // Holds the current input
  const [submittedID, setSubmittedID] = useState(''); // Holds the submitted ID for deletion
  const [submitted, setSubmitted] = useState(false); // To control if the form was submitted
  const [modalOpen, setModalOpen] = useState(false); // To control modal visibility

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault(); // Prevent default form submission
    setSubmittedID(deleteID); // Store the deleteID for deletion
    setDeleteID(''); // Clear the input field after submission
    setSubmitted(true); // Set the form as submitted
  };

  // Simulate deletion from DB and handle success/error with toast notifications
  const deleteEntry = () => {
    try {
      console.log(`Deleting entry for Vehicle with ID: ${submittedID}`);
      // API call goes here: axios.delete(`/api/vehicles/${submittedID}`)
      toast.success(`Vehicle with Reg ID ${submittedID} deleted successfully!`, {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
      setModalOpen(false); // Close the modal after successful deletion
      setSubmitted(false); // Reset the submission state
    } catch (error) {
      toast.error(`Error occurred while deleting vehicle: ${error.message}`, {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
      setModalOpen(false); // Close the modal even if an error occurs
    }
  };

  // Open modal for final confirmation
  const handleDeleteConfirmation = () => {
    setModalOpen(true); // Show modal after clicking the "Confirm" button
  };

  // Close the modal
  const closeModal = () => {
    setModalOpen(false); // Close the modal without deletion
  };

  return (
    <div className="container mx-auto p-16">
      {/* Form for submitting the vehicle reg ID */}
      <form onSubmit={handleSubmit}>
        <h2 className="text-xl font-bold mb-2">Vehicle Details</h2>
        <div>
          <label
            htmlFor="brandName"
            className="block text-gray-700 text-sm font-bold mb-2"
          >
            Vehicle Reg ID
          </label>
          <input
            type="text"
            id="brandName"
            required
            maxLength="10" // Restrict input to 10 characters
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            value={deleteID}
            onChange={(e) => setDeleteID(e.target.value)}
          />
        </div>
        <button
          type="submit"
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline mt-6"
        >
          Submit
        </button>
      </form>

      {/* Display confirmation section only after form is submitted */}
      {submitted && (
        <div className="mt-8 p-4 bg-gray-100 rounded-lg shadow">
          <h3 className="text-lg font-semibold">Car Details for Deletion</h3>
          <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Cumque, explicabo?</p>
          
          {/* First-stage confirm button */}
          <button
            onClick={handleDeleteConfirmation}
            className="bg-yellow-500 hover:bg-yellow-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline mt-4"
          >
            Confirm
          </button>
        </div>
      )}

      {/* Modal for final confirmation */}
      <Modal
        isOpen={modalOpen}
        onRequestClose={closeModal}
        contentLabel="Confirm Deletion"
        className="bg-white p-8 rounded-lg shadow-lg max-w-md mx-auto mt-20"
        overlayClassName="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center"
      >
        <h3 className="text-lg font-semibold mb-4">Confirm Deletion</h3>
        <p>Are you sure you want to delete the vehicle with reg No.: {submittedID}?</p>
        <div className="mt-6">
          <button
            onClick={deleteEntry}
            className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline mr-2"
          >
            Confirm Delete
          </button>
          <button
            onClick={closeModal}
            className="bg-gray-300 hover:bg-gray-500 text-gray-800 font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
          >
            Cancel
          </button>
        </div>
      </Modal>

      {/* Toast Container to render toast notifications */}
      <ToastContainer />
    </div>
  );
}

export default DeleteCarDetails;
