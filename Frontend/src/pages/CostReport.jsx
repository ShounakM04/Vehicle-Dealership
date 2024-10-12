import React, { useState } from 'react';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { FaTrash } from 'react-icons/fa';

const CostReport = () => {
  const [reportData, setReportData] = useState({
    buyingPrice: 12000,
    sellingPrice: 0,
    insuranceCommission: 500, // New insurance commission
    maintenanceRecords: [
      {
        title: 'Oil Change',
        price: 100,
        description: 'Changed oil and filter.',
      },
      {
        title: 'Tire Rotation',
        price: 50,
        description: 'Rotated all four tires.',
      },
    ],
    installments: [], // New installments array
    carDetails: {
      carNo: 'MH48Ck9597',
      ownerName: 'Lalit Mohane',
      ownerPhone: '9876543210',
      ownerEmail: 'lalit@gmail.com',
      model: 'Ertiga',
      color: 'White',
      type: 'SUV',
    },
    totalAmountToBePaid: 0, // Default total amount
    remainingAmount: 0
  });

  // Form state for maintenance
  const [title, setTitle] = useState('');
  const [price, setPrice] = useState('');
  const [description, setDescription] = useState('');

  // Form state for installments
  const [installmentAmount, setInstallmentAmount] = useState('');
  const [installmentDate, setInstallmentDate] = useState('');

  // Form state for total amount to be paid
  const [totalAmountToBePaid, setTotalAmountToBePaid] = useState(0);

  const handleSubmit = (e) => {
    e.preventDefault();
    const newMaintenanceRecord = {
      title,
      price: parseFloat(price),
      description,
    };

    setReportData((prevData) => ({
      ...prevData,
      maintenanceRecords: [...prevData.maintenanceRecords, newMaintenanceRecord],
    }));

    toast.success('Maintenance record added successfully!');
    setTitle('');
    setPrice('');
    setDescription('');
  };

  const handleInstallmentSubmit = (e) => {
    e.preventDefault();
    const newInstallment = {
      amount: parseFloat(installmentAmount),
      date: installmentDate,
    };

    setReportData((prevData) => {
      const updatedInstallments = [...prevData.installments, newInstallment];
      // Calculate the new remaining amount
      const newRemainingAmount = prevData.totalAmountToBePaid - updatedInstallments.reduce((acc, installment) => acc + installment.amount, 0);

      return {
        ...prevData,
        installments: updatedInstallments,
        remainingAmount: newRemainingAmount >= 0 ? newRemainingAmount : 0, // Ensure it doesn't go negative
      };
    });

    toast.success('Installment added successfully!');
    setInstallmentAmount('');
    setInstallmentDate('');
  };


  const handleTotalAmountSubmit = (e) => {
    e.preventDefault();
    setReportData((prevData) => ({
      ...prevData,
      totalAmountToBePaid: parseFloat(totalAmountToBePaid),
      remainingAmount: parseFloat(totalAmountToBePaid)
    }));
    toast.success('Total amount to be paid updated!');
    setTotalAmountToBePaid(0);
  };

  const handleDelete = (index) => {
    const updatedRecords = reportData.maintenanceRecords.filter((_, i) => i !== index);
    setReportData((prevData) => ({
      ...prevData,
      maintenanceRecords: updatedRecords,
    }));
    toast.info('Maintenance record deleted');
  };

  // Calculate total maintenance cost
  const totalMaintenanceCost = reportData.maintenanceRecords.reduce(
    (acc, record) => acc + record.price,
    0
  );

  // Calculate total installments
  const totalInstallments = reportData.installments.reduce(
    (acc, installment) => acc + installment.amount,
    0
  );

  // Calculate net profit: Selling Price - (Buying Price + Maintenance Cost + Insurance Commission)
  const netProfit = reportData.sellingPrice - (reportData.buyingPrice + totalMaintenanceCost + reportData.insuranceCommission);

  return (
    <div className="flex flex-col lg:flex-row p-5 bg-gray-100 min-h-screen">
      {/* Report Section */}
      <div className="flex-1 p-5 bg-white shadow-lg rounded-lg mr-0 lg:mr-2 mb-4 lg:mb-0">
        <h2 className="text-2xl font-bold mb-4">Vehicle Pricing & Maintenance Report</h2>

        {/* Car Details */}
        <div className="mb-4 p-4 bg-blue-200 text-blue-800 font-semibold rounded">
          <h3 className="text-xl">Car Details</h3>
          <p>Car No: {reportData.carDetails.carNo}</p>
          <p>Owner: {reportData.carDetails.ownerName}</p>
          <p>Phone: {reportData.carDetails.ownerPhone}</p>
          <p>Email: {reportData.carDetails.ownerEmail}</p>
          <p>Model: {reportData.carDetails.model}</p>
          <p>Color: {reportData.carDetails.color}</p>
          <p>Type: {reportData.carDetails.type}</p>
        </div>

        {/* Buying Price */}
        <div className="mb-4 p-4 bg-red-200 text-red-800 font-semibold rounded">
          <h3 className="text-xl">Buying Price: ₹{reportData.buyingPrice}</h3>
        </div>

        {/* Maintenance Records */}
        <h3 className="text-lg font-semibold mb-2">Maintenance Records:</h3>
        <ul className="mt-2">
          {reportData.maintenanceRecords.map((record, index) => (
            <li
              key={index}
              className="mb-2 p-4 bg-yellow-200 text-yellow-800 rounded flex justify-between items-center"
            >
              <div>
                <p className="font-medium">Title: {record.title}</p>
                <p>Price: ₹{record.price}</p>
                <p>Description: {record.description || 'No description'}</p>
              </div>
              <FaTrash
                onClick={() => handleDelete(index)}
                className="text-red-500 hover:text-red-700 cursor-pointer"
              />
            </li>
          ))}
        </ul>

        {/* Total Maintenance Cost */}
        <div className="mt-4 p-4 bg-yellow-100 text-yellow-800 font-semibold rounded">
          <h3 className="text-lg">Total Maintenance Cost: ₹{totalMaintenanceCost}</h3>
        </div>

        {/* Insurance Commission */}
        <div className="mt-4 p-4 bg-orange-200 text-orange-800 font-semibold rounded">
          <h3 className="text-lg">Insurance Commission: ₹{reportData.insuranceCommission}</h3>
        </div>

        {/* Selling Price */}
        <div className="mt-4 p-4 bg-green-200 text-green-800 font-semibold rounded">
          <h3 className="text-xl">Selling Price: ₹{reportData.sellingPrice}</h3>
        </div>

        {/* Net Profit */}
        <div className="mt-6 p-4 bg-gray-200 text-gray-800 font-semibold rounded">
          <h3 className="text-xl">Net Profit: ₹{netProfit >= 0 ? netProfit : `-${Math.abs(netProfit)}`}</h3>
        </div>

        {/* Total Amount to be Paid */}
        <div className="mt-6 p-4 bg-pink-200 text-pink-800 font-semibold rounded">
          <h3 className="text-xl">Total Amount to be Paid: ₹{reportData.totalAmountToBePaid}</h3>
        </div>

        {/* Remaining Amount to be Paid */}
        {/* Remaining Amount */}
        <div className="mt-6 p-4 bg-teal-200 text-teal-800 font-semibold rounded">
          <h3 className="text-xl">Remaining Amount to be Paid: ₹{reportData.remainingAmount}</h3>
        </div>


        {/* Installments */}
        <div className="mt-4">
          <h3 className="text-lg font-semibold mb-2">Installments:</h3>
          {reportData.installments.map((installment, index) => (
            <div
              key={index}
              className="mb-2 p-4 bg-purple-200 text-purple-800 rounded"
            >
              <p>Installment #{index + 1}</p>
              <p>Amount: ₹{installment.amount}</p>
              <p>Date: {installment.date}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Maintenance Form Section */}
      <div className="flex-1 p-5 bg-white shadow-lg rounded-lg ml-0 lg:ml-2">
        <h2 className="text-2xl font-bold mb-4">Add Maintenance Record</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-gray-700">Title</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="border border-yellow-300 bg-yellow-100 rounded w-full py-2 px-3 focus:outline-none focus:ring focus:border-yellow-500"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700">Price</label>
            <input
              type="number"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              className="border border-yellow-300 bg-yellow-100 rounded w-full py-2 px-3 focus:outline-none focus:ring focus:border-yellow-500"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700">Description (optional)</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="border border-yellow-300 bg-yellow-100 rounded w-full py-2 px-3 focus:outline-none focus:ring focus:border-yellow-500"
            />
          </div>
          <button
            type="submit"
            className="bg-yellow-500 text-white font-bold py-2 px-4 rounded focus:outline-none focus:ring focus:bg-yellow-600"
          >
            Add Maintenance Record
          </button>
        </form>

        {/* Installment Form */}
        <h2 className="text-2xl font-bold mt-8 mb-4">Add Installment</h2>
        <form onSubmit={handleInstallmentSubmit}>
          <div className="mb-4">
            <label className="block text-gray-700">Amount</label>
            <input
              type="number"
              value={installmentAmount}
              onChange={(e) => setInstallmentAmount(e.target.value)}
              className="border border-yellow-300 bg-yellow-100 rounded w-full py-2 px-3 focus:outline-none focus:ring focus:border-yellow-500"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700">Date & Time</label>
            <input
              type="datetime-local"
              value={installmentDate}
              onChange={(e) => setInstallmentDate(e.target.value)}
              className="border border-yellow-300 bg-yellow-100 rounded w-full py-2 px-3 focus:outline-none focus:ring focus:border-yellow-500"
              required
            />
          </div>
          <button
            type="submit"
            className="bg-yellow-500 text-white font-bold py-2 px-4 rounded focus:outline-none focus:ring focus:bg-yellow-600"
          >
            Add Installment
          </button>
        </form>
        <h2 className="text-2xl font-bold mb-4 mt-8">Set Total Amount to be Paid</h2>
        <form onSubmit={handleTotalAmountSubmit}>
          <div className="mb-4">
            <label className="block text-gray-700">Total Amount</label>
            <input
              type="number"
              value={totalAmountToBePaid}
              onChange={(e) => setTotalAmountToBePaid(e.target.value)}
              className="border border-pink-300 bg-pink-100 rounded w-full py-2 px-3 focus:outline-none focus:ring focus:border-pink-500"
              required
            />
          </div>
          <button
            type="submit"
            className="bg-pink-500 text-white font-semibold rounded py-2 px-4 hover:bg-pink-600"
          >
            Update Total Amount
          </button>
        </form>
      </div>

      {/* Toast Notification Container */}
      <ToastContainer />
    </div>
  );
};

export default CostReport;