import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom'; // For getting the params from the URL
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { FaTrash } from 'react-icons/fa';
import { Maintainance } from '../components/Maintainance';
import Insurance from '../components/Insurance';

const CostReport = () => {
  const { id } = useParams(); // Get the car ID from the URL
  const [soldStatus, setSoldStatus] = useState();
  const [reportData, setReportData] = useState({
    buyingPrice: 12000,
    sellingPrice: 0,
    insuranceCommission: 500,
    maintenanceRecords: [],
    installments: [],
    carDetails: {
      carNo: '',
      ownerName: '',
      ownerPhone: '',
      ownerEmail: '',
      model: '',
      color: '',
      type: '',
    },
    totalAmountToBePaid: 0,
    remainingAmount: 0,
  });

  // Form state for maintenance
  const [title, setTitle] = useState('');
  const [price, setPrice] = useState('');
  const [description, setDescription] = useState('');
  const [files, setFiles] = useState([]); // State to store uploaded files

  // Form state for installments
  const [installmentAmount, setInstallmentAmount] = useState('');
  const [installmentDate, setInstallmentDate] = useState('');

  // Form state for total amount to be paid
  const [totalAmountToBePaid, setTotalAmountToBePaid] = useState(0);

  useEffect(() => {
    const fetchCarDetails = async () => {
      try {
        const response = await axios.get(`http://localhost:8000/car/${id}`);
        console.log(response.data); // Log the response to see its structure
        const { car, images, insurance, owner } = response.data;
        setSoldStatus(response.data.car.status);

        setReportData((prevData) => ({
          ...prevData,
          carDetails: {
            carNo: car.registernumber,
            ownerName: owner.ownername,
            ownerPhone: owner.ownerphone,
            ownerEmail: owner.owneremail,
            model: car.carname,
            color: car.carcolor,
            type: car.carmake,
            fuelType: car.fuel,
            carCompany: car.carcompany
          },
        }));
      } catch (error) {
        console.error('Error fetching car details:', error);
        toast.error('Failed to fetch car details.');
      }
    };

    fetchCarDetails();
  }, [id]);



  // Call fetchMaintenanceDetails when car details are loaded

  return (
    <div className='flex flex-col'>
      <div className="flex flex-col lg:flex-row p-5 bg-gray-100 min-h-screen">
        {/* Report Section */}
        <div className="flex-1 p-5 bg-white shadow-lg rounded-lg mr-0 lg:mr-2 mb-4 lg:mb-0">
          <h2 className="text-2xl font-bold mb-4">Vehicle Pricing & Maintenance Report</h2>

          {/* Car Details */}
          <div className="mb-4 p-4 bg-blue-200 text-blue-800 font-semibold rounded">
            <h3 className="text-xl">Car Details</h3>
            <p>Car No: {reportData.carDetails.carNo}</p>
            <p>Car Company: {reportData.carDetails.carCompany}</p>
            <p>Model: {reportData.carDetails.model}</p>
            <p>Type: {reportData.carDetails.type}</p>
            <p>Fuel Type: {reportData.carDetails.fuelType}</p>
            <p>Color: {reportData.carDetails.color}</p>
            <br></br>

            <h3 className="text-xl">Owner Details</h3>
            <p>Owner: {reportData.carDetails.ownerName}</p>
            <p>Phone: {reportData.carDetails.ownerPhone}</p>
            <p>Email: {reportData.carDetails.ownerEmail}</p>
          </div>

          {/* Maintenance Records */}
          {/* <h3 className="text-lg font-semibold mb-2">Maintenance Records:</h3>
          <ul className="mt-2">
            {reportData.maintenanceRecords.map((record, index) => (
              <li
                key={index}
                className="mb-2 p-4 bg-yellow-200 text-yellow-800 rounded flex justify-between items-center"
              >
                <div>
                  <p className="font-medium">Title: {record.maintainancedetails}</p>
                  <p>Price: ₹{record.maintainancecost}</p>
                  <p>Description: {record.maintainancedescription || 'No description'}</p>
                </div>
                <FaTrash
                  onClick={() => handleDelete(index)}
                  className="text-red-500 hover:text-red-700 cursor-pointer"
                />
              </li>
            ))}
          </ul> */}

          {/* Total Maintenance Cost */}
          {/* <div className="mt-4 p-4 bg-yellow-100 text-yellow-800 font-semibold rounded">
            <h3 className="text-lg">Total Maintenance Cost: ₹{totalMaintenanceCost}</h3>
          </div> */}

          {/* Insurance Commission */}
          {/* <div className="mt-4 p-4 bg-orange-200 text-orange-800 font-semibold rounded">
            <h3 className="text-lg">Insurance Commission: ₹{reportData.insuranceCommission}</h3>
          </div> */}

          {/* Net Profit */}
          {/* <div className="mt-4 p-4 bg-green-200 text-green-800 font-semibold rounded">
            <h3 className="text-lg">Net Profit: ₹{netProfit}</h3>
          </div> */}
        </div>

        {/* Form Section */}
        <div className="flex-1 p-5 bg-white shadow-lg rounded-lg">
          {soldStatus === false ?
            <Maintainance registernumber={reportData.carDetails.carNo} /> : <Insurance />
          }

          {/* <h2 className="text-2xl font-bold mt-6 mb-4">Set Total Amount to be Paid</h2>
          <form onSubmit={handleTotalAmountSubmit}>
            <div className="mb-4">
              <label className="block text-sm font-medium mb-2">Total Amount</label>
              <input
                type="number"
                value={totalAmountToBePaid}
                onChange={(e) => setTotalAmountToBePaid(e.target.value)}
                required
                className="border border-gray-300 rounded p-2 w-full"
              />
            </div>
            <button type="submit" className="bg-purple-500 text-white p-2 rounded">
              Set Total Amount
            </button>
          </form> */}
        </div>
      </div>
      <ToastContainer />
    </div>
  );
};

export default CostReport;
