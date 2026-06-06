import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import AuthProvider from './context/authContext'
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { VendorProvider } from './context/vendorContext'

createRoot(document.getElementById('root')).render(
  <AuthProvider>
    <VendorProvider>
    <App />
    <ToastContainer />

    </VendorProvider>
  </AuthProvider>,
)
