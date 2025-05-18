import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import { getUploadURL, uploadToS3 } from '../../utils/s3UploadFunctions.jsx';
import { jwtDecode } from "jwt-decode";
import { Carousel } from "react-responsive-carousel";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import { ArrowLeft, Car, Upload, PenTool as Tool, Calendar, DollarSign, FileText, Copy, Info, Fuel, Building2, Palette, Gauge, ChevronRight, Shield, ShieldCheck } from 'lucide-react';

function DetailItem({ icon, label, value }) {
    return (
        <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
            <div className="text-blue-500 mt-1">{icon}</div>
            <div>
                <p className="text-sm text-gray-500">{label}</p>
                <p className="font-medium text-gray-900">{value || "Not provided"}</p>
            </div>
        </div>
    );
}

export function Maintainance({ registernumber, isDriver, isEmployee, isAdmin, vehicleData, onMaintenanceAdded }) {
    const [title, setTitle] = useState('');
    const [price, setPrice] = useState('');
    const [description, setDescription] = useState('');
    const [files, setFiles] = useState([]);
    const [maintainanceDate, setMaintainanceDate] = useState('');
    const [role, setRole] = useState("");
    const [adding, setAdding] = useState(false);
    const [inputValue, setInputValue] = useState("");
    const [globalRegisterNumber, setGlobalRegisterNumber] = useState(registernumber);



    const [driverSubittedId, setDriverSubittedId] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [carData, setCarData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [decodedToken, setDecodedToken] = useState(null);

    const [isCopied, setIsCopied] = useState(false);




    const navigate = useNavigate();
    const fileInputRef = useRef(null);


    const [maintainanceData, setMaintainanceData] = useState({
        maintenanceRecords: [],
        totalMaintenanceCost: 0,
    });

    if (isEmployee == true || isAdmin == true) {
        useEffect(() => {
            if (vehicleData) {
                setCarData(vehicleData);
            }
        })
    }

    const copyToClipboard = () => {

        navigator.clipboard.writeText(window.location.href);

        setIsCopied(true);
        setTimeout(() => {
            setIsCopied(false);
        }, 1000); // Revert back to copy icon after 2 seconds
    };


    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            setAdding(true);

            const token = localStorage.getItem("authToken");
            // console.log("++++++ " + token)
            let decodedToken;
            if (token) {
                try {
                    decodedToken = jwtDecode(token);
                    // console.log("temppppp " + decodedToken);
                } catch (error) {
                    console.error("Invalid token", error);
                }
            }


            let username = decodedToken.username ? decodedToken.username : "Unkown";

            let userdesignation = decodedToken.isAdmin ? "Admin" : decodedToken.isEmployee ? "Employee" : decodedToken.isDriver ? "Driver" : "Unknown";
            // console.log("username : " + username);
            // console.log(decodedToken);


            // console.log(globalRegisterNumber, description, price, username, userdesignation, maintainanceDate)
            const response = await axios.post('https://www.nikhilmotors.com/api/maintainance',
                { registernumber: globalRegisterNumber, description, price, username, maintainanceDate },
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('authToken')}`
                    }
                });

            if (files.length != 0) {
                const nextIndex = response.data.nextIndex;
                console.log("nextIndex : " + nextIndex);;
                // Handle other image uploads if necessary (similar to DisplayImage)

                const file = files[0];
                const maintainanceDocPath = `${globalRegisterNumber}/MaintenanceDoc/${nextIndex}`;
                const maintainanceDocUrl = await getUploadURL(file, maintainanceDocPath);
                console.log("Url : " + maintainanceDocUrl);

                await uploadToS3(maintainanceDocUrl, file);
            }
            // Call the parent callback to refresh maintenance records
            if (onMaintenanceAdded) { onMaintenanceAdded(); }

            // Clear form fields
            setTitle('');
            setPrice('');
            setDescription('');
            setFiles([]);
            setMaintainanceDate('');
            setRole('');

            // Clear the file input using ref
            if (fileInputRef.current) {
                fileInputRef.current.value = "";
            }

            toast.success('Maintenance record added successfully!');
            // console.log(response.data);
            setDriverSubittedId(false);

        } catch (error) {
            console.error('Error adding maintenance record:', error);
            toast.error('Failed to add maintenance record.');
        } finally {
            setAdding(false);
        }
    };

    // Fetch car details using the submitted ID
    const fetchCarDetails = async (currId) => {
        setUploading(true);
        setLoading(true); // Set loading to true before the fetch call
        setError(null); // Reset error before fetch
        try {
            const response = await axios.get(
                `https://www.nikhilmotors.com/api/car/${currId}`, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('authToken')}`
                }
            }
            );
            setCarData(response.data); // Store the fetched car data
            console.log(response.data); // Log the fetched car data
        } catch (err) {
            setCarData(null);
            console.error("Error fetching car details:", err);
            setError("Error fetching car details"); // Set error message if fetch fails
        } finally {
            setLoading(false); // Set loading to false after fetch completes
            setUploading(false);
        }
    };

    const handleGoBack = () => {
        navigate('/driverdashboard');
    };

    const handleDriverSubmitID = async (e) => {
        e.preventDefault();
        const currId = inputValue;

        setInputValue("");


        try {

            setDriverSubittedId(true);
            setGlobalRegisterNumber(currId);
            if (!vehicleData) {
                await fetchCarDetails(currId);
            }

        } catch (error) {

            // Display error message in toast
            console.log("Error in adding Vehicle Images. Please try again!")
            toast.error("Error in adding Vehicle Images. Please try again!");

        }

        // console.log(registernumber);
    }



    useEffect(() => {
        const fetchMaintenanceDetails = async () => {
            if (!driverSubittedId || !carData?.car?.registernumber) return;

            try {
                const response = await axios.get(
                    "https://www.nikhilmotors.com/api/maintainance",
                    {
                        params: { registernumber: carData.car.registernumber },
                        headers: {
                            Authorization: `Bearer ${localStorage.getItem("authToken")}`,
                        },
                    }
                );

                if (response.status === 201) {
                    setMaintainanceData({
                        maintenanceRecords: [],
                        totalMaintenanceCost: 0,
                    });
                    return;
                }

                const { maintenanceRecords, totalmaintainance } = response.data;
                console.log(response.data);

                if (Array.isArray(maintenanceRecords)) {
                    setMaintainanceData({
                        maintenanceRecords,
                        totalMaintenanceCost: Number(totalmaintainance),
                    });
                } else {
                    console.error("Invalid maintenance records format.");
                }
            } catch (error) {
                console.error("Error fetching maintenance details:", error);
            }
        };

        fetchMaintenanceDetails();
    }, [driverSubittedId, carData]);

    return (
        <>
            {isDriver == true && (<>
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
                    <form onSubmit={handleDriverSubmitID}>
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
                                value={inputValue}
                                onChange={(e) => setInputValue(e.target.value
                                    .replace(/^\s+/, "")
                                    .replace(/[a-z]/g, (char) => char.toUpperCase()))}
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
                </div>
            </>)}


            {/* Error Message */}
            {/* {error && !loading && (
                <div className="mt-4 p-4 bg-red-100 border border-red-500 rounded text-center text-red-700">
                    {error}
                </div>
            )} */}

            {/* No data found message */}
            {driverSubittedId == true && !carData && !loading && (
                <p className="text-center mt-4">No data found for this ID.</p>
            )}

            {driverSubittedId == true && carData && carData.car && carData.car.status === true && (
                <div className="mt-4 w-[80%] mx-auto p-4 bg-green-100 border border-green-500 rounded text-center text-green-700">
                    Already Sold
                </div>
            )}

            {/* Display confirmation section only after form is submitted */}
            {driverSubittedId == true && carData && carData.car && carData.car.status === false && (
                <div className="max-w-7xl mx-auto">
                    <div className="mb-8">
                        <div className="mx-8">
                            <div className="flex items-center mb-4">
                                <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
                                    <Car className="w-8 h-8 text-blue-500" />
                                    {carData.car.carcompany} {carData.car.carname}
                                </h1>
                                <button
                                    onClick={copyToClipboard}
                                    className="flex items-center gap-2 px-3 py-2 ml-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition"
                                >
                                    {isCopied ? <CheckCheck /> : <Copy />}
                                </button>
                            </div>
                            <p className="text-gray-500 mt-2 font-medium text-xl">
                                Registration number: {carData.car.registernumber}
                            </p>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        {/* Image Gallery Section */}
                        <div className="bg-[#FFFFFF] rounded-xl shadow-md overflow-hidden p-2 sm:p-4 border">
                            <Carousel
                                showArrows={true}
                                autoPlay={true}
                                infiniteLoop={true}
                                showThumbs={false}
                                showStatus={false}
                                className="custom-carousel mx-2 sm:mx-4 md:mx-8 border border-gray-600 rounded-lg bg-[#FFFAF0]"
                                renderArrowPrev={(clickHandler, hasPrev) =>
                                    hasPrev && (
                                        <button
                                            onClick={clickHandler}
                                            className="absolute left-4 z-10 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/80 rounded-full flex items-center justify-center hover:bg-white transition-colors"
                                        >
                                            <ChevronRight className="w-6 h-6 rotate-180 text-slate-700" />
                                        </button>
                                    )
                                }
                                renderArrowNext={(clickHandler, hasNext) =>
                                    hasNext && (
                                        <button
                                            onClick={clickHandler}
                                            className="absolute right-4 z-10 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/80 rounded-full flex items-center justify-center hover:bg-white transition-colors"
                                        >
                                            <ChevronRight className="w-6 h-6 text-slate-700" />
                                        </button>
                                    )
                                }
                            >
                                {carData.images?.map((image, index) => (
                                    <div
                                        key={index}
                                        className="relative flex justify-center items-center overflow-hidden"
                                    >
                                        <a
                                            href={image}
                                            download
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="block"
                                        >
                                            <img
                                                src={image}
                                                alt={`Car ${carData.car.carname}`}
                                                className="max-h-[20rem] rounded-t-lg object-contain"
                                            />
                                        </a>
                                    </div>
                                ))}
                            </Carousel>
                        </div>
                        {/* Details Section */}
                        <div className="space-y-6">
                            {/* Vehicle Information */}
                            <div className="bg-white rounded-xl shadow-md p-6">
                                <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
                                    <Info className="w-5 h-5 text-blue-500" />
                                    Vehicle Information
                                </h2>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {carData.car.carmake && carData.car.carmake !== "Not Provided" && (
                                        <DetailItem
                                            icon={<Car />}
                                            label="Vehicle Type"
                                            value={
                                                carData.car.carmake.charAt(0).toUpperCase() +
                                                carData.car.carmake.slice(1)
                                            }
                                        />
                                    )}
                                    {carData.car.fuel && carData.car.fuel !== "Not Provided" && (
                                        <DetailItem
                                            icon={<Fuel />}
                                            label="Fuel Type"
                                            value={
                                                carData.car.fuel.charAt(0).toUpperCase() +
                                                carData.car.fuel.slice(1)
                                            }
                                        />
                                    )}
                                    {carData.car.carcompany && (
                                        <DetailItem
                                            icon={<Building2 />}
                                            label="Company"
                                            value={
                                                carData.car.carcompany.charAt(0).toUpperCase() +
                                                carData.car.carcompany.slice(1)
                                            }
                                        />
                                    )}
                                    {carData.car.carcolor && carData.car.carcolor !== "Not Provided" && (
                                        <DetailItem
                                            icon={<Palette />}
                                            label="Color"
                                            value={
                                                carData.car.carcolor.charAt(0).toUpperCase() +
                                                carData.car.carcolor.slice(1)
                                            }
                                        />
                                    )}
                                    {carData.car.kilometers > 0 && (
                                        <DetailItem
                                            icon={<Gauge />}
                                            label="Kilometers"
                                            value={carData.car.kilometers}
                                        />
                                    )}
                                    {carData.car.registration_date &&
                                        new Date(carData.car.registration_date).getTime() !== 0 && (
                                            <DetailItem
                                                icon={<Calendar />}
                                                label="Registration Date"
                                                value={new Date(
                                                    carData.car.registration_date
                                                ).toLocaleDateString("en-GB")}
                                            />
                                        )}
                                    {carData.car.fitness_upto_date &&
                                        new Date(carData.car.fitness_upto_date).getTime() !== 0 && (
                                            <DetailItem
                                                icon={<Calendar />}
                                                label="Fitness Upto"
                                                value={new Date(
                                                    carData.car.fitness_upto_date
                                                ).toLocaleDateString("en-GB")}
                                            />
                                        )}
                                    {carData.insurance &&
                                        carData.insurance.insuranceenddate &&
                                        new Date(carData.insurance.insuranceenddate).getTime() !== 0 && (
                                            <DetailItem
                                                icon={<Calendar />}
                                                label="Insurance Upto"
                                                value={new Date(
                                                    carData.insurance.insuranceenddate
                                                ).toLocaleDateString("en-GB")}
                                            />
                                        )}
                                </div>
                                {/* Price Section */}
                                <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                                    <div className="flex justify-between items-center">
                                        <span className="text-lg font-semibold text-gray-900">Price</span>
                                        <span className="text-2xl font-bold text-blue-600">
                                            {carData.car.vehiclesellprice === 0
                                                ? "Not provided"
                                                : `₹${carData.car.vehiclesellprice.toLocaleString()}`}
                                        </span>
                                    </div>
                                </div>
                                {/* Description */}
                                {carData.car.description &&
                                    carData.car.description !== "Not Provided" && (
                                        <div className="mt-6">
                                            <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2 mb-2">
                                                <FileText className="w-5 h-5 text-blue-500" />
                                                Description
                                            </h3>
                                            <p className="text-gray-600 whitespace-pre-wrap">
                                                {carData.car.description}
                                            </p>
                                        </div>
                                    )}
                            </div>
                            {/* Insurance Information */}
                            {carData.insurance && carData.insurance.insurancetenure != 0 && (
                                <div className="bg-white rounded-xl shadow-md p-6">
                                    <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
                                        <Shield className="w-5 h-5 text-blue-500" />
                                        Insurance Information
                                    </h2>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <DetailItem
                                            icon={<ShieldCheck />}
                                            label="Insurance Company"
                                            value={carData.insurance.insurancecompany}
                                        />
                                        <DetailItem
                                            icon={<ShieldCheck />}
                                            label="Policy Number"
                                            value={carData.insurance.insurancenumber}
                                        />
                                        <DetailItem
                                            icon={<ShieldCheck />}
                                            label="Policy Tenure"
                                            value={`${carData.insurance.insurancetenure} years`}
                                        />
                                        <DetailItem
                                            icon={<ShieldCheck />}
                                            label="Insurance Upto"
                                            value={new Date(
                                                carData.insurance.insuranceenddate
                                            ).toLocaleDateString("en-GB")}
                                        />
                                    </div>
                                </div>
                            )}
                            {/* Maintenance Records */}
                            <div className="bg-white rounded-xl shadow-md p-6">
                                <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
                                    <FileText className="w-5 h-5 text-blue-500" />
                                    Maintenance Records
                                </h2>
                                <div className="overflow-y-auto max-h-48">
                                    {maintainanceData.maintenanceRecords.length > 0 ? (
                                        <div className="space-y-4">
                                            {maintainanceData.maintenanceRecords.map((record, index) => (
                                                <div
                                                    key={index}
                                                    className="bg-blue-50 rounded-lg p-4 transition-transform"
                                                >
                                                    <div className="space-y-2">
                                                        <p className="font-medium text-blue-900">
                                                            {index + 1}. {record.description}
                                                        </p>
                                                        <p className="text-blue-700">
                                                            <span className="font-semibold">Cost:</span> ₹
                                                            {record.price}
                                                        </p>
                                                        <p className="text-blue-700">
                                                            <span className="font-semibold">Date:</span>{" "}
                                                            {new Date(
                                                                record.maintainanceDate
                                                            ).toLocaleDateString("en-GB")}
                                                        </p>
                                                        <p className="text-blue-700">
                                                            <span className="font-semibold">Done By:</span>{" "}
                                                            {record.username}
                                                        </p>
                                                        <a
                                                            href={record.maintainanceReceipt}
                                                            target="_blank"
                                                            rel="noopener noreferrer"
                                                            className="inline-flex items-center text-blue-600 hover:text-blue-800 font-medium"
                                                        >
                                                            <FileText className="w-4 h-4 mr-1" />
                                                            View Receipt
                                                        </a>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    ) : (
                                        <p className="text-gray-500 text-center py-4">
                                            No maintenance records available.
                                        </p>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {(isEmployee == true || driverSubittedId == true || isAdmin == true) && carData && carData.car.status == false && (
                <div className='w-[90%] mx-auto mt-6 mb-10'>

                    <h2 className="text-2xl font-bold mb-4">Add Maintenance Record</h2>
                    <form onSubmit={handleSubmit} encType="multipart/form-data">
                        <div className="mb-4">
                            <label className="block text-sm font-medium mb-2">Maintenance Description</label>
                            <textarea
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                className="border border-gray-300 rounded p-2 w-full"
                            ></textarea>
                        </div>
                        <div className="mb-4">
                            <label className="block text-sm font-medium mb-2">Price</label>
                            <input
                                type="number"
                                value={price}
                                onChange={(e) => setPrice(e.target.value)}
                                required
                                className="border border-gray-300 rounded p-2 w-full"
                            />
                        </div>
                        {/* <div className="mb-4">
                            <label className="block text-sm font-medium mb-2">Role</label>
                            <select
                                disabled={isDriver || isAdmin || isEmployee} // Disable if any of these roles are true
                                value={isDriver ? "driver" : isEmployee==true ? "Employee" :  isAdmin==true ? "temp" : role}
                                onChange={(e) => setRole(e.target.value)}
                                required
                                className="border border-gray-300 rounded p-2 w-full text-sm md:text-base"
                            >
                                <option value="" disabled>
                                    Select role
                                </option>
                                <option value="admin">Admin</option>
                                <option value="employee">Employee</option>
                                <option value="driver">Driver</option>
                            </select>


                        </div> */}
                        <div className="mb-4">
                            <label className="block text-sm font-medium mb-2">Maintenance Date</label>
                            <input
                                type="date"
                                value={maintainanceDate}
                                onChange={(e) => setMaintainanceDate(e.target.value)}
                                required
                                className="border border-gray-300 rounded p-2 w-full"
                            />
                        </div>
                        <div className="mb-4">
                            <label className="block text-sm font-medium mb-2">Upload Documents</label>
                            <input
                                type="file"
                                required
                                ref={fileInputRef}
                                onChange={(e) => setFiles([...e.target.files])}
                                className="border border-gray-300 rounded p-2 w-full"
                            />
                        </div>
                        <button
                            type="submit"
                            className={`bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline ${adding ? 'opacity-50 cursor-not-allowed' : ''}`}
                            disabled={adding}
                        >
                            {adding ? 'Adding...' : 'Add Maintenance Record'}
                        </button>
                    </form>
                </div>)}
        </>

    );
}