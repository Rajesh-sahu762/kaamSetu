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
import CheckoutPage from '@/pages/client/CheckoutPage';
import BookingSuccess from '@/pages/client/BookingSuccess';
import TrackBookingPage from '@/pages/client/TrackBookingPage';
import MyBookingsPage from '@/pages/client/MyBookingsPage';
import CustomerProfilePage from '@/pages/client/CustomerProfilePage';
import NotificationsPage from '@/pages/client/NotificationsPage';
import WriteReviewPage from '@/pages/client/WriteReviewPage';
import SupportPage from '@/pages/client/SupportPage';
import NotFound from '@/pages/client/NotFound';


const AppRoutes = () => {
  return (
    <Routes>
        {/* Client */}
      <Route element={<ClientLayout />}>

      <Route path="/" element={<Home />} />
      <Route path='/services' element={<Services />} />
      <Route path='/experts' element={<Experts />} />
      <Route path='/expert/:id' element={<ExpertProfile />} />
      <Route path='/booking' element={<BookingPage />}  />
      <Route path='/checkout' element={<CheckoutPage />}  />
      <Route path='/booking-success' element={<BookingSuccess />}  />
      <Route path='/booking/:id' element={<TrackBookingPage />} />
      <Route path='/my-booking' element={<MyBookingsPage />} />
      <Route path='/profile' element={<CustomerProfilePage />} />
      <Route path='/notifications' element={<NotificationsPage />} />
      <Route path='/review/:bookingId' element={<WriteReviewPage />} />
      <Route path='/support' element={<SupportPage />} />
      <Route path='*' element={<NotFound />} />

      </Route>

      {/* Auth Routes */}
      <Route path="/login" element={<LoginView />} />
      <Route path="/join" element={<JoinKaamsetu />} />
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
      {/* <Route path="*" element={<LoginView /
      >} /> */} 
      <Route path="/verify-otp" element={<VerifyOtp />} />
      <Route path="/reset-password" element={<ResetPassword />} />
      <Route path="/register/customer" element={<CustomerRegister />} />
      <Route path="/register/success" element={<RegisterSuccess />} />
    </Routes>
  );
};

export default AppRoutes;
