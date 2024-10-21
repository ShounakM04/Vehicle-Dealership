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
  });

  const navigate = useNavigate();

  // Search car by Reg ID
  const handleSearch = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get(`http://localhost:8000/car/${deleteID}`);
      setCarData(response.data);
      setDeleteID('');
    } catch (err) {
      setError('No vehicle found with this Reg ID');
      setCarData(null);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleFileChange = (e) => {
    const { name, files } = e.target;
    setFormData({ ...formData, [name]: files[0] });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formDataObj = new FormData();
    Object.keys(formData).forEach((key) => {
      formDataObj.append(key, formData[key]);
    });

    try {
      await axios.post('http://localhost:8000/sell-car', formDataObj, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      toast.success('Car sold successfully!', { position: 'top-right' });
      navigate('/dashboard');
    } catch (error) {
      toast.error('Error selling car. Try again.', { position: 'top-right' });
    }
  };

  return (
    <div className="container mx-auto p-8">
      {/* Back to Dashboard */}
      <div className="mb-4">
        <button
          onClick={() => navigate('/dashboard')}
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        >
          Back to Dashboard
        </button>
      </div>

      {/* Vehicle Search Form */}
      <form onSubmit={handleSearch} className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
        <h2 className="text-xl font-bold mb-4">Search Vehicle by Reg ID</h2>
        <input
          type="text"
          name="regID"
          value={deleteID}
          onChange={(e) => setDeleteID(e.target.value)}
          placeholder="Enter Vehicle Reg ID"
          className="shadow border rounded w-full py-2 px-3 mb-4"
          required
        />
        <button
          type="submit"
          className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
        >
          Search
        </button>
      </form>

      {/* Error Message */}
      {error && (
        <div className="bg-red-100 border border-red-500 text-red-700 px-4 py-3 rounded relative">
          {error}
        </div>
      )}

      {/* Loader */}
      {loading && <p className="text-center">Loading...</p>}

      {/* Display Car Details if Found */}
      {carData && carData.car && (
        <div className="mt-8 p-4 bg-gray-100 rounded-lg shadow">
          <h2 className="text-2xl font-bold mb-4">Vehicle Details</h2>
          <ul className="space-y-2">
            <li className="flex justify-between">
              <span className="font-semibold">Name:</span>
              <span>{carData.car.carname}</span>
            </li>
            <li className="flex justify-between">
              <span className="font-semibold">Make:</span>
              <span>{carData.car.carmake}</span>
            </li>
            <li className="flex justify-between">
              <span className="font-semibold">Company:</span>
              <span>{carData.car.carcompany}</span>
            </li>
          </ul>

          {/* Sell Car Form */}
          <form onSubmit={handleSubmit} className="bg-white shadow-md rounded px-8 pt-6 pb-8 mt-4">
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
              className="mb-4"
              required
            />

            <input
              type="file"
              name="carPhoto"
              onChange={handleFileChange}
              className="mb-4"
              required
            />

            <button
              type="submit"
              className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
            >
              Submit
            </button>
          </form>
        </div>
      )}

      <ToastContainer />
    </div>
  );
}

export default SellCarDetails;
