import AuthFooter from "@/components/auth/authFooter";
import AuthHeader from "@/components/auth/authHeader";
import ProgressBar from "@/components/auth/ProgressBar";
import React, { useState } from "react";
import { FaShieldAlt } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

const VendorBusinessDetails = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    address: "",
    city: "",
    state: "",
    pincode: "",
    experience: "",
    serviceRadius: "",
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // API Call

    navigate("/register/vendor/documents");
  };

  return (
    <section className="min-h-screen bg-[#f8f9ff] flex flex-col">
      {/* Header */}
      <AuthHeader />

      {/* Content */}
      <main className="flex-1 max-w-6xl mx-auto w-full px-4 md:px-8 py-8 md:py-12">

        {/* Progress */}
        <ProgressBar step={2} totalSteps={4} title={"Business Details"} />

        {/* Heading */}
        <div className="max-w-3xl mx-auto text-center mb-10">
          <h2 className="text-3xl md:text-4xl font-semibold text-[#091426]">
            Business Details
          </h2>

          <p className="mt-3 text-[#45474c]">
            Help customers discover and connect with your services.
          </p>
        </div>

        {/* Form Card */}
        <div className="max-w-3xl mx-auto bg-white border border-[#d3e4fe] rounded-lg p-6 md:p-10 shadow-sm">

          <form onSubmit={handleSubmit}>
            <div className="grid md:grid-cols-2 gap-8">

              {/* Address */}
              <div className="md:col-span-2">
                <label className="block text-xs font-semibold uppercase tracking-wider mb-3">
                  Business Address
                </label>

                <input
                  type="text"
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  placeholder="Enter your business address"
                  className="w-full border-b border-[#c5c6cd] pb-3 focus:outline-none focus:border-[#745a38]"
                />
              </div>

              {/* City */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider mb-3">
                  City
                </label>

                <input
                  type="text"
                  name="city"
                  value={formData.city}
                  onChange={handleChange}
                  placeholder="Bhilwara"
                  className="w-full border-b border-[#c5c6cd] pb-3 focus:outline-none focus:border-[#745a38]"
                />
              </div>

              {/* State */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider mb-3">
                  State
                </label>

                <input
                  type="text"
                  name="state"
                  value={formData.state}
                  onChange={handleChange}
                  placeholder="Rajasthan"
                  className="w-full border-b border-[#c5c6cd] pb-3 focus:outline-none focus:border-[#745a38]"
                />
              </div>

              {/* Pincode */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider mb-3">
                  Pincode
                </label>

                <input
                  type="text"
                  name="pincode"
                  value={formData.pincode}
                  onChange={handleChange}
                  placeholder="311001"
                  className="w-full border-b border-[#c5c6cd] pb-3 focus:outline-none focus:border-[#745a38]"
                />
              </div>

              {/* Experience */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider mb-3">
                  Experience
                </label>

                <select
                  name="experience"
                  value={formData.experience}
                  onChange={handleChange}
                  className="w-full border-b border-[#c5c6cd] pb-3 bg-transparent focus:outline-none focus:border-[#745a38]"
                >
                  <option value="">Select Experience</option>
                  <option>0-1 Years</option>
                  <option>1-3 Years</option>
                  <option>3-5 Years</option>
                  <option>5-10 Years</option>
                  <option>10+ Years</option>
                </select>
              </div>

              {/* Radius */}
              <div className="md:col-span-2">
                <label className="block text-xs font-semibold uppercase tracking-wider mb-3">
                  Service Radius (KM)
                </label>

                <input
                  type="number"
                  name="serviceRadius"
                  value={formData.serviceRadius}
                  onChange={handleChange}
                  placeholder="50"
                  className="w-full border-b border-[#c5c6cd] pb-3 focus:outline-none focus:border-[#745a38]"
                />
              </div>
            </div>

            {/* Info Box */}
            <div className="mt-8 bg-[#e5eeff] border border-[#d3e4fe] p-4 flex gap-3 items-start">
              <FaShieldAlt className="text-[#745a38] mt-1" />

              <p className="text-sm text-[#091426]">
                These details help customers find services near
                their location and improve your visibility.
              </p>
            </div>

            {/* Buttons */}
            <div className="mt-10 flex justify-end">

           
              <button
                type="submit"
                className="
                    cursor-pointer
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

export default VendorBusinessDetails;