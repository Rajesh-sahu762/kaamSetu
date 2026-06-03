import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

import AuthHeader from "../../components/auth/AuthHeader";
import AuthFooter from "../../components/auth/AuthFooter";

import registerImage from "../../assets/images/customer-register.jpg";

const CustomerRegister = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    mobile: "",
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

    navigate("/verify-otp");
    
  };

  return (
    <section className="min-h-screen bg-[#f8f9ff] flex flex-col">

      <AuthHeader backPath="/join" />

      <main className="flex-1">

        <div className="grid lg:grid-cols-2 min-h-[650px]">

          {/* Left Image */}
          <div className="hidden lg:flex items-center justify-center">
            <img
              src={registerImage}
              alt="Kaamsetu"
              className="w-3/4 h-3/4 object-cover rounded"
            />
          </div>

          {/* Right Form */}
          <div className="flex items-center justify-center px-6 py-10">

            <div className="w-full max-w-md">

              <h1 className="text-4xl font-semibold text-[#091426]">
                Create an Account
              </h1>

              <p className="mt-4 text-[#45474c] leading-8">
                Join Kaamsetu to discover and book premium
                services with trusted artisans.
              </p>

              <form
                onSubmit={handleSubmit}
                className="mt-10"
              >

                {/* Name */}
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider mb-4">
                    Full Name
                  </label>

                  <input
                    type="text"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleChange}
                    placeholder="e.g. Eleanor Vance"
                    className="
                      w-full
                      border-0
                      border-b
                      border-[#c5c6cd]
                      bg-transparent
                      pb-3
                      focus:outline-none
                      focus:border-[#745a38]
                    "
                  />
                </div>

                {/* Email */}
                <div className="mt-8">
                  <label className="block text-xs font-semibold uppercase tracking-wider mb-4">
                    Email Address
                  </label>

                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="name@example.com"
                    className="
                      w-full
                      border-0
                      border-b
                      border-[#c5c6cd]
                      bg-transparent
                      pb-3
                      focus:outline-none
                      focus:border-[#745a38]
                    "
                  />
                </div>

                {/* Mobile */}
                <div className="mt-8">
                  <label className="block text-xs font-semibold uppercase tracking-wider mb-4">
                    Mobile Number
                  </label>

                  <input
                    type="tel"
                    name="mobile"
                    value={formData.mobile}
                    onChange={handleChange}
                    placeholder="+1 (555) 000-0000"
                    className="
                      w-full
                      border-0
                      border-b
                      border-[#c5c6cd]
                      bg-transparent
                      pb-3
                      focus:outline-none
                      focus:border-[#745a38]
                    "
                  />
                </div>

                {/* Terms */}
                <p className="mt-10 text-xs text-[#45474c] leading-6">
                  By continuing, you agree to Kaamsetu's{" "}
                  <button
                    type="button"
                    className="underline"
                  >
                    Terms of Service
                  </button>{" "}
                  and acknowledge our{" "}
                  <button
                    type="button"
                    className="underline"
                  >
                    Privacy Policy
                  </button>.
                </p>

                {/* Submit */}
                <button
                  type="submit"
                  className="
                    w-full
                    mt-8
                    bg-[#091426]
                    text-white
                    py-4
                    rounded
                    font-semibold
                    hover:opacity-95
                    transition
                  "
                >
                  Create Account
                </button>

              </form>

              {/* Login */}
              <div className="mt-10 pt-8 border-t border-[#d3e4fe] text-center">

                <p className="text-[#45474c]">
                  Already have an account?

                  <button
                    onClick={() =>
                      navigate("/login")
                    }
                    className="
                      ml-2
                      font-semibold
                      text-[#091426]
                    "
                  >
                    LOG IN
                  </button>

                </p>

              </div>

            </div>

          </div>

        </div>

      </main>

      <AuthFooter />

    </section>
  );
};

export default CustomerRegister;