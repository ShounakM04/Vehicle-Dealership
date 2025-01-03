import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import '@fortawesome/fontawesome-free/css/all.min.css';
import axios from "axios";
import EditVehicleImages from "./EditVehicleImages";

const EditVehicleDetailsForm = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [wait, setWait] = useState(false);
    const [vehicleData, setVehicleData] = useState({
        vehicleDetails: {
            carname: "",
            carcompany: "",
            registernumber: "",
            carmake: "",
            carcolor: "",
            fuel: "",
            vehiclebuyprice: "",
            vehiclesellprice: "",
            insurancecompany: "",
            insurancenumber: "",
            insurancestartdate: "",
            insuranceenddate: "",
            insurancetenure: "",
            ownername: "",
            ownerphone: "",
            owneremail: "",
            owneraddress: ""
        },
    });

    const [editableFields, setEditableFields] = useState({
        carname: false,
        carcompany: false,
        registernumber: false,
        carmake: false,
        carcolor: false,
        fuel: false,
        vehiclebuyprice: false,
        vehiclesellprice: false,
        insurancecompany: false,
        insurancenumber: false,
        insurancestartdate: false,
        insuranceenddate: false,
        insurancetenure: false,
        ownername: false,
        ownerphone: false,
        owneremail: false,
        owneraddress: false
    });

    const [inputValue, setInputValue] = useState("");

    useEffect(() => {
        const fetchCarDetails = async () => {
            try {
                const response = await axios.get(`http://localhost:8000/car/${id}`,
                    {
                        headers: {
                            Authorization: `Bearer ${localStorage.getItem('authToken')}`
                        }
                    }
                );
                const { car, images, insurance, owner } = response.data;
                setVehicleData((prevData) => ({
                    ...prevData,
                    vehicleDetails: {
                        carname: car.carname,
                        carcompany: car.carcompany,
                        registernumber: car.registernumber,
                        carmake: car.carmake,
                        carcolor: car.carcolor,
                        fuel: car.fuel,
                        vehiclebuyprice: car.vehiclebuyprice,
                        vehiclesellprice: car.vehiclesellprice,

                        insurancecompany: insurance?.insurancecompany,
                        insurancenumber: insurance?.insurancenumber,
                        insurancestartdate: insurance?.insurancestartdate,
                        insuranceenddate: insurance?.insuranceenddate,
                        insurancetenure: insurance?.insurancetenure,

                        ownername: owner?.ownername,
                        ownerphone: owner?.ownerphone,
                        owneremail: owner?.owneremail,
                        owneraddress: owner?.owneraddress
                    },
                }));
            } catch (error) {
                console.error("Error fetching car details:", error);
            }
        };

        fetchCarDetails();
    }, [id]);

    const handleVehicleDetailsEdit = async (newValue, fieldToEdit) => {

        console.log(fieldToEdit);
        let tablename = "cardetails";

        if (fieldToEdit == "insurancecompany" || fieldToEdit == "insurancenumber" || fieldToEdit == "insurancestartdate" || fieldToEdit == "insuranceenddate" || fieldToEdit == "insurancetenure") {
            tablename = "carinsurance"
        }
        if (fieldToEdit == "ownername" || fieldToEdit == "ownerphone" || fieldToEdit == "owneremail" || fieldToEdit == "owneraddress") {
            tablename = "ownerdetails"
        }
        try {
            setWait(true);
            const response = await axios.post("http://localhost:8000/edit-fields", {
                tablename: tablename,
                fieldToEdit: fieldToEdit,
                newValue: newValue,
                registernumber: id
            }, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('authToken')}`
                }
            });

            // Update the field in vehicleData
            setVehicleData((prevData) => ({
                ...prevData,
                vehicleDetails: {
                    ...prevData.vehicleDetails,
                    [fieldToEdit]: newValue,
                },
            }));


            // After editing, set the field back to readOnly (not editable)
            setEditableFields((prev) => ({ ...prev, [fieldToEdit]: false }));

        } catch (error) {
            console.log(error);
        }
        setInputValue("");
        setWait(false);
    };

    const handleCancelEdit = (field) => {
        setEditableFields((prev) => ({ ...prev, [field]: false }));
        setInputValue("");  // Clear the input when canceled
    };

    const handleInputChange = (e) => {
        setInputValue(e.target.value);
    };

    const fuelOptions = ["petrol", "diesel", "cng"];
    const carMakeOptions = ["car", "bike", "tempo", "truck"];
    let field;

    return (
        <div className="container mx-auto pl-16 pr-16 pb-16 pt-8">
            <div className="mb-4">
                <button
                    onClick={() => navigate('/dashboard')}
                    className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:ring focus:ring-blue-300 transition"
                >
                    Back to Dashboard
                </button>
            </div>
            <div>
                <h1 className="text-xl font-bold mb-2 mt-6 ">Vehicle Details : Reg No : {id}</h1>
                <div className="flex flex-wrap gap-4">
                    <div className="w-full md:w-[49%]">

                        <label htmlFor="carname" className="block text-gray-700 text-sm font-bold mb-2">Vehicle Name</label>
                        <div className="relative w-full">
                            <input
                                type="text"
                                id={"carname"}
                                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                value={editableFields.carname ? inputValue : vehicleData.vehicleDetails.carname}
                                readOnly={!editableFields.carname}
                                onChange={handleInputChange}
                            />
                            <button className="absolute right-2 top-1/2 transform -translate-y-1/2" onClick={() => setEditableFields({ ...editableFields, carname: true })}>
                                <i className="fas fa-pencil-alt"></i>
                            </button>

                            {editableFields.carname && (
                                <div className="absolute right-2 top-1/2 transform -translate-y-1/2 flex space-x-2">
                                    <button onClick={() => handleVehicleDetailsEdit(inputValue, "carname")} className={`bg-green-500 text-white py-1 px-3 rounded ${wait ? 'opacity-50 cursor-not-allowed' : ''}`}>{wait ? "wait..." : "OK"}</button>
                                    <button onClick={() => handleCancelEdit("carname")} className={`bg-red-500 text-white py-1 px-3 rounded ${wait ? 'opacity-50 cursor-not-allowed' : ''}`}>CANCEL</button>
                                </div>
                            )}
                        </div>
                    </div>


                    <div className="w-full md:w-[49%]">

                        <label htmlFor="carcompany" className="block text-gray-700 text-sm font-bold mb-2">Vehicle Company Name</label>
                        <div className="relative w-full">
                            <input
                                type="text"
                                id={"carcompany"}
                                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                value={editableFields.carcompany ? inputValue : vehicleData.vehicleDetails.carcompany}
                                readOnly={!editableFields.carcompany}
                                onChange={handleInputChange}
                            />
                            <button className="absolute right-2 top-1/2 transform -translate-y-1/2" onClick={() => setEditableFields({ ...editableFields, carcompany: true })}>
                                <i className="fas fa-pencil-alt"></i>
                            </button>

                            {editableFields.carcompany && (
                                <div className="absolute right-2 top-1/2 transform -translate-y-1/2 flex space-x-2">
                                    <button onClick={() => handleVehicleDetailsEdit(inputValue, "carcompany")} className={`bg-green-500 text-white py-1 px-3 rounded ${wait ? 'opacity-50 cursor-not-allowed' : ''}`}>{wait ? "wait..." : "OK"}</button>
                                    <button onClick={() => handleCancelEdit("carcompany")} className={`bg-red-500 text-white py-1 px-3 rounded ${wait ? 'opacity-50 cursor-not-allowed' : ''}`}>CANCEL</button>
                                </div>
                            )}
                        </div>
                    </div>



                    <div className="w-full md:w-[49%]">
                        <label htmlFor="carmake" className="block text-gray-700 text-sm font-bold mb-2">Vehicle Type</label>
                        <div className="relative w-full">
                            {/* Dropdown for Vehicle Names */}
                            {editableFields.carmake ? (
                                <select
                                    id={"carmake"}
                                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                    value={inputValue}
                                    onChange={(e) => setInputValue(e.target.value)}
                                >
                                    <option value="" disabled>Select Vehicle</option>
                                    {carMakeOptions.map((option, index) => (
                                        <option key={index} value={option}>{option}</option>
                                    ))}
                                </select>
                            ) : (
                                <input
                                    type="text"
                                    id={"carmake"}
                                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                    value={vehicleData.vehicleDetails.carmake}
                                    readOnly
                                />
                            )}

                            {/* Edit Button */}
                            <button
                                className="absolute right-2 top-1/2 transform -translate-y-1/2"
                                onClick={() => setEditableFields({ ...editableFields, carmake: true })}
                            >
                                <i className="fas fa-pencil-alt"></i>
                            </button>

                            {/* {wait ? "wait..." : "OK"} and Cancel Buttons */}
                            {editableFields.carmake && (
                                <div className="absolute right-2 top-1/2 transform -translate-y-1/2 flex space-x-2">
                                    <button onClick={() => handleVehicleDetailsEdit(inputValue, "carmake")} className={`bg-green-500 text-white py-1 px-3 rounded ${wait ? 'opacity-50 cursor-not-allowed' : ''}`}>{wait ? "wait..." : "OK"}</button>
                                    <button onClick={() => handleCancelEdit("carmake")} className={`bg-red-500 text-white py-1 px-3 rounded ${wait ? 'opacity-50 cursor-not-allowed' : ''}`}>CANCEL</button>
                                </div>
                            )}
                        </div>
                    </div>


                    <div className="w-full md:w-[49%]">

                        <label htmlFor="carcolor" className="block text-gray-700 text-sm font-bold mb-2">Vehicle Color</label>
                        <div className="relative w-full">
                            <input
                                type="text"
                                id={"carcolor"}
                                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                value={editableFields.carcolor ? inputValue : vehicleData.vehicleDetails.carcolor}
                                readOnly={!editableFields.carcolor}
                                onChange={handleInputChange}
                            />
                            <button className="absolute right-2 top-1/2 transform -translate-y-1/2" onClick={() => setEditableFields({ ...editableFields, carcolor: true })}>
                                <i className="fas fa-pencil-alt"></i>
                            </button>

                            {editableFields.carcolor && (
                                <div className="absolute right-2 top-1/2 transform -translate-y-1/2 flex space-x-2">
                                    <button onClick={() => handleVehicleDetailsEdit(inputValue, "carcolor")} className={`bg-green-500 text-white py-1 px-3 rounded ${wait ? 'opacity-50 cursor-not-allowed' : ''}`}>{wait ? "wait..." : "OK"}</button>
                                    <button onClick={() => handleCancelEdit("carcolor")} className={`bg-red-500 text-white py-1 px-3 rounded ${wait ? 'opacity-50 cursor-not-allowed' : ''}`}>CANCEL</button>
                                </div>
                            )}
                        </div>
                    </div>


                    <div className="w-full md:w-[49%]">
                        <label htmlFor="fuel" className="block text-gray-700 text-sm font-bold mb-2">Fuel Type</label>
                        <div className="relative w-full">
                            {/* Dropdown for Vehicle Names */}
                            {editableFields.fuel ? (
                                <select
                                    id={"fuel"}
                                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                    value={inputValue}
                                    onChange={(e) => setInputValue(e.target.value)}
                                >
                                    <option value="" disabled>Select Vehicle</option>
                                    {fuelOptions.map((option, index) => (
                                        <option key={index} value={option}>{option}</option>
                                    ))}
                                </select>
                            ) : (
                                <input
                                    type="text"
                                    id={"fuel"}
                                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                    value={vehicleData.vehicleDetails.fuel}
                                    readOnly
                                />
                            )}

                            {/* Edit Button */}
                            <button
                                className="absolute right-2 top-1/2 transform -translate-y-1/2"
                                onClick={() => setEditableFields({ ...editableFields, fuel: true })}
                            >
                                <i className="fas fa-pencil-alt"></i>
                            </button>

                            {/* {wait ? "wait..." : "OK"} and Cancel Buttons */}
                            {editableFields.fuel && (
                                <div className="absolute right-2 top-1/2 transform -translate-y-1/2 flex space-x-2">
                                    <button onClick={() => handleVehicleDetailsEdit(inputValue, "fuel")} className={`bg-green-500 text-white py-1 px-3 rounded ${wait ? 'opacity-50 cursor-not-allowed' : ''}`}>{wait ? "wait..." : "OK"}</button>
                                    <button onClick={() => handleCancelEdit("fuel")} className={`bg-red-500 text-white py-1 px-3 rounded ${wait ? 'opacity-50 cursor-not-allowed' : ''}`}>CANCEL</button>
                                </div>
                            )}
                        </div>
                    </div>


                    <div className="w-full md:w-[49%]">

                        <label htmlFor="vehiclebuyprice" className="block text-gray-700 text-sm font-bold mb-2">Vehicle Buying Price</label>
                        <div className="relative w-full">
                            <input
                                type="text"
                                id={"vehiclebuyprice"}
                                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                value={editableFields.vehiclebuyprice ? inputValue : vehicleData.vehicleDetails.vehiclebuyprice}
                                readOnly={!editableFields.vehiclebuyprice}
                                onChange={handleInputChange}
                            />
                            <button className="absolute right-2 top-1/2 transform -translate-y-1/2" onClick={() => setEditableFields({ ...editableFields, vehiclebuyprice: true })}>
                                <i className="fas fa-pencil-alt"></i>
                            </button>

                            {editableFields.vehiclebuyprice && (
                                <div className="absolute right-2 top-1/2 transform -translate-y-1/2 flex space-x-2">
                                    <button onClick={() => handleVehicleDetailsEdit(inputValue, "vehiclebuyprice")} className={`bg-green-500 text-white py-1 px-3 rounded ${wait ? 'opacity-50 cursor-not-allowed' : ''}`}>{wait ? "wait..." : "OK"}</button>
                                    <button onClick={() => handleCancelEdit("vehiclebuyprice")} className={`bg-red-500 text-white py-1 px-3 rounded ${wait ? 'opacity-50 cursor-not-allowed' : ''}`}>CANCEL</button>
                                </div>
                            )}
                        </div>
                    </div>


                    <div className="w-full md:w-[50%]">

                        <label htmlFor="vehiclesellprice" className="block text-gray-700 text-sm font-bold mb-2">Vehicle Selling Price (Display Price)</label>
                        <div className="relative w-full">
                            <input
                                type="text"
                                id={"vehiclesellprice"}
                                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                value={editableFields.vehiclesellprice ? inputValue : vehicleData.vehicleDetails.vehiclesellprice}
                                readOnly={!editableFields.vehiclesellprice}
                                onChange={handleInputChange}
                            />
                            <button className="absolute right-2 top-1/2 transform -translate-y-1/2" onClick={() => setEditableFields({ ...editableFields, vehiclesellprice: true })}>
                                <i className="fas fa-pencil-alt"></i>
                            </button>

                            {editableFields.vehiclesellprice && (
                                <div className="absolute right-2 top-1/2 transform -translate-y-1/2 flex space-x-2">
                                    <button onClick={() => handleVehicleDetailsEdit(inputValue, "vehiclesellprice")} className={`bg-green-500 text-white py-1 px-3 rounded ${wait ? 'opacity-50 cursor-not-allowed' : ''}`}>{wait ? "wait..." : "OK"}</button>
                                    <button onClick={() => handleCancelEdit("vehiclesellprice")} className={`bg-red-500 text-white py-1 px-3 rounded ${wait ? 'opacity-50 cursor-not-allowed' : ''}`}>CANCEL</button>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>


            {/* Insurance */}
            <div>
                <h1 className="text-xl font-bold mb-2 mt-6 ">Insurance Details</h1>
                <div className="flex flex-wrap gap-4">

                    <div className="w-full md:w-[49%]">

                        <label htmlFor="insurancecompany" className="block text-gray-700 text-sm font-bold mb-2">Insurance Company Name</label>
                        <div className="relative w-full">
                            <input
                                type="text"
                                id={"insurancecompany"}
                                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                value={editableFields.insurancecompany ? inputValue : vehicleData.vehicleDetails.insurancecompany}
                                readOnly={!editableFields.insurancecompany}
                                onChange={handleInputChange}
                            />
                            <button className="absolute right-2 top-1/2 transform -translate-y-1/2" onClick={() => setEditableFields({ ...editableFields, insurancecompany: true })}>
                                <i className="fas fa-pencil-alt"></i>
                            </button>

                            {editableFields.insurancecompany && (
                                <div className="absolute right-2 top-1/2 transform -translate-y-1/2 flex space-x-2">
                                    <button onClick={() => handleVehicleDetailsEdit(inputValue, "insurancecompany")} className={`bg-green-500 text-white py-1 px-3 rounded ${wait ? 'opacity-50 cursor-not-allowed' : ''}`}>{wait ? "wait..." : "OK"}</button>
                                    <button onClick={() => handleCancelEdit("insurancecompany")} className={`bg-red-500 text-white py-1 px-3 rounded ${wait ? 'opacity-50 cursor-not-allowed' : ''}`}>CANCEL</button>
                                </div>
                            )}
                        </div>
                    </div>


                    <div className="w-full md:w-[49%]">

                        <label htmlFor="insurancenumber" className="block text-gray-700 text-sm font-bold mb-2">Insurance Number</label>
                        <div className="relative w-full">
                            <input
                                type="text"
                                id={"insurancenumber"}
                                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                value={editableFields.insurancenumber ? inputValue : vehicleData.vehicleDetails.insurancenumber}
                                readOnly={!editableFields.insurancenumber}
                                onChange={handleInputChange}
                            />
                            <button className="absolute right-2 top-1/2 transform -translate-y-1/2" onClick={() => setEditableFields({ ...editableFields, insurancenumber: true })}>
                                <i className="fas fa-pencil-alt"></i>
                            </button>

                            {editableFields.insurancenumber && (
                                <div className="absolute right-2 top-1/2 transform -translate-y-1/2 flex space-x-2">
                                    <button onClick={() => handleVehicleDetailsEdit(inputValue, "insurancenumber")} className={`bg-green-500 text-white py-1 px-3 rounded ${wait ? 'opacity-50 cursor-not-allowed' : ''}`}>{wait ? "wait..." : "OK"}</button>
                                    <button onClick={() => handleCancelEdit("insurancenumber")} className={`bg-red-500 text-white py-1 px-3 rounded ${wait ? 'opacity-50 cursor-not-allowed' : ''}`}>CANCEL</button>
                                </div>
                            )}
                        </div>
                    </div>


                    <div className="w-full md:w-[50%]">

                        <label htmlFor="insurancestartdate" className="block text-gray-700 text-sm font-bold mb-2">Insurance Start Date</label>
                        <div className="relative w-full">
                            <input
                                type="date"
                                id="insurancestartdate"
                                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                value={editableFields.insurancestartdate ? inputValue : vehicleData.vehicleDetails.insurancestartdate?.slice(0, 10)}
                                readOnly={!editableFields.insurancestartdate}
                                onChange={handleInputChange}
                            />
                            <button className="absolute right-8 top-1/2 transform -translate-y-1/2" onClick={() => setEditableFields({ ...editableFields, insurancestartdate: true })}>
                                <i className="fas fa-pencil-alt"></i>
                            </button>

                            {editableFields.insurancestartdate && (
                                <div className="absolute right-8 top-1/2 transform -translate-y-1/2 flex space-x-2">
                                    <button onClick={() => handleVehicleDetailsEdit(inputValue, "insurancestartdate")} className={`bg-green-500 text-white py-1 px-3 rounded ${wait ? 'opacity-50 cursor-not-allowed' : ''}`}>{wait ? "wait..." : "OK"}</button>
                                    <button onClick={() => handleCancelEdit("insurancestartdate")} className={`bg-red-500 text-white py-1 px-3 rounded ${wait ? 'opacity-50 cursor-not-allowed' : ''}`}>CANCEL</button>
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="w-full md:w-[48%]">

                        <label htmlFor="insuranceenddate" className="block text-gray-700 text-sm font-bold mb-2">Insurance End Date</label>
                        <div className="relative w-full">
                            <input
                                type="date"
                                id={"insuranceenddate"}
                                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                value={editableFields.insuranceenddate ? inputValue : vehicleData.vehicleDetails.insuranceenddate?.slice(0, 10)}
                                readOnly={!editableFields.insuranceenddate}
                                onChange={handleInputChange}
                            />
                            <button className="absolute right-8 top-1/2 transform -translate-y-1/2" onClick={() => setEditableFields({ ...editableFields, insuranceenddate: true })}>
                                <i className="fas fa-pencil-alt"></i>
                            </button>

                            {editableFields.insuranceenddate && (
                                <div className="absolute right-8 top-1/2 transform -translate-y-1/2 flex space-x-2">
                                    <button onClick={() => handleVehicleDetailsEdit(inputValue, "insuranceenddate")} className={`bg-green-500 text-white py-1 px-3 rounded ${wait ? 'opacity-50 cursor-not-allowed' : ''}`}>{wait ? "wait..." : "OK"}</button>
                                    <button onClick={() => handleCancelEdit("insuranceenddate")} className={`bg-red-500 text-white py-1 px-3 rounded ${wait ? 'opacity-50 cursor-not-allowed' : ''}`}>CANCEL</button>
                                </div>
                            )}
                        </div>
                    </div>


                    <div className="w-full md:w-[50%]">

                        <label htmlFor="insurancetenure" className="block text-gray-700 text-sm font-bold mb-2">Insurance Policy Tenure</label>
                        <div className="relative w-full">
                            <input
                                type="text"
                                id={"insurancetenure"}
                                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                value={editableFields.insurancetenure ? inputValue : vehicleData.vehicleDetails.insurancetenure}
                                readOnly={!editableFields.insurancetenure}
                                onChange={handleInputChange}
                            />
                            <button className="absolute right-2 top-1/2 transform -translate-y-1/2" onClick={() => setEditableFields({ ...editableFields, insurancetenure: true })}>
                                <i className="fas fa-pencil-alt"></i>
                            </button>

                            {editableFields.insurancetenure && (
                                <div className="absolute right-2 top-1/2 transform -translate-y-1/2 flex space-x-2">
                                    <button onClick={() => handleVehicleDetailsEdit(inputValue, "insurancetenure")} className={`bg-green-500 text-white py-1 px-3 rounded ${wait ? 'opacity-50 cursor-not-allowed' : ''}`}>{wait ? "wait..." : "OK"}</button>
                                    <button onClick={() => handleCancelEdit("insurancetenure")} className={`bg-red-500 text-white py-1 px-3 rounded ${wait ? 'opacity-50 cursor-not-allowed' : ''}`}>CANCEL</button>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Owner */}
                <div>
                    <h1 className="text-xl font-bold mb-2 mt-6 ">Owner Details</h1>
                    <div className="flex flex-wrap gap-4">

                        <div className="w-full md:w-[49%]">

                            <label htmlFor="ownername" className="block text-gray-700 text-sm font-bold mb-2">Owner Name</label>
                            <div className="relative w-full">
                                <input
                                    type="text"
                                    id={"ownername"}
                                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                    value={editableFields.ownername ? inputValue : vehicleData.vehicleDetails.ownername}
                                    readOnly={!editableFields.ownername}
                                    onChange={handleInputChange}
                                />
                                <button className="absolute right-2 top-1/2 transform -translate-y-1/2" onClick={() => setEditableFields({ ...editableFields, ownername: true })}>
                                    <i className="fas fa-pencil-alt"></i>
                                </button>

                                {editableFields.ownername && (
                                    <div className="absolute right-2 top-1/2 transform -translate-y-1/2 flex space-x-2">
                                        <button onClick={() => handleVehicleDetailsEdit(inputValue, "ownername")} className={`bg-green-500 text-white py-1 px-3 rounded ${wait ? 'opacity-50 cursor-not-allowed' : ''}`}>{wait ? "wait..." : "OK"}</button>
                                        <button onClick={() => handleCancelEdit("ownername")} className={`bg-red-500 text-white py-1 px-3 rounded ${wait ? 'opacity-50 cursor-not-allowed' : ''}`}>CANCEL</button>
                                    </div>
                                )}
                            </div>
                        </div>


                        <div className="w-full md:w-[49%]">

                            <label htmlFor="ownerphone" className="block text-gray-700 text-sm font-bold mb-2">Owner Phone</label>
                            <div className="relative w-full">
                                <input
                                    type="text"
                                    id={"ownerphone"}
                                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                    value={editableFields.ownerphone ? inputValue : vehicleData.vehicleDetails.ownerphone}
                                    readOnly={!editableFields.ownerphone}
                                    onChange={handleInputChange}
                                />
                                <button className="absolute right-2 top-1/2 transform -translate-y-1/2" onClick={() => setEditableFields({ ...editableFields, ownerphone: true })}>
                                    <i className="fas fa-pencil-alt"></i>
                                </button>

                                {editableFields.ownerphone && (
                                    <div className="absolute right-2 top-1/2 transform -translate-y-1/2 flex space-x-2">
                                        <button onClick={() => handleVehicleDetailsEdit(inputValue, "ownerphone")} className={`bg-green-500 text-white py-1 px-3 rounded ${wait ? 'opacity-50 cursor-not-allowed' : ''}`}>{wait ? "wait..." : "OK"}</button>
                                        <button onClick={() => handleCancelEdit("ownerphone")} className={`bg-red-500 text-white py-1 px-3 rounded ${wait ? 'opacity-50 cursor-not-allowed' : ''}`}>CANCEL</button>
                                    </div>
                                )}
                            </div>
                        </div>


                        <div className="w-full md:w-[49%]">

                            <label htmlFor="owneremail" className="block text-gray-700 text-sm font-bold mb-2">Owner Email</label>
                            <div className="relative w-full">
                                <input
                                    type="text"
                                    id={"owneremail"}
                                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                    value={editableFields.owneremail ? inputValue : vehicleData.vehicleDetails.owneremail}
                                    readOnly={!editableFields.owneremail}
                                    onChange={handleInputChange}
                                />
                                <button className="absolute right-2 top-1/2 transform -translate-y-1/2" onClick={() => setEditableFields({ ...editableFields, owneremail: true })}>
                                    <i className="fas fa-pencil-alt"></i>
                                </button>

                                {editableFields.owneremail && (
                                    <div className="absolute right-2 top-1/2 transform -translate-y-1/2 flex space-x-2">
                                        <button onClick={() => handleVehicleDetailsEdit(inputValue, "owneremail")} className={`bg-green-500 text-white py-1 px-3 rounded ${wait ? 'opacity-50 cursor-not-allowed' : ''}`}>{wait ? "wait..." : "OK"}</button>
                                        <button onClick={() => handleCancelEdit("owneremail")} className={`bg-red-500 text-white py-1 px-3 rounded ${wait ? 'opacity-50 cursor-not-allowed' : ''}`}>CANCEL</button>
                                    </div>
                                )}
                            </div>
                        </div>


                        <div className="w-full md:w-[49%]">

                            <label htmlFor="owneraddress" className="block text-gray-700 text-sm font-bold mb-2">Owner Address</label>
                            <div className="relative w-full">
                                <input
                                    type="text"
                                    id={"owneraddress"}
                                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                    value={editableFields.owneraddress ? inputValue : vehicleData.vehicleDetails.owneraddress}
                                    readOnly={!editableFields.owneraddress}
                                    onChange={handleInputChange}
                                />
                                <button className="absolute right-2 top-1/2 transform -translate-y-1/2" onClick={() => setEditableFields({ ...editableFields, owneraddress: true })}>
                                    <i className="fas fa-pencil-alt"></i>
                                </button>

                                {editableFields.owneraddress && (
                                    <div className="absolute right-2 top-1/2 transform -translate-y-1/2 flex space-x-2">
                                        <button onClick={() => handleVehicleDetailsEdit(inputValue, "owneraddress")} className={`bg-green-500 text-white py-1 px-3 rounded ${wait ? 'opacity-50 cursor-not-allowed' : ''}`}>{wait ? "wait..." : "OK"}</button>
                                        <button onClick={() => handleCancelEdit("owneraddress")} className={`bg-red-500 text-white py-1 px-3 rounded ${wait ? 'opacity-50 cursor-not-allowed' : ''}`}>CANCEL</button>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>


            <EditVehicleImages id={id} />
        </div >
    );
};

export default EditVehicleDetailsForm;
