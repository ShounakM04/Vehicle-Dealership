import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Carousel } from "react-responsive-carousel";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import axios from "axios";
import {
  Car,
  ShieldCheck,
  Info,
  Calendar,
  Gauge,
  Palette,
  Tag,
  FileText,
  Shield,
  Fuel,
  Copy,
  CheckCheck

} from "lucide-react";
import { FaDownload, FaCopy, FaCheck } from "react-icons/fa";



function CarDetails() {
  const params = useParams();
  const [carData, setCarData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isCopied,setIsCopied] = useState(false);

  useEffect(() => {
    const fetchCarDetails = async () => {
      setLoading(true);
      try {
        const response = await axios.get(
          `http://localhost:8000/landingcar/${params.id}`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("authToken")}`,
            },
          }
        );
        if (response.status === 200) {
          setCarData(response.data);
        }
      } catch (err) {
        if (err.response && err.response.status === 400) {
          setError("Car not found");
        } else {
          setError("Error fetching car details");
        }
        console.error("Error fetching car details:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchCarDetails();
  }, [params.id]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading vehicle details...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="bg-white p-8 rounded-lg shadow-lg text-center">
          <Info className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Error</h2>
          <p className="text-gray-600">{error}</p>
        </div>
      </div>
    );
  }


  const copyToClipboard = () => {

    navigator.clipboard.writeText(window.location.href);
    // toast.success("Page URL copied to clipboard!", {
    //   position: "top-center",
    //   autoClose: 1500,
    // });
    // alert("Page URL copied to clipboard!");

    setIsCopied(true);
      setTimeout(() => {
        setIsCopied(false);
      }, 1000); // Revert back to copy icon after 2 seconds
  };
  
  const downloadImage = async (imageUrl) => {
    try {
      // Use the original signed URL directly for download
      const link = document.createElement('a');
      link.href = imageUrl;
      link.target = '_blank';
      link.download = `car-image-${Date.now()}.jpg`;
      
      // Append to body, click, and remove
      document.body.appendChild(link);
      link.click();
      
      // Clean up
      document.body.removeChild(link);
    } catch (error) {
      console.error('Download failed:', error);
    }
  };

  return (
    <div className="h-[calc(100vh-80px)] bg-gray-50 pt-6 sm:px-6 lg:px-8">
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

            <p className="text-gray-500 mt-2">
              Registration number: {carData.car.registernumber}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Image Gallery Section */}
          <div className="bg-white rounded-xl shadow-md overflow-hidden p-2 sm:p-4">

            <Carousel
              showArrows={true}
              autoPlay={true}
              infiniteLoop={true}
              showThumbs={true}
              showStatus={false}
              className="custom-carousel mx-2 sm:mx-4 md:mx-8"
              renderThumbs={(children) =>
                children.map((item, index) => (
                  <div key={index} className="h-14 w-full">
                    {item}
                  </div>
                ))
              }
            >
              {carData.images?.map((image, index) => (
                <div
                  key={index}
                  className="relative flex justify-center items-center overflow-hidden"
                >
                  <img
                    src={image}
                    alt={`Car ${carData.car.carname}`}
                    className="max-h-[20rem] rounded-t-lg object-contain"
                  />
                  {/* Download Button */}
                  <button
                    onClick={() => downloadImage(image)}
                    className="absolute top-4 right-4 p-2 bg-gray-800 text-white rounded-full hover:bg-gray-700"
                    title="Download Image"
                  >
                    <FaDownload />
                  </button>
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
                    icon={<Tag />}
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
              </div>

              {/* Price Section */}
              <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                <div className="flex justify-between items-center">
                  <span className="text-lg font-semibold text-gray-900">
                    Price
                  </span>
                  <span className="text-2xl font-bold text-blue-600">
                    {carData.car.vehiclesellprice === 0
                      ? "Not provided"
                      : `₹${carData.car.vehiclesellprice.toLocaleString()}`}
                  </span>
                </div>
              </div>

              {/* Description */}
              {carData.car.description && carData.car.description !== "Not Provided" && (
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
          </div>
        </div>
      </div>
    </div>
  );
}

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

export default CarDetails;
