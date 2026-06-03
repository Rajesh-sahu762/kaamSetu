import React, { useRef, useState } from "react";
import { FaLock } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

import AuthHeader from "../../components/auth/AuthHeader";
import AuthFooter from "../../components/auth/AuthFooter";

const VerifyOtp = () => {
  const navigate = useNavigate();

  const [otp, setOtp] = useState(["", "", "", "", "", ""]);

  const inputRefs = useRef([]);

  const handleChange = (value, index) => {
    if (!/^\d*$/.test(value)) return;

    const updatedOtp = [...otp];
    updatedOtp[index] = value;
    setOtp(updatedOtp);

    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (e, index) => {
    if (
      e.key === "Backspace" &&
      !otp[index] &&
      index > 0
    ) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e) => {
    const pastedData = e.clipboardData
      .getData("text")
      .slice(0, 6);

    if (!/^\d+$/.test(pastedData)) return;

    const otpArray = pastedData.split("");

    const updatedOtp = [...otp];

    otpArray.forEach((digit, index) => {
      if (index < 6) {
        updatedOtp[index] = digit;
      }
    });

    setOtp(updatedOtp);
  };

  const handleVerify = (e) => {
    e.preventDefault();

    const finalOtp = otp.join("");

    console.log(finalOtp);

    // API Call

    navigate("/reset-password");
  };

  return (
    <section className="min-h-screen bg-[#f8f9ff] flex flex-col">

      <AuthHeader />

      <main className="flex-1 flex items-center justify-center px-4 py-10">

        <div className="w-full max-w-[520px] bg-white border border-[#d3e4fe] rounded-lg p-6 md:p-10 shadow-sm">

          {/* Icon */}
          <div className="flex justify-center">
            <div className="w-16 h-16 bg-[#e5eeff] rounded-xl flex items-center justify-center">
              <FaLock
                size={22}
                className="text-[#091426]"
              />
            </div>
          </div>

          {/* Title */}
          <div className="text-center mt-8">

            <h1 className="text-3xl font-semibold text-[#091426]">
              Verify your identity
            </h1>

            <p className="mt-4 text-[#45474c] leading-7">
              We've sent a code to your mobile number
            </p>

          </div>

          {/* OTP Form */}
          <form
            onSubmit={handleVerify}
            className="mt-10"
          >

            {/* OTP Boxes */}
            <div
              className="flex justify-center gap-2 md:gap-4"
              onPaste={handlePaste}
            >
              {otp.map((digit, index) => (
                <input
                  key={index}
                  ref={(el) =>
                    (inputRefs.current[index] = el)
                  }
                  type="text"
                  maxLength={1}
                  value={digit}
                  onChange={(e) =>
                    handleChange(
                      e.target.value,
                      index
                    )
                  }
                  onKeyDown={(e) =>
                    handleKeyDown(e, index)
                  }
                  className="
                    w-12 h-14
                    md:w-14 md:h-16
                    text-center
                    text-xl
                    font-semibold
                    border
                    border-[#d3e4fe]
                    rounded
                    focus:outline-none
                    focus:border-[#745a38]
                  "
                />
              ))}
            </div>

            {/* Verify Button */}
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
              "
            >
              Verify & Complete
            </button>

          </form>

          {/* Resend */}
          <div className="text-center mt-8">

            <p className="text-[#45474c]">
              Didn't receive a code?
            </p>

            <button
              className="
                mt-3
                text-xs
                font-semibold
                tracking-[0.2em]
                uppercase
                text-[#745a38]
              "
            >
              Resend Code
            </button>

          </div>

        </div>

      </main>

      <AuthFooter />

    </section>
  );
};

export default VerifyOtp;