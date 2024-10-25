import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Carousel } from 'react-responsive-carousel';
import 'react-responsive-carousel/lib/styles/carousel.min.css';

export default function Landing() {
  const [fuelType, setFuelType] = useState(null);
  const [carType, setCarType] = useState(null);
  const [cars, setCars] = useState([]);
  const [showFilters, setShowFilters] = useState(false);
  const [noticeImages, setNoticeImages] = useState([]);

  const navigate = useNavigate();

  const handleFuelTypeChange = (event) => {
    const selectedFuelType = event.target.value;
    setFuelType((prev) => (prev === selectedFuelType ? null : selectedFuelType));
  };

  const handleCarTypeChange = (event) => {
    const selectedCarType = event.target.value;
    setCarType((prev) => (prev === selectedCarType ? null : selectedCarType));
  };

  const handleSelectButton = (id) => {
    navigate(`/car/${id}`);
  };

  const resetFilters = () => {
    setFuelType(null);
    setCarType(null);
  };

  const toggleFilters = () => {
    setShowFilters((prev) => !prev);
  };

  // Fetch cars based on filters
  useEffect(() => {
    const fetchCars = async () => {
      try {
        const params = {};
        if (fuelType) params.fuelType = fuelType;
        if (carType) params.carMake = carType;

        const response = await axios.get(`http://localhost:8000/`, { params });
        const data = response.data.carsWithImages;
        const carsData = data.map((car) => {
          const firstImage = car.imageurl[0];
          return {
            id: car.registrationnumber,
            imgSrc: firstImage,
            name: car.carname,
            number: car.registrationnumber,
            kilometers: "20,000KM",
            price: car.carprice,
            status: car.status
          };
        });
        setCars(carsData);
      } catch (error) {
        console.error(error);
      }
    };
    fetchCars();
  }, [fuelType, carType]);

  // Fetch notice images only once on component mount
  useEffect(() => {
    const fetchNoticeImages = async () => {
      try {
        const response = await axios.get('http://localhost:8000/dashboard/get-notice');
        const array = response.data;
        const imageUrls = array.map(item => item.image_urls);
        setNoticeImages(imageUrls);  // Set fetched image URLs
        console.log("Notice Images:", imageUrls);
      } catch (error) {
        console.error("Error fetching notice images:", error);
      }
    };

    fetchNoticeImages();
  }, []); // Empty dependency array to run only once

  return (
    <div className="container mx-auto">
      {/* Top Section with Carousel and Filters */}
      <div className="flex flex-col lg:flex-row gap-4">
        {/* Filters Section */}
        <div className={`w-100vh lg:w-1/4 bg-white rounded-md shadow-md p-4 ${showFilters ? '' : 'hidden lg:block'}`}>
          <div className="hidden lg:block mb-4">
            <h2 className="text-xl font-bold">FILTERS</h2>
          </div>

          <div className="mb-4">
            <h2 className="text-xl font-bold">FUEL TYPE</h2>
            {["petrol", "diesel", "cng"].map((type) => (
              <div className="flex items-center" key={type}>
                <input
                  type="radio"
                  id={type}
                  name="fuelType"
                  value={type}
                  checked={fuelType === type}
                  onChange={handleFuelTypeChange}
                  className="mr-2 cursor-pointer"
                />
                <label htmlFor={type} className="font-medium cursor-pointer">
                  {type.toUpperCase()}
                </label>
              </div>
            ))}
          </div>

          <div className="mb-4">
            <h2 className="text-xl font-bold">CAR TYPE</h2>
            {["car", "truck", "bike", "tempo"].map((type) => (
              <div className="flex items-center" key={type}>
                <input
                  type="radio"
                  id={type}
                  name="carType"
                  value={type}
                  checked={carType === type}
                  onChange={handleCarTypeChange}
                  className="mr-2 cursor-pointer"
                />
                <label htmlFor={type} className="font-medium cursor-pointer">
                  {type.toUpperCase()}
                </label>
              </div>
            ))}
          </div>

          <button
            onClick={resetFilters}
            className="w-full px-4 py-2 bg-blue-500 text-white rounded-md"
          >
            Reset Filters
          </button>
        </div>

        {/* Filter Toggle Button for Mobile */}
        <button 
          onClick={toggleFilters} 
          className="lg:hidden mb-2 px-4 py-2 bg-blue-500 text-white rounded-md"
        >
          {showFilters ? 'Hide Filters' : 'Show Filters'}
        </button>

        {/* Carousel Section */}
        <div className="w-full lg:w-3/4 mt-2">
          {noticeImages.length > 0 ? (
            <Carousel
              showArrows={true}
              autoPlay={true}
              infiniteLoop={true}
              showThumbs={false}
              className="rounded-t-lg"
            >
              {noticeImages.map((image, index) => (
                <div key={index}>
                  <img
                    src={image}
                    alt={`Car Image ${index + 1}`}
                    className="w-full h-auto rounded-t-lg max-h-[60vh] object-contain"
                  />
                </div>
              ))}
            </Carousel>
          ) : (
            <p>Loading images...</p>
          )}
        </div>
      </div>

      {/* Car Cards Section */}
      <div className="flex flex-wrap mt-8 gap-4">
        {cars.map((car) => (
          car.status === false && (
            <div
              key={car.id}
              className="bg-white rounded-md shadow-md p-4 w-full sm:w-1/2 lg:w-[32.5%]"
            >
              <img
                src={car.imgSrc}
                alt={car.name}
                className="w-full h-48 object-cover rounded-md"
              />
              <h3 className="text-lg font-bold mt-4">{car.name}</h3>
              <p className="text-gray-600 mt-2">{car.number}</p>
              <p className="text-gray-600 mt-2">{car.kilometers}</p>
              <p className="text-green-500 font-bold mt-2">₹{car.price}</p>
              <button
                onClick={() => handleSelectButton(car.id)}
                className="w-full px-4 py-2 bg-blue-500 text-white rounded-md mt-4"
              >
                View Details
              </button>
            </div>
          )
        ))}
      </div>
    </div>
  );
}
