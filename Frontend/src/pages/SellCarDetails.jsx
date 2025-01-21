import React, { useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Modal from "react-modal";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { getUploadURL, uploadToS3 } from "../../utils/s3UploadFunctions.jsx";

Modal.setAppElement("#root");

function SellCarDetails() {
  const [deleteID, setDeleteID] = useState("");
  const [carData, setCarData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [uploading, setUploading] = useState(false);

  const [formData, setFormData] = useState({
    sellingPrice: "",
    ownerName: "",
    contactNo: "",
    downPayment: "",
    totalInstallments: "",
    installmentAmount: "",
    commission: "",
    insuranceDocument: [],
    carPhotos: [], // Change to array for multiple photos
    carID: "",
    description: "", // New field for description
    paymentMode: "", // New field for payment mode
    accountPaidTo: "", // New field for account paid to
  });

  const [submittedID, setSubmittedID] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);

  const navigate = useNavigate();

  // Fetch car details using the submitted ID
  const fetchCarDetails = async (currDeleteId) => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get(
        `http://localhost:8000/car/${currDeleteId}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('authToken')}`
          }
        }
      );
      setCarData(response.data);
      // console.log(response.data);
    } catch (err) {
      setCarData(null);
      console.error("Error fetching Vehicle details:", err);
      setError("Error fetching Vehicle details");
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
    setDeleteID("");
    setSubmitted(true);
    try {
      setUploading(true);
      await fetchCarDetails(currDeleteId);
    } catch (error) {
      console.log(error);
    }
    setUploading(false);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleFileChange = (e) => {
    const { name, files } = e.target;

    setFormData({ ...formData, [name]: Array.from(files) }); // Convert FileList to array
  };

  const handleSubmit = async () => {
    try {
      setLoading(true);

      const registernumber = carData.car.registernumber;
      // console.log(registernumber);
      // Handle other image uploads if necessary (similar to DisplayImage)
      // console.log(formData.carPhotos);
      for (let i = 0; i < formData.carPhotos.length; i++) {
        const image = formData.carPhotos[i];
        const imageFileName = `${registernumber}/SoldCarImages/${i + 1}`;
        const imageUploadURL = await getUploadURL(image, imageFileName);
        await uploadToS3(imageUploadURL, image);
      }

      // Handle other image uploads if necessary (similar to DisplayImage)
      for (let i = 0; i < formData.insuranceDocument.length; i++) {
        const file = formData.insuranceDocument[i];
        const FileName = `${registernumber}/InsuranceDocuments/${i + 1}`;
        const FileUploadURL = await getUploadURL(file, FileName);
        await uploadToS3(FileUploadURL, file);
      }

      // sellFormData.append("carID", formData.carID);

      await axios.post("http://localhost:8000/dashboard/sell-car", formData,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('authToken')}`
          }
        }
      );

      toast.success("Car sold successfully!", { position: "top-right" });
      setCarData(null);
      setSubmitted(false);
    } catch (error) {
      toast.error("Error selling car. Try again.", { position: "top-right" });
    }
    setLoading(false);
    setModalOpen(false);
  };

  const handleGoBack = () => {
    navigate("/dashboard");
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
            onChange={(e) =>
              setDeleteID(
                e.target.value
                  .replace(/^\s+/, "")
                  .replace(/[a-z]/g, (char) => char.toUpperCase())
              )
            }
          />
        </div>
        <button
          type="submit"
          className={`bg-blue-500 mt-6 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline ${uploading ? 'opacity-50 cursor-not-allowed' : ''}`}
          disabled={uploading}
        >
          {uploading ? 'Fetching...' : 'Submit'}
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
                  <h2 className="text-2xl font-bold mb-4">
                    {carData.car.carname} Details
                  </h2>
                  <h3 className="text-lg font-semibold mb-2">
                    Vehicle Information
                  </h3>
                  <ul className="space-y-2">
                    <li className="flex justify-between items-center border-b pb-2">
                      <span className="font-semibold">Vehicle Register Number:</span>
                      <span>{carData.car.registernumber}</span>
                    </li>
                    <li className="flex justify-between items-center border-b pb-2">
                      <span className="font-semibold">Vehicle Name:</span>
                      <span>{carData.car.carname}</span>
                    </li>
                    <li className="flex justify-between items-center border-b pb-2">
                      <span className="font-semibold">Vehicle Type:</span>
                      <span>{carData.car.carmake}</span>
                    </li>
                    <li className="flex justify-between items-center border-b pb-2">
                      <span className="font-semibold">Company:</span>
                      <span>{carData.car.carcompany}</span>
                    </li>
                    <li className="flex justify-between items-center border-b pb-2">
                      <span className="font-semibold">Color:</span>
                      <span>{carData.car.carcolor}</span>
                    </li>
                    <li className="flex justify-between items-center border-b pb-2">
                      <span className="font-semibold">Kilometers :</span>
                      <span>{carData.car.kilometers}</span>
                    </li>
                    <li className="flex justify-between items-center border-b pb-2">
                      <span className="font-semibold">Fitness Upto :</span>
                      <span>{(new Date(carData.car.fitness_upto_date)).toLocaleDateString('en-GB')}</span>
                    </li>
                    <li className="flex justify-between items-center border-b pb-2">
                      <span className="font-semibold">Registration Date :</span>
                      <span>{(new Date(carData.car.registration_date)).toLocaleDateString('en-GB')}</span>
                    </li>
                    <li className="flex justify-between items-center border-b pb-2">
                      <span className="font-semibold">Price:</span>
                      <span className="text-blue-500">
                        ₹ {carData.car.vehiclesellprice}
                      </span>
                    </li>
                    <li className="flex justify-between items-start border-b pb-2">
                      <span className="font-semibold">Description:</span>
                      <div className="ml-2 w-full">
                        <p className="break-words whitespace-normal">{carData.car.description}</p>
                      </div>
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
        <div className="mt-8 p-4 bg-white rounded-lg shadow">
          <h2 className="text-2xl font-bold mb-4">Sell Car</h2>
          <form onSubmit={handleSellConfirmation}>
            <div className="mb-4">
              <label
                htmlFor="sellingPrice"
                className="block text-gray-700 text-sm font-bold mb-2"
              >
                Selling Price
              </label>
              <input
                type="number"
                id="sellingPrice"
                name="sellingPrice"
                required
                value={formData.sellingPrice}
                onChange={handleChange}
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                step="1"
                min="0"
              />
            </div>

            <div className="mb-4">
              <label
                htmlFor="ownerName"
                className="block text-gray-700 text-sm font-bold mb-2"
              >
                Owner Name
              </label>
              <input
                type="text"
                id="ownerName"
                name="ownerName"
                required
                value={formData.ownerName}
                onChange={handleChange}
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              />
            </div>

            <div className="mb-4">
              <label
                htmlFor="contactNo"
                className="block text-gray-700 text-sm font-bold mb-2"
              >
                Contact No
              </label>
              <input
                type="tel"
                id="contactNo"
                name="contactNo"
                required
                value={formData.contactNo}
                onChange={handleChange}
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              />
            </div>

            <div className="mb-4">
              <label
                htmlFor="downPayment"
                className="block text-gray-700 text-sm font-bold mb-2"
              >
                Down Payment
              </label>
              <input
                type="number"
                id="downPayment"
                name="downPayment"
                required
                value={formData.downPayment}
                onChange={handleChange}
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                step="1"
                min="0"
              />
            </div>

            <div className="mb-4">
              <label
                htmlFor="totalInstallments"
                className="block text-gray-700 text-sm font-bold mb-2"
              >
                Total Installments
              </label>
              <input
                type="number"
                id="totalInstallments"
                name="totalInstallments"
                required
                value={formData.totalInstallments}
                onChange={handleChange}
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                step="1"
                min="0"
              />
            </div>

            <div className="mb-4">
              <label
                htmlFor="installmentAmount"
                className="block text-gray-700 text-sm font-bold mb-2"
              >
                Installment Amount
              </label>
              <input
                type="number"
                id="installmentAmount"
                name="installmentAmount"
                required
                value={formData.installmentAmount}
                onChange={handleChange}
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                step="1"
                min="0"
              />
            </div>

            <div className="mb-4">
              <label
                htmlFor="commission"
                className="block text-gray-700 text-sm font-bold mb-2"
              >
                Commission
              </label>
              <input
                type="number"
                id="commission"
                name="commission"
                required
                value={formData.commission}
                onChange={handleChange}
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                step="1"
                min="0"
              />
            </div>

            <div className="mb-4">
              <label
                htmlFor="description"
                className="block text-gray-700 text-sm font-bold mb-2"
              >
                Description
              </label>
              <textarea
                id="description"
                name="description"
                required
                value={formData.description}
                onChange={handleChange}
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                rows="4"  // Set the number of rows for the textarea (optional)
              ></textarea>

            </div>

            <div className="mb-4">
              <label
                htmlFor="paymentMode"
                className="block text-gray-700 text-sm font-bold mb-2"
              >
                Payment Mode
              </label>
              <input
                type="text"
                id="paymentMode"
                name="paymentMode"
                required
                value={formData.paymentMode}
                onChange={handleChange}
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              />
            </div>

            <div className="mb-4">
              <label
                htmlFor="accountPaidTo"
                className="block text-gray-700 text-sm font-bold mb-2"
              >
                Account Paid To
              </label>
              <input
                type="text"
                id="accountPaidTo"
                name="accountPaidTo"
                required
                value={formData.accountPaidTo}
                onChange={handleChange}
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              />
            </div>

            <div className="mb-4">
              <label
                htmlFor="insuranceDocument"
                className="block text-gray-700 text-sm font-bold mb-2"
              >
                Insurance Document
              </label>
              <input
                type="file"
                id="insuranceDocument"
                name="insuranceDocument"
                multiple
                onChange={handleFileChange}
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              />
            </div>

            <div className="mb-4">
              <label
                htmlFor="carPhotos"
                className="block text-gray-700 text-sm font-bold mb-2"
              >
                Car Photos
              </label>
              <input
                type="file"
                id="carPhotos"
                name="carPhotos"
                multiple // Allow multiple files
                onChange={handleFileChange}
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              />
            </div>

            <button
              type="button"
              onClick={handleSellConfirmation}
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
              disabled={loading}
            >
              Sell Car
            </button>
          </form>

        </div>
      )}

      {/* Confirmation Modal */}
      <Modal
        isOpen={modalOpen}
        onRequestClose={closeModal}
        contentLabel="Confirmation Modal"
        className="bg-white w-full sm:w-2/3 lg:w-1/3 mx-4 sm:mx-auto mt-32 p-4 rounded-lg shadow-lg"
        overlayClassName="fixed inset-0 bg-gray-900 bg-opacity-50 flex items-center justify-center"
      >
        <h2 className="text-xl font-bold mb-4">Confirm Sale</h2>
        <p>Are you sure you want to sell this car?</p>
        <button
          onClick={handleSubmit}
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline mt-4"
          disabled={loading}
        >
          {loading ? "Selling..." : "Confirm"}

        </button>
        <button
          onClick={closeModal}
          className="bg-gray-300 hover:bg-gray-500 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline mt-4 ml-2"
        >
          Cancel
        </button>
      </Modal>

      <ToastContainer />
    </div>
  );
}

export default SellCarDetails;
