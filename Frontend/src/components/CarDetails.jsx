import React from 'react';
import { useParams } from 'react-router-dom';

function CarDetails() {
  const params = useParams();
  return (
    <div className="container mx-auto">
      <main className="py-10">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white shadow-md rounded-md p-4">
            <div className="flex justify-between mt-4">
              <button className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded-md">
                &#10094;
              </button>
              <h1>Car {params.id}</h1>
              <button className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded-md">
                &#10095;
              </button>
            </div>
          </div>
          <div className="bg-white shadow-md rounded-md p-4">
            <h2 className="text-2xl font-bold mb-4">Suzuki Fronx</h2>
            <h3 className="text-lg font-semibold mb-2">Common Details</h3>
            <h3 className="text-lg font-semibold mb-2">Specifications:</h3>
            <ul>
              <li className="flex justify-between items-center mb-2">
                <span className="font-semibold">Field1</span>
                <span>Value1</span>
              </li>
              <li className="flex justify-between items-center mb-2">
                <span className="font-semibold">Field2</span>
                <span>Value2</span>
              </li>
              <li className="flex justify-between items-center mb-2">
                <span className="font-semibold">Field3</span>
                <span>Value3</span>
              </li>
              <li className="flex justify-between items-center mb-2">
                <span className="font-semibold">Field4</span>
                <span>Value4</span>
              </li>
              <li className="flex justify-between items-center mb-2">
                <span className="font-semibold">Field5</span>
                <span>Value5</span>
              </li>
              <li className="flex justify-between items-center mb-2">
                <span className="font-semibold">Field6</span>
                <span>Value6</span>
              </li>
              <li className="flex justify-between items-center mb-2">
                <span className="font-semibold">Field7</span>
                <span>Value7</span>
              </li>
            </ul>
          </div>
        </div>
      </main>
    </div>
  );
}

export default CarDetails;