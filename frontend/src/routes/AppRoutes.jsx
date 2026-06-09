import { Routes, Route } from 'react-router-dom';

import LoginView from '../pages/Auth/Login';
import JoinKaamsetu from '../pages/Auth/Role';
import VendorProfileStep1 from '../pages/Vendor/VendorProfile';
import VendorBusinessDetails from '../pages/Vendor/VendorBusinessDetails';
import VendorDocuments from '../pages/Vendor/VendorDocuments';
import VendorReview from '../pages/Vendor/VendorReview';
import VendorPendingApproval from '../pages/Vendor/VendorPendingApproval';
import ForgotPassword from '../pages/Auth/ForgotPassword';
import VerifyOtp from '../pages/Auth/VerifyOtp';
import ResetPassword from '../pages/Auth/ResetPassword';
import CustomerRegister from '../pages/Auth/CustomerRegister';
import RegisterSuccess from '../pages/Auth/RegisterSuccess';
import Home from '@/pages/client/home';
import ClientLayout from '@/layouts/ClientLayout';
import Services from '@/pages/client/services';
import Experts from '@/pages/client/experts';
import ExpertProfile from '@/pages/client/expertProfile';
import BookingPage from '@/pages/client/BookingPage';


const AppRoutes = () => {
  return (
    <Routes>
        {/* Client */}
      <Route element={<ClientLayout />}>

      <Route path="/" element={<Home />} />
      <Route path='/services' element={<Services />} />
      <Route path='/experts' element={<Experts />} />
      <Route path='/expertProfile' element={<ExpertProfile />} />
      <Route path='/booking' element={<BookingPage/>}  />
      </Route>

      {/* Auth Routes */}
      <Route path="/login" element={<LoginView />} />
      <Route path="/Join" element={<JoinKaamsetu />} />
      <Route path="/register/vendor/Profile" element={<VendorProfileStep1 />} />
      <Route
        path="/register/vendor/business"
        element={<VendorBusinessDetails />}
      />
      <Route path="/register/vendor/documents" element={<VendorDocuments />} />
      <Route path="/register/vendor/review" element={<VendorReview />} />
      <Route
        path="/register/vendor/pending"
        element={<VendorPendingApproval />}
      />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      {/* <Route path="*" element={<LoginView />} /> */}
      <Route path="/verify-otp" element={<VerifyOtp />} />
      <Route path="/reset-password" element={<ResetPassword />} />
      <Route path="/register/customer" element={<CustomerRegister />} />
      <Route path="/register/success" element={<RegisterSuccess />} />
    </Routes>
  );
};

export default AppRoutes;
