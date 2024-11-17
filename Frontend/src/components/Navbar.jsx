import React, { useContext, useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { SearchContext } from '../context/SearchContext.jsx';
import { jwtDecode } from "jwt-decode";
import { toast } from 'react-toastify';
import { MdLocationOn } from 'react-icons/md';  


function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const { query, setQuery } = useContext(SearchContext);
  const [loggedIn, setLoggedIn] = useState(false);
  const location = useLocation(); // Get current location
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("authToken");
    if (token) {
      setLoggedIn(true);
    }
  })

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const handleSearchInputChange = (e) => {
    setQuery(e.target.value);

  };

  const handleSearch = () => {
    console.log('Searching for:', query);
    // Implement your search logic here

  };

  const handleAdmin = () => {

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
    if (decodedToken?.isAdmin == true || decodedToken?.isEmployee == true) {

      navigate("/dashboard");  // Navigate to dashboard upon success
    }
    else if (decodedToken?.isDriver == true) {
      navigate("/driverdashboard");
    }
    else {
      navigate("/admin");
    }
  }

  // Function to handle logout
  const handleLogout = () => {
    try {
      // Remove the token from localStorage or sessionStorage
      localStorage.removeItem('authToken'); // or sessionStorage.removeItem('authToken');

      // Redirect to the login page
      // window.location.href = '/admin';
      // navigate("/admin");
      toast.success('Logged out successfully!');
      setLoggedIn(false);

    } catch (error) {
      console.error('Error during logout:', error);
      toast.error('An error occurred while logging out.');
    }
  }


  const isHomeRoute = location.pathname === '/'; // Check if on the home route

  return (
    <nav className="bg-gray-800 sticky top-0 z-50 shadow-md">
      <div className="max-w-10xl mx-auto px-2 sm:px-6 lg:px-8">
        <div className="relative flex items-center justify-between h-20">
          <div className="absolute inset-y-0 left-0 flex items-center sm:hidden">
            <button
              onClick={toggleMenu}
              type="button"
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-white hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
              aria-controls="mobile-menu"
              aria-expanded={isOpen ? 'true' : 'false'}
            >
              <span className="sr-only">Open main menu</span>
              {isOpen ? (
                <svg className="block h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                <svg className="block h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16m-7 6h7" />
                </svg>
              )}
            </button>
          </div>
          <div className="flex-1 flex items-center justify-center sm:items-stretch sm:justify-start">
            <div className="flex-shrink-0 flex items-center">
              <img src="/Assets/Images/logo.png" alt="Brand Logo" className="h-30 w-20" />
              <div className="text-white text-xl font-bold ml-2">
                Nikhil Motors
              </div>
            </div>
          </div>

          <a href="/" className="text-gray-300 hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md text-sm font-medium">Home</a>

          {isHomeRoute && ( // Render search input only on the home route
            <div className="hidden sm:block flex-1 mr-[15%]">
              <div className="relative mx-auto w-full max-w-md">
                <input
                  type="text"
                  className="w-full h-8 pl-10 pr-4 py-2 border border-gray-300 rounded-2xl shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Search..."
                  value={query}
                  onChange={handleSearchInputChange}
                />
                <div className="absolute inset-y-0 left-0 flex items-center pl-3">
                  <svg
                    className="h-5 w-5 text-gray-400"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M21 21l-4.35-4.35M18.4 10.55a7.5 7.5 0 11-15 0 7.5 7.5 0 0115 0z"
                    />
                  </svg>
                </div>
              </div>
            </div>
          )}

          <div className="hidden sm:block sm:ml-6">
            <div className="flex space-x-4">
              <a href="https://www.google.co.in/maps/place/Nikhil+Motors/@16.7394676,74.3060399,17z/data=!3m1!4b1!4m6!3m5!1s0x3bc10109ce728891:0x93fd2aa9da4338c8!8m2!3d16.7394676!4d74.3086148!16s%2Fg%2F11v3ty7l85?entry=ttu&g_ep=EgoyMDI0MTExMy4xIKXMDSoASAFQAw%3D%3D" className="text-gray-300 hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md text-sm">
              <MdLocationOn className="h-6 w-6 rounded-full border-2 border" />
              </a>


              <a href="/about" className="text-gray-300 hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md text-sm font-medium">Contact us</a>
              {loggedIn == true && (<Link to="#" onClick={handleAdmin} className="text-gray-300 hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md text-sm font-medium">Dashboard</Link>)}
              {loggedIn == true ?
                (<Link to="#" onClick={handleLogout} className="text-gray-300 hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md text-sm font-medium">Log Out</Link>)
                :
                (<Link to="/admin" className="text-gray-300 hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md text-sm font-medium">Log In</Link>)}
            </div>
          </div>
        </div>
      </div>

      {isOpen && (
        <div className="sm:hidden" id="mobile-menu">
          <div className="px-2 pt-2 pb-3 space-y-1">
            <a href="/" className="text-gray-300 hover:bg-gray-700 hover:text-white block px-3 py-2 rounded-md text-base font-medium">Home</a>
            <a href="/about" className="text-gray-300 hover:bg-gray-700 hover:text-white block px-3 py-2 rounded-md text-base font-medium">About</a>
            <a href="/services" className="text-gray-300 hover:bg-gray-700 hover:text-white block px-3 py-2 rounded-md text-base font-medium">Services</a>
            <a href="/contact" className="text-gray-300 hover:bg-gray-700 hover:text-white block px-3 py-2 rounded-md text-base font-medium">Contact</a>
            <a href="#" onClick={handleAdmin} className="text-gray-300 hover:bg-gray-700 hover:text-white block px-3 py-2 rounded-md text-base font-medium">Dashboard</a>
            {loggedIn == true ?
              (<a href="#" onClick={handleLogout} className="text-gray-300 hover:bg-gray-700 hover:text-white block px-3 py-2 rounded-md text-base font-medium">Log Out</a>)
              :
              (<a href="/admin" className="text-gray-300 hover:bg-gray-700 hover:text-white block px-3 py-2 rounded-md text-base font-medium">Log In</a>)}
          </div>

          {/* Search bar in the hamburger menu */}
          {isHomeRoute && ( // Render search input only on the home route
            <div className="px-2 pt-2 pb-3">
              <div className="relative">
                <input
                  type="text"
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Search..."
                  value={query}
                  onChange={handleSearchInputChange}
                />
                <div className="absolute inset-y-0 left-0 flex items-center pl-3">
                  <svg
                    className="h-5 w-5 text-gray-400"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M21 21l-4.35-4.35M18.4 10.55a7.5 7.5 0 11-15 0 7.5 7.5 0 0115 0z"
                    />
                  </svg>
                </div>
              </div>
              <button
                onClick={handleSearch}
                className="w-full mt-2 px-4 py-2 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              >
                Search
              </button>
            </div>
          )}
        </div>
      )}
    </nav>
  );
}

export default Navbar;
