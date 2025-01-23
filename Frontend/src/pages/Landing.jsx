// import { useState, useEffect } from "react";
// import { useNavigate } from "react-router-dom";
// import axios from "axios";
// import { Carousel } from 'react-responsive-carousel';
// import 'react-responsive-carousel/lib/styles/carousel.min.css';
// import { SearchContext } from "../context/SearchContext";
// import { useContext } from "react";


// export default function Landing() {
//   const [fuelType, setFuelType] = useState(null);
//   const [carType, setCarType] = useState(null);
//   const [cars, setCars] = useState([]);
//   const [showFilters, setShowFilters] = useState(false);
//   const [noticeImages, setNoticeImages] = useState([]);
//   const { query } = useContext(SearchContext);
//   // const [carname, setCarname] = useState(null);
//   const navigate = useNavigate();

//   const handleFuelTypeChange = (event) => {
//     const selectedFuelType = event.target.value;
//     setFuelType((prev) => (prev === selectedFuelType ? null : selectedFuelType));
//   };

//   const handleCarTypeChange = (event) => {
//     const selectedCarType = event.target.value;
//     setCarType((prev) => (prev === selectedCarType ? null : selectedCarType));
//   };

//   const handleSelectButton = (id) => {
//     navigate(`/car/${id}`);
//   };

//   const resetFilters = () => {
//     setFuelType(null);
//     setCarType(null);
//   };

//   const toggleFilters = () => {
//     setShowFilters((prev) => !prev);
//   };

//   // Fetch cars based on filters
//   useEffect(() => {
//     const fetchCars = async () => {
//       try {
//         const params = {};
//         if (fuelType) params.fuelType = fuelType;
//         if (carType) params.carMake = carType;
//         if (query) params.carSearch = query;
//         const response = await axios.get(`http://localhost:8000/`, { params });
//         // console.log(response.data);
//         const data = response.data.carsWithImages;
//         const carsData = data?.map((car) => {
//           const firstImage = car.displayImage; // Updated to use imageurl instead of displayImage
//           return {
//             id: car.registernumber,
//             imgSrc: firstImage, // Set imgSrc to the signed URL
//             name: car.carname,
//             number: car.registernumber,
//             kilometers: "", // You might want to update this with actual data if available
//             price: car.carprice,
//             status: car.status,
//             onhomepage: car.onhomepage,
//           };
//         });
//         setCars(carsData);
//       } catch (error) {
//         console.error(error);
//       }
//     };

//     fetchCars();
//   }, [fuelType, carType, query]);


//   // Fetch notice images only once on component mount
//   useEffect(() => {
//     const fetchNoticeImages = async () => {
//       try {
//         let folderPath;
//         folderPath = 'Notices/'
//         const response = await axios.get('http://localhost:8000/get-images', {
//           params: {
//             folderPath: folderPath
//           }
//         });
//         const imageUrls = response.data;

//         setNoticeImages(imageUrls);  // Set fetched image URLs
//         // console.log("Notice Images:", imageUrls);
//       } catch (error) {
//         console.error("Error fetching notice images:", error);
//       }
//     };

//     fetchNoticeImages();
//   }, []); // Empty dependency array to run only once

//   return (
//     <div className="container mx-auto max-w-full">
//       {/* Top Section with Carousel and Filters */}
//       <div className="flex flex-col lg:flex-row gap-4 mt-8 ml-12 mr-12">
//         {/* Filters Section */}
//         {/* {console.log("query", query)} */}  
//         <div className={`w-100vh lg:w-1/4 bg-white h-full rounded-md shadow-md p-4 ${showFilters ? '' : 'hidden lg:block'}`}>
//           <div className="hidden lg:block mb-4">
//             <h2 className="text-xl font-bold">FILTERS</h2>
//           </div>

//           <div className="mb-4">
//             <h2 className="text-xl py-4 font-bold">FUEL TYPE</h2>
//             {["petrol", "diesel", "cng"]?.map((type) => (
//               <div className="flex items-center" key={type}>
//                 <input
//                   type="radio"
//                   id={type}
//                   name="fuelType"
//                   value={type}
//                   checked={fuelType === type}
//                   onChange={handleFuelTypeChange}
//                   className="mr-2 cursor-pointer"
//                 />
//                 <label htmlFor={type} className="font-medium cursor-pointer">
//                   {type.toUpperCase()}
//                 </label>
//               </div>
//             ))}
//           </div>

//           <div className="mb-4">
//             <h2 className="text-xl py-6 font-bold">VEHICLE TYPE</h2>
//             {["car", "truck", "bike", "tempo"]?.map((type) => (
//               <div className="flex items-center" key={type}>
//                 <input
//                   type="radio"
//                   id={type}
//                   name="carType"
//                   value={type}
//                   checked={carType === type}
//                   onChange={handleCarTypeChange}
//                   className="mr-2 cursor-pointer"
//                 />
//                 <label htmlFor={type} className="font-medium cursor-pointer">
//                   {type.toUpperCase()}
//                 </label>
//               </div>
//             ))}
//           </div>

//           <button
//             onClick={resetFilters}
//             className="w-full px-4 py-2 bg-blue-500 text-white rounded-md"
//           >
//             Reset Filters
//           </button>
//         </div>

//         {/* Filter Toggle Button for Mobile */}
//         <button
//           onClick={toggleFilters}
//           className="lg:hidden mb-2 px-4 py-2 bg-blue-500 text-white rounded-md"
//         >
//           {showFilters ? 'Hide Filters' : 'Show Filters'}
//         </button>

//         {/* Carousel Section */}
//         <div className="w-full lg:w-3/4 mt-2 sm:m-10 p-4">
//           {noticeImages.length > 0 ? (
//             <Carousel
//               showArrows={true}
//               autoPlay={true}
//               infiniteLoop={true}
//               showThumbs={false}
//               className="rounded-t-lg"
//             >
//               {noticeImages?.map((image, index) => (
//                 <div key={index}>
//                   <img
//                     src={image}
//                     alt={`Car Image ${index + 1}`}
//                     className="w-full h-auto rounded-t-lg max-h-[60vh] object-contain"
//                   />
//                 </div>
//               ))}
//             </Carousel>
//           ) : (
//             // <p>Loading images...</p>
//             // <p></p>
//             null

//           )}
//         </div>
//       </div>

//       {/* Car Cards Section */}
//       <div className="flex flex-wrap gap-4 m-10 p-4">
//         {cars?.map(
//           (car) =>
//             car.status === false &&
//             car.onhomepage === true && (
//               <div
//                 key={car.id}
//                 className="bg-white rounded-md shadow-md p-4 w-full sm:w-1/2 lg:w-[32%] md:w-[48%]"
//               >
//                 <div className="relative w-full h-48">
//                   <img
//                     src={car.imgSrc}
//                     alt={car.name}
//                     className="w-full h-full object-cover rounded-md max-h-48"
//                     style={{ maxHeight: "12rem" }} // Ensures the image height does not exceed 12rem
//                   />
//                 </div>
//                 <h3 className="text-lg font-bold mt-4">{car.name}</h3>
//                 <p className="text-gray-600 mt-2">{car.number}</p>
//                 <p className="text-gray-600 mt-2">{car.kilometers}</p>
//                 <p className="text-green-500 font-bold mt-2">₹{car.price}</p>
//                 <button
//                   onClick={() => handleSelectButton(car.id)}
//                   className="w-full px-4 py-2 bg-blue-500 text-white rounded-md mt-4"
//                 >
//                   View Details
//                 </button>
//               </div>
//             )
//         )}
//       </div>

//     </div>
//   );
// }

import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Carousel } from 'react-responsive-carousel';
import 'react-responsive-carousel/lib/styles/carousel.min.css';
import { SearchContext } from "../context/SearchContext";
import { useContext } from "react";
import { 
  Fuel, 
  Car, 
  Truck, 
  Bike, 
  Tag,
  Filter as FilterIcon,
  ChevronRight,
  Gauge,
  DollarSign,
  PiggyBank,
  Wallet2
} from 'lucide-react';

export default function Landing() {
  const [fuelType, setFuelType] = useState(null);
  const [carType, setCarType] = useState(null);
  const [cars, setCars] = useState([]);
  const [showFilters, setShowFilters] = useState(false);
  const [noticeImages, setNoticeImages] = useState([]);
  const { query } = useContext(SearchContext);
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

  useEffect(() => {
    const fetchCars = async () => {
      try {
        const params = {};
        if (fuelType) params.fuelType = fuelType;
        if (carType) params.carMake = carType;
        if (query) params.carSearch = query;
        const response = await axios.get(`http://localhost:8000/`, { params });
        const data = response.data.carsWithImages;
        const carsData = data?.map((car) => {
          const firstImage = car.displayImage;
          return {
            id: car.registernumber,
            imgSrc: firstImage,
            name: car.carname,
            number: car.registernumber,
            kilometers: "",
            price: car.carprice,
            status: car.status,
            onhomepage: car.onhomepage,
          };
        });
        setCars(carsData);
      } catch (error) {
        console.error(error);
      }
    };

    fetchCars();
  }, [fuelType, carType, query]);

  useEffect(() => {
    const fetchNoticeImages = async () => {
      try {
        let folderPath = 'Notices/';
        const response = await axios.get('http://localhost:8000/get-images', {
          params: { folderPath }
        });
        const imageUrls = response.data;
        setNoticeImages(imageUrls);
      } catch (error) {
        console.error("Error fetching notice images:", error);
      }
    };

    fetchNoticeImages();
  }, []);

  const getVehicleIcon = (type) => {
    switch (type) {
      case 'car':
        return <Car className="w-5 h-5" />;
      case 'truck':
        return <Truck className="w-5 h-5" />;
      case 'bike':
        return <Bike className="w-5 h-5" />;
      case 'tempo':
        return <Truck className="w-5 h-5" />;
      default:
        return <Car className="w-5 h-5" />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100">
      <div className="flex flex-col lg:flex-row gap-4 mt-8 mx-4 lg:mx-12">
        {/* Filters Section */}
        <div className={`lg:w-1/4 bg-white rounded-xl shadow-lg p-6 ${showFilters ? '' : 'hidden lg:block'} border border-slate-100`}>
          <div className="hidden lg:block mb-6">
            <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
              <FilterIcon className="w-5 h-5 text-blue-500" />
              FILTERS
            </h2>
          </div>

          <div className="mb-6">
            <h2 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
              <Fuel className="w-5 h-5 text-blue-500" />
              FUEL TYPE
            </h2>
            <div className="space-y-3">
              {["petrol", "diesel", "cng"]?.map((type) => (
                <label 
                  key={type} 
                  className="flex items-center p-1 rounded-lg hover:bg-slate-50 transition-colors cursor-pointer"
                >
                  <input
                    type="radio"
                    id={type}
                    name="fuelType"
                    value={type}
                    checked={fuelType === type}
                    onChange={handleFuelTypeChange}
                    className="w-4 h-4 text-blue-500 border-slate-300 focus:ring-blue-400"
                  />
                  <span className="ml-3 font-medium text-slate-700">
                    {type.toUpperCase()}
                  </span>
                </label>
              ))}
            </div>
          </div>

          <div className="mb-6">
            <h2 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
              <Car className="w-5 h-5 text-blue-500" />
              VEHICLE TYPE
            </h2>
            <div className="space-y-3">
              {["car", "truck", "bike", "tempo"]?.map((type) => (
                <label 
                  key={type}
                  className="flex items-center p-1 rounded-lg hover:bg-slate-50 transition-colors cursor-pointer"
                >
                  <input
                    type="radio"
                    id={type}
                    name="carType"
                    value={type}
                    checked={carType === type}
                    onChange={handleCarTypeChange}
                    className="w-4 h-4 text-blue-500 border-slate-300 focus:ring-blue-400"
                  />
                  <span className="ml-3 font-medium text-slate-700">
                    {type.toUpperCase()}
                  </span>
                </label>
              ))}
            </div>
          </div>

          <button
            onClick={resetFilters}
            className="w-full px-4 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors font-medium"
          >
            Reset Filters
          </button>
        </div>

        {/* Filter Toggle Button for Mobile */}
        <button
          onClick={toggleFilters}
          className="lg:hidden mb-2 px-4 py-3 bg-blue-500 text-white rounded-lg flex items-center justify-center gap-2"
        >
          <FilterIcon className="w-5 h-5" />
          {showFilters ? 'Hide Filters' : 'Show Filters'}
        </button>

        {/* Carousel Section */}
        <div className="w-full lg:w-3/4 mt-2 sm:m-10 md:w-10">
          {noticeImages.length > 0 ? (
            <div className="rounded-2xl shadow-xl">
              <Carousel
                showArrows={true}
                autoPlay={true}
                infiniteLoop={true}
                showThumbs={false}
                showStatus={false}
                className="rounded-2xl"
                renderArrowPrev={(clickHandler, hasPrev) => (
                  hasPrev && (
                    <button
                      onClick={clickHandler}
                      className="absolute left-4 z-10 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/80 rounded-full flex items-center justify-center hover:bg-white transition-colors"
                    >
                      <ChevronRight className="w-6 h-6 rotate-180 text-slate-700" />
                    </button>
                  )
                )}
                renderArrowNext={(clickHandler, hasNext) => (
                  hasNext && (
                    <button
                      onClick={clickHandler}
                      className="absolute right-4 z-10 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/80 rounded-full flex items-center justify-center hover:bg-white transition-colors"
                    >
                      <ChevronRight className="w-6 h-6 text-slate-700" />
                    </button>
                  )
                )}
              >
                {noticeImages?.map((image, index) => (
                  <div key={index}>
                    <img
                      src={image}
                      alt={`Car Image ${index + 1}`}
                      className="w-full h-[60vw] lg:h-[60vh] object-cover"
                    />
                  </div>
                ))}
              </Carousel>
            </div>
          ) : null}
        </div>
      </div>

      {/* Car Cards Section */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 m-4 lg:m-12">
        {cars?.map(
          (car) =>
            car.status === false &&
            car.onhomepage === true && (
              <div
                key={car.id}
                className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300 border border-slate-100"
              >
                <div className="relative">
                  <img
                    src={car.imgSrc}
                    alt={car.name}
                    className="w-full h-56 object-cover hover:scale-2"
                  />
                  <div className="absolute top-4 right-4">
                    <span className="bg-green-500 text-white px-3 py-1 rounded-full text-sm font-medium shadow-lg">
                      Available
                    </span>
                  </div>
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-bold text-slate-800 mb-4">{car.name}</h3>
                  <div className="space-y-3 mb-6">
                    <div className="flex items-center text-slate-600">
                      <Tag className="w-4 h-4 mr-2 text-blue-500" />
                      <span>{car.number}</span>
                    </div>
                    {car.kilometers && (
                      <div className="flex items-center text-slate-600">
                        <Gauge className="w-4 h-4 mr-2 text-blue-500" />
                        <span>{car.kilometers}</span>
                      </div>
                    )}
                    <div className="flex items-center text-slate-600">
                      <Wallet2 className="w-4 h-4 mr-2 text-blue-500" />
                      <span className="text-2xl font-bold text-blue-500">₹{car.price}</span>
                    </div>
                  </div>
                  <button
                    onClick={() => handleSelectButton(car.id)}
                    className="w-full px-4 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors flex items-center justify-center gap-2 font-medium group"
                  >
                    View Details
                    <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </button>
                </div>
              </div>
            )
        )}
      </div>
    </div>
  );
}