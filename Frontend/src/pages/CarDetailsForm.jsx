import { useState } from 'react';
import { submitAdminForm } from '../api/adminForm.api.js';
import { toast } from 'react-toastify';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

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
  const [carColor, setCarColor] = useState('');
  const [carPrice, setCarPrice] = useState('');
  const [carType, setCarType] = useState('');
  const [uploading, setUploading] = useState(false);
  const [images, setImages] = useState([]);
  const [DisplayImage, setDisplayImage] = useState(null);
  const [fuel, setFuel] = useState('');

  const navigate = useNavigate();
  const handleGoBack = () => {
    navigate('/dashboard');
  };

  const handleDisplayImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setDisplayImage(file);
    }
  };

  const handleImageChange = (e) => {
    setImages([...e.target.files]);
  };

  const getUploadURL = async (file,path) => {
    try {
      // console.log("HEllo hi "+fileName);
      const filename = file.name;
      const filetype = file.type;
      
      const response = await axios.get('http://localhost:8000/upload/generate-upload-url', {
        params :{filename,
        filetype,path}
      });
      // console.log(response.data.uploadUrl);
      console.log(response)
      return response.data.uploadUrl;
    } catch (error) {
      console.error('Error getting upload URL:', error);
      toast.error("Couldn't get S3 upload URL");
      throw error;
    }
  };

  const uploadToS3 = async (url, file) => {
    try {
            const result = await fetch(url,{
        method:"PUT",
        headers:{
          "Content-Type":encodeURI(file.type),
        },
        body:file
      })
      console.log("Uploaded successfully.")
    } catch (error) {
      console.error('Error uploading file to S3:', error);
      toast.error("Couldn't upload to S3");
      throw error;
    }
  };

  const handleUpload = async () => {
    setUploading(true);

    try {
      // Generate the S3 upload URL for the display image
      if (DisplayImage) {
        const displayImageFileName = `${registrationNumber}/VehicleImages/0`;
        const displayImageUploadURL = await getUploadURL(DisplayImage,displayImageFileName);
        console.log(displayImageUploadURL);
        await uploadToS3(displayImageUploadURL, DisplayImage);
      }

      // Handle other image uploads if necessary (similar to DisplayImage)
      for (let i = 0; i < images.length; i++) {
        const image = images[i];
        const imageFileName = `${registrationNumber}/VehicleImages/${i + 1}`;
        const imageUploadURL = await getUploadURL(image,imageFileName);
        await uploadToS3(imageUploadURL, image);
      }

      setUploading(false);
      return true;
    } catch (error) {
      setUploading(false);
      throw error;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (carPrice < 0) {
      toast.error("Car price cannot be negative");
      return;
    }

    try {
      // Upload images first
      await handleUpload();

      // Submit form data after images are uploaded
      await submitAdminForm({
        vehicleName,
        brandName,
        registrationNumber,
        insuranceCompany,
        insuranceNumber: '10',
        policyNumber,
        insuranceTenure: policyTenure,
        ownerName,
        ownerPhone,
        ownerEmail,
        ownerAddress,
        carColor,
        carPrice,
        carType,
        fuel,
      });

      toast.success("Car details added successfully!");
      navigate('/dashboard');
    } catch (error) {
      toast.error("Error submitting form. Please try again.");
    }
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
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <label htmlFor="registrationNumber" className="block text-gray-700 text-sm font-bold mb-2">Registration Number</label>
            <input
              type="text"
              id="registrationNumber"
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              value={registrationNumber}
              onChange={(e) => setRegistrationNumber(e.target.value)}
            />
          </div>
          <div>
            <label htmlFor="carType" className="block text-gray-700 text-sm font-bold mb-2">Car Type</label>
            <input
              type="text"
              id="carType"
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              value={carType}
              onChange={(e) => setCarType(e.target.value)}
            />
          </div>
        </div>

        {/* New fields for Car Color and Car Price side by side */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <label htmlFor="carColor" className="block text-gray-700 text-sm font-bold mb-2">Car Color</label>
            <input
              type="text"
              id="carColor"
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              value={carColor}
              onChange={(e) => setCarColor(e.target.value)}
            />
          </div>
          <div>
            <label htmlFor="carPrice" className="block text-gray-700 text-sm font-bold mb-2">Car Price</label>
            <input
              type="number"
              id="carPrice"
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              value={carPrice}
              onChange={(e) => setCarPrice(Math.max(0, e.target.value))} // Prevent negative input
            />
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <label htmlFor="carColor" className="block text-gray-700 text-sm font-bold mb-2">Fuel Type</label>
            <input
              type="text"
              id="fuel"
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              value={fuel}
              onChange={(e) => setFuel(e.target.value)}
            />
          </div>
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

            // Disable mouse wheel increment/decrement
            onWheel={(e) => e.target.blur()}
            style={{ appearance: 'textfield', MozAppearance: 'textfield', WebkitAppearance: 'none' }}

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
              type="text"
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

        {/* Image Upload Section */}
        <div>
          <h2 className="text-xl font-bold mb-2">Upload Display Image </h2>
          <input
            type="file"
            accept="image/*"
            onChange={handleDisplayImageChange}
            className="mb-4"
          />
          {DisplayImage && (
            <div className="mt-4">
              <img
                src={URL.createObjectURL(DisplayImage)}
                alt="Primary Preview"
                className="h-32 mb-6 object-cover rounded-lg shadow-lg"
              />
            </div>
          )}
        </div>



        <div>
          <h2 className="text-xl font-bold mb-2">Upload Images (Max 10)</h2>
          <input
            type="file"
            accept="image/*"
            multiple
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
        </div>
        <button
          type="submit"
          className={`bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline ${uploading ? 'opacity-50 cursor-not-allowed' : ''}`}
          disabled={uploading}
        >
          {uploading ? 'Uploading...' : 'Submit'}
        </button>
      </form>
    </div>
  );
}

export default AdminForm;


/////////////////////////////////////
// import { useState } from 'react';
// import { submitAdminForm } from '../api/adminForm.api.js';
// import { toast } from 'react-toastify';
// import axios from 'axios';
// import { useNavigate } from 'react-router-dom';

// function AdminForm() {
//   const [vehicleName, setVehicleName] = useState('');
//   const [brandName, setBrandName] = useState('');
//   const [registrationNumber, setRegistrationNumber] = useState('');
//   const [insuranceCompany, setInsuranceCompany] = useState('');
//   const [policyNumber, setPolicyNumber] = useState('');
//   const [policyTenure, setPolicyTenure] = useState('');
//   const [ownerName, setOwnerName] = useState('');
//   const [ownerPhone, setOwnerPhone] = useState('');
//   const [ownerEmail, setOwnerEmail] = useState('');
//   const [ownerAddress, setOwnerAddress] = useState('');
//   const [carColor, setCarColor] = useState('');
//   const [carPrice, setCarPrice] = useState('');
//   const [carType, setCarType] = useState('');
//   const [uploading, setUploading] = useState(false);
//   const [images, setImages] = useState([]);
//   const [DisplayImage, setDisplayImage] = useState(null);
//   const [fuel, setFuel] = useState('');

//   const navigate = useNavigate();
//   const handleGoBack = () => {
//     navigate('/dashboard');
//   };

//   const handleDisplayImageChange = (e) => {
//     const file = e.target.files[0];
//     if (file) {
//       setDisplayImage(file);
//     }
//   };

//   const handleImageChange = (e) => {
//     setImages([...e.target.files]);
//   };

//   const getUploadURL = async (file) => {
//     try {
//       // console.log("HEllo hi "+fileName);
//       const response = await fetch(`http://localhost:8000/upload/generate-upload-url?filename=${file.name}&mimetype=${file.type}`, {
//         method:"GET",
//         headers:{
//           "Content-Type":"application/json",
//         },
//       }
//     );
//     const data = await response.json();
//       // console.log(response.data.uploadUrl);
//       return data.url;
//     } catch (error) {
//       console.error('Error getting upload URL:', error);
//       toast.error("Couldn't get S3 upload URL");
//       throw error;
//     }
//   };

//   const uploadToS3 = async (url, file) => {
//     try {
//       // await axios.put(url, file, {
//       //   headers: {
//       //     'Content-Type': file.type,
//       //   },
//       // });

//       const result = await fetch(url,{
//         method:"PUT",
//         headers:{
//           "Content-Type":encodeURI(file.type),
//         },
//         body:file
//       })
//       console.log("Uploaded successfully.")
//     } catch (error) {
//       console.error('Error uploading file to S3:', error);
//       toast.error("Couldn't upload to S3");
//       throw error;
//     }
//   };

//   const handleUpload = async () => {
//     setUploading(true);

//     try {
//       // Generate the S3 upload URL for the display image
//       if (DisplayImage) {
//         const displayImageFileName = `${registrationNumber}/VehicleImages/0`;
//         const displayImageUploadURL = await getUploadURL(DisplayImage);
//         console.log(displayImageUploadURL);
//         await uploadToS3(displayImageUploadURL, DisplayImage);
//       }

//       // Handle other image uploads if necessary (similar to DisplayImage)
//       // for (let i = 0; i < images.length; i++) {
//       //   const image = images[i];
//       //   const imageFileName = `${registrationNumber}/VehicleImages/${i + 1}`;
//       //   const imageUploadURL = await getUploadURL(imageFileName);
//       //   await uploadToS3(imageUploadURL, image);
//       // }

//       setUploading(false);
//       return true;
//     } catch (error) {
//       setUploading(false);
//       throw error;
//     }
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     if (carPrice < 0) {
//       toast.error("Car price cannot be negative");
//       return;
//     }

//     try {
//       // Upload images first
//       await handleUpload();

//       // Submit form data after images are uploaded
//       await submitAdminForm({
//         vehicleName,
//         brandName,
//         registrationNumber,
//         insuranceCompany,
//         insuranceNumber: '10',
//         policyNumber,
//         insuranceTenure: policyTenure,
//         ownerName,
//         ownerPhone,
//         ownerEmail,
//         ownerAddress,
//         carColor,
//         carPrice,
//         carType,
//         fuel,
//       });

//       toast.success("Car details added successfully!");
//       navigate('/dashboard');
//     } catch (error) {
//       toast.error("Error submitting form. Please try again.");
//     }
// };
//   return (
//     <div className="container mx-auto pl-16 pr-16 pb-16 pt-8">
//       <div className="mb-4">
//         <button
//           onClick={handleGoBack}
//           className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:ring focus:ring-blue-300 transition"
//         >
//           Back to Dashboard
//         </button>
//       </div>
//       <form onSubmit={handleSubmit}>
//         <h2 className="text-xl font-bold mb-2">Vehicle Details</h2>
//         <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
//           <div>
//             <label htmlFor="vehicleName" className="block text-gray-700 text-sm font-bold mb-2">Vehicle Name</label>
//             <input
//               type="text"
//               id="vehicleName"
//               className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
//               value={vehicleName}
//               onChange={(e) => setVehicleName(e.target.value)}
//             />
//           </div>
//           <div>
//             <label htmlFor="brandName" className="block text-gray-700 text-sm font-bold mb-2">Brand Name</label>
//             <input
//               type="text"
//               id="brandName"
//               className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
//               value={brandName}
//               onChange={(e) => setBrandName(e.target.value)}
//             />
//           </div>
//         </div>
//         <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
//           <div>
//             <label htmlFor="registrationNumber" className="block text-gray-700 text-sm font-bold mb-2">Registration Number</label>
//             <input
//               type="text"
//               id="registrationNumber"
//               className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
//               value={registrationNumber}
//               onChange={(e) => setRegistrationNumber(e.target.value)}
//             />
//           </div>
//           <div>
//             <label htmlFor="carType" className="block text-gray-700 text-sm font-bold mb-2">Car Type</label>
//             <input
//               type="text"
//               id="carType"
//               className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
//               value={carType}
//               onChange={(e) => setCarType(e.target.value)}
//             />
//           </div>
//         </div>

//         {/* New fields for Car Color and Car Price side by side */}
//         <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
//           <div>
//             <label htmlFor="carColor" className="block text-gray-700 text-sm font-bold mb-2">Car Color</label>
//             <input
//               type="text"
//               id="carColor"
//               className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
//               value={carColor}
//               onChange={(e) => setCarColor(e.target.value)}
//             />
//           </div>
//           <div>
//             <label htmlFor="carPrice" className="block text-gray-700 text-sm font-bold mb-2">Car Price</label>
//             <input
//               type="number"
//               id="carPrice"
//               className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
//               value={carPrice}
//               onChange={(e) => setCarPrice(Math.max(0, e.target.value))} // Prevent negative input
//             />
//           </div>
//         </div>
//         <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
//           <div>
//             <label htmlFor="carColor" className="block text-gray-700 text-sm font-bold mb-2">Fuel Type</label>
//             <input
//               type="text"
//               id="fuel"
//               className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
//               value={fuel}
//               onChange={(e) => setFuel(e.target.value)}
//             />
//           </div>
//         </div>

//         {/* Insurance Details */}
//         <h2 className="text-xl font-bold mb-2">Insurance Details</h2>
//         <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
//           <div>
//             <label htmlFor="insuranceCompany" className="block text-gray-700 text-sm font-bold mb-2">Insurance Company</label>
//             <input
//               type="text"
//               id="insuranceCompany"
//               className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
//               value={insuranceCompany}
//               onChange={(e) => setInsuranceCompany(e.target.value)}
//             />
//           </div>
//           <div>
//             <label htmlFor="policyNumber" className="block text-gray-700 text-sm font-bold mb-2">Policy Number</label>
//             <input
//               type="text"
//               id="policyNumber"
//               className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
//               value={policyNumber}
//               onChange={(e) => setPolicyNumber(e.target.value)}
//             />
//           </div>
//         </div>
//         <div className="mb-4">
//           <label htmlFor="policyTenure" className="block text-gray-700 text-sm font-bold mb-2">Policy Tenure</label>
//           <input
//             type="number"
//             id="policyTenure"
//             className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
//             value={policyTenure}
//             onChange={(e) => setPolicyTenure(e.target.value)}

//             // Disable mouse wheel increment/decrement
//             onWheel={(e) => e.target.blur()}
//             style={{ appearance: 'textfield', MozAppearance: 'textfield', WebkitAppearance: 'none' }}

//           />
//         </div>

//         {/* Owner Details */}
//         <h2 className="text-xl font-bold mb-2">Owner Information</h2>
//         <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
//           <div>
//             <label htmlFor="ownerName" className="block text-gray-700 text-sm font-bold mb-2">Owner Name</label>
//             <input
//               type="text"
//               id="ownerName"
//               className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
//               value={ownerName}
//               onChange={(e) => setOwnerName(e.target.value)}
//             />
//           </div>
//           <div>
//             <label htmlFor="ownerPhone" className="block text-gray-700 text-sm font-bold mb-2">Owner Phone</label>
//             <input
//               type="text"
//               id="ownerPhone"
//               className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
//               value={ownerPhone}
//               onChange={(e) => setOwnerPhone(e.target.value)}
//             />
//           </div>
//         </div>
//         <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
//           <div>
//             <label htmlFor="ownerEmail" className="block text-gray-700 text-sm font-bold mb-2">Owner Email</label>
//             <input
//               type="email"
//               id="ownerEmail"
//               className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
//               value={ownerEmail}
//               onChange={(e) => setOwnerEmail(e.target.value)}
//             />
//           </div>
//           <div>
//             <label htmlFor="ownerAddress" className="block text-gray-700 text-sm font-bold mb-2">Owner Address</label>
//             <input
//               type="text"
//               id="ownerAddress"
//               className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
//               value={ownerAddress}
//               onChange={(e) => setOwnerAddress(e.target.value)}
//             />
//           </div>
//         </div>

//         {/* Image Upload Section */}
//         <div>
//           <h2 className="text-xl font-bold mb-2">Upload Display Image </h2>
//           <input
//             type="file"
//             accept="image/*"
//             onChange={handleDisplayImageChange}
//             className="mb-4"
//           />
//           {DisplayImage && (
//             <div className="mt-4">
//               <img
//                 src={URL.createObjectURL(DisplayImage)}
//                 alt="Primary Preview"
//                 className="h-32 mb-6 object-cover rounded-lg shadow-lg"
//               />
//             </div>
//           )}
//         </div>



//         <div>
//           <h2 className="text-xl font-bold mb-2">Upload Images (Max 10)</h2>
//           <input
//             type="file"
//             accept="image/*"
//             multiple
//             onChange={handleImageChange}
//             className="mb-4"
//           />

//           <div className="flex flex-wrap gap-4 mb-5">
//             {images.map((image, index) => {
//               const imageURL = URL.createObjectURL(image);
//               return (
//                 <img
//                   key={index}
//                   src={imageURL}
//                   alt={`Preview ${index + 1}`}
//                   className="h-32 object-cover rounded-lg shadow-lg"
//                 />
//               );
//             })}
//           </div>
//         </div>
//         <button
//           type="submit"
//           className={`bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline ${uploading ? 'opacity-50 cursor-not-allowed' : ''}`}
//           disabled={uploading}
//         >
//           {uploading ? 'Uploading...' : 'Submit'}
//         </button>
//       </form>
//     </div>
//   );
// }

// export default AdminForm;