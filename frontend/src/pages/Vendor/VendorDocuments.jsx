import AuthFooter from '@/components/auth/authFooter';
import AuthHeader from '@/components/auth/authHeader';
import ProgressBar from '@/components/auth/ProgressBar';
import React, { useState } from 'react';
import { FaArrowLeft, FaShieldAlt, FaCloudUploadAlt } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { useVendor } from '@/context/vendorContext';

const VendorDocuments = () => {
  const navigate = useNavigate();
  const { vendorData, updateVendorData } = useVendor();

  const [documents, setDocuments] = useState({
    profilePhoto: null,
    aadhaar: null,
    pan: null,
  });

  const handleFileChange = (e) => {
    const { name, files } = e.target;

    setDocuments({
      ...documents,
      [name]: files[0],
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    updateVendorData({
      aadhaarImage: documents.aadhaar?.name,

      panImage: documents.pan?.name,
    });

    console.log('Documents Page:', vendorData);
    navigate('/register/vendor/review');
  };

  const UploadBox = ({ title, subtitle, name, file }) => (
    <div>
      <label className="block text-xs font-semibold uppercase tracking-wider mb-3">
        {title}
      </label>

      <label
        htmlFor={name}
        className="
          border-2 border-dashed border-[#d3e4fe]
          rounded-lg
          p-6
          flex
          flex-col
          items-center
          justify-center
          cursor-pointer
          hover:bg-[#eff4ff]
          transition
        "
      >
        <FaCloudUploadAlt size={28} className="text-[#745a38]" />

        <p className="mt-3 text-sm font-medium text-center">
          {file ? file.name : subtitle}
        </p>

        <span className="text-xs text-[#45474c] mt-2">JPG, PNG or PDF</span>
      </label>

      <input
        id={name}
        name={name}
        type="file"
        className="hidden"
        onChange={handleFileChange}
      />
    </div>
  );

  return (
    <section className="min-h-screen bg-[#f8f9ff] flex flex-col">
      {/* Header */}
      <AuthHeader />
      {/* Content */}
      <main className="flex-1 max-w-6xl mx-auto w-full px-4 md:px-8 py-8 md:py-12">
        {/* Progress */}
        <ProgressBar step={3} totalSteps={4} title={'Verify Your Identity'} />

        {/* Heading */}
        <div className="max-w-3xl mx-auto text-center mb-10">
          <h2 className="text-3xl md:text-4xl font-semibold text-[#091426]">
            Verify Your Identity
          </h2>

          <p className="mt-3 text-[#45474c]">
            Upload the required documents for manual verification by our team.
          </p>
        </div>

        {/* Card */}
        <div className="max-w-3xl mx-auto bg-white border border-[#d3e4fe] rounded-lg p-6 md:p-10 shadow-sm">
          <form onSubmit={handleSubmit}>
            <div className="grid md:grid-cols-2 gap-8">
              <UploadBox
                title="Profile Photo"
                subtitle="Upload profile image"
                name="profilePhoto"
                file={documents.profilePhoto}
              />

              <UploadBox
                title="Aadhaar Card"
                subtitle="Upload Aadhaar card"
                name="aadhaar"
                file={documents.aadhaar}
              />

              <div className="md:col-span-2">
                <UploadBox
                  title="PAN Card"
                  subtitle="Upload PAN card"
                  name="pan"
                  file={documents.pan}
                />
              </div>
            </div>

            {/* Info Box */}
            <div className="mt-8 bg-[#e5eeff] border border-[#d3e4fe] p-4 flex gap-3 items-start">
              <FaShieldAlt className="text-[#745a38] mt-1" />

              <p className="text-sm text-[#091426]">
                Your documents are securely stored and reviewed only for
                verification purposes.
              </p>
            </div>

            {/* Buttons */}
            <div className="mt-10 flex justify-end">
              <button
                type="submit"
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
                Continue →
              </button>
            </div>
          </form>
        </div>
      </main>

      {/* Footer */}
      <AuthFooter />
    </section>
  );
};

export default VendorDocuments;
