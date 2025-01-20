import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css"; // Import the styles for the toast notifications
import { jwtDecode } from "jwt-decode";

const AccountDetails = () => {
  const [costs, setCosts] = useState([]); // Initialize as an empty array
  const [description, setDescription] = useState("");
  const [editDescription, setEditDescription] = useState("");
  const [editAmount, setEditAmount] = useState("");
  const [editDate, setEditDate] = useState("");
  const [amount, setCost] = useState("");
  const [filterYear, setFilterYear] = useState(new Date().getFullYear());
  const [filterMonth, setFilterMonth] = useState(new Date().getMonth());
  const [totalCost, setTotalCost] = useState(0); // State to store the total amount
  const [loading, setLoading] = useState(false); // Loading state for add button
  const [isFetching, setIsFetching] = useState(false); // Loading state for fetching data
  const [editMode, setEditMode] = useState(false); // Flag to toggle edit mode
  const [editableItem, setEditableItem] = useState(null); // Item being edited
  const [isAdmin, setIsAdmin] = useState();
  const [accountDetails, setAccountDetails] = useState({
    totalBuy: 0,
    totalMaintainance: 0,
    totalMiscellaneous: 0,
    totalInstallments: 0,
    totalSellings: 0,
    totalDownPayments: 0,
    totalCommision: 0,
    totalInvestment: 0,
    Remaining_Balance: 0,
  });
  const navigate = useNavigate();
  useEffect(() => {
    function fetchRole() {
      const token = localStorage.getItem("authToken");
      let decodedToken;
      if (token) {
        try {
          decodedToken = jwtDecode(token);
          console.log(decodedToken);
        } catch (error) {
          console.error("Invalid token", error);
        }
      }
      if (decodedToken?.isAdmin && decodedToken.isAdmin == true) {
        setIsAdmin(true);
      }
    }
    fetchRole();
  }, []);
  const fetchAccountDetails = async () => {
    try {
      const response = await axios.get("https://www.nikhilmotors.com/api/accountDetails", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("authToken")}`,
        },
      });
      setAccountDetails(response.data);
    } catch (error) {
      console.error("Error fetching account details:", error);
    }
  };
  useEffect(() => {
    fetchAccountDetails();
  }, [costs]);
  const fetchCosts = async () => {
    setIsFetching(true); // Start loading
    try {
      const response = await axios.get(
        "https://www.nikhilmotors.com/api/accountDetails/filter",
        {
          params: {
            month: filterMonth + 1, // Adjust for 0-based month
            year: filterYear,
          },
          headers: {
            Authorization: `Bearer ${localStorage.getItem("authToken")}`,
          },
        }
      );
      console.log(response.data);
      if (Array.isArray(response.data.investmentCosts)) {
        setCosts(response.data.investmentCosts);
      } else {
        setCosts([]); // Fallback if data is not as expected
      }
      setTotalCost(response.data.totalInvestment || 0); // Ensure total amount is set correctly
    } catch (error) {
      console.error("Error fetching costs:", error);
      toast.error("Failed to fetch costs"); // Show error toast
      setCosts([]); // Set empty array in case of error
      setTotalCost(0); // Reset total amount if error occurs
    } finally {
      setIsFetching(false); // End loading
    }
  };

  const handleEdit = (item) => {
    setEditableItem(item);
    setEditDescription(item.description); // Changed to use edit form state
    setEditAmount(item.amount); // Changed to use edit form state
    setEditDate(new Date(item.date).toISOString().split('T')[0]);
    setEditMode(true);
  };
  const handleSaveEdit = async (e) => {
    e.preventDefault();
    try {
      const updatedData = {};

      if (editDescription !== editableItem.description) {
        updatedData.description = editDescription;
      }

      if (editAmount !== editableItem.amount) {
        updatedData.amount = editAmount;
      }

      const originalDate = new Date(editableItem.date).toISOString().split('T')[0];
      if (editDate !== originalDate) {
        updatedData.date = new Date(editDate).toISOString();
      }

      if (Object.keys(updatedData).length > 0) {
        const updatePromises = Object.entries(updatedData).map(
          ([field, value]) =>
            axios.post(
              "https://www.nikhilmotors.com/api/editMiscellaneous",
              {
                tablename: "investment",
                fieldToEdit: field,
                newValue: value,
                whereField: "serial_number",
                whereValue: editableItem.serial_number,
              },
              {
                headers: {
                  Authorization: `Bearer ${localStorage.getItem("authToken")}`,
                },
              }
            )
        );

        await Promise.all(updatePromises);
        fetchCosts();
        toast.success("Investment updated successfully");
        setEditMode(false);
        setEditableItem(null);
        setEditDescription("");
        setEditAmount("");
        setEditDate("");
      }
    } catch (error) {
      console.error("Error editing cost:", error);
      toast.error("Failed to edit investment");
    }
  };

  const handleCancelEdit = () => {
    setEditMode(false);
    setEditableItem(null);
    setEditDescription("");
    setEditAmount("");
    setEditDate("");
  };

  const handleAddInvestment = async (e) => {
    e.preventDefault();
    setLoading(true); // Show loading while adding amount
    try {
      const response = await axios.post(
        "https://www.nikhilmotors.com/api/accountDetails/addInvestment",
        {
          description,
          amount,
          date: new Date().toISOString(),
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("authToken")}`,
          },
        }
      );
      setDescription("");
      setCost("");
      fetchCosts(); // Refresh the list after adding
      toast.success("Investment added successfully"); // Show success toast
    } catch (error) {
      console.error("Error adding amount:", error);
      toast.error("Failed to add amount"); // Show error toast
    } finally {
      setLoading(false); // End loading
    }
  };

  useEffect(() => {
    fetchCosts();
  }, [filterMonth, filterYear]);

  return (
    <div className="min-h-[89vh] flex flex-col lg:flex-row bg-gray-100 p-5">
      <div className="w-full lg:w-1/2 p-5 bg-white shadow-lg rounded-lg mb-5 lg:mb-0 lg:mr-5">
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">
          Add Investment Amount
        </h2>
        <hr className="border-t-2 border-gray-300 my-4" />
        <form onSubmit={handleAddInvestment} className="mb-5 space-y-4">
          <input
            type="number"
            placeholder="Amount"
            value={amount}
            onChange={(e) => setCost(e.target.value)}
            className="border p-2 rounded-md w-full"
            required
          />
          <input
            type="text"
            placeholder="Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="border p-2 rounded-md w-full"
            required
          />
          <button
            type="submit"
            className={`bg-blue-500 text-white px-6 py-2 rounded-md w-full ${loading ? "opacity-50 cursor-not-allowed" : ""
              }`}
            disabled={loading}
          >
            {loading ? "Adding..." : "Add Investment"}
          </button>
        </form>
        <table className="min-w-full table-auto border-collapse">
          <thead>
            <tr className="bg-gray-200">
              <th className="py-2 px-4 text-left">Description</th>
              <th className="py-2 px-4 text-right">Amount (₹)</th>
            </tr>
          </thead>
          <tbody>
            <tr className="border-b">
              <td className="py-2 px-4">Total Investment Amount</td>
              <td className="py-2 px-4 text-right">
                {accountDetails?.totalInvestment}
              </td>
            </tr>
            <tr className="border-b">
              <td className="py-2 px-4">Total Vehicle Buying Amount</td>
              <td className="py-2 px-4 text-right">
                {accountDetails?.totalBuy}
              </td>
            </tr>
            <tr className="border-b">
              <td className="py-2 px-4">Total Vehicle Maintenance Amount</td>
              <td className="py-2 px-4 text-right">
                {accountDetails?.totalMaintainance}
              </td>
            </tr>
            <tr className="border-b">
              <td className="py-2 px-4">Total Miscellaneous Spends</td>
              <td className="py-2 px-4 text-right">
                {accountDetails?.totalMiscellaneous}
              </td>
            </tr>
            <tr className="border-b">
              <td className="py-2 px-4">Total DownPayment Received</td>
              <td className="py-2 px-4 text-right">
                {accountDetails?.totalDownPayments}
              </td>
            </tr>
            <tr className="border-b">
              <td className="py-2 px-4">Total Commission</td>
              <td className="py-2 px-4 text-right">
                {accountDetails?.totalCommision}
              </td>
            </tr>
            <tr className="border-b">
              <td className="py-2 px-4 font-bold">Total Remaining Balance</td>
              <td className="py-2 px-4 text-right font-bold">
                {accountDetails?.Remaining_Balance}
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <div className="w-full lg:w-[70%] p-5 bg-white shadow-lg rounded-lg h-[608px] overflow-y-auto flex flex-col">
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">
          Account Details
        </h2>
        <hr className="border-t-2 border-gray-300 mb-2" />

        <p>Filters:</p>
        <div className="mb-4 flex space-x-4">
          <select
            value={filterMonth}
            onChange={(e) => setFilterMonth(Number(e.target.value))}
            className="border p-2 rounded-md w-full"
          >
            {Array.from({ length: 12 }, (_, i) => (
              <option key={i} value={i}>
                {new Date(0, i).toLocaleString("en", { month: "long" })}
              </option>
            ))}
          </select>
          <select
            value={filterYear}
            onChange={(e) => setFilterYear(Number(e.target.value))}
            className="border p-2 rounded-md w-full"
          >
            {Array.from({ length: 10 }, (_, i) => {
              const year = new Date().getFullYear() - i;
              return (
                <option key={year} value={year}>
                  {year}
                </option>
              );
            })}
          </select>
        </div>

        <div className="overflow-x-auto flex-1">
          <table className="min-w-full table-auto border-collapse text-gray-700">
            <thead>
              <tr>
                <th className="border p-3 text-left">Description</th>
                <th className="border p-3 text-left">Amount</th>
                <th className="border p-3 text-left">Date</th>
                {isAdmin && <th className="border p-3 text-left">Actions</th>}
              </tr>
            </thead>
            <tbody>
              {isFetching ? (
                <tr>
                  <td colSpan="4" className="border p-3 text-center">
                    Loading...
                  </td>
                </tr>
              ) : costs.length > 0 ? (
                costs?.map((costItem, index) => (
                  <tr key={index} className="border-t">
                    <td className="border p-3">
                      {editMode &&
                        editableItem?.serial_number === costItem.serial_number ? (
                        <input
                          type="text"
                          value={editDescription}
                          onChange={(e) => setEditDescription(e.target.value)}
                          className="border p-2 rounded-md w-full"
                        />
                      ) : (
                        costItem.description
                      )}
                    </td>
                    <td className="border p-3">
                      {editMode &&
                        editableItem?.serial_number === costItem.serial_number ? (
                        <input
                          type="number"
                          value={editAmount}
                          onChange={(e) => setEditAmount(e.target.value)}
                          className="border p-2 rounded-md w-full"
                        />
                      ) : (
                        costItem.amount
                      )}
                    </td>
                    <td className="border p-3">
                      {editMode &&
                        editableItem?.serial_number === costItem.serial_number ? (
                        <input
                          type="date"
                          value={editDate}
                          onChange={(e) => setEditDate(e.target.value)}
                          className="border p-2 rounded-md w-full"
                        />
                      ) : (
                        new Date(costItem.date).toLocaleDateString()
                      )}
                    </td>
                    {isAdmin && <td className="border p-3">
                      {editMode &&
                        editableItem?.serial_number === costItem.serial_number ? (
                        <>
                          <button
                            onClick={handleSaveEdit}
                            className="bg-green-500 text-white py-1 px-3 rounded"
                          >
                            Save
                          </button>
                          <button
                            onClick={handleCancelEdit}
                            className="bg-red-500 text-white py-1 px-3 rounded ml-2"
                          >
                            Cancel
                          </button>
                        </>
                      ) : (
                        <button
                          onClick={() => handleEdit(costItem)}
                          className="text-blue-500"
                        >
                          Edit
                        </button>
                      )}
                    </td>}
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="4" className="border p-3 text-center">
                    No data available
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        <div className="mt-4 font-semibold text-gray-800">
          Total Investment Amount: ₹{totalCost}
        </div>
      </div>
      <ToastContainer />
    </div>
  );
};

export default AccountDetails;
