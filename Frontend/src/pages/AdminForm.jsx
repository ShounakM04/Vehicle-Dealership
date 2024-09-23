import { useState } from 'react';

function AdminForm() {
  const [fullName, setFullName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [email, setEmail] = useState('');
  const [streetAddress, setStreetAddress] = useState('');
  const [streetAddressLine2, setStreetAddressLine2] = useState('');
  const [city, setCity] = useState('');
  const [stateProvince, setStateProvince] = useState('');
  const [postalCode, setPostalCode] = useState('');
  const [selectedVehicle, setSelectedVehicle] = useState('');
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedTime, setSelectedTime] = useState('5:30 PM');

  // Vehicle and Owner details
  const [vehicleName, setVehicleName] = useState('');
  const [brandName, setBrandName] = useState('');
  const [model, setModel] = useState('');
  const [numberPlate, setNumberPlate] = useState('');
  const [color, setColor] = useState('');
  const [registrationNumber, setRegistrationNumber] = useState('');
  const [registrationDate, setRegistrationDate] = useState(new Date());

  const [insuranceDetails, setInsuranceDetails] = useState('');
  const [insuranceValidity, setInsuranceValidity] = useState(new Date());
  const [chassisNumber, setChassisNumber] = useState('');

  const [ownerName, setOwnerName] = useState('');
  const [ownerPhoneNumber, setOwnerPhoneNumber] = useState('');
  const [ownerEmail, setOwnerEmail] = useState('');

  const [kmsDriven, setKmsDriven] = useState('');
  const [cost, setCost] = useState('');

  const handleSubmit = (event) => {
    event.preventDefault();
    // Submit the form data to the server
    console.log('Form submitted:', {
      fullName,
      phoneNumber,
      email,
      streetAddress,
      streetAddressLine2,
      city,
      stateProvince,
      postalCode,
      selectedVehicle,
      selectedDate,
      selectedTime,
      vehicleName,
      brandName,
      model,
      numberPlate,
      color,
      registrationNumber,
      registrationDate,
      insuranceDetails,
      insuranceValidity,
      chassisNumber,
      ownerName,
      ownerPhoneNumber,
      ownerEmail,
      kmsDriven,
      cost,
    });
  };

  return (
    <div className="container mx-auto p-4">
      <form onSubmit={handleSubmit}>
        {/* Vehicle Details */}
        <h2 className="text-xl font-bold mb-2">Vehicle Details</h2>
        <div className="mb-4">
          <label htmlFor="vehicleName" className="block text-gray-700 text-sm font-bold mb-2">Vehicle Name</label>
          <input
            type="text"
            id="vehicleName"
            className="shadow AdminFormearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            value={vehicleName}
            onChange={(e) => setVehicleName(e.target.value)}
          />
        </div>
        <div className="mb-4">
          <label htmlFor="brandName" className="block text-gray-700 text-sm font-bold mb-2">Brand Name</label>
          <input
            type="text"
            id="brandName"
            className="shadow AdminFormearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            value={brandName}
            onChange={(e) => setBrandName(e.target.value)}
          />
        </div>
        <div className="mb-4">
          <label htmlFor="model" className="block text-gray-700 text-sm font-bold mb-2">Model</label>
          <input
            type="text"
            id="model"
            className="shadow AdminFormearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            value={model}
            onChange={(e) => setModel(e.target.value)}
          />
        </div>
        <div className="mb-4">
          <label htmlFor="numberPlate" className="block text-gray-700 text-sm font-bold mb-2">Number Plate</label>
          <input
            type="text"
            id="numberPlate"
            className="shadow AdminFormearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            value={numberPlate}
            onChange={(e) => setNumberPlate(e.target.value)}
          />
        </div>
        <div className="mb-4">
          <label htmlFor="color" className="block text-gray-700 text-sm font-bold mb-2">Color</label>
          <input
            type="text"
            id="color"
            className="shadow AdminFormearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            value={color}
            onChange={(e) => setColor(e.target.value)}
          />
        </div>

        {/* Owner Details */}
        <h2 className="text-xl font-bold mb-2">Owner Information</h2>
        <div className="mb-4">
          <label htmlFor="ownerName" className="block text-gray-700 text-sm font-bold mb-2">Owner Name</label>
          <input
            type="text"
            id="ownerName"
            className="shadow AdminFormearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            value={ownerName}
            onChange={(e) => setOwnerName(e.target.value)}
          />
        </div>
        <div className="mb-4">
          <label htmlFor="ownerPhoneNumber" className="block text-gray-700 text-sm font-bold mb-2">Owner Phone Number</label>
          <input
            type="tel"
            id="ownerPhoneNumber"
            className="shadow AdminFormearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            value={ownerPhoneNumber}
            onChange={(e) => setOwnerPhoneNumber(e.target.value)}
          />
        </div>
        <div className="mb-4">
          <label htmlFor="ownerEmail" className="block text-gray-700 text-sm font-bold mb-2">Owner Email</label>
          <input
            type="email"
            id="ownerEmail"
            className="shadow AdminFormearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            value={ownerEmail}
            onChange={(e) => setOwnerEmail(e.target.value)}
          />
        </div>

        {/* Insurance Details */}
        <h2 className="text-xl font-bold mb-2">Documentation and Insurance</h2>
        <div className="mb-4">
          <label htmlFor="insuranceDetails" className="block text-gray-700 text-sm font-bold mb-2">Insurance Details</label>
          <input
            type="text"
            id="insuranceDetails"
            className="shadow AdminFormearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            value={insuranceDetails}
            onChange={(e) => setInsuranceDetails(e.target.value)}
          />
        </div>
        <div className="mb-4">
          <label htmlFor="insuranceValidity" className="block text-gray-700 text-sm font-bold mb-2">Insurance Validity</label>
          <input
            type="date"
            id="insuranceValidity"
            className="shadow AdminFormearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            value={insuranceValidity.toISOString().slice(0, 10)}
            onChange={(e) => setInsuranceValidity(new Date(e.target.value))}
          />
        </div>
        <div className="mb-4">
          <label htmlFor="chassisNumber" className="block text-gray-700 text-sm font-bold mb-2">Chassis Number</label>
          <input
            type="text"
            id="chassisNumber"
            className="shadow AdminFormearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            value={chassisNumber}
            onChange={(e) => setChassisNumber(e.target.value)}
          />
        </div>

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
