import React from 'react';

function EnquiryCard({ customerName, customerPhone, description, date }) {
  return (
    <div className="bg-white shadow-lg rounded-lg p-6 mb-4 transition duration-300 ease-in-out hover:shadow-xl transform hover:scale-105">
      <h3 className="text-teal-700 text-xl font-semibold mb-2">{customerName}</h3>
      <p className="text-gray-600 text-lg mb-2"><span className="font-medium">Phone:</span> {customerPhone}</p>
      <p className="text-gray-600 text-lg mb-4"><span className="font-medium">Description:</span> {description}</p>
      <p className="text-gray-500 text-sm italic">Registered on: {new Date(date).toLocaleString()}</p>
    </div>
  );
}

export default EnquiryCard;
