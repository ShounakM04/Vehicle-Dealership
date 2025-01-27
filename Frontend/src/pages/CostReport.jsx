import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Maintainance } from "../components/Maintainance";
import Installment from "../components/Installment";
import { jwtDecode } from "jwt-decode";
import { Carousel } from "react-responsive-carousel";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import {
  FileText,
  Car,
  PenTool as Tool,
  DollarSign,
  Download,
  Plus,
  Eye,
} from "lucide-react";
import { FaTrashAlt } from "react-icons/fa";
const CostReport = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [soldStatus, setSoldStatus] = useState();
  const [vehicleData, setvehicleData] = useState({
    insuranceCommission: 0,
    maintenanceRecords: [],
    installments: [],
    carDetails: {
      buyingprice: 0,
      sellingprice: 0,
      carNo: "",
      ownerName: "",
      ownerPhone: "",
      ownerEmail: "",
      model: "",
      color: "",
      type: "",
    },
    totalAmountToBePaid: 0,
    remainingAmount: 0,
  });
  const [installmentAmount, setInstallmentAmount] = useState("");
  const [installmentDate, setInstallmentDate] = useState("");
  const [loading, setLoading] = useState(false);
  const [financeData, setFinanceData] = useState(null);
  const [fetchedVehicleData, setFetchedVehicleData] = useState(null);
  const [vehicleImages, setvehicleImages] = useState([]);
  const [onsiteVehicleImages, setOnsiteVehicleImages] = useState([]);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isEmployee, setIsEmployee] = useState(false);
  const [maintainanceData, setMaintainanceData] = useState({
    carDetails: { carNo: "" },
    maintenanceRecords: [],
    totalMaintenanceCost: 0,
  });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedImageSerial, setSelectedImageSerial] = useState(null);
  const [isLoading, setIsLoading] = useState(false); // State for screen overlay
  function cleanURL(url) {
    const match = url.match(/https?:\/\/[^\s"']+/);
    return match ? match[0] : "";
  }

  useEffect(() => {
    const fetchCarDetails = async () => {
      try {
        const response = await axios.get(`https://www.nikhilmotors.com/api/car/${id}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("authToken")}`,
          },
        });
        const { car, images, insurance, owner, onsiteImages } = response.data;
        setSoldStatus(response.data.car.status);
        setFetchedVehicleData(response.data);
        setvehicleImages(images);
        setOnsiteVehicleImages(onsiteImages);
        setFinanceData(response.data.finance);

        setvehicleData((prevData) => ({
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
            carCompany: car.carcompany,
            buyingprice: car.vehiclebuyprice,
            sellingprice: car.vehiclesellprice,
          },
        }));
      } catch (error) {
        console.error("Error fetching car details:", error);
        toast.error("Failed to fetch car details.");
      }
    };

    fetchCarDetails();
  }, [id]);

  useEffect(() => {
    function fetchRole() {
      const token = localStorage.getItem("authToken");
      let decodedToken;
      if (token) {
        try {
          decodedToken = jwtDecode(token);
        } catch (error) {
          console.error("Invalid token", error);
        }
      }
      if (decodedToken?.isAdmin && decodedToken.isAdmin == true) {
        setIsAdmin(true);
      } else if (decodedToken?.isEmployee && decodedToken.isEmployee == true) {
        setIsEmployee(true);
      }
    }
    fetchRole();
  }, []);

  const handleGenerateBill = async () => {
    try {
      setLoading(true);
      const response = await axios.post(
        `https://www.nikhilmotors.com/api/bill/generate-bill`,
        { registerNumber: id },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("authToken")}`,
          },
        }
      );

      if (response.data && response.data.fileUrl) {
        toast.success("Bill generated successfully!");
        const newTab = window.open(response.data.fileUrl, "_blank");
        if (newTab) {
          newTab.focus();
        } else {
          toast.error("Failed to open the bill in a new tab.");
        }
      }
      setLoading(false);
    } catch (error) {
      if (error.response?.data?.message) {
        toast.error(error.response.data.message);
      } else {
        toast.error("Failed to generate bill.");
      }
      console.error(error);
      setLoading(false);
    }
  };

  const fetchMaintenanceDetails = async () => {
    try {
      const response = await axios.get("https://www.nikhilmotors.com/api/maintainance", {
        params: { registernumber: id },
        headers: {
          Authorization: `Bearer ${localStorage.getItem("authToken")}`,
        },
      });

      if (response.status === 201) {
        setMaintainanceData((prevData) => ({
          ...prevData,
          maintenanceRecords: [],
          totalMaintenanceCost: 0,
        }));
        return;
      }

      const { maintenanceRecords, totalmaintainance } = response.data;

      if (Array.isArray(maintenanceRecords)) {
        setMaintainanceData((prevData) => ({
          ...prevData,
          maintenanceRecords: maintenanceRecords,
          totalMaintenanceCost: Number(totalmaintainance),
        }));
      } else {
        toast.error("Invalid maintenance records format.");
      }
    } catch (error) {
      console.error("Error fetching maintenance details:", error);
    }
  };

  useEffect(() => {
    if (id) fetchMaintenanceDetails();
  }, [id]);

  const handleMaintenanceAdded = () => {
    fetchMaintenanceDetails();
  };

  const confirmDelete = (serialnum) => {
    setSelectedImageSerial(serialnum);
    setIsModalOpen(true);
  };

  const handleDelete = async () => {
    try {
      setIsLoading(true); // Start fade-up effect
      console.log(maintainanceData.maintenanceRecords);
      const deleteUrl =
        maintainanceData.maintenanceRecords[selectedImageSerial]
          .maintainanceReceipt;
      console.log("Del : " + deleteUrl);

      // Extract the uniqueID from the URL

      let regex = new RegExp(`/${id}/MaintenanceDoc/(\\d+)\\?`);

      const match = deleteUrl.match(regex);
      let uniqueID;

      if (match) {
        uniqueID = match[1];
        console.log(uniqueID);
      } else {
        console.log("No unique ID found");
      }

      let path = `${id}/MaintenanceDoc/${uniqueID}`;

      // console.log(uniqueID);

      await axios.delete(`https://www.nikhilmotors.com/api/delete-image`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("authToken")}`,
        },
        params: { path: path },
      });

      await axios.delete(
        `https://www.nikhilmotors.com/api/maintainance/delete-maintainance`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("authToken")}`,
          },
          params: { uniqueID: uniqueID, registernumber: id },
        }
      );

      fetchMaintenanceDetails();
      toast.success(
        `Maintenance with serial number ${selectedImageSerial} deleted successfully!`
      );
    } catch (error) {
      console.error("Error deleting notice image:", error);
      toast.error("Failed to delete notice image");
    } finally {
      setIsLoading(false); // Remove fade-up effect
      setIsModalOpen(false);
      setSelectedImageSerial(null);
    }
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedImageSerial(null);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-2 sm:px-6 lg:px-8">
      <div className="max-w-8xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Column */}
          <div className="space-y-8">
            {/* Vehicle Details Card */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
              <div className="p-6">
                <div className="flex flex-col sm:flex-row sm:justify-between items-start mb-6">
                  <h2 className="text-2xl font-bold text-gray-900 flex items-center mb-4 sm:mb-0">
                    <Car className="w-6 h-6 mr-2 text-blue-600" />
                    Vehicle Details
                  </h2>
                  {(isAdmin || isEmployee) && (
                    <div className="flex flex-wrap gap-3">
                      <button
                        onClick={() => navigate(`/dashboard/costReport/${id}/addDoc`)}
                        className="inline-flex items-center px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
                      >
                        <Plus className="w-4 h-4 mr-2" />
                        Add Doc
                      </button>
                      <button
                        onClick={() => navigate(`/dashboard/costReport/${id}/viewDoc`)}
                        className="inline-flex items-center px-4 py-2 bg-green-600 text-white text-sm font-medium rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-colors"
                      >
                        <Eye className="w-4 h-4 mr-2" />
                        View Docs
                      </button>
                      {soldStatus && (
                        <button
                          onClick={handleGenerateBill}
                          className="inline-flex items-center px-4 py-2 bg-purple-600 text-white text-sm font-medium rounded-md hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 transition-colors"
                          disabled={loading}
                        >
                          <Download className="w-4 h-4 mr-2" />
                          {loading ? "Downloading..." : "Download Bill"}
                        </button>
                      )}
                    </div>
                  )}
                </div>


                {/* Vehicle and Owner Details Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <h3 className="text-lg font-semibold text-blue-900 mb-3">
                      Vehicle Information
                    </h3>
                    <div className="space-y-2">
                      <p className="text-blue-800">
                        <span className="font-medium">Registration:</span>{" "}
                        {vehicleData.carDetails.carNo || "Not Provided"}
                      </p>
                      <p className="text-blue-800">
                        <span className="font-medium">Company:</span>{" "}
                        {vehicleData.carDetails.carCompany || "Not Provided"}
                      </p>
                      <p className="text-blue-800">
                        <span className="font-medium">Model:</span>{" "}
                        {vehicleData.carDetails.model || "Not Provided"}
                      </p>
                    </div>
                  </div>

                  <div className="bg-green-50 p-4 rounded-lg">
                    <h3 className="text-lg font-semibold text-green-900 mb-3">
                      Owner Information
                    </h3>
                    <div className="space-y-2">
                      <p className="text-green-800">
                        <span className="font-medium">Name:</span>{" "}
                        {vehicleData.carDetails.ownerName || "Not Provided"}
                      </p>
                      <p className="text-green-800">
                        <span className="font-medium">Phone:</span>{" "}
                        {vehicleData.carDetails.ownerPhone || "Not Provided"}
                      </p>
                      <p className="text-green-800">
                        <span className="font-medium">Email:</span>{" "}
                        {vehicleData.carDetails.ownerEmail || "Not Provided"}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Finance Details */}
                <div className="bg-purple-50 p-4 rounded-lg mb-6">
                  <h3 className="text-lg font-semibold text-purple-900 mb-3">
                    Finance Details
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <p className="text-purple-800">
                        <span className="font-medium">Company:</span>{" "}
                        {financeData?.company_name || "Not Provided"}
                      </p>
                      <p className="text-purple-800">
                        <span className="font-medium">Manager 1:</span>{" "}
                        {financeData?.manager_name1 || "Not Provided"}
                        {financeData?.contact1 && ` (${financeData.contact1})`}
                      </p>
                    </div>
                    <div className="space-y-2">
                      <p className="text-purple-800">
                        <span className="font-medium">Branch:</span>{" "}
                        {financeData?.branch_name || "Not Provided"}
                      </p>
                      <p className="text-purple-800">
                        <span className="font-medium">Manager 2:</span>{" "}
                        {financeData?.manager_name2 || "Not Provided"}
                        {financeData?.contact2 && ` (${financeData.contact2})`}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Image Galleries */}
                <div className="bg-white rounded-xl shadow-sm overflow-hidden">
                  <h2 className="text-2xl font-semibold mb-4">
                    Vehicle Images
                  </h2>
                  <div className="grid md:grid-cols-2 gap-6">
                    {/* Inventory Images */}
                    <div>
                      <h3 className="font-medium text-gray-900 mb-3">
                        Inventory Images
                      </h3>
                      {vehicleImages.length > 0 ? (
                        <Carousel
                          showArrows={true}
                          autoPlay={true}
                          infiniteLoop={true}
                          showThumbs={false}
                          className="rounded-lg overflow-hidden"
                        >
                          {vehicleImages?.map((image, index) => (
                            <div
                              key={index}
                              className="aspect-video bg-gray-100"
                            >
                              <img
                                src={image}
                                alt={`Inventory ${index + 1}`}
                                className="w-full h-full object-contain"
                              />
                            </div>
                          ))}
                        </Carousel>
                      ) : (
                        <div className="flex items-center justify-center h-40 bg-gray-50 rounded-lg">
                          <p className="text-gray-500">
                            No inventory images available
                          </p>
                        </div>
                      )}
                    </div>

                    {/* Onsite Images */}
                    <div>
                      <h3 className="font-medium text-gray-900 mb-3">
                        Onsite Images
                      </h3>
                      {onsiteVehicleImages.length > 0 ? (
                        <Carousel
                          showArrows={true}
                          autoPlay={true}
                          infiniteLoop={true}
                          showThumbs={false}
                          className="rounded-lg overflow-hidden"
                        >
                          {onsiteVehicleImages?.map((image, index) => (
                            <div
                              key={index}
                              className="aspect-video bg-gray-100"
                            >
                              <img
                                src={image}
                                alt={`Onsite ${index + 1}`}
                                className="w-full h-full object-contain"
                              />
                            </div>
                          ))}
                        </Carousel>
                      ) : (
                        <div className="flex items-center justify-center h-40 bg-gray-50 rounded-lg">
                          <p className="text-gray-500">
                            No onsite images available
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
              <div className="p-6">
                <h3 className="text-xl font-bold text-gray-900 flex items-center mb-4">
                  <FileText className="w-6 h-6 mr-2 text-indigo-600" />
                  Maintenance Records
                </h3>
                <div className="overflow-y-auto max-h-48">
                  {maintainanceData.maintenanceRecords.length > 0 ? (
                    <div className="space-y-4">
                      {maintainanceData.maintenanceRecords.map(
                        (record, index) => (
                          <div
                            key={index}
                            className="bg-indigo-50 rounded-lg p-4 transition-transform"
                          >
                            <div className="flex justify-between items-start">
                              <div className="space-y-2">
                                <p className="font-medium text-indigo-900">
                                  {index + 1}. {record.description}
                                </p>
                                <p className="text-indigo-700">
                                  <span className="font-semibold">Cost:</span> ₹
                                  {record.price}
                                </p>
                                <p className="text-indigo-700">
                                  <span className="font-semibold">Date:</span>{" "}
                                  {new Date(
                                    record.maintainanceDate
                                  ).toLocaleDateString("en-GB")}
                                </p>
                                <p className="text-indigo-700">
                                  <span className="font-semibold">
                                    Done By:
                                  </span>{" "}
                                  {record.username}
                                </p>
                                <a
                                  href={record.maintainanceReceipt}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="inline-flex items-center text-indigo-600 hover:text-indigo-800 font-medium"
                                >
                                  <FileText className="w-4 h-4 mr-1" />
                                  View Receipt
                                </a>
                              </div>
                              {isAdmin && (
                                <div className="ml-4">
                                  <button
                                    className="bg-red-500 hover:bg-red-600 text-white font-semibold py-2 px-3 rounded-lg focus:outline-none focus:ring focus:ring-red-300 transition"
                                    onClick={() => confirmDelete(index)}
                                    title="Delete Record"
                                  >
                                    <FaTrashAlt className="w-4 h-4" />
                                  </button>
                                </div>
                              )}
                            </div>
                          </div>
                        )
                      )}
                    </div>
                  ) : (
                    <p className="text-gray-500 text-center py-4">
                      No maintenance records available.
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Maintenance Summary Card */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
              <div className="p-6">
                <h3 className="text-xl font-bold text-gray-900 flex items-center mb-4">
                  <Tool className="w-6 h-6 mr-2 text-orange-600" />
                  Maintenance Summary
                </h3>
                <div className="bg-orange-50 rounded-lg p-4 space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-orange-900 font-medium">
                      Total Maintenance Cost:
                    </span>
                    <span className="text-orange-900 font-bold">
                      ₹{maintainanceData.totalMaintenanceCost}
                    </span>
                  </div>
                  {isAdmin && (
                    <>
                      <div className="flex justify-between items-center">
                        <span className="text-orange-900 font-medium">
                          Buying Price:
                        </span>
                        <span className="text-orange-900 font-bold">
                          ₹{vehicleData.carDetails.buyingprice}
                        </span>
                      </div>
                      <div className="border-t border-orange-200 pt-4">
                        <div className="flex justify-between items-center">
                          <span className="text-orange-900 font-medium">
                            Total Investment:
                          </span>
                          <span className="text-orange-900 font-bold">
                            ₹
                            {Number(vehicleData.carDetails.buyingprice) +
                              maintainanceData.totalMaintenanceCost}
                          </span>
                        </div>
                      </div>
                    </>
                  )}
                </div>
              </div>
            </div>

            {/* Maintenance Records */}
          </div>

          {/* Right Column */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="p-6">
              {soldStatus === false ? (
                <Maintainance
                  registernumber={id}
                  isDriver={false}
                  isEmployee={isEmployee}
                  isAdmin={isAdmin}
                  vehicleData={fetchedVehicleData}
                  onMaintenanceAdded={handleMaintenanceAdded}
                />
              ) : (
                <Installment
                  carID={id}
                  isAdmin={isAdmin}
                  soldStatus={soldStatus}
                />
              )}
            </div>
          </div>
        </div>
        {isModalOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <div className="bg-white p-6 rounded-lg shadow-lg max-w-sm w-full">
              <h3 className="text-lg font-semibold mb-4">
                Are you sure you want to delete this image?
              </h3>
              <div className="flex justify-end">
                <button
                  className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded mr-2"
                  onClick={handleDelete}
                  disabled={isLoading}
                >
                  Yes, Delete
                </button>
                <button
                  className="bg-gray-300 hover:bg-gray-400 text-black font-bold py-2 px-4 rounded"
                  onClick={closeModal}
                  disabled={isLoading}
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
      <ToastContainer />
    </div>
  );
};

export default CostReport;
