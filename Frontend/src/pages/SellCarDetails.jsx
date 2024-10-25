import React, { useState } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Modal from 'react-modal';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

Modal.setAppElement('#root');

function SellCarDetails() {
  const [deleteID, setDeleteID] = useState('');
  const [carData, setCarData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const [formData, setFormData] = useState({
    sellingPrice: '',
    ownerName: '',
    contactNo: '',
    downPayment: '',
    totalInstallments: '',
    installmentAmount: '',
    commission: '',
    insuranceDocument: null,
    carPhoto: null,
    carID: ''
  });
  const [submittedID, setSubmittedID] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);

  const navigate = useNavigate();

  // Fetch car details using the submitted ID
  const fetchCarDetails = async (currDeleteId) => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get(`http://localhost:8000/car/${currDeleteId}`);
      setCarData(response.data);
      console.log(response.data);
    } catch (err) {
      setCarData(null);
      console.error('Error fetching car details:', err);
      setError('Error fetching car details');
    } finally {
      setLoading(false);
    }
  };

  const handleSellConfirmation = () => {
    setModalOpen(true);
  };

  // Handle form submission
  const handleSubmitID = async (e) => {
    e.preventDefault();
    const currDeleteId = deleteID;
    formData.carID = currDeleteId;

    setSubmittedID(deleteID);
    setDeleteID('');
    setSubmitted(true);
    await fetchCarDetails(currDeleteId);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleFileChange = (e) => {
    const { name, files } = e.target;
    setFormData({ ...formData, [name]: files[0] });
  };

  const handleSubmit = async () => {
    try {
      console.log(formData);
      await axios.post('http://localhost:8000/dashboard/sell-car', {
        formData,
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      toast.success('Car sold successfully!', { position: 'top-right' });
      setCarData(null);
      setSubmitted(false);
    } catch (error) {
      toast.error('Error selling car. Try again.', { position: 'top-right' });
    }
    setModalOpen(false);
  };

  const handleGoBack = () => {
    navigate('/dashboard/sellCarDetails');
  };

  // Close the modal
  const closeModal = () => {
    setModalOpen(false);
  };

  return (
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
      <form onSubmit={handleSubmitID}>
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
            maxLength="10"
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            value={deleteID}
            onChange={(e) => setDeleteID(e.target.value)}
          />
        </div>
        <button
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline mt-6"
        >
          Submit
        </button>
      </form>

      {/* Error Message */}
      {error && !loading && (
        <div className="mt-4 p-4 bg-red-100 border border-red-500 rounded text-center text-red-700">
          {error}
        </div>
      )}

      {/* No data found message */}
      {!carData && submitted && !loading && !error && (
        <p className="text-center mt-4">No data found for this ID.</p>
      )}

      {submitted && carData && carData.car && carData.car.status === false && (
        <div className="mt-8 p-4 bg-gray-100 rounded-lg shadow">
          <div className="container mx-auto">
            <main className="py-10">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-white shadow-md rounded-md p-4 ">
                  <h1 className="text-2xl font-bold mb-4 mt-16">
                    {carData.car.carcompany} {carData.car.carname}
                  </h1>

                  <div>
                    <img
                      src={carData.images[0]}
                      alt={`Car ${carData.car.carname}`}
                      className="w-full h-auto rounded-t-lg"
                    />
                  </div>
                </div>

                <div className="bg-white shadow-md rounded-md p-4">
                  <h2 className="text-2xl font-bold mb-4">{carData.car.carname} Details</h2>
                  <h3 className="text-lg font-semibold mb-2">Car Information</h3>
                  <ul>
                    <li className="flex justify-between items-center mb-2">
                      <span className="font-semibold">Car Name:</span>
                      <span>{carData.car.carname}</span>
                    </li>
                    <li className="flex justify-between items-center mb-2">
                      <span className="font-semibold">Make:</span>
                      <span>{carData.car.carmake}</span>
                    </li>
                    <li className="flex justify-between items-center mb-2">
                      <span className="font-semibold">Company:</span>
                      <span>{carData.car.carcompany}</span>
                    </li>
                    <li className="flex justify-between items-center mb-2">
                      <span className="font-semibold">Color:</span>
                      <span>{carData.car.carcolor}</span>
                    </li>
                    <li className="flex justify-between items-center mb-2">
                      <span className="font-semibold">Price:</span>
                      <span>{carData.car.carprice}</span>
                    </li>
                  </ul>
                </div>
              </div>
            </main>
          </div>
        </div>
      )}

      {submitted && carData && carData.car && carData.car.status === true && (
        <div className="mt-4 p-4 bg-green-100 border border-green-500 rounded text-center text-green-700">
          Already Sold
        </div>
      )}

      {/* Sell Car Form */}
      {submitted && carData && carData.car && carData.car.status === false && (
        <>
          <form className="bg-white shadow-md rounded px-8 pt-6 pb-8 mt-4">
            <h2 className="text-xl font-bold mb-4">Sell Car Form</h2>

            <input
              type="number"
              name="sellingPrice"
              value={formData.sellingPrice}
              onChange={handleChange}
              placeholder="Selling Price"
              className="shadow border rounded w-full py-2 px-3 mb-4"
              required
            />

            <input
              type="text"
              name="ownerName"
              value={formData.ownerName}
              onChange={handleChange}
              placeholder="Owner Name"
              className="shadow border rounded w-full py-2 px-3 mb-4"
              required
            />

            <input
              type="text"
              name="contactNo"
              value={formData.contactNo}
              onChange={handleChange}
              placeholder="Contact No"
              className="shadow border rounded w-full py-2 px-3 mb-4"
              required
            />

            <input
              type="number"
              name="downPayment"
              value={formData.downPayment}
              onChange={handleChange}
              placeholder="Down Payment"
              className="shadow border rounded w-full py-2 px-3 mb-4"
              required
            />

            <input
              type="number"
              name="totalInstallments"
              value={formData.totalInstallments}
              onChange={handleChange}
              placeholder="Total Installments"
              className="shadow border rounded w-full py-2 px-3 mb-4"
              required
            />

            <input
              type="number"
              name="installmentAmount"
              value={formData.installmentAmount}
              onChange={handleChange}
              placeholder="Installment Amount"
              className="shadow border rounded w-full py-2 px-3 mb-4"
              required
            />

            <input
              type="number"
              name="commission"
              value={formData.commission}
              onChange={handleChange}
              placeholder="Commission"
              className="shadow border rounded w-full py-2 px-3 mb-4"
              required
            />

            <input
              type="file"
              name="insuranceDocument"
              onChange={handleFileChange}
              className="shadow border rounded w-full py-2 px-3 mb-4"
              required
            />

            <input
              type="file"
              name="carPhoto"
              onChange={handleFileChange}
              className="shadow border rounded w-full py-2 px-3 mb-4"
              required
            />

            <button
              type="button" // Prevent form submission
              onClick={handleSellConfirmation} // Show confirmation modal
              className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
            >
              Sell
            </button>
          </form>
        </>
      )}

      {/* Modal for final confirmation */}
      <Modal
        isOpen={modalOpen}
        onRequestClose={closeModal}
        contentLabel="Confirm Sell"
        className="bg-white p-8 rounded-lg shadow-lg max-w-md mx-auto mt-20"
        overlayClassName="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center"
      >
        <h3 className="text-lg font-semibold mb-4">Confirm Sale</h3>
        <p>Are you sure you want to sell the vehicle with reg No.: {submittedID}?</p>
        <div className="mt-6">
          <button
            onClick={async () => {
              await handleSubmit(); // Call the handleSubmit function
              closeModal(); // Close the modal after submitting
            }}
            className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline mr-2"
          >
            Confirm Sell
          </button>
          <button
            onClick={closeModal}
            className="bg-gray-300 hover:bg-gray-500 text-gray-800 font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
          >
            Cancel
          </button>
        </div>
      </Modal>

      <ToastContainer />
    </div>
  );
}

export default SellCarDetails;
