import React, { useState } from "react";
import { FaArrowLeft, FaShieldAlt, FaCloudUploadAlt } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

const VendorDocuments = () => {
  const navigate = useNavigate();

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

    // API Call Here

    navigate("/register/vendor/review");
  };

  const UploadBox = ({
    title,
    subtitle,
    name,
    file,
  }) => (
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
        <FaCloudUploadAlt
          size={28}
          className="text-[#745a38]"
        />

        <p className="mt-3 text-sm font-medium text-center">
          {file ? file.name : subtitle}
        </p>

        <span className="text-xs text-[#45474c] mt-2">
          JPG, PNG or PDF
        </span>
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
      <header className="border-b border-[#d3e4fe] bg-white">
        <div className="max-w-6xl mx-auto px-4 md:px-8 h-16 flex items-center justify-between">

          <button
            onClick={() =>
              navigate("/register/vendor/business")
            }
            className="w-10 h-10 border border-[#d3e4fe] rounded flex items-center justify-center"
          >
            <FaArrowLeft />
          </button>

          <h1 className="tracking-[0.25em] text-sm font-medium">
            KAAMSETU
          </h1>

          <button className="text-sm font-medium">
            Support
          </button>

        </div>
      </header>

      {/* Content */}
      <main className="flex-1 max-w-6xl mx-auto w-full px-4 md:px-8 py-8 md:py-12">

        {/* Progress */}
        <div className="max-w-3xl mx-auto mb-12">

          <div className="flex justify-between text-xs font-semibold mb-2">
            <span>Step 3 of 4</span>
            <span>Document Verification</span>
          </div>

          <div className="h-[3px] bg-[#d3e4fe] rounded-full overflow-hidden">
            <div className="h-full w-3/4 bg-[#091426]"></div>
          </div>

        </div>

        {/* Heading */}
        <div className="max-w-3xl mx-auto text-center mb-10">

          <h2 className="text-3xl md:text-4xl font-semibold text-[#091426]">
            Verify Your Identity
          </h2>

          <p className="mt-3 text-[#45474c]">
            Upload the required documents for manual
            verification by our team.
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
                Your documents are securely stored and
                reviewed only for verification purposes.
              </p>

            </div>

            {/* Buttons */}
            <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-between">

              <button
                type="button"
                onClick={() =>
                  navigate("/register/vendor/business")
                }
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

    </section>
  );
};

export default VendorDocuments;