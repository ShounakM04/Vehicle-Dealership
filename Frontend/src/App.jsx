  import { useState } from 'react'
  import './App.css'
  import {
    createBrowserRouter,
    RouterProvider,
  } from "react-router-dom";
import Layout from './components/Layout';
import Landing from './components/Landing';
import CarDetails from './components/CarDetails';
import Login from './components/Login';
import CarDetailsForm  from "./components/CarDetailsForm"

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
      path:"/details/carDetailsForm",
      element:(
        <Layout>
          <CarDetailsForm/>
        </Layout>
      )
    },
    {
      path: "*",
      element: () => <h1>Page Not Found</h1>  // 404 page component
    }
  ])

  function App() {
      return (
      <>
        <RouterProvider router={router} />
      </>
    )
  }

  export default App
