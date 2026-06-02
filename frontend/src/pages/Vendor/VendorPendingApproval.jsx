import React from "react";
import {
  FaCheckCircle,
  FaClock,
  FaHeadset,
} from "react-icons/fa";
import { useNavigate } from "react-router-dom";

const VendorPendingApproval = () => {
  const navigate = useNavigate();

  return (
    <section className="min-h-screen bg-[#f8f9ff] flex flex-col">

      {/* Header */}
      <header className="border-b border-[#d3e4fe] bg-white">
        <div className="max-w-6xl mx-auto px-4 md:px-8 h-16 flex items-center justify-center">

          <h1 className="tracking-[0.25em] text-sm font-medium text-[#091426]">
            KAAMSETU
          </h1>

        </div>
      </header>

      {/* Main */}
      <main className="flex-1 flex items-center justify-center px-4 py-12">

        <div className="w-full max-w-3xl">

          {/* Success Card */}
          <div className="bg-white border border-[#d3e4fe] rounded-lg shadow-sm p-8 md:p-12 text-center">

            {/* Icon */}
            <div className="flex justify-center mb-8">

              <div className="w-24 h-24 rounded-full bg-[#e5eeff] flex items-center justify-center">

                <FaCheckCircle
                  size={42}
                  className="text-[#745a38]"
                />

              </div>

            </div>

            {/* Title */}
            <h2 className="text-3xl md:text-5xl font-semibold text-[#091426]">
              Application Submitted
            </h2>

            {/* Subtitle */}
            <p className="mt-5 text-[#45474c] text-base md:text-lg leading-relaxed max-w-xl mx-auto">
              Thank you for joining Kaamsetu.
              Your application has been successfully submitted
              and is now under review by our verification team.
            </p>

            {/* Timeline Box */}
            <div className="mt-10 bg-[#eff4ff] border border-[#d3e4fe] rounded-lg p-6">

              <div className="flex items-center justify-center gap-3">

                <FaClock className="text-[#745a38]" />

                <span className="font-medium text-[#091426]">
                  Estimated Review Time: 24 - 48 Hours
                </span>

              </div>

            </div>

            {/* What Happens Next */}
            <div className="mt-10 text-left">

              <h3 className="text-lg font-semibold text-[#091426] mb-5">
                What Happens Next?
              </h3>

              <div className="space-y-4">

                <div className="flex gap-3">
                  <span className="font-semibold text-[#745a38]">
                    1.
                  </span>

                  <p className="text-[#45474c]">
                    Our team will verify your profile and
                    uploaded documents.
                  </p>
                </div>

                <div className="flex gap-3">
                  <span className="font-semibold text-[#745a38]">
                    2.
                  </span>

                  <p className="text-[#45474c]">
                    We may contact you if additional
                    information is required.
                  </p>
                </div>

                <div className="flex gap-3">
                  <span className="font-semibold text-[#745a38]">
                    3.
                  </span>

                  <p className="text-[#45474c]">
                    Once approved, you'll receive an email
                    and gain access to your Vendor Dashboard.
                  </p>
                </div>

              </div>

            </div>

            {/* Support Box */}
            <div className="mt-10 bg-[#e5eeff] border border-[#d3e4fe] rounded-lg p-4 flex items-start gap-3">

              <FaHeadset className="text-[#745a38] mt-1" />

              <p className="text-sm text-[#091426] text-left">
                Need help? Contact our support team anytime.
                We're here to assist you throughout the
                onboarding process.
              </p>

            </div>

            {/* Actions */}
            <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center">

              <button
                onClick={() => navigate("/")}
                className="
                  bg-[#091426]
                  text-white
                  px-8
                  py-4
                  rounded
                  uppercase
                  tracking-[0.15em]
                  text-sm
                  font-semibold
                  hover:opacity-95
                  transition
                "
              >
                Go To Homepage
              </button>

              <button
                onClick={() => navigate("/login")}
                className="
                  border
                  border-[#d3e4fe]
                  px-8
                  py-4
                  rounded
                  text-[#091426]
                  hover:bg-[#eff4ff]
                  transition
                "
              >
                Sign In
              </button>

            </div>

          </div>

        </div>

      </main>

      {/* Footer */}
      <footer className="border-t border-[#d3e4fe] bg-white py-6">
        <div className="max-w-6xl mx-auto px-4 md:px-8 flex flex-col md:flex-row justify-between items-center gap-4 text-sm">

          <p>
            © 2026 Kaamsetu. Excellence in Craftsmanship.
          </p>

          <div className="flex gap-6">
            <a href="#">Privacy Policy</a>
            <a href="#">Terms of Service</a>
            <a href="#">Help Center</a>
          </div>

        </div>
      </footer>

    </section>
  );
};

export default VendorPendingApproval;