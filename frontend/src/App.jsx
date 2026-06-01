import React from 'react'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import LoginView from './pages/Login'
import JoinKaamsetu from './pages/Role'
import VendorProfileStep1 from './pages/Vendor/VendorProfile'


const App = () => {
  return (
    <>
      <BrowserRouter>
      <Routes>
        <Route path='/login' element={<LoginView />} />
        <Route path='/Join' element={<JoinKaamsetu />} />
        <Route path='/register/vendor/Profile' element={<VendorProfileStep1 />} />
      </Routes>
      </BrowserRouter>



    </>
  )
}

export default App
