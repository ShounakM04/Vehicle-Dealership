import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import {
  DollarSign,
  Calendar,
  FileText,
  Eye,
  Plus,
  CreditCard,
  Building2,
  AlertCircle,
  Car,
  IndianRupee,
  Wallet2,
} from "lucide-react";

export default function Installment({ carID, isAdmin, soldStatus }) {
  const [installmentAmount, setInstallmentAmount] = useState("");
  const [installmentDate, setInstallmentDate] = useState("");
  const [carDetails, setCarDetails] = useState([]);
  const [installments, setInstallments] = useState([]);
  const [error, setError] = useState(null);
  const [viewOption, setViewOption] = useState("view");
  const [loading, setLoading] = useState(true);
  const [insuranceDoc, setInsuranceDoc] = useState([]);
  const [soldCarImages, setSoldCarImages] = useState([]);
  const [profit, setProfit] = useState(0);
  const [uploading, setUploading] = useState(false);
  const [description, setDescription] = useState("");
  const [paymentMode, setPaymentMode] = useState("");
  const [accountPaidTo, setAccountPaidTo] = useState("");
  const [totalInstallmentsAmount, setTotalInstallmentsAmount] = useState(0);

  const fetchCarDetails = async () => {
    try {
      const response = await axios.get(
        `https://www.nikhilmotors.com/api/dashboard/sold-cars`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("authToken")}`,
          },
          params: { carID },
        }
      );
      setCarDetails(response.data.dbData);
      setInsuranceDoc(response.data.soldCarInsuranceDocs);
      setSoldCarImages(response.data.soldCarImages);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchInstallments = async () => {
    if (!carID) return;
    try {
      const response = await axios.get(`https://www.nikhilmotors.com/api/installments`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("authToken")}`,
        },
        params: { registernumber: carID },
      });
      setInstallments(response.data.installments);
      setTotalInstallmentsAmount(response.data.totalAmount);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleInstallmentSubmit = async (e) => {
    e.preventDefault();
    setUploading(true);
    try {
      const response = await axios.post(
        "https://www.nikhilmotors.com/api/installments",
        {
          registernumber: carID,
          amount: installmentAmount,
          installmentdate: installmentDate,
          description,
          paymentMode,
          accountPaidTo,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("authToken")}`,
          },
        }
      );

      if (response.status === 200) {
        toast.success("Installment added successfully");
        setInstallmentAmount("");
        setInstallmentDate("");
        setDescription("");
        setPaymentMode("");
        setAccountPaidTo("");
        setViewOption("view");
        fetchInstallments();
      }
    } catch (error) {
      toast.error("Failed to add installment. Please try again.");
      console.error(error);
    }
    setUploading(false);
  };

  const fetchProfit = async () => {
    try {
      const response = await axios.get("https://www.nikhilmotors.com/api/profits", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("authToken")}`,
        },
        params: { registernumber: carID },
      });
      setProfit(response.data.profit);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        if (soldStatus) {
          await Promise.all([
            fetchCarDetails(),
            fetchInstallments(),
            fetchProfit(),
          ]);
        }
      } catch (err) {
        console.error("Error fetching data:", err);
        setError("Error fetching data");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [carID, soldStatus]);

  const formatDate = (dateString) => {
    const options = { year: "numeric", month: "2-digit", day: "2-digit" };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const totalInstallmentAmount = installments.reduce(
    (total, inst) => total + parseFloat(inst.amount),
    0
  );

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[200px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-xl shadow-lg overflow-hidden">
        <div className="p-6">
          <h2 className="text-2xl font-bold mb-6 flex items-center">
            <Car className="w-6 h-6 mr-2 text-blue-600" />
            Sold Vehicle Details
          </h2>

          {error && (
            <div className="mb-4 p-4 bg-red-50 rounded-lg flex items-center">
              <AlertCircle className="w-5 h-5 text-red-400 mr-2" />
              <p className="text-red-700">{error}</p>
            </div>
          )}

          {carDetails.length > 0 ? (
            carDetails.map((car) => (
              <div key={car.registernumber} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <h3 className="font-semibold text-lg mb-3">
                        Basic Details
                      </h3>
                      <div className="space-y-2">
                        <p className="flex justify-between">
                          <span className="text-gray-600">Buyer:</span>
                          <span className="font-medium">{car.owner_name}</span>
                        </p>
                        <p className="flex justify-between">
                          <span className="text-gray-600">Contact:</span>
                          <span className="font-medium">{car.contact_no}</span>
                        </p>
                        <p className="flex justify-between">
                          <span className="text-gray-600">Selling Price:</span>
                          <span className="font-medium">
                            {formatCurrency(car.selling_price)}
                          </span>
                        </p>
                      </div>
                    </div>

                    <div className="bg-blue-50 p-4 rounded-lg">
                      <h3 className="font-semibold text-lg mb-3">
                        Payment Details
                      </h3>
                      <div className="space-y-2">
                        <p className="flex justify-between">
                          <span className="text-gray-600">Down Payment:</span>
                          <span className="font-medium">
                            {formatCurrency(car.down_payment)}
                          </span>
                        </p>
                        <p className="flex justify-between">
                          <span className="text-gray-600">
                            Total Installments:
                          </span>
                          <span className="font-medium">
                            {formatCurrency(totalInstallmentsAmount)}
                          </span>
                        </p>
                        <p className="flex justify-between">
                          <span className="text-gray-600">Commission:</span>
                          <span className="font-medium">
                            {formatCurrency(car.commission)}
                          </span>
                        </p>
                        <div className="pt-2 border-t border-blue-100">
                          <p className="flex justify-between font-semibold">
                            <span>Total Received:</span>
                            <span>
                              {formatCurrency(
                                parseFloat(car.down_payment || 0) +
                                parseFloat(totalInstallmentAmount || 0)
                              )}
                            </span>
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <h3 className="font-semibold text-lg mb-3">
                        Payment Information
                      </h3>
                      <div className="space-y-2">
                        <p className="flex justify-between">
                          <span className="text-gray-600">Payment Mode:</span>
                          <span className="font-medium">
                            {car.payment_mode}
                          </span>
                        </p>
                        <p className="flex justify-between">
                          <span className="text-gray-600">Account:</span>
                          <span className="font-medium">
                            {car.account_paid_to}
                          </span>
                        </p>
                      </div>
                    </div>

                    <div className="bg-gray-50 p-4 rounded-lg">
                      <h3 className="font-semibold text-lg mb-3">Documents</h3>
                      <div className="space-y-4">
                        <div>
                          <p className="text-gray-600 mb-2">
                            Insurance Document:
                          </p>
                          {insuranceDoc.length > 0 ? (
                            <button
                              onClick={() =>
                                insuranceDoc.forEach((doc) =>
                                  window.open(doc, "_blank")
                                )
                              }
                              className="inline-flex items-center text-blue-600 hover:text-blue-800"
                            >
                              <FileText className="w-4 h-4 mr-2" />
                              View Document
                            </button>
                          ) : (
                            <span className="text-gray-500">Not Provided</span>
                          )}
                        </div>
                        <div>
                          <p className="text-gray-600 mb-2">Vehicle Images:</p>
                          {soldCarImages.length > 0 ? (
                            <button
                              onClick={() =>
                                soldCarImages.forEach((doc) =>
                                  window.open(doc, "_blank")
                                )
                              }
                              className="inline-flex items-center text-blue-600 hover:text-blue-800"
                            >
                              <Eye className="w-4 h-4 mr-2" />
                              View Images
                            </button>
                          ) : (
                            <span className="text-gray-500">Not Provided</span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {isAdmin && (
                  <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-4 rounded-lg">
                    <p className="text-lg font-semibold flex items-center">
                      {/* <span className="w-5 h-5 text-blue-600" /> */}
                      Estimated {profit >= 0 ? "Profit" : "Loss"}:{" "}
                      <span
                        className={
                          profit >= 0
                            ? "text-green-600 ml-2"
                            : "text-red-600 ml-2"
                        }
                      >
                        {formatCurrency(Math.abs(profit))}
                      </span>
                    </p>
                  </div>
                )}
              </div>
            ))
          ) : (
            <p className="text-center text-gray-500">
              No vehicle details available
            </p>
          )}
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-lg overflow-hidden">
        <div className="p-6">
          <div className="lg:flex lg:justify-between lg:items-center lg:mb-6 ">
            <h2 className="text-2xl font-bold flex items-center mb-4">
              <Calendar className="w-6 h-6 mr-2 text-blue-600 " />
              Installments
            </h2>
            <div className="flex space-x-4">
              <button
                onClick={() => setViewOption("view")}
                className={`px-4 py-2 rounded-md transition-colors ${viewOption === "view"
                    ? "bg-blue-600 text-white"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
              >
                <Eye className="w-4 h-4 inline-block mr-2" />
                View
              </button>
              <button
                onClick={() => setViewOption("add")}
                className={`px-4 py-2 rounded-md transition-colors ${viewOption === "add"
                    ? "bg-blue-600 text-white"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
              >
                <Plus className="w-4 h-4 inline-block mr-2" />
                Add New
              </button>
            </div>
          </div>

          {viewOption === "view" ? (
            <div className="space-y-4">
              <div className="max-h-[400px] overflow-y-auto">
                {installments.length > 0 ? (
                  <div className="space-y-4">
                    {installments.map((inst, index) => (
                      <div
                        key={index}
                        className="bg-gray-50 p-4 rounded-lg transition-shadow hover:shadow-md"
                      >
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <p className="text-lg font-semibold flex items-center">
                              <Wallet2 className="w-4 h-4 mr-2 text-green-600" />
                              {formatCurrency(inst.amount)}
                            </p>
                            <p className="text-gray-600 flex items-center mt-2">
                              <Calendar className="w-4 h-4 mr-2" />
                              {formatDate(inst.installment_date)}
                            </p>
                          </div>
                          <div>
                            <p className="flex items-center">
                              <span className="text-sm font-medium mr-2 text-gray-700">
                                Payment Mode:
                              </span>
                              {/* <CreditCard className="w-4 h-4 mr-2 text-blue-600" /> */}
                              {inst.payment_mode}
                            </p>
                            <p className="flex items-center mt-2">
                              <span className="text-sm font-medium mr-2 text-gray-700">
                                Account Paid To:
                              </span>
                              {/* <Building2 className="w-4 h-4 mr-2 text-purple-600" /> */}
                              {inst.account_paid_to}
                            </p>
                          </div>
                        </div>

                        {inst.description && (
                          <p className="mt-3 text-gray-600">
                            {/* <File Text className="w-4 h-4 mr-2" /> */}
                            {inst.description}
                          </p>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-center text-gray-500 py-4">
                    No installments available
                  </p>
                )}
              </div>
              <div className="pt-4 border-t">
                <p className="text-xl font-semibold flex items-center">
                  <IndianRupee className="w-5 h-5 mr-2 text-green-600" />
                  Total Installments: {formatCurrency(totalInstallmentAmount)}
                </p>
              </div>
            </div>
          ) : (
            <form onSubmit={handleInstallmentSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Amount
                  </label>
                  <div className="relative">
                    <IndianRupee className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input
                      type="number"
                      value={installmentAmount}
                      onChange={(e) => setInstallmentAmount(e.target.value)}
                      required
                      min="0"
                      step="1"
                      className="pl-10 p-2 block w-full rounded-md border border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Date
                  </label>
                  <div className="relative">
                    <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input
                      type="date"
                      value={installmentDate}
                      onChange={(e) => setInstallmentDate(e.target.value)}
                      required
                      className="pl-10 p-2 block w-full border rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description
                </label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  required
                  rows={3}
                  className="block w-full rounded-md border border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 p-2"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Payment Mode
                  </label>
                  <div className="relative">
                    <CreditCard className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input
                      type="text"
                      value={paymentMode}
                      onChange={(e) => setPaymentMode(e.target.value)}
                      required
                      className="pl-10 block w-full rounded-md border border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 p-2"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Account Paid To
                  </label>
                  <div className="relative">
                    <Building2 className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input
                      type="text"
                      value={accountPaidTo}
                      onChange={(e) => setAccountPaidTo(e.target.value)}
                      required
                      className="pl-10 block w-full rounded-md border border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 p-2"
                    />
                  </div>
                </div>
              </div>

              <button
                type="submit"
                disabled={uploading}
                className="w-full flex justify-center items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {uploading ? (
                  <>
                    <svg
                      className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    Adding...
                  </>
                ) : (
                  "Add Installment"
                )}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
