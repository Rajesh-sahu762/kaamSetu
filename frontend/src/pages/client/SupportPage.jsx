import { useState } from "react";

import { motion } from "framer-motion";
import { toast } from "react-toastify";

import {
  Mail,
  Phone,
  Clock3,
  ChevronDown,
  ChevronUp,
} from "lucide-react";

import { submitSupportRequest } from "@/services/supportService";

const faqs = [
  {
    question:
      "How do I cancel a booking?",
    answer:
      "You can cancel your booking from the My Bookings page before the service starts.",
  },
  {
    question:
      "How do payments work?",
    answer:
      "Payments can be made securely through KaamSetu during checkout.",
  },
  {
    question:
      "Can I reschedule a booking?",
    answer:
      "Yes, bookings can be rescheduled based on expert availability.",
  },
  {
    question:
      "How are experts verified?",
    answer:
      "Every expert goes through identity, document and profile verification.",
  },
  {
    question:
      "How do refunds work?",
    answer:
      "Eligible refunds are processed back to the original payment method.",
  },
];

const helpTopics = [
  "Booking Issues",
  "Payments",
  "Account Access",
  "Vendor Registration",
  "Technical Problem",
  "Refund Request",
];

const SupportPage = () => {
  const [openFaq, setOpenFaq] =
    useState(null);

  const [form, setForm] = useState({
    fullName: "",
    email: "",
    subject: "",
    message: "",
  });
  const [submitting, setSubmitting] = useState(false);

  const updateForm = (patch) => setForm((prev) => ({ ...prev, ...patch }));

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.fullName || !form.email || !form.subject || !form.message) {
      toast.error("Please fill in all fields.");
      return;
    }

    try {
      setSubmitting(true);
      const response = await submitSupportRequest(form);

      if (response.success) {
        toast.success(response.message || "Message sent successfully.");
        setForm({ fullName: "", email: "", subject: "", message: "" });
      } else {
        toast.error(response.message || "Failed to send your message.");
      }
    } catch (err) {
      toast.error("Failed to send your message.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section
      className="
        min-h-screen

        bg-theme

        pt-32
        pb-24
      "
    >
      <div
        className="
          max-w-6xl
          mx-auto

          px-6
          lg:px-8
        "
      >
        {/* Hero */}

        <motion.div
          initial={{
            opacity: 0,
            y: 20,
          }}
          animate={{
            opacity: 1,
            y: 0,
          }}
          className="
            text-center

            max-w-3xl

            mx-auto
          "
        >
          <p
            className="
              uppercase

              tracking-[0.25em]

              text-xs

              font-semibold

              text-[#745A38]
            "
          >
            Support Center
          </p>

          <h1
            className="
              mt-4

              text-4xl
              md:text-6xl

              font-semibold

              text-primary
            "
          >
            Need Help?
          </h1>

          <p
            className="
              mt-5

              text-lg

              text-muted

              leading-8
            "
          >
            We're here to help with
            bookings, payments, account
            issues and anything else you
            need.
          </p>
        </motion.div>

        {/* Topics */}

        <div
          className="
            mt-14

            flex
            flex-wrap

            justify-center

            gap-3
          "
        >
          {helpTopics.map((topic) => (
            <button
              key={topic}
              onClick={() => updateForm({ subject: topic })}
              className="
                px-5
                py-3

                rounded-full

                border
                border-theme

                hover:bg-[#745A38]

                hover:text-white

                transition
              "
            >
              {topic}
            </button>
          ))}
        </div>

        {/* Contact Info */}

        <div
          className="
            mt-20

            grid

            md:grid-cols-3

            gap-10
          "
        >
          <div>
            <Mail
              size={22}
              className="
                text-[#745A38]
              "
            />

            <h3
              className="
                mt-4

                text-xl

                font-semibold

                text-primary
              "
            >
              Email
            </h3>

            <p
              className="
                mt-2

                text-muted
              "
            >
              support@kaamsetu.com
            </p>
          </div>

          <div>
            <Phone
              size={22}
              className="
                text-[#745A38]
              "
            />

            <h3
              className="
                mt-4

                text-xl

                font-semibold

                text-primary
              "
            >
              Phone
            </h3>

            <p
              className="
                mt-2

                text-muted
              "
            >
              +91 98765 43210
            </p>
          </div>

          <div>
            <Clock3
              size={22}
              className="
                text-[#745A38]
              "
            />

            <h3
              className="
                mt-4

                text-xl

                font-semibold

                text-primary
              "
            >
              Response Time
            </h3>

            <p
              className="
                mt-2

                text-muted
              "
            >
              Within 24 Hours
            </p>
          </div>
        </div>

        {/* Divider */}

        <div
          className="
            h-px

            bg-border

            my-20
          "
        />

        {/* Support Form */}

        <div
          className="
            max-w-3xl

            mx-auto
          "
        >
          <h2
            className="
              text-3xl

              font-semibold

              text-primary

              mb-10
            "
          >
            Contact Support
          </h2>

          <form
            onSubmit={handleSubmit}
            className="
              space-y-10
            "
          >
            <input
              type="text"
              placeholder="Full Name"
              value={form.fullName}
              onChange={(e) => updateForm({ fullName: e.target.value })}
              className="
                w-full

                bg-transparent

                border-0
                border-b

                border-theme

                pb-4

                outline-none
              "
            />

            <input
              type="email"
              placeholder="Email Address"
              value={form.email}
              onChange={(e) => updateForm({ email: e.target.value })}
              className="
                w-full

                bg-transparent

                border-0
                border-b

                border-theme

                pb-4

                outline-none
              "
            />

            <input
              type="text"
              placeholder="Subject"
              value={form.subject}
              onChange={(e) => updateForm({ subject: e.target.value })}
              className="
                w-full

                bg-transparent

                border-0
                border-b

                border-theme

                pb-4

                outline-none
              "
            />

            <textarea
              rows="5"
              placeholder="Tell us about your issue..."
              value={form.message}
              onChange={(e) => updateForm({ message: e.target.value })}
              className="
                w-full

                border
                border-theme

                rounded-3xl

                p-5

                bg-transparent

                resize-none

                outline-none
              "
            />

            <button
              type="submit"
              disabled={submitting}
              className="
                px-8
                py-4

                rounded-xl

                bg-[#091426]

                text-white

                hover:-translate-y-1

                transition

                disabled:opacity-60
              "
            >
              {submitting ? "Sending..." : "Send Message"}
            </button>
          </form>
        </div>

        {/* FAQ */}

        <div
          className="
            mt-24

            max-w-4xl

            mx-auto
          "
        >
          <h2
            className="
              text-3xl

              font-semibold

              text-primary

              mb-10
            "
          >
            Frequently Asked Questions
          </h2>

          <div>
            {faqs.map(
              (faq, index) => (
                <div
                  key={index}
                  className="
                    border-b
                    border-theme

                    py-6
                  "
                >
                  <button
                    onClick={() =>
                      setOpenFaq(
                        openFaq ===
                          index
                          ? null
                          : index
                      )
                    }
                    className="
                      w-full

                      flex

                      items-center
                      justify-between

                      text-left
                    "
                  >
                    <span
                      className="
                        font-medium

                        text-primary
                      "
                    >
                      {faq.question}
                    </span>

                    {openFaq ===
                    index ? (
                      <ChevronUp
                        size={20}
                      />
                    ) : (
                      <ChevronDown
                        size={20}
                      />
                    )}
                  </button>

                  {openFaq ===
                    index && (
                    <motion.p
                      initial={{
                        opacity: 0,
                        height: 0,
                      }}
                      animate={{
                        opacity: 1,
                        height: "auto",
                      }}
                      className="
                        mt-4

                        text-muted

                        leading-7
                      "
                    >
                      {faq.answer}
                    </motion.p>
                  )}
                </div>
              )
            )}
          </div>
        </div>

      </div>
    </section>
  );
};

export default SupportPage;