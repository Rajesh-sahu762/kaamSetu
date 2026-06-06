import React, { useState } from 'react';
import { FaShieldAlt } from 'react-icons/fa';
import { IoChevronDown } from 'react-icons/io5';
import { useNavigate } from 'react-router-dom';
import AuthHeader from '@/components/auth/authHeader';
import ProgressBar from '@/components/auth/ProgressBar';
import AuthFooter from '@/components/auth/authFooter';
import { useVendor } from '@/context/vendorContext';

const VendorProfileStep1 = () => {
  const navigate = useNavigate(); 

  const { updateVendorData } = useVendor();

  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    mobile: '',
    businessName: '',
    businessType: '',
    password: '',
  });

  const businessType = [
    'Electrician',
    'Plumber',
    'Carpenter',
    'Painter',
    'AC Repair',
    'Home Cleaning',
    'Interior Designer',
    'Appliance Repair',
  ];

 const handleSubmit = (e) => {
  e.preventDefault();

  updateVendorData({
    fullName: formData.fullName,
    email: formData.email,
    mobile: formData.mobile,
    businessName: formData.businessName,
    businessType: formData.businessType,
    password: formData.password,
  });


  navigate('/register/vendor/business');
};

  return (
    <section className="min-h-screen bg-[#f8f9ff] flex flex-col">
      {/* Header */}
      <AuthHeader />

      {/* Content */}
      <main className="flex-1 max-w-6xl mx-auto w-full px-4 md:px-8 py-8 md:py-12">
        {/* Progress */}
        <ProgressBar step={1} totalSteps={4} title={'Proffessional Profile'} />

        {/* Title */}
        <div className="max-w-3xl mx-auto text-center mb-10">
          <h2 className="text-3xl md:text-4xl font-semibold text-[#091426]">
            Join the Network
          </h2>

          <p className="mt-3 text-[#45474c]">
            Provide your professional details to begin the verification process.
          </p>
        </div>

        {/* Form Card */}
        <div className="max-w-3xl mx-auto bg-white border border-[#d3e4fe] rounded-lg p-6 md:p-10 shadow-sm">
          <form onSubmit={handleSubmit}>
            <div className="grid md:grid-cols-2 gap-8">
              {/* Full Name */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider mb-3">
                  Full Legal Name
                </label>

                <input
                  type="text"
                  placeholder="As it appears on your government ID"
                  className="w-full border-b border-[#c5c6cd] pb-3 focus:outline-none focus:border-[#745a38]"
                  value={formData.fullName}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      fullName: e.target.value,
                    })
                  }
                />
              </div>

              {/* Business Name */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider mb-3">
                  Business Name (Optional)
                </label>

                <input
                  type="text"
                  placeholder="e.g. Acme Plumbing Solutions"
                  className="w-full border-b border-[#c5c6cd] pb-3 focus:outline-none focus:border-[#745a38]"
                  value={formData.businessName}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      businessName: e.target.value,
                    })
                  }
                />
              </div>

              {/* Mobil Number */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider mb-3">
                  Mobile Number
                </label>

                <input
                  type="text"
                  placeholder="Enter Your Mobile Number"
                  className="w-full border-b border-[#c5c6cd] pb-3 focus:outline-none focus:border-[#745a38]"
                  value={formData.mobile}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      mobile: e.target.value,
                    })
                  }
                />
              </div>

              {/* Email Address */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider mb-3">
                  E-mail
                </label>

                <input
                  type="text"
                  placeholder="Enter Your Email"
                  className="w-full border-b border-[#c5c6cd] pb-3 focus:outline-none focus:border-[#745a38]"
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      email: e.target.value,
                    })
                  }
                />
              </div>

                   {/* Password */}
                 <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider">
                    Password
                  </label>

                  <input
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        password: e.target.value,
                      })
                    }
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


              {/* Category */}
              <div className="md:col-span-2">
                <label className="block text-xs font-semibold uppercase tracking-wider mb-3">
                  Primary Service Category
                </label>

                <div className="relative">
                  <select
                    className="w-full border-b border-[#c5c6cd] pb-3 appearance-none bg-transparent focus:outline-none focus:border-[#745a38]"
                    value={formData.businessType}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        businessType: e.target.value,
                      })
                    }
                  >
                    <option value="">Select your specialty...</option>

                    {businessType.map((item) => (
                      <option key={item} value={item}>
                        {item}
                      </option>
                    ))}
                  </select>

                  <IoChevronDown className="absolute right-0 top-1 text-lg" />
                </div>
              </div>

            </div>

            {/* Info Box */}
            <div className="mt-8 bg-[#e5eeff] border border-[#d3e4fe] p-4 flex gap-3 items-start">
              <FaShieldAlt className="text-[#745a38] mt-1" />

              <p className="text-sm text-[#091426]">
                Your information is securely encrypted and used solely for
                verification purposes.
              </p>
            </div>

            {/* Button */}
            <div className="mt-10 flex justify-end">
              <button
                type="submit"
                className="
                  bg-[#091426]
                  text-white
                  px-10
                  py-4
                  uppercase
                  tracking-[0.15em]
                  text-sm
                  font-semibold
                  rounded
                  hover:opacity-95
                  transition
                "
              >
                Continue →
              </button>
            </div>
          </form>
        </div>
      </main>

      {/* Footer */}
      <AuthFooter />
    </section>
  );
};

export default VendorProfileStep1;
