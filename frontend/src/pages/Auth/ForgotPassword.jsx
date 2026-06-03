import React, { useState } from 'react';
import { FaArrowRight } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

import AuthHeader from '../../components/auth/AuthHeader';
import AuthFooter from '../../components/auth/AuthFooter';

const ForgotPassword = () => {
  const navigate = useNavigate();

  const [email, setEmail] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();

    // API Call

    navigate('/verify-otp');
  };

  return (
    <section className="min-h-screen bg-[#f8f9ff] flex flex-col">
      <AuthHeader />

      <main className="flex-1 flex items-center justify-center px-6 py-10">
        <div className="w-full max-w-[520px]">
          {/* Heading */}
          <div className="text-center md:text-left">
            <h1 className="text-[42px] md:text-[56px] font-semibold text-[#091426] leading-tight">
              Reset Password
            </h1>

            <p className="mt-5 text-[#45474c] text-[16px] leading-8">
              Enter the email address associated with your account, and we will
              send you secure instructions to reset your password.
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="mt-12">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-[#45474c] mb-4">
                Email Address
              </label>

              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@example.com"
                className="
                  w-full
                  bg-transparent
                  border-0
                  border-b
                  border-[#c5c6cd]
                  px-0
                  pb-3
                  text-[#091426]
                  placeholder:text-[#c5c6cd]
                  focus:outline-none
                  focus:border-[#745a38]
                "
              />
            </div>

            {/* Submit */}
            <button
              type="submit"
              className="
                w-full
                mt-10
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
              Send Reset Link
              <FaArrowRight size={12} />
            </button>

            
          </form>
        </div>
      </main>

      <AuthFooter />
    </section>
  );
};

export default ForgotPassword;
