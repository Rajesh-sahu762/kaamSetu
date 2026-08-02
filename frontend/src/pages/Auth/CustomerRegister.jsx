import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { DotLottieReact } from '@lottiefiles/dotlottie-react';
import AuthHeader from '../../components/auth/authHeader';
import AuthFooter from '../../components/auth/authFooter';
import { toast } from 'react-toastify';
import { registerUser } from '@/services/authService';

const CustomerRegister = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const googleData = location.state?.googleSignup;

  const [formData, setFormData] = useState({
     fullName:
      location.state?.fullName || "",
    email:
      location.state?.email || "",
    mobile: '',
    password: '',
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // Here you would typically send formData to your backend API to create the user account. For this example, we'll just log it.
      const response = await registerUser({
        fullName: formData.fullName,
        email: formData.email,
        mobile: formData.mobile,
        password: formData.password,
      });

      navigate('/verify-email', {
        state: {
          email: formData.email,
        },
      });

      toast.success('Account created successfully! Please verify your email.');
    } catch (error) {
      console.log('ERROR RESPONSE:', error.response?.data);

      toast.error(error.response?.data?.message);
    }
  };

  return (
    <section className="min-h-screen bg-card flex flex-col">
      <AuthHeader backPath="/join" />

      <main className="flex-1">
        <div className="grid lg:grid-cols-2 min-h-[650px]">
          {/* Left Image */}
          <div className="hidden lg:flex mt-10 justify-center">
            <DotLottieReact
              src="https://lottie.host/dde50c12-2c57-4117-96c7-4c326fcf8b1e/mmTMCrhzRX.lottie"
              loop
              autoplay
              className=" w-[550px] h-[600px] "
            />
          </div>

          {/* Right Form */}
          <div className="flex items-center justify-center px-6 py-10">
            <div className="w-full max-w-md">
              <h1 className="text-4xl font-semibold text-primary">
                Create an Account
              </h1>

              <p className="mt-4 text-muted leading-8">
                Join Kaamsetu to discover and book premium services with trusted
                artisans.
              </p>

              <form onSubmit={handleSubmit} className="mt-10">
                {/* Name */}
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider mb-4">
                    Full Name
                  </label>

                  <input
                  readOnly={googleData}
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
                  readOnly={googleData}
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

                {/* Password */}
                <div className="mt-8">
                  <label className="block text-xs font-semibold uppercase tracking-wider mb-4">
                    Password
                  </label>

                  <input
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="Enter your password"
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
                <p className="mt-10 text-xs text-muted leading-6">
                  By continuing, you agree to Kaamsetu's{' '}
                  <button type="button" className="underline">
                    Terms of Service
                  </button>{' '}
                  and acknowledge our{' '}
                  <button type="button" className="underline">
                    Privacy Policy
                  </button>
                  .
                </p>

                {/* Submit */}
                <button
                  type="submit"
                  className="
                    w-full
                    cursor-pointer
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
              <div className="mt-10 pt-8 border-t border-theme text-center">
                <p className="text-muted">
                  Already have an account?
                  <button
                    onClick={() => navigate('/login')}
                    className="
                      ml-2
                      font-semibold
                      text-primary
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
