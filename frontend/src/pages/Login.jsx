import React from "react";
import { FaGoogle } from "react-icons/fa";
import { FaApple } from "react-icons/fa";

const Login = () => {
  return (
    <section className="min-h-screen bg-[#f8f9ff] flex items-center justify-center px-4 py-8">
      <div className="w-full max-w-[520px] bg-white border border-[#d3e4fe] rounded-lg shadow-[0_4px_20px_rgba(9,20,38,0.05)] p-6 sm:p-8 md:p-12">
        
        {/* Header */}
        <div className="text-center mb-10">
          <h1 className="text-[38px] md:text-[52px] font-semibold text-[#091426] tracking-tight">
            Welcome back
          </h1>

          <p className="mt-3 text-[16px] md:text-[18px] text-[#45474c]">
            Sign in to your Kaamsetu account.
          </p>
        </div>

        {/* Form */}
        <form className="space-y-8">
          {/* Email */}
          <div>
            <label className="block text-[12px] font-semibold uppercase tracking-wider text-[#45474c] mb-2">
              Email Address
            </label>

            <input
              type="email"
              placeholder="name@example.com"
              className="w-full bg-transparent border-0 border-b border-[#c5c6cd] px-0 py-3 focus:outline-none focus:border-[#745a38]"
            />
          </div>

          {/* Password */}
          <div>
            <div className="flex justify-between items-center mb-2">
              <label className="text-[12px] font-semibold uppercase tracking-wider text-[#45474c]">
                Password
              </label>

              <a
                href="#"
                className="text-[12px] text-[#745a38] hover:underline"
              >
                Forgot Password?
              </a>
            </div>

            <input
              type="password"
              placeholder="••••••••"
              className="w-full bg-transparent border-0 border-b border-[#c5c6cd] px-0 py-3 focus:outline-none focus:border-[#745a38]"
            />
          </div>

          {/* Button */}
          <button
            type="submit"
            className="w-full bg-[#091426] text-white uppercase tracking-[0.15em] text-[12px] font-semibold py-4 rounded-md hover:opacity-95 transition"
          >
            SIGN IN →
          </button>
        </form>

        {/* Divider */}
        <div className="flex items-center gap-4 my-8">
          <div className="flex-1 border-t border-[#d3e4fe]" />
          <span className="text-[12px] font-semibold text-[#45474c]">
            OR
          </span>
          <div className="flex-1 border-t border-[#d3e4fe]" />
        </div>

        {/* Social */}
        <div className="grid grid-cols-2 gap-4">
         <button
  type="button"
  className="flex items-center justify-center gap-3 border border-[#c5c6cd] h-12 rounded-md text-sm font-medium hover:bg-[#eff4ff] transition"
>
  <FaGoogle className="text-[16px]" />
  <span>Google</span>
</button>

<button
  type="button"
  className="flex items-center justify-center gap-3 border border-[#c5c6cd] h-12 rounded-md text-sm font-medium hover:bg-[#eff4ff] transition"
>
  <FaApple className="text-[18px]" />
  <span>Apple</span>
</button>
        </div>

        {/* Footer */}
        <p className="text-center mt-10 text-[#45474c]">
          Don't have an account?
          <a
            href="#"
            className="ml-1 font-semibold text-[#091426] hover:text-[#745a38]"
          >
            Create an account
          </a>
        </p>
      </div>
    </section>
  );
};

export default Login;