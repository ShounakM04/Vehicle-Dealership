import { useState } from 'react';
import { submitAdminForm } from '../api/adminForm.api.js';

function AdminForm() {
  const [vehicleName, setVehicleName] = useState('');
  const [brandName, setBrandName] = useState('');
  const [registrationNumber, setRegistrationNumber] = useState('');
  const [insuranceCompany, setInsuranceCompany] = useState('');
  const [policyNumber, setPolicyNumber] = useState('');
  const [policyTenure, setPolicyTenure] = useState('');
  const [ownerName, setOwnerName] = useState('');
  const [ownerPhone, setOwnerPhone] = useState('');
  const [ownerEmail, setOwnerEmail] = useState('');
  const [ownerAddress, setOwnerAddress] = useState('');
  // const [imageUrl, setImageUrl] = useState('');
  // const [imageFile, setImageFile] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await submitAdminForm({
        vehicleName,
        brandName,
        registrationNumber,
        insuranceCompany,
        policyNumber,
        policyTenure,
        ownerName,
        ownerPhone,
        ownerEmail,
        ownerAddress,
        // imageUrl: uploadedImageUrl // Commented out
      });
      console.log(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="container mx-auto p-10">
      <form onSubmit={handleSubmit}>
        <h2 className="text-xl font-bold mb-2">Vehicle Details</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <label htmlFor="vehicleName" className="block text-gray-700 text-sm font-bold mb-2">Vehicle Name</label>
            <input
              type="text"
              id="vehicleName"
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              value={vehicleName}
              onChange={(e) => setVehicleName(e.target.value)}
            />
          </div>
          <div>
            <label htmlFor="brandName" className="block text-gray-700 text-sm font-bold mb-2">Brand Name</label>
            <input
              type="text"
              id="brandName"
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              value={brandName}
              onChange={(e) => setBrandName(e.target.value)}
            />
          </div>
        </div>
        <div className="mb-4">
          <label htmlFor="registrationNumber" className="block text-gray-700 text-sm font-bold mb-2">Registration Number</label>
          <input
            type="text"
            id="registrationNumber"
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            value={registrationNumber}
            onChange={(e) => setRegistrationNumber(e.target.value)}
          />
        </div>

        {/* Insurance Details */}
        <h2 className="text-xl font-bold mb-2">Insurance Details</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <label htmlFor="insuranceCompany" className="block text-gray-700 text-sm font-bold mb-2">Insurance Company</label>
            <input
              type="text"
              id="insuranceCompany"
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              value={insuranceCompany}
              onChange={(e) => setInsuranceCompany(e.target.value)}
            />
          </div>
          <div>
            <label htmlFor="policyNumber" className="block text-gray-700 text-sm font-bold mb-2">Policy Number</label>
            <input
              type="text"
              id="policyNumber"
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              value={policyNumber}
              onChange={(e) => setPolicyNumber(e.target.value)}
            />
          </div>
        </div>
        <div className="mb-4">
          <label htmlFor="policyTenure" className="block text-gray-700 text-sm font-bold mb-2">Policy Tenure</label>
          <input
            type="number"
            id="policyTenure"
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            value={policyTenure}
            onChange={(e) => setPolicyTenure(e.target.value)}
          />
        </div>

        {/* Owner Details */}
        <h2 className="text-xl font-bold mb-2">Owner Information</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <label htmlFor="ownerName" className="block text-gray-700 text-sm font-bold mb-2">Owner Name</label>
            <input
              type="text"
              id="ownerName"
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              value={ownerName}
              onChange={(e) => setOwnerName(e.target.value)}
            />
          </div>
          <div>
            <label htmlFor="ownerPhone" className="block text-gray-700 text-sm font-bold mb-2">Owner Phone</label>
            <input
              type="tel"
              id="ownerPhone"
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              value={ownerPhone}
              onChange={(e) => setOwnerPhone(e.target.value)}
            />
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <label htmlFor="ownerEmail" className="block text-gray-700 text-sm font-bold mb-2">Owner Email</label>
            <input
              type="email"
              id="ownerEmail"
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              value={ownerEmail}
              onChange={(e) => setOwnerEmail(e.target.value)}
            />
          </div>
          <div>
            <label htmlFor="ownerAddress" className="block text-gray-700 text-sm font-bold mb-2">Owner Address</label>
            <input
              type="text"
              id="ownerAddress"
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              value={ownerAddress}
              onChange={(e) => setOwnerAddress(e.target.value)}
            />
          </div>
        </div>

        {/* Image Upload */}
        {/* <h2 className="text-xl font-bold mb-2">Car Image</h2>
        <div className="mb-4">
          <label htmlFor="imageUpload" className="block text-gray-700 text-sm font-bold mb-2">Upload Image</label>
          <input
            type="file"
            id="imageUpload"
            accept="image/*"
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            onChange={(e) => setImageFile(e.target.files[0])}
          />
        </div> */}

        {/* Submit button */}
        <button
          type="submit"
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
        >
          Submit
        </button>
      </form>
    </div>
  );
}

export default AdminForm;
