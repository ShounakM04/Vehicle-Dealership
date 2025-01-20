import React, { useState, useEffect } from "react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import { jwtDecode } from "jwt-decode";
import "react-toastify/dist/ReactToastify.css";

const MiscellaneousCosts = () => {
  const [costs, setCosts] = useState([]);
  const [description, setDescription] = useState("");
  const [cost, setCost] = useState("");
  const [filterYear, setFilterYear] = useState(new Date().getFullYear());
  const [filterMonth, setFilterMonth] = useState(new Date().getMonth());
  const [totalCost, setTotalCost] = useState(0);
  const [loading, setLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [editedItem, setEditedItem] = useState(null);
  const [isAdmin, setIsAdmin] = useState();

  useEffect(() => {
    fetchCosts();
  }, [filterMonth, filterYear]);
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
  // Function to format date for display (DD/MM/YYYY)
  const formatDisplayDate = (dateString) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-GB', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
      });
    } catch (error) {
      console.error("Error formatting display date:", error);
      return dateString;
    }
  };

  // Function to format date for input field (YYYY-MM-DD)
  const formatDateForInput = (dateString) => {
    try {
      // Create a date object and adjust for timezone
      const date = new Date(dateString);
      // Get year, month, and day components
      const year = date.getFullYear();
      // Month needs to be padded as it's 0-based
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const day = String(date.getDate()).padStart(2, '0');
      // Combine in YYYY-MM-DD format
      return `${year}-${month}-${day}`;
    } catch (error) {
      console.error("Error formatting date for input:", error);
      return dateString;
    }
  };

  const fetchCosts = async () => {
    setIsFetching(true);
    try {
      const response = await axios.get(
        "https://www.nikhilmotors.com/api/miscellaneous-costs/filter",
        {
          params: {
            month: filterMonth + 1,
            year: filterYear,
          },
          headers: {
            Authorization: `Bearer ${localStorage.getItem("authToken")}`,
          },
        }
      );
      setCosts(response.data.costs || []);
      setTotalCost(response.data.totalCost || 0);
    } catch (error) {
      console.error("Error fetching costs:", error);
      toast.error("Failed to fetch costs");
      setCosts([]);
      setTotalCost(0);
    } finally {
      setIsFetching(false);
    }
  };

  const handleAddCost = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await axios.post(
        "https://www.nikhilmotors.com/api/miscellaneous-costs/add",
        {
          description,
          cost,
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
      fetchCosts();
      toast.success("Cost added successfully");
    } catch (error) {
      console.error("Error adding cost:", error);
      toast.error("Failed to add cost");
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (item) => {
    setEditingId(item.id);
    setEditedItem({
      ...item,
      date: formatDateForInput(item.date)
    });
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setEditedItem(null);
  };

  const handleSaveEdit = async () => {
    try {
      const updates = [];
      const fields = ["description", "cost", "date"];
      const originalItem = costs.find(c => c.id === editingId);

      fields.forEach(field => {
        let comparison = field === 'date'
          ? formatDateForInput(originalItem[field])
          : originalItem[field];

        if (editedItem[field] !== comparison) {
          updates.push(
            axios.post(
              "https://www.nikhilmotors.com/api/editMiscellaneous",
              {
                tablename: "miscellaneous_costs",
                fieldToEdit: field,
                newValue: editedItem[field],
                whereField: "id",
                whereValue: editingId,
              },
              {
                headers: {
                  Authorization: `Bearer ${localStorage.getItem("authToken")}`,
                },
              }
            )
          );
        }
      });

      await Promise.all(updates);
      fetchCosts();
      toast.success("Changes saved successfully");
      setEditingId(null);
      setEditedItem(null);
    } catch (error) {
      console.error("Error saving changes:", error);
      toast.error("Failed to save changes");
    }
  };

  const handleEditInputChange = (field, value) => {
    setEditedItem(prev => ({
      ...prev,
      [field]: value
    }));
  };

  return (
    <div className="min-h-[89vh] flex flex-col lg:flex-row bg-gray-100 p-5">
      <div className="w-full lg:w-1/2 p-5 bg-white shadow-lg rounded-lg mb-5 lg:mb-0 lg:mr-5">
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">
          Add Miscellaneous Cost
        </h2>
        <hr className="border-t-2 border-gray-300 my-4" />
        <form onSubmit={handleAddCost} className="mb-5 space-y-4">
          <input
            type="text"
            placeholder="Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="border p-2 rounded-md w-full"
            required
          />
          <input
            type="number"
            placeholder="Cost"
            value={cost}
            onChange={(e) => setCost(e.target.value)}
            className="border p-2 rounded-md w-full"
            required
          />
          <button
            type="submit"
            className={`bg-blue-500 text-white px-6 py-2 rounded-md w-full ${loading ? "opacity-50 cursor-not-allowed" : ""
              }`}
            disabled={loading}
          >
            {loading ? "Adding..." : "Add Cost"}
          </button>
        </form>
      </div>

      <div className="w-full lg:w-[70%] p-5 bg-white shadow-lg rounded-lg h-[608px] overflow-y-auto flex flex-col">
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">
          Miscellaneous Costs
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
        <h3 className="font-semibold text-gray-700 mb-2">
          Costs for{" "}
          {new Date(filterYear, filterMonth).toLocaleString("en", {
            month: "long",
            year: "numeric",
          })}
        </h3>
        <div className="overflow-x-auto flex-1">
          <table className="min-w-full table-auto border-collapse text-gray-700">
            <thead>
              <tr>
                <th className="border p-3 text-left">Description</th>
                <th className="border p-3 text-left">Cost</th>
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
                costs.map((costItem) => (
                  <tr key={costItem.id} className="border-t">
                    <td className="border p-3">
                      {editingId === costItem.id ? (
                        <input
                          type="text"
                          value={editedItem.description}
                          onChange={(e) => handleEditInputChange("description", e.target.value)}
                          className="border p-2 w-full"
                        />
                      ) : (
                        costItem.description
                      )}
                    </td>
                    <td className="border p-3">
                      {editingId === costItem.id ? (
                        <input
                          type="number"
                          value={editedItem.cost}
                          onChange={(e) => handleEditInputChange("cost", e.target.value)}
                          className="border p-2 w-full"
                        />
                      ) : (
                        costItem.cost
                      )}
                    </td>
                    <td className="border p-3">
                      {editingId === costItem.id ? (
                        <input
                          type="date"
                          value={editedItem.date}
                          onChange={(e) => handleEditInputChange("date", e.target.value)}
                          className="border p-2 w-full"
                        />
                      ) : (
                        formatDisplayDate(costItem.date)
                      )}
                    </td>
                    {isAdmin && <td className="border p-3">
                      {editingId === costItem.id ? (
                        <div className="space-x-2">
                          <button
                            onClick={handleSaveEdit}
                            className="bg-green-500 text-white py-1 px-3 rounded"
                          >
                            Save
                          </button>
                          <button
                            onClick={handleCancelEdit}
                            className="bg-red-500 text-white py-1 px-3 rounded"
                          >
                            Cancel
                          </button>
                        </div>
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
          Total Cost: ₹{totalCost}
        </div>
      </div>
      <ToastContainer />
    </div>
  );
};

export default MiscellaneousCosts;