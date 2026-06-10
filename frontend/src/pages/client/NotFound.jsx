import { motion } from "framer-motion";
import { Home, Search, Wrench, Zap, Paintbrush, Hammer } from "lucide-react";
import { Link } from "react-router-dom";

const floatingIcons = [
  { Icon: Wrench, x: "-25%", y: "-20%" },
  { Icon: Zap, x: "25%", y: "-15%" },
  { Icon: Paintbrush, x: "-20%", y: "20%" },
  { Icon: Hammer, x: "20%", y: "25%" },
];

const NotFound = () => {
  return (
    <div className="relative min-h-screen overflow-hidden bg-theme flex items-center justify-center px-6">

      {/* Background Glow 1 */}
   <motion.div
  animate={{
    scale: [1.1, 1.3, 1.1],
    opacity: [0.08, 0.15, 0.08],
  }}
  transition={{
    duration: 10,
    repeat: Infinity,
  }}
  className="
    absolute
    bottom-[-200px]
    right-[-150px]
    w-[500px]
    h-[500px]
    rounded-full
    blur-[120px]
  "
  style={{
    background: "var(--color-primary)",
  }}
/>

      {/* Background Glow 2 */}
      <motion.div
        animate={{
          scale: [1.1, 1.3, 1.1],
          opacity: [0.2, 0.4, 0.2],
        }}
        transition={{
          duration: 10,
          repeat: Infinity,
        }}
        className="
          absolute
          bottom-[-200px]
          right-[-150px]
          w-[500px]
          h-[500px]
          rounded-full
          bg-blue-500/10
          blur-[120px]
        "
      />

      {/* Floating Icons */}
      {floatingIcons.map((item, index) => {
        const Icon = item.Icon;

        return (
          <motion.div
            key={index}
            animate={{
              y: [0, -20, 0],
              rotate: [0, 8, 0],
            }}
            transition={{
              duration: 4 + index,
              repeat: Infinity,
            }}
            className="absolute hidden md:block"
            style={{
              left: `calc(50% + ${item.x})`,
              top: `calc(50% + ${item.y})`,
            }}
          >
           <div
  className="
    w-16
    h-16
    rounded-2xl
    glass-card
    backdrop-blur-xl
    flex
    items-center
    justify-center
  "
>
              <Icon className="text-accent" size={28} />
            </div>
          </motion.div>
        );
      })}

      <div className="relative z-10 text-center max-w-3xl">

        {/* 404 */}
        <motion.h1
          animate={{
            y: [0, -15, 0],
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
          }}
          className="
          font-heading
tracking-wider
            text-[130px]
md:text-[220px]
            font-black
            leading-none
            text-primary
          "
        >
          404
        </motion.h1>

        {/* Title */}
        <motion.h2
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="
            text-4xl
md:text-6xl
            font-bold
            text-primary
          "
        >
          Page Not Found
        </motion.h2>

        {/* Description */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="
            mt-6
            text-muted
            text-lg
            leading-8
          "
        >
          Looks like the service you're looking for doesn't exist,
          has been moved, or the URL is incorrect.
        </motion.p>

        {/* Buttons */}
        <div
          className="
            mt-10
            flex
            flex-col
            sm:flex-row
            justify-center
            gap-4
          "
        >
          <Link to="/">
            <motion.button
              whileHover={{
                scale: 1.05,
                y: -3,
              }}
              whileTap={{
                scale: 0.95,
              }}
             className="
px-8
py-4

rounded-2xl

font-semibold

text-white
flex
items-center
                gap-2

shadow-lg
"
style={{
  background: "var(--color-secondary)",
}}
            >
              <Home size={18} />
              Back Home
            </motion.button>
          </Link>

          <Link to="/services">
            <motion.button
              whileHover={{
                scale: 1.05,
                y: -3,
              }}
              whileTap={{
                scale: 0.95,
              }}
              className="
                px-8
                py-4
                rounded-2xl
                glass-card
                backdrop-blur-xl
                border
                text-primary
                font-semibold
                flex
                items-center
                gap-2
              "
            >
              <Search size={18} />
              Explore Services
            </motion.button>
          </Link>
        </div>

      </div>
    </div>
  );
};

export default NotFound;

