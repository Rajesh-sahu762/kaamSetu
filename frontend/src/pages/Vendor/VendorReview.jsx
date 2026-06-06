import AuthFooter from '@/components/auth/authFooter';
import AuthHeader from '@/components/auth/authHeader';
import ProgressBar from '@/components/auth/ProgressBar';
import React, { useState } from 'react';
import {
  FaArrowLeft,
  FaUserTie,
  FaMapMarkerAlt,
  FaFileAlt,
  FaCheckCircle,
} from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { useVendor } from '@/context/vendorContext';
import { toast } from 'react-toastify';
import { vendorRegister } from '@/services/authService';

const VendorReview = () => {
  const navigate = useNavigate();
    const { vendorData } = useVendor();
    
     console.log("REVIEW DATA", vendorData);
 
  const handleSubmit = async () => {
  try {
    const response =
      await vendorRegister(vendorData);

    toast.success(
      "Application submitted successfully"
    );

    console.log("Review Page:", vendorData);

    navigate(
      "/register/vendor/pending"
    );

  } catch (error) {

    toast.error(
      error.response?.data?.message
      || "Something went wrong"
    );

  }
};

  return (
    <section className="min-h-screen bg-[#f8f9ff] flex flex-col">
      {/* Header */}

      <AuthHeader />

      {/* Main */}
      <main className="flex-1 max-w-6xl mx-auto w-full px-4 md:px-8 py-8 md:py-12">
        {/* Progress */}
        <ProgressBar
          step={4}
          totalSteps={4}
          title={'Review Your Application'}
        />
        {/* Title */}
        <div className="max-w-3xl mx-auto text-center mb-10">
          <h2 className="text-3xl md:text-4xl font-semibold text-[#091426]">
            Review Your Application
          </h2>

          <p className="mt-3 text-[#45474c]">
            Please verify all information before submitting your application for
            approval.
          </p>
        </div>

        {/* Card */}
        <div className="max-w-3xl mx-auto bg-white border border-[#d3e4fe] rounded-lg shadow-sm overflow-hidden">
          {/* Professional Profile */}
          <div className="p-6 md:p-8 border-b border-[#d3e4fe]">
            <div className="flex items-center gap-3 mb-6">
              <FaUserTie className="text-[#745a38]" />
              <h3 className="text-xl font-semibold text-[#091426]">
                Professional Profile
              </h3>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <Info label="Full Name" value={vendorData.fullName} />

              <Info label="Business Name" value={vendorData.businessName} />

              <Info label="Category" value={vendorData.businessType} />
            </div>
          </div>

          {/* Business Details */}
          <div className="p-6 md:p-8 border-b border-[#d3e4fe]">
            <div className="flex items-center gap-3 mb-6">
              <FaMapMarkerAlt className="text-[#745a38]" />
              <h3 className="text-xl font-semibold text-[#091426]">
                Business Details
              </h3>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <Info label="Address" value={vendorData.address} />

              <Info label="City" value={vendorData.city} />

              <Info label="State" value={vendorData.state} />

              <Info label="Pincode" value={vendorData.pincode} />

              <Info label="Experience" value={vendorData.experience} />

              <Info label="Service Radius" value={vendorData.radius} />
            </div>
          </div>

          {/* Documents */}
          <div className="p-6 md:p-8">
            <div className="flex items-center gap-3 mb-6">
              <FaFileAlt className="text-[#745a38]" />
              <h3 className="text-xl font-semibold text-[#091426]">
                Uploaded Documents
              </h3>
            </div>

            <div className="space-y-4">
              <DocumentItem title="Profile Photo" />
              <DocumentItem title="Aadhaar Card" />
              <DocumentItem title="PAN Card" />
            </div>
          </div>
        </div>

        {/* Terms */}
        <div className="max-w-3xl mx-auto mt-8 bg-[#e5eeff] border border-[#d3e4fe] p-4 rounded">
          <p className="text-sm text-[#091426]">
            By submitting this application, you confirm that all information
            provided is accurate and that you agree to Kaamsetu's verification
            process and platform policies.
          </p>
        </div>

        {/* Buttons */}
        <div className="max-w-3xl mx-auto mt-10 flex flex-col sm:flex-row gap-4 justify-between">
          <button
            onClick={() => navigate('/register/vendor/documents')}
            className="
              border border-[#d3e4fe]
              px-8
              py-4
              rounded
              text-[#091426]
            "
          >
            Back
          </button>

          <button
            onClick={handleSubmit}
            className="
              bg-[#091426]
              text-white
              px-10
              py-4
              uppercase
              tracking-[0.15em]
              text-sm
              font-semibold
              rounded
              hover:opacity-95
              transition
            "
          >
            Submit Application
          </button>
        </div>
      </main>

      {/* Footer */}
      <AuthFooter />
    </section>
  );
};

const Info = ({ label, value }) => (
  <div>
    <p className="text-xs uppercase tracking-wider text-[#45474c] mb-1">
      {label}
    </p>

    <p className="font-medium text-[#091426]">{value}</p>
  </div>
);

const DocumentItem = ({ title }) => (
  <div className="flex items-center justify-between border border-[#d3e4fe] rounded p-4">
    <span>{title}</span>

    <div className="flex items-center gap-2 text-green-600">
      <FaCheckCircle />
      <span className="text-sm">Uploaded</span>
    </div>
  </div>
);

export default VendorReview;
