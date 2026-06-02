import React, { useState } from "react";
import { FaUserTie } from "react-icons/fa";
import { MdStorefront } from "react-icons/md";
import { useNavigate } from "react-router-dom";

const JoinKaamsetu = () => {
  const [selectedRole, setSelectedRole] = useState("");
  const navigate = useNavigate();

  const handleContinue = () => {
    if (selectedRole === "customer") {
      navigate("/register/customer");
    }

    if (selectedRole === "vendor") {
      navigate("/register/vendor/Profile");
    }
  };

  const roles = [
    {
      id: "customer",
      title: "I want to hire services",
      description:
        "Discover and book verified, high-quality professionals for your specific needs. Experience seamless service delivery.",
      icon: FaUserTie,
    },
    {
      id: "vendor",
      title: "I want to provide services",
      description:
        "Join our curated network of premium craftspeople. Manage your bookings, build your reputation, and grow your business.",
      icon: MdStorefront,
    },
  ];

  return (
    <section className="min-h-screen bg-[#f8f9ff] px-4 py-8 md:py-16">
      <div className="max-w-6xl mx-auto">

        {/* Logo */}
        <div className="text-center">
          <h2 className="text-sm tracking-[0.25em] text-[#091426] font-medium">
            KAAMSETU
          </h2>
        </div>

        {/* Heading */}
        <div className="text-center mt-8 md:mt-12">
          <h1 className="text-[38px] md:text-[56px] font-semibold text-[#091426]">
            Join Kaamsetu
          </h1>

          <p className="max-w-xl mx-auto mt-4 text-[#45474c] text-base md:text-lg leading-relaxed">
            Select how you would like to use our platform.
            You can always change this later in your account settings.
          </p>
        </div>

        {/* Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 mt-12 md:mt-16">

          {roles.map((role) => {
            const Icon = role.icon;

            return (
              <button
                key={role.id}
                onClick={() => setSelectedRole(role.id)}
                className={`
                  relative
                  bg-white
                  border
                  rounded-xl
                  p-7
                  text-left
                  transition-all
                  duration-300
                  hover:shadow-lg
                  min-h-[260px]

                  ${
                    selectedRole === role.id
                      ? "border-[#745a38] ring-2 ring-[#745a38]/20"
                      : "border-[#d3e4fe]"
                  }
                `}
              >
                {/* Icon */}
                <div className="w-14 h-14 rounded-xl bg-[#e5eeff] flex items-center justify-center">
                  <Icon
                    size={24}
                    className="text-[#091426]"
                  />
                </div>

                {/* Radio */}
                <div className="absolute top-7 right-7">
                  <div
                    className={`
                      w-6 h-6 rounded-full border-2 flex items-center justify-center

                      ${
                        selectedRole === role.id
                          ? "border-[#745a38]"
                          : "border-gray-300"
                      }
                    `}
                  >
                    {selectedRole === role.id && (
                      <div className="w-3 h-3 bg-[#745a38] rounded-full"></div>
                    )}
                  </div>
                </div>

                {/* Content */}
                <h3 className="mt-8 text-3xl font-semibold text-[#091426]">
                  {role.title}
                </h3>

                <p className="mt-4 text-[#45474c] leading-8 text-lg">
                  {role.description}
                </p>
              </button>
            );
          })}
        </div>

        {/* Continue Button */}
        {selectedRole && (
          <div className="flex justify-center mt-10">
            <button
              onClick={handleContinue}
              className="
                bg-[#091426]
                text-white
                px-10
                py-4
                rounded-md
                uppercase
                tracking-[0.15em]
                text-sm
                font-semibold
                hover:opacity-95
                transition
              "
            >
              Continue
            </button>
          </div>
        )}

        {/* Login Link */}
        <div className="text-center mt-12">
          <p className="text-[#45474c]">
            Already have an account?
            <button
              onClick={() => navigate("/login")}
              className="ml-1 font-semibold text-[#091426] hover:text-[#745a38]"
            >
              Sign in
            </button>
          </p>
        </div>

      </div>
    </section>
  );
};

export default JoinKaamsetu;