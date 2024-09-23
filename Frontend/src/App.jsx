import { useState } from 'react'
import './App.css'
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import Layout from './components/Layout';
import Landing from './pages/Landing';
import CarDetails from './pages/CarDetails';
import Login from './pages/Login';
import CarDetailsForm  from "./pages/CarDetailsForm"
import DeleteCarDetails from './pages/DeleteCarDetails';
import Dashboard from './pages/Dashboard';
  const router = createBrowserRouter([
    {
      path:"/",
      element:(
        <Layout>
          <Landing/>
        </Layout>
      )
    },
    {
      path:"car/:id",
      element:(
        <Layout>
          <CarDetails/>
        </Layout>
      )


    },{
      path:"/admin",
      element:(
        <Layout>
          <Login/>
        </Layout>
      )
    },
    {
      path:"/dashboard",
      element:(
        <Layout>
          <Dashboard/>
        </Layout>
      )
    },
    {
      path:"/details/carDetailsForm",
      element:(
        <Layout>
          <CarDetailsForm/>
        </Layout>
      )
    },
    {
      path:"/details/DeleteCarDetails",
      element:(
        <Layout>
          <DeleteCarDetails/>
        </Layout>
      )
    },
    {
      path: "*",
      element: () => <h1>Page Not Found</h1>
    }
  ])

  function App() {
      return (
      <>
        <>
          <RouterProvider router={router} />
        </>
      </>
    )
  }

  export default App
