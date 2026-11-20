import { useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { ChevronDown, HelpCircle } from "lucide-react";
import "./HomeFAQ.css";

const faqs = [
  {
    question: "How do I cancel a booking?",
    answer: "You can cancel your booking from the My Bookings page before the service starts.",
  },
  {
    question: "How do payments work?",
    answer: "Payments can be made securely through KaamSetu during checkout.",
  },
  {
    question: "Can I reschedule a booking?",
    answer: "Yes, bookings can be rescheduled based on expert availability.",
  },
  {
    question: "How are experts verified?",
    answer: "Every expert goes through identity, document and profile verification.",
  },
  {
    question: "How do refunds work?",
    answer: "Eligible refunds are processed back to the original payment method.",
  },
];

const HomeFAQ = () => {
  const [openIndex, setOpenIndex] = useState(0);
  const reduceMotion = useReducedMotion();

  return (
    <section className="ks-home-faq" aria-labelledby="ks-home-faq-title">
      <div className="ks-home-faq__container">
        <motion.div
          className="ks-home-faq__heading"
          initial={reduceMotion ? false : { opacity: 0, y: 18 }}
          whileInView={reduceMotion ? undefined : { opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.35 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
        >
          <span className="ks-home-faq__eyebrow"><HelpCircle size={15} /> NEED A HAND?</span>
          <h2 id="ks-home-faq-title">Frequently Asked <span>Questions</span></h2>
          <p>Quick answers to help you book with confidence.</p>
        </motion.div>

        <div className="ks-home-faq__list">
          {faqs.map((faq, index) => {
            const isOpen = openIndex === index;
            const panelId = `ks-home-faq-answer-${index}`;

            return (
              <motion.article
                className={`ks-home-faq__item${isOpen ? " is-open" : ""}`}
                key={faq.question}
                initial={reduceMotion ? false : { opacity: 0, y: 14 }}
                whileInView={reduceMotion ? undefined : { opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ duration: 0.38, delay: reduceMotion ? 0 : index * 0.045 }}
              >
                <h3>
                  <button
                    type="button"
                    aria-expanded={isOpen}
                    aria-controls={panelId}
                    onClick={() => setOpenIndex(isOpen ? null : index)}
                  >
                    <span className="ks-home-faq__number">{String(index + 1).padStart(2, "0")}</span>
                    <span className="ks-home-faq__question">{faq.question}</span>
                    <span className="ks-home-faq__toggle"><ChevronDown size={19} /></span>
                  </button>
                </h3>
                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      id={panelId}
                      className="ks-home-faq__answer"
                      initial={reduceMotion ? false : { height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: reduceMotion ? 0 : 0.24, ease: "easeOut" }}
                    >
                      <p>{faq.answer}</p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.article>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default HomeFAQ;
