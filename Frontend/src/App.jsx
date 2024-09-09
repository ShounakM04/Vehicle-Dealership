  import { useState } from 'react'
  import './App.css'
  import {
    createBrowserRouter,
    RouterProvider,
  } from "react-router-dom";
import Layout from './components/Layout';
import Landing from './components/Landing';
import CarDetails from './components/CarDetails';

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
