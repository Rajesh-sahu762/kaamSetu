import { motion } from "framer-motion";
import {
  Search,
  UserCheck,
  CalendarCheck,
  CheckCircle2,
  Briefcase,
  Wallet,
} from "lucide-react";

const customerSteps = [
  {
    icon: Search,
    title: "Find a Service",
    desc: "Browse verified professionals and choose the service you need.",
  },
  {
    icon: UserCheck,
    title: "Select an Expert",
    desc: "Compare ratings, reviews and experience before booking.",
  },
  {
    icon: CalendarCheck,
    title: "Book Instantly",
    desc: "Schedule a visit at your preferred date and time.",
  },
  {
    icon: CheckCircle2,
    title: "Get It Done",
    desc: "Sit back while the expert completes the job professionally.",
  },
];

const professionalSteps = [
  {
    icon: UserCheck,
    title: "Create Profile",
    desc: "Register and submit your professional details.",
  },
  {
    icon: Briefcase,
    title: "Get Verified",
    desc: "Our team verifies your documents and approves your profile.",
  },
  {
    icon: CalendarCheck,
    title: "Receive Leads",
    desc: "Start receiving service requests from nearby customers.",
  },
  {
    icon: Wallet,
    title: "Earn More",
    desc: "Grow your business and increase your monthly income.",
  },
];

const HowItWorks = () => {
  return (
    <section className="py-24 bg-[#f8f9ff]">
      <div className="max-w-[1280px] mx-auto px-6 lg:px-8">
        
        {/* Heading */}

        <div className="text-center max-w-3xl mx-auto">
          <p
            className="
              uppercase
              tracking-[0.25em]
              text-xs
              font-semibold
              text-[#745A38]
            "
          >
            How It Works
          </p>

          <h2
            className="
              mt-4
              text-4xl
              md:text-5xl
              font-semibold
              text-[#091426]
            "
          >
            Simple, Fast & Reliable
          </h2>

          <p
            className="
              mt-5
              text-lg
              text-[#45474c]
              leading-8
            "
          >
            Whether you're looking for a service or looking for work,
            KaamSetu makes the process simple and transparent.
          </p>
        </div>

        {/* Two Columns */}

        <div className="grid lg:grid-cols-2 gap-12 mt-20">
          
          {/* Customer Side */}

          <div
            className="
              bg-white
              border
              border-[#d3e4fe]
              rounded-3xl
              p-8
            "
          >
            <h3
              className="
                text-2xl
                font-semibold
                text-[#091426]
                mb-10
              "
            >
              For Customers
            </h3>

            <div className="space-y-8">
              {customerSteps.map((step, index) => {
                const Icon = step.icon;

                return (
                  <motion.div
                    key={step.title}
                    initial={{
                      opacity: 0,
                      x: -20,
                    }}
                    whileInView={{
                      opacity: 1,
                      x: 0,
                    }}
                    viewport={{
                      once: true,
                    }}
                    transition={{
                      delay: index * 0.1,
                    }}
                    className="
                      flex
                      gap-5
                    "
                  >
                    <div
                      className="
                        min-w-[56px]
                        h-14

                        rounded-xl

                        bg-[#eff4ff]

                        flex
                        items-center
                        justify-center
                      "
                    >
                      <Icon
                        size={24}
                        className="text-[#745A38]"
                      />
                    </div>

                    <div>
                      <h4
                        className="
                          font-semibold
                          text-lg
                          text-[#091426]
                        "
                      >
                        {index + 1}. {step.title}
                      </h4>

                      <p
                        className="
                          mt-2
                          text-[#45474c]
                          leading-7
                        "
                      >
                        {step.desc}
                      </p>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>

          {/* Professional Side */}

          <div
            className="
              bg-[#091426]
              rounded-3xl
              p-8
            "
          >
            <h3
              className="
                text-2xl
                font-semibold
                text-white
                mb-10
              "
            >
              For Professionals
            </h3>

            <div className="space-y-8">
              {professionalSteps.map((step, index) => {
                const Icon = step.icon;

                return (
                  <motion.div
                    key={step.title}
                    initial={{
                      opacity: 0,
                      x: 20,
                    }}
                    whileInView={{
                      opacity: 1,
                      x: 0,
                    }}
                    viewport={{
                      once: true,
                    }}
                    transition={{
                      delay: index * 0.1,
                    }}
                    className="
                      flex
                      gap-5
                    "
                  >
                    <div
                      className="
                        min-w-[56px]
                        h-14

                        rounded-xl

                        bg-[#1b2b43]

                        flex
                        items-center
                        justify-center
                      "
                    >
                      <Icon
                        size={24}
                        className="text-[#C59A6A]"
                      />
                    </div>

                    <div>
                      <h4
                        className="
                          font-semibold
                          text-lg
                          text-white
                        "
                      >
                        {index + 1}. {step.title}
                      </h4>

                      <p
                        className="
                          mt-2
                          text-[#d3e4fe]
                          leading-7
                        "
                      >
                        {step.desc}
                      </p>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </div>

        {/* CTA */}

        <div className="mt-16 text-center">
          <button
            className="
              px-8
              py-4

              rounded-xl

              bg-[#091426]
              text-white

              shadow-lg

              hover:-translate-y-1
              transition-all
            "
          >
            Get Started Today
          </button>
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;