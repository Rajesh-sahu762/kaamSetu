import {
  Send,
  ArrowUp,
} from 'lucide-react';

import { FaFacebook, FaInstagram, FaLinkedin, FaTwitter } from "react-icons/fa";

import { motion } from 'framer-motion';

const Footer = () => {
  return (
    <footer className="relative bg-[#091426] overflow-hidden">
      {/* Top Glow */}

      <div
        className="
          absolute
          top-0
          left-1/2
          -translate-x-1/2

          w-[500px]
          h-[500px]

          rounded-full

          bg-[#745A38]/10
          blur-[120px]
        "
      />

      <div className="relative max-w-[1280px] mx-auto px-6 lg:px-8">
        {/* Newsletter */}


        {/* Main Footer */}

        <div
          className="
            py-20

            grid
            lg:grid-cols-5

            gap-10
          "
        >
          {/* Brand */}

          <div className="lg:col-span-2">
            <h2
              className="
                text-2xl
                font-bold
                tracking-[0.25em]
              "
            >
              <span className="text-white">KAAM</span>

              <span className="text-[#C59A6A]">SETU</span>
            </h2>

            <p
              className="
                mt-6

                text-[#d3e4fe]
                leading-8

                max-w-md
              "
            >
              Connecting customers with trusted professionals across India. Find
              verified experts for every service you need.
            </p>

            {/* Social */}

            <div
              className="
                flex
                gap-4
                mt-8
              "
            >
              <SocialIcon>
                <FaFacebook size={18} />
              </SocialIcon>

              <SocialIcon>
                <FaInstagram size={18} />
              </SocialIcon>

              <SocialIcon>
                <FaLinkedin size={18} />
              </SocialIcon>

              <SocialIcon>
                <FaTwitter size={18} />
              </SocialIcon>
            </div>
          </div>

          {/* Services */}

          <FooterColumn
            title="Services"
            links={[
              'Electrician',
              'Plumber',
              'Carpenter',
              'Painter',
              'AC Repair',
            ]}
          />

          {/* Company */}

          <FooterColumn
            title="Company"
            links={['About Us', 'How It Works', 'Careers', 'Contact', 'Blog']}
          />

          {/* Support */}

          <FooterColumn
            title="Support"
            links={[
              'Help Center',
              'Privacy Policy',
              'Terms',
              'Refund Policy',
              'FAQ',
            ]}
          />
        </div>

        {/* Bottom */}

        <div
          className="
            py-8

            border-t
            border-[#22324a]

            flex
            flex-col
            md:flex-row

            gap-4

            items-center
            justify-between
          "
        >
          <p
            className="
              text-[#d3e4fe]
            "
          >
            © {new Date().getFullYear()} KaamSetu. All rights reserved.
          </p>

          <motion.button
            whileHover={{
              y: -4,
            }}
            onClick={() =>
              window.scrollTo({
                top: 0,
                behavior: 'smooth',
              })
            }
            className="
              flex
              items-center
              gap-2

              text-white

              hover:text-[#C59A6A]
              transition-all
            "
          >
            Back To Top
            <ArrowUp size={16} />
          </motion.button>
        </div>
      </div>
    </footer>
  );
};

const FooterColumn = ({ title, links }) => {
  return (
    <div>
      <h3
        className="
          text-white
          font-semibold
          text-lg
          mb-6
        "
      >
        {title}
      </h3>

      <ul className="space-y-4">
        {links.map((link) => (
          <li key={link}>
            <a
              href="#"
              className="
                text-[#d3e4fe]

                hover:text-[#C59A6A]

                transition-all
              "
            >
              {link}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
};

const SocialIcon = ({ children }) => {
  return (
    <motion.a
      whileHover={{
        y: -4,
        scale: 1.05,
      }}
      href="#"
      className="
        w-11
        h-11

        rounded-xl

        bg-[#132033]

        border
        border-[#22324a]

        flex
        items-center
        justify-center

        text-white

        hover:bg-[#745A38]

        transition-all
      "
    >
      {children}
    </motion.a>
  );
};

export default Footer;
