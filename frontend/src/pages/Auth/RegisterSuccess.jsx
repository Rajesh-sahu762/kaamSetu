import React from "react";
import {
  FaShieldAlt,
} from "react-icons/fa";

import { MdVerified } from "react-icons/md";


import { FaCheckCircle } from "react-icons/fa";

import { useNavigate } from "react-router-dom";

import AuthHeader from "../../components/auth/AuthHeader";
import AuthFooter from "../../components/auth/AuthFooter";

import successImage from "../../assets/images/success-artisan.png";

const RegisterSuccess = () => {
  const navigate = useNavigate();

  return (
    <section className="min-h-screen bg-[#f8f9ff] flex flex-col">

      <AuthHeader showBack={false} />

      <main className="flex-1 flex items-center justify-center px-6 py-10">

        <div className="w-full max-w-4xl text-center">

          {/* Image Card */}
          <div className="relative inline-block">

            <div
              className="
                bg-white
                border
                border-[#d3e4fe]
                rounded-lg
                p-6
                shadow-sm
              "
            >
              <img
                src={successImage}
                alt="Success"
                className="
                  w-[220px]
                  md:w-[260px]
                  mx-auto
                "
              />
            </div>

            {/* Floating Badge */}
            <div
              className="
                absolute
                -top-4
                -right-4
                w-16
                h-16
                bg-[#8b6b3f]
                rounded-xl
                flex
                items-center
                justify-center
                shadow-lg
              "
            >
              <FaCheckCircle
                size={26}
                className="text-white"
              />
            </div>

          </div>

          {/* Heading */}
          <h1
            className="
              mt-12
              text-[42px]
              md:text-[64px]
              leading-tight
              font-semibold
              text-[#091426]
            "
          >
            Welcome to the
            <br />
            Network of Artisans
          </h1>

          {/* Description */}
          <p
            className="
              mt-6
              max-w-2xl
              mx-auto
              text-[#45474c]
              text-lg
              leading-9
            "
          >
            Your account has been created.
            You can now explore and book premium
            services from India's finest craftspeople.
            Excellence in every detail, guaranteed.
          </p>

          {/* Buttons */}
          <div
            className="
              mt-10
              flex
              flex-col
              md:flex-row
              justify-center
              gap-4
            "
          >

            <button
              onClick={() =>
                navigate("/services")
              }
              className="
                bg-[#091426]
                text-white
                px-10
                py-4
                rounded
                uppercase
                tracking-[0.15em]
                text-sm
                font-semibold
                shadow-md
              "
            >
              Start Exploring Services
            </button>

            <button
              onClick={() =>
                navigate("/dashboard/profile")
              }
              className="
                border
                border-[#7d8597]
                px-10
                py-4
                rounded
                uppercase
                tracking-[0.15em]
                text-sm
                font-semibold
                text-[#091426]
              "
            >
              Complete Your Profile
            </button>

          </div>

          {/* Benefits */}
          <div
            className="
              mt-12
              flex
              flex-wrap
              justify-center
              gap-8
              text-sm
              text-[#7d8597]
            "
          >

            <div className="flex items-center gap-2">
              <MdVerified className="text-[#8b6b3f]" />
              <span>Verified Professionals</span>
            </div>

            <div className="flex items-center gap-2">
              <FaShieldAlt className="text-[#8b6b3f]" />
              <span>Secure Booking</span>
            </div>

          </div>

        </div>

      </main>

      <AuthFooter />

    </section>
  );
};

export default RegisterSuccess;