import { useState } from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import { SearchProvider } from "./context/SearchContext";
import Layout from "./components/Layout";
import Landing from "./pages/Landing";
import CarDetails from "./pages/CarDetails";
import Login from "./pages/Login";
import CarDetailsForm from "./pages/CarDetailsForm";
import DeleteCarDetails from "./pages/DeleteCarDetails";
import Dashboard from "./pages/Dashboard";
import AddNoticeImage from "./pages/AddNoticeImage";
import CustomerEnquiry from "./pages/CustomerEnquiry";
import CostReport from "./pages/CostReport";
import SellCarDetails from "./pages/SellCarDetails";
import DriverDashboard from "./pages/DriverDashboard";
import DriverOnsiteImagesAdd from "./components/DriverOnsiteImagesAdd";
import ProtectedRoute from "./Auth/ProtectedRoute";
import ProtectedUserRoute from "./Auth/ProtectedUserRoute";

const router = createBrowserRouter([
  {
    path: "/",
    element: (
      <Layout>
        <Landing />
      </Layout>
    ),
  },
  {
    path: "/car/:id",
    element: (
      <Layout>
        <CarDetails />
      </Layout>
    ),
  },
  {
    path: "/admin",
    element: (
      <Layout>
        <Login />
      </Layout>
    ),
  },
  {
    path: "/dashboard",
    element: (
      <ProtectedRoute>
        <ProtectedUserRoute requiredRoles={["admin", "employee"]}>
        <Layout>
          <Dashboard />
        </Layout>
        </ProtectedUserRoute>

      </ProtectedRoute>


    ),
  },
  {
    path: "/driverdashboard",
    element: (
      <ProtectedRoute>
        <ProtectedUserRoute requiredRoles={["driver", "admin" , "employee"]}>
        <Layout>
          <DriverDashboard />
        </Layout>
        </ProtectedUserRoute>
      </ProtectedRoute>
    ),
},
{
    path: "/driverdashboard/onsiteVehicleImages",
    element: (
      <ProtectedRoute>
        <ProtectedUserRoute requiredRoles={["driver", "admin" , "employee"]}>

        <Layout>
          <DriverOnsiteImagesAdd />
        </Layout>
        </ProtectedUserRoute >

      </ProtectedRoute>
    ),
},
  {
    path: "/dashboard/carDetailsForm",
    element: (
      <ProtectedRoute>
        <ProtectedUserRoute requiredRoles={["admin", "employee"]}>

        <Layout>
          <CarDetailsForm />
        </Layout>
        </ProtectedUserRoute>

      </ProtectedRoute>
    ),
  },
  {
    path: "/dashboard/DeleteCarDetails",
    element: (
      <ProtectedRoute>
        <ProtectedUserRoute requiredRoles={["admin", "employee"]}>
      
        <Layout>
          <DeleteCarDetails />
        </Layout>
        </ProtectedUserRoute>

      </ProtectedRoute>
      
    ),
  },
  {
    path: "/dashboard/customerEnquiry",
    element: (
      <ProtectedRoute>
        <ProtectedUserRoute requiredRoles={["admin", "employee"]}>

        <Layout>
          <CustomerEnquiry />
        </Layout>
        </ProtectedUserRoute>

      </ProtectedRoute>
    ),
  },
  {
    path: "/dashboard/addNoticeImage",
    element: (
      <ProtectedRoute>
        <ProtectedUserRoute requiredRoles={["admin", "employee"]}>

        <Layout>
          <AddNoticeImage />
        </Layout>
        </ProtectedUserRoute>

      </ProtectedRoute>
    ),
  },
  {
    path: "/dashboard/sellCarDetails",
    element: (
      <ProtectedRoute>
        <ProtectedUserRoute requiredRoles={["admin", "employee"]}>

        <Layout>
          <SellCarDetails />
        </Layout>
        </ProtectedUserRoute>

      </ProtectedRoute>
    ),
  },
  {
    path: "/costReport/:id",
    element: (
      <ProtectedRoute>
        <ProtectedUserRoute requiredRoles={["admin", "employee"]}>

        <Layout>
          <CostReport />
        </Layout>
        </ProtectedUserRoute>

      </ProtectedRoute>
    ),
  },
  {
    path: "*",
    element: (
      <Layout>
        <h1>Page Not Found</h1>
      </Layout>
    ),
  },
]);

function App() {
  return (
      <SearchProvider>
        <ToastContainer />
        <RouterProvider router={router} />
      </SearchProvider>
  );
}

export default App;
