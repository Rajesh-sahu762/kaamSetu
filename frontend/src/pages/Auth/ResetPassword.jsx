import React, { useState } from "react";
import {
  FaArrowRight,
  FaRedoAlt,
} from "react-icons/fa";

import {
  FiEye,
  FiEyeOff,
} from "react-icons/fi";

import { useNavigate } from "react-router-dom";

import AuthHeader from "../../components/auth/AuthHeader";
import AuthFooter from "../../components/auth/AuthFooter";

const ResetPassword = () => {
  const navigate = useNavigate();

  const [showPassword, setShowPassword] =
    useState(false);

  const [
    showConfirmPassword,
    setShowConfirmPassword,
  ] = useState(false);

  const [formData, setFormData] = useState({
    password: "",
    confirmPassword: "",
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (
      formData.password !==
      formData.confirmPassword
    ) {
      alert("Passwords do not match");
      return;
    }

    // API Call

    navigate("/login");
  };

  return (
    <section className="min-h-screen bg-card flex flex-col">

      <AuthHeader />

      <main className="flex-1 flex items-center justify-center px-4 py-10">

        <div className="w-full max-w-[520px] bg-card border border-theme rounded-lg p-6 md:p-10 shadow-sm">

          {/* Icon */}
          <div className="flex justify-center">

            <div className="w-16 h-16 rounded-xl bg-[#e5eeff] flex items-center justify-center">

              <FaRedoAlt
                size={20}
                className="text-primary"
              />

            </div>

          </div>

          {/* Heading */}
          <div className="text-center mt-8">

            <h1 className="text-4xl font-semibold text-primary">
              Set New Password
            </h1>

            <p className="mt-4 text-muted leading-7">
              Please create a strong, secure password
              for your account.
            </p>

          </div>

          {/* Form */}
          <form
            onSubmit={handleSubmit}
            className="mt-10"
          >

            {/* Password */}
            <div>

              <label className="block text-xs font-semibold uppercase tracking-wider text-muted mb-4">
                New Password
              </label>

              <div className="relative">

                <input
                  type={
                    showPassword
                      ? "text"
                      : "password"
                  }
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Enter your new password"
                  className="
                    w-full
                    bg-transparent
                    border-0
                    border-b
                    border-[#c5c6cd]
                    pb-3
                    pr-10
                    focus:outline-none
                    focus:border-[#745a38]
                  "
                />

                <button
                  type="button"
                  onClick={() =>
                    setShowPassword(
                      !showPassword
                    )
                  }
                  className="
                    absolute
                    right-0
                    top-0
                    text-[#7d8597]
                  "
                >
                  {showPassword ? (
                    <FiEye />
                  ) : (
                    <FiEyeOff />
                  )}
                </button>

              </div>

            </div>

            {/* Confirm Password */}
            <div className="mt-8">

              <label className="block text-xs font-semibold uppercase tracking-wider text-muted mb-4">
                Confirm Password
              </label>

              <div className="relative">

                <input
                  type={
                    showConfirmPassword
                      ? "text"
                      : "password"
                  }
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  placeholder="Re-enter your new password"
                  className="
                    w-full
                    bg-transparent
                    border-0
                    border-b
                    border-[#c5c6cd]
                    pb-3
                    pr-10
                    focus:outline-none
                    focus:border-[#745a38]
                  "
                />

                <button
                  type="button"
                  onClick={() =>
                    setShowConfirmPassword(
                      !showConfirmPassword
                    )
                  }
                  className="
                    absolute
                    right-0
                    top-0
                    text-[#7d8597]
                  "
                >
                  {showConfirmPassword ? (
                    <FiEye />
                  ) : (
                    <FiEyeOff />
                  )}
                </button>

              </div>

            </div>

            {/* Note */}
            <p className="mt-8 text-xs text-muted leading-5">
              Password must be at least 8 characters
              long and include a mix of letters,
              numbers, and symbols.
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
                uppercase
                tracking-[0.15em]
                text-sm
                font-semibold
                hover:opacity-95
                transition
                flex
                items-center
                justify-center
                gap-3
              "
            >
              Update Password
              <FaArrowRight size={12} />
            </button>

          </form>

        </div>

      </main>

      <AuthFooter />

    </section>
  );
};

export default ResetPassword;