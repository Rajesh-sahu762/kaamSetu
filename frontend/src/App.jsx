import React from 'react'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import LoginView from './pages/Login/Login'


const App = () => {
  return (
    <>
      <BrowserRouter>
      <Routes>
        <Route path='/login' element={<LoginView />} />
      </Routes>
      </BrowserRouter>



    </>
  )
}

export default App
