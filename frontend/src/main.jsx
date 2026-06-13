// import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import AuthProvider from './context/authContext'
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { VendorProvider } from './context/vendorContext'
import { ThemeProvider } from './context/ThemeContext'
import { GoogleOAuthProvider } from "@react-oauth/google";

createRoot(document.getElementById('root')).render(
  <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID}>
  <AuthProvider>
    <VendorProvider>
      <ThemeProvider>

    <App />
    <ToastContainer />

      </ThemeProvider>
    </VendorProvider>
  </AuthProvider>
  </GoogleOAuthProvider>
)
