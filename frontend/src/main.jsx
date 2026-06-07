import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import AuthProvider from './context/authContext'
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { VendorProvider } from './context/vendorContext'
import { ThemeProvider } from './context/ThemeContext'

createRoot(document.getElementById('root')).render(
  <AuthProvider>
    <VendorProvider>
      <ThemeProvider>

    <App />
    <ToastContainer />

      </ThemeProvider>
    </VendorProvider>
  </AuthProvider>,
)
