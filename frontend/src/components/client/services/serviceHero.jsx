import { motion } from "framer-motion";
import {
  Search,
  MapPin,
  ArrowRight,
} from "lucide-react";
import { useState } from "react";

const ServiceHero = ({ initialSearch = "", initialCity = "", onSearch }) => {
  const [searchTerm, setSearchTerm] = useState(initialSearch);
  const [city, setCity] = useState(initialCity);

  const handleSearch = (event) => {
    event.preventDefault();
    onSearch?.({ search: searchTerm.trim(), city: city.trim() });
  };

  return (
    <section
      className="
        relative
        overflow-hidden

        pt-36
        pb-20

        bg-theme
      "
    >
      {/* Background Glow */}

      <div
        className="
          absolute
          top-0
          left-1/2
          -translate-x-1/2

          w-[700px]
          h-[700px]

          rounded-full

          bg-[#745A38]/10

          blur-[120px]
        "
      />

      <div
        className="
          relative
          z-10

          max-w-[1280px]
          mx-auto

          px-6
          lg:px-8
        "
      >
        <div
          className="
            max-w-4xl
            mx-auto
            text-center
          "
        >
          {/* Badge */}

          <motion.div
            initial={{
              opacity: 0,
              y: 20,
            }}
            animate={{
              opacity: 1,
              y: 0,
            }}
            transition={{
              duration: 0.5,
            }}
            className="
              inline-flex
              items-center

              px-4
              py-2

              rounded-full

              bg-card
              border
              border-theme

              text-sm
              text-muted
            "
          >
            2,000+ Verified Professionals Across India
          </motion.div>

          {/* Heading */}

          <motion.h1
            initial={{
              opacity: 0,
              y: 30,
            }}
            animate={{
              opacity: 1,
              y: 0,
            }}
            transition={{
              delay: 0.1,
            }}
            className="
              mt-6

              text-4xl
              md:text-6xl

              font-semibold

              text-primary

              leading-tight
            "
          >
            Find Trusted
            <span className="text-accent">
              {" "}Professionals
            </span>
            <br />
            Near You
          </motion.h1>

          {/* Description */}

          <motion.p
            initial={{
              opacity: 0,
              y: 30,
            }}
            animate={{
              opacity: 1,
              y: 0,
            }}
            transition={{
              delay: 0.2,
            }}
            className="
              mt-6

              text-lg
              md:text-xl

              text-muted

              leading-8

              max-w-3xl
              mx-auto
            "
          >
            Compare verified experts,
            check ratings and book
            trusted services in just
            a few clicks.
          </motion.p>

          {/* Search Box */}

          <motion.div
            initial={{
              opacity: 0,
              y: 30,
            }}
            animate={{
              opacity: 1,
              y: 0,
            }}
            transition={{
              delay: 0.3,
            }}
          >
          <form
            onSubmit={handleSearch}
            className="
              mt-10

              bg-card

              border
              border-theme

              rounded-3xl

              shadow-theme

              p-4

              flex
              flex-col
              lg:flex-row

              gap-4
            "
          >
            {/* Service Search */}

            <div
              className="
                flex
                items-center

                flex-1

                px-4
              "
            >
              <Search
                size={20}
                className="text-muted"
              />

              <input
                type="text"
                value={searchTerm}
                onChange={(event) => setSearchTerm(event.target.value)}
                placeholder="What service do you need?"
                className="
                  w-full
                  ml-3

                  bg-transparent
                  outline-none

                  text-primary
                "
              />
            </div>

            {/* Location */}

            <div
              className="
                flex
                items-center

                flex-1

                px-4

                border-l
                border-theme
              "
            >
              <MapPin
                size={20}
                className="text-muted"
              />

              <input
                type="text"
                value={city}
                onChange={(event) => setCity(event.target.value)}
                placeholder="Enter your city"
                className="
                  w-full
                  ml-3

                  bg-transparent
                  outline-none

                  text-primary
                "
              />
            </div>

            {/* Search Button */}

            <button
              type="submit"
              className="
                px-8
                py-4

                rounded-2xl

                bg-[#745A38]

                text-white

                font-medium

                flex
                items-center
                justify-center
                gap-2

                hover:opacity-90
                transition
              "
            >
              Search

              <ArrowRight size={18} />
            </button>
          </form>
          </motion.div>

          {/* Stats */}

          <div
            className="
              mt-12

              grid
              grid-cols-2
              md:grid-cols-4

              gap-6
            "
          >
            <Stat
              value="2K+"
              label="Experts"
            />

            <Stat
              value="50+"
              label="Services"
            />

            <Stat
              value="15+"
              label="Cities"
            />

            <Stat
              value="4.9★"
              label="Rating"
            />
          </div>
        </div>
      </div>
    </section>
  );
};

const Stat = ({
  value,
  label,
}) => {
  return (
    <div>
      <h3
        className="
          text-3xl
          font-bold

          text-primary
        "
      >
        {value}
      </h3>

      <p
        className="
          mt-2
          text-muted
        "
      >
        {label}
      </p>
    </div>
  );
};

export default ServiceHero;