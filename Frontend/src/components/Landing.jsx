import { useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";

export default function Landing() {
  const [fuelType, setFuelType] = useState("petrol");
  const [budget, setBudget] = useState("any");
  const [kilometres, setKilometres] = useState("any");
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  const navigate = useNavigate();

  const handleFuelTypeChange = (event) => {
    setFuelType(event.target.value);
  };

  const handleBudgetChange = (event) => {
    setBudget(event.target.value);
  };

  const handleKilometresChange = (event) => {
    setKilometres(event.target.value);
  };

  const toggleFilter = () => {
    setIsFilterOpen(!isFilterOpen);
  };

  const handleSelectButton = (id) => {
    navigate(`/car/${id}`);
  };

  const cars = [
    {
      id: 1,
      imgSrc: "/suzuki-fronx-1.jpg",
      name: "2020 SUZUKI FRONX",
      number: "MH19XX1111",
      kilometers: "20,000KM",
      price: "₹14 lakh",
    },
    {
      id: 2,
      imgSrc: "/suzuki-fronx-2.jpg",
      name: "2020 SUZUKI FRONX",
      number: "MH19XX1111",
      kilometers: "20,000KM",
      price: "₹14 lakh",
    },
    {
      id: 3,
      imgSrc: "/suzuki-fronx-3.jpg",
      name: "2020 SUZUKI FRONX",
      number: "MH19XX1111",
      kilometers: "20,000KM",
      price: "₹14 lakh",
    },
    {
      id: 4,
      imgSrc: "/suzuki-fronx-1.jpg",
      name: "2020 SUZUKI FRONX",
      number: "MH19XX1111",
      kilometers: "20,000KM",
      price: "₹14 lakh",
    },
    {
      id: 5,
      imgSrc: "/suzuki-fronx-2.jpg",
      name: "2020 SUZUKI FRONX",
      number: "MH19XX1111",
      kilometers: "20,000KM",
      price: "₹14 lakh",
    },
    {
      id: 6,
      imgSrc: "/suzuki-fronx-3.jpg",
      name: "2020 SUZUKI FRONX",
      number: "MH19XX1111",
      kilometers: "20,000KM",
      price: "₹14 lakh",
    },
  ];

  return (
    <div className="container mx-auto">
      <main className="mt-8 flex flex-col lg:flex-row">
        <div className="w-full lg:w-1/4 mb-4 lg:mb-0">
          {/* Filter button for mobile view */}
          <button
            onClick={toggleFilter}
            className="w-full lg:hidden px-4 py-2 bg-blue-500 text-white rounded-md"
          >
            {isFilterOpen ? "Hide Filters" : "Show Filters"}
          </button>

          {/* Filters */}
          <div className={`lg:block ${isFilterOpen ? "block" : "hidden"}`}>
            <div className="bg-white rounded-md shadow-md p-4 mb-4 ml-8 mr-8">
              <h2 className="text-xl font-bold mb-4">FUEL TYPE</h2>
              <div className="flex items-center">
                <input
                  type="radio"
                  id="petrol"
                  name="fuelType"
                  value="petrol"
                  checked={fuelType === "petrol"}
                  onChange={handleFuelTypeChange}
                  className="mr-2"
                />
                <label htmlFor="petrol" className="font-medium">
                  PETROL
                </label>
              </div>
              <div className="flex items-center">
                <input
                  type="radio"
                  id="diesel"
                  name="fuelType"
                  value="diesel"
                  checked={fuelType === "diesel"}
                  onChange={handleFuelTypeChange}
                  className="mr-2"
                />
                <label htmlFor="diesel" className="font-medium">
                  DIESEL
                </label>
              </div>
              <div className="flex items-center">
                <input
                  type="radio"
                  id="cng"
                  name="fuelType"
                  value="cng"
                  checked={fuelType === "cng"}
                  onChange={handleFuelTypeChange}
                  className="mr-2"
                />
                <label htmlFor="cng" className="font-medium">
                  CNG
                </label>
              </div>
              <div className="flex items-center">
                <input
                  type="radio"
                  id="electric"
                  name="fuelType"
                  value="electric"
                  checked={fuelType === "electric"}
                  onChange={handleFuelTypeChange}
                  className="mr-2"
                />
                <label htmlFor="electric" className="font-medium">
                  ELECTRIC
                </label>
              </div>
              <div className="flex items-center">
                <input
                  type="radio"
                  id="lpg"
                  name="fuelType"
                  value="lpg"
                  checked={fuelType === "lpg"}
                  onChange={handleFuelTypeChange}
                  className="mr-2"
                />
                <label htmlFor="lpg" className="font-medium">
                  LPG
                </label>
              </div>
            </div>

            <div className="bg-white rounded-md shadow-md p-4 mb-4 ml-8 mr-8">
              <h2 className="text-xl font-bold mb-4">BUDGET</h2>
              <select
                value={budget}
                onChange={handleBudgetChange}
                className="px-4 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 w-full"
              >
                <option value="any">Any</option>
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
            </div>

            <div className="bg-white rounded-md shadow-md p-4 mb-4 ml-8 mr-8">
              <h2 className="text-xl font-bold mb-4">KILOMETRES</h2>
              <div className="flex items-center">
                <input
                  type="radio"
                  id="any"
                  name="kilometres"
                  value="any"
                  checked={kilometres === "any"}
                  onChange={handleKilometresChange}
                  className="mr-2"
                />
                <label htmlFor="any" className="font-medium">
                  Any
                </label>
              </div>
              <div className="flex items-center">
                <input
                  type="radio"
                  id="0-25000"
                  name="kilometres"
                  value="0-25000"
                  checked={kilometres === "0-25000"}
                  onChange={handleKilometresChange}
                  className="mr-2"
                />
                <label htmlFor="0-25000" className="font-medium">
                  0-25000KM
                </label>
              </div>
              <div className="flex items-center">
                <input
                  type="radio"
                  id="25000-50000"
                  name="kilometres"
                  value="25000-50000"
                  checked={kilometres === "25000-50000"}
                  onChange={handleKilometresChange}
                  className="mr-2"
                />
                <label htmlFor="25000-50000" className="font-medium">
                  25000-50000KM
                </label>
              </div>
              <div className="flex items-center">
                <input
                  type="radio"
                  id="50000-75000"
                  name="kilometres"
                  value="50000-75000"
                  checked={kilometres === "50000-75000"}
                  onChange={handleKilometresChange}
                  className="mr-2"
                />
                <label htmlFor="50000-75000" className="font-medium">
                  50000-75000KM
                </label>
              </div>
              <div className="flex items-center">
                <input
                  type="radio"
                  id="75000-100000"
                  name="kilometres"
                  value="75000-100000"
                  checked={kilometres === "75000-100000"}
                  onChange={handleKilometresChange}
                  className="mr-2"
                />
                <label htmlFor="75000-100000" className="font-medium">
                  75000-100000KM
                </label>
              </div>
              <div className="flex items-center">
                <input
                  type="radio"
                  id="100000"
                  name="kilometres"
                  value="100000"
                  checked={kilometres === "100000"}
                  onChange={handleKilometresChange}
                  className="mr-2"
                />
                <label htmlFor="100000" className="font-medium">
                  100000KM
                </label>
              </div>
            </div>
          </div>
        </div>

        {/* Car Cards */}
        <div className="flex flex-wrap w-full lg:w-3/4 gap-2">
          {cars.map((car) => (
            <div
              key={car.id}
              className="bg-white rounded-md shadow-md p-4 flex flex-col justify-between w-full sm:w-1/3 lg:w-[32%]"
            >
              <div className="flex-grow">
                <img
                  src={car.imgSrc}
                  alt={car.name}
                  className="w-full rounded-md"
                />
                <h3 className="text-lg font-bold mt-4">{car.name}</h3>
                <p className="text-gray-600 mt-2">{car.number}</p>
                <p className="text-gray-600 mt-2">{car.kilometers}</p>
                <p className="text-green-500 font-bold mt-2">{car.price}</p>
              </div>
              <div className="mt-4">
                <button
                  onClick={() => handleSelectButton(car.id)}
                  className="w-full px-4 py-2 bg-blue-500 text-white rounded-md"
                >
                  View Details
                </button>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
