import React from 'react'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import LoginView from './pages/Auth/Login'
import JoinKaamsetu from './pages/Auth/Role'
import VendorProfileStep1 from './pages/Vendor/VendorProfile'
import VendorBusinessDetails from './pages/Vendor/VendorBusinessDetails'
import VendorDocuments from './pages/Vendor/VendorDocuments'
import VendorReview from './pages/Vendor/VendorReview'
import VendorPendingApproval from './pages/Vendor/VendorPendingApproval'



const App = () => {
  return (
    <>
      <BrowserRouter>
      <Routes>
        <Route path='/login' element={<LoginView />} />
        <Route path='/Join' element={<JoinKaamsetu />} />
        <Route path='/register/vendor/Profile' element={<VendorProfileStep1 />} />
        <Route
  path="/register/vendor/business"
  element={<VendorBusinessDetails />}
/>
<Route
  path="/register/vendor/documents"
  element={<VendorDocuments />}
/>
<Route
  path="/register/vendor/review"
  element={<VendorReview />}
/>
<Route path="/register/vendor/pending" element={<VendorPendingApproval />} />
      </Routes>
      </BrowserRouter>



    </>
  )
}

export default App
