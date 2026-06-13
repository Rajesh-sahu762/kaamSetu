import React, { useState } from 'react';
import { FaGoogle } from 'react-icons/fa';
import { FaApple } from 'react-icons/fa';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { loginUser, googleLogin } from '@/services/authService';
import { toast } from 'react-toastify';
import { GoogleLogin } from '@react-oauth/google';

const Login = () => {
  const location = useLocation();

  const from = location.state?.form?.pathname;

  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleGoogleSuccess = async (credentialResponse) => {
    try {
      const response = await googleLogin({
        credential: credentialResponse.credential,
      });

      localStorage.setItem('token', response.token);

      localStorage.setItem('user', JSON.stringify(response.user));

      toast.success(response.message);

      navigate('/');
    } catch (error) {
      toast.error(error.response?.data?.message);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await loginUser({
        email: formData.email,
        password: formData.password,
      });

      localStorage.setItem('token', response.token);
      localStorage.setItem('user', JSON.stringify(response.user));

      toast.success(response.message);

      const user = response.user;

      if (user.role === 'customer') {
        navigate(from || '/');
      } else if (user.role === 'vendor') {
        navigate('/vendor/dashboard');
      } else if (user.role === 'Admin') {
        navigate('/admin/dashboard');
      }
    } catch (error) {
      console.log('Full Error:', error);
      console.log('Response Data:', error.response?.data);

      toast.error(error.response?.data?.message || 'An error occurred');
    }
  };

  return (
    <section className="min-h-screen bg-card flex items-center justify-center px-4 py-8">
      <div className="w-full max-w-[520px] bg-card border border-theme rounded-lg shadow-[0_4px_20px_rgba(9,20,38,0.05)] p-6 sm:p-8 md:p-12">
        {/* Header */}
        <div className="text-center mb-10">
          <h1 className="text-[38px] md:text-[52px] font-semibold text-primary tracking-tight">
            Welcome back
          </h1>

          <p className="mt-3 text-[16px] md:text-[18px] text-muted">
            Sign in to your Kaamsetu account.
          </p>
        </div>

        {/* Form */}
        <form className="space-y-8" onSubmit={handleSubmit}>
          {/* Email */}
          <div>
            <label className="block text-[12px] font-semibold uppercase tracking-wider text-muted mb-2">
              Email Address
            </label>

            <input
              type="email"
              onChange={handleChange}
              name="email"
              value={formData.email}
              placeholder="name@example.com"
              className="w-full bg-transparent border-0 border-b border-[#c5c6cd] px-0 py-3 focus:outline-none focus:border-[#745a38]"
            />
          </div>

          {/* Password */}
          <div>
            <div className="flex justify-between items-center mb-2">
              <label className="text-[12px] font-semibold uppercase tracking-wider text-muted">
                Password
              </label>

              <Link
                to="/forgot-password"
                className="text-[12px] text-[#745a38] hover:underline"
              >
                Forgot Password?
              </Link>
            </div>

            <input
              type="password"
              value={formData.password}
              onChange={handleChange}
              name="password"
              placeholder="••••••••"
              className="w-full bg-transparent border-0 border-b border-[#c5c6cd] px-0 py-3 focus:outline-none focus:border-[#745a38]"
            />
          </div>

          {/* Button */}
          <button
            type="submit"
            className="cursor-pointer w-full bg-[#091426] text-white uppercase tracking-[0.15em] text-[12px] font-semibold py-4 rounded-md hover:opacity-95 transition"
          >
            SIGN IN →
          </button>
        </form>

        {/* Divider */}
        <div className="flex items-center gap-4 my-8">
          <div className="flex-1 border-t border-theme" />
          <span className="text-[12px] font-semibold text-muted">OR</span>
          <div className="flex-1 border-t border-theme" />
        </div>

        {/* Social */}
        <div className="grid grid-cols-2 gap-4">
          <GoogleLogin
            className="flex items-center justify-center gap-3 border border-[#c5c6cd] h-12 rounded-md text-sm font-medium hover:bg-[#eff4ff] transition"
            onSuccess={handleGoogleSuccess}
            onError={() => {
              toast.error('Google Login Failed');
            }}
          />
          <button
            type="button"
            className="flex items-center justify-center gap-3 border border-[#c5c6cd] h-12 rounded-md text-sm font-medium hover:bg-[#eff4ff] transition"
          >
            <FaApple className="text-[18px]" />
            <span>Apple</span>
          </button>
        </div>

        {/* Footer */}
        <p className="text-center mt-10 text-muted">
          Don't have an account?
          <Link
            to="/join"
            className="ml-1 font-semibold text-primary hover:text-[#745a38]"
          >
            Create an account
          </Link>
        </p>
      </div>
    </section>
  );
};

export default Login;
