// import React from "react";
// import { NavLink } from "react-router-dom";

// const ContactUs = () => {
//     return (
//         <div className="min-h-[89vh] bg-blue-50 flex flex-col lg:flex-row">

//             {/* Main Content */}
//             <div className="flex-1 p-5 lg:p-10">
//                 <h1 className="text-3xl font-bold text-center mb-6 text-blue-700">
//                     NIKHIL MOTORS
//                 </h1>
//                 <p className="text-center mb-8 text-gray-700">
//                     Feel free to reach out to us using the details below!
//                 </p>

//                 {/* Cards Section */}
//                 <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
//                     {/* Contact Numbers Card */}
//                     <div className="bg-gray-100 shadow-md rounded-lg p-6 flex flex-col items-center border border-gray-300">
//                         <div className="w-full">
//                             <h2 className="text-xl font-bold mb-4 text-gray-700 text-center">
//                                 Contact Numbers
//                             </h2>
//                             <p className="text-gray-700 mb-2 font-medium text-center">
//                                 General: +91 7058600679
//                             </p>
//                             <p className="text-gray-700 mb-2 font-medium text-center">
//                                 Office: +91 9272111777
//                             </p>
//                         </div>
//                         <div className="mt-4 w-full flex justify-center">
//                             {/* SVG Below Contact Numbers */}
//                             <img
//                                 className="w-24 h-24"
//                                 src="/Assets/Images/call.svg"
//                                 alt="Contact Icon"
//                             />
//                         </div>
//                     </div>

//                     {/* WhatsApp Group QR Code Card */}
//                     <div className="bg-green-100 shadow-md rounded-lg p-6 text-center border border-green-200">
//                         <h2 className="text-xl font-bold mb-4 text-green-700">
//                             Join Our WhatsApp Group
//                         </h2>
//                         <p className="text-gray-700 mb-4 font-medium">
//                             Scan the QR code below to join our WhatsApp group!
//                         </p>
//                         <div className="mt-8">
//                             {/* Adjusted margin for QR code */}
//                            <a href="https://chat.whatsapp.com/KlAdjB3KgIl8PUv3VQEy8g" target="blank_"> <img
//                                 className="w-40 h-40 mx-auto"
//                                 src="/Assets/Images/qr.jpeg"
//                                 alt="WhatsApp QR Code"
//                             /></a>
//                         </div>
//                     </div>

//                     {/* Location Card */}
//                     <div className="bg-yellow-100 shadow-md rounded-lg p-6 text-center border border-yellow-200">
//                         <h2 className="text-xl font-bold mb-4 text-yellow-700">
//                             Our Location
//                         </h2>
//                         <p className="text-gray-700 mb-2 font-medium">150, Kolhapur - Sangli Hwy</p>
//                         <p className="text-gray-700 mb-2 font-medium">near Juna पाटिल ढाबा, Halondi</p>
//                         <p className="text-gray-700 font-medium">Maharashtra 416116</p>
//                         <iframe
//                             className="mt-4 w-full h-40 border rounded"
//                             src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3922.2366055831183!2d74.30603987481776!3d16.739467621607726!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bc10109ce728891%3A0x93fd2aa9da4338c8!2sNikhil%20Motors!5e0!3m2!1sen!2sin!4v1699874369004!5m2!1sen!2sin"
//                             allowFullScreen=""
//                             loading="lazy"
//                             title="Nikhil Motors Location"
//                         ></iframe>
//                     </div>

//                 </div>
//             </div>
//         </div>
//     );
// };

// export default ContactUs;


import React from "react";

const ContactUs = () => {
    return (
        <div className="min-h-[89vh] bg-gradient-to-br from-blue-50 to-white">
            {/* Header Section */}
            <div className="max-w-7xl mx-auto pt-16 px-4 sm:px-6 lg:px-8">
                <div className="text-center">
                    <h1 className="text-4xl font-extrabold text-blue-800 tracking-tight sm:text-5xl md:text-6xl">
                        NIKHIL MOTORS
                    </h1>
                    <p className="mt-3 max-w-md mx-auto text-lg text-gray-600 sm:text-xl md:mt-5 md:max-w-3xl">
                        Connect with us today - we're here to serve you better!
                    </p>
                </div>

                {/* Cards Section */}
                <div className="mt-16 grid grid-cols-1 gap-8 lg:grid-cols-3 pb-16 ">
                    {/* Contact Numbers Card */}
                    <div className="relative group ">
                        <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-600 to-blue-400 rounded-lg blur opacity-25 group-hover:opacity-75 transition duration-1000 group-hover:duration-200"></div>
                        <div className="relative bg-white rounded-lg p-8 transform transition duration-300 hover:-translate-y-1 hover:shadow-xl h-full">
                            <div className="flex flex-col items-center h-full lg:mt-[30%]">
                                <div className="p-3 bg-blue-100 rounded-full mb-6">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                                    </svg>
                                </div>
                                <div>
                                    <h2 className="text-2xl font-bold text-gray-900 mb-4">Contact Numbers</h2>
                                    <div className="space-y-3 text-center">
                                        <p className="text-gray-700 font-medium hover:text-blue-600 transition-colors">
                                            General: +91 7058600679
                                        </p>
                                        <p className="text-gray-700 font-medium hover:text-blue-600 transition-colors">
                                            Office: +91 9272111777
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* WhatsApp Group Card */}
                    <div className="relative group">
                        <div className="absolute -inset-0.5 bg-gradient-to-r from-green-600 to-green-400 rounded-lg blur opacity-25 group-hover:opacity-75 transition duration-1000 group-hover:duration-200"></div>
                        <div className="relative bg-white rounded-lg p-8 transform transition duration-300 hover:-translate-y-1 hover:shadow-xl h-full ">
                            <div className="flex flex-col items-center lg:mt-[20%]">
                                <div className="p-3 bg-green-100 rounded-full mb-6">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a1.994 1.994 0 01-1.414-.586m0 0L11 14h4a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2v4l.586-.586z" />
                                    </svg>
                                </div>
                                <h2 className="text-2xl font-bold text-gray-900 mb-4">Join Our WhatsApp Group</h2>
                                <p className="text-gray-600 mb-6">Scan the QR code to join our community!</p>
                                <a
                                    href="https://chat.whatsapp.com/KlAdjB3KgIl8PUv3VQEy8g"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="transform transition-transform hover:scale-105"
                                >
                                    <img
                                        className="w-40 h-40 rounded-lg shadow-md"
                                        src="/Assets/Images/qr.jpeg"
                                        alt="WhatsApp QR Code"
                                    />
                                </a>
                            </div>
                        </div>
                    </div>

                    {/* Location Card */}
                    <div className="relative group">
                        <div className="absolute -inset-0.5 bg-gradient-to-r from-yellow-600 to-yellow-400 rounded-lg blur opacity-25 group-hover:opacity-75 transition duration-1000 group-hover:duration-200"></div>
                        <div className="relative bg-white rounded-lg p-8 transform transition duration-300 hover:-translate-y-1 hover:shadow-xl">
                            <div className="flex flex-col items-center">
                                <div className="p-3 bg-yellow-100 rounded-full mb-6">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-yellow-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                    </svg>
                                </div>
                                <h2 className="text-2xl font-bold text-gray-900 mb-4">Visit Us</h2>
                                <div className="text-center space-y-2 mb-6">
                                    <p className="text-gray-700 font-medium">150, Kolhapur - Sangli Hwy</p>
                                    <p className="text-gray-700 font-medium">near Juna पाटिल ढाबा, Halondi</p>
                                    <p className="text-gray-700 font-medium">Maharashtra 416116</p>
                                </div>
                                <div className="w-full overflow-hidden rounded-lg shadow-md">
                                    <iframe
                                        className="w-full h-48 border-0"
                                        src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3922.2366055831183!2d74.30603987481776!3d16.739467621607726!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bc10109ce728891%3A0x93fd2aa9da4338c8!2sNikhil%20Motors!5e0!3m2!1sen!2sin!4v1699874369004!5m2!1sen!2sin"
                                        allowFullScreen=""
                                        loading="lazy"
                                        title="Nikhil Motors Location"
                                    ></iframe>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ContactUs;