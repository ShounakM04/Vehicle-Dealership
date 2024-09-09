import { useState } from "react";

function Cards() {
  const [searchValue, setSearchValue] = useState("");

  return (
    <div className="container mx-auto px-4 py-8">
      <header className="bg-yellow-200 p-4 rounded-lg flex items-center justify-between">
        <div className="flex items-center gap-4">
          <img src="/logo.png" alt="BG" className="h-8" />
          <a href="#" className="text-gray-800 hover:text-gray-900">
            HOME
          </a>
          <a href="#" className="text-gray-800 hover:text-gray-900">
            CONTACT
          </a>
        </div>
        <div className="flex items-center gap-4">
          <input
            type="text"
            placeholder="Search Vehicles"
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
            className="px-3 py-2 rounded-lg border border-gray-300 focus:outline-none focus:border-blue-500"
          />
          <button className="px-3 py-2 rounded-lg bg-blue-500 text-white hover:bg-blue-600">
            Search
          </button>
          <a href="#" className="text-gray-800 hover:text-gray-900">
            ADMIN
          </a>
        </div>
      </header>
      <main className="mt-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="rounded-lg shadow-md">
            <img
              src="/car.jpg"
              alt="Suzuki Fronx"
              className="w-full h-auto rounded-t-lg"
            />
            <div className="p-4">
              <h2 className="text-2xl font-bold text-gray-800">
                Suzuki Fronx
              </h2>
              <ul className="mt-4">
                <li className="text-gray-700">Common Details</li>
                <li className="text-gray-700">Specifications:</li>
                <li className="text-gray-600">
                  Field1: <span className="font-bold">Value1</span>
                </li>
                <li className="text-gray-600">
                  Field2: <span className="font-bold">Value2</span>
                </li>
                <li className="text-gray-600">
                  Field3: <span className="font-bold">Value3</span>
                </li>
                <li className="text-gray-600">
                  Field4: <span className="font-bold">Value4</span>
                </li>
                <li className="text-gray-600">
                  Field5: <span className="font-bold">Value5</span>
                </li>
                <li className="text-gray-600">
                  Field6: <span className="font-bold">Value6</span>
                </li>
                <li className="text-gray-600">
                  Field7: <span className="font-bold">Value7</span>
                </li>
              </ul>
            </div>
          </div>
          {/* Add more car details here */}
        </div>
      </main>
    </div>
  );
}

export default Cards;