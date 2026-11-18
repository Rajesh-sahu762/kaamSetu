import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "react-toastify";
import {
  Mail, Phone, Clock3, ChevronDown, ArrowUpRight, ArrowRight,
  MessageCircle, Sparkles, Headphones, ShieldCheck, Send,
  CalendarClock, CircleHelp, CheckCircle2, Zap,
} from "lucide-react";
import { submitSupportRequest } from "@/services/supportService";
import "./SupportPage.css";

const faqs = [
  { question: "How do I cancel a booking?", answer: "You can cancel your booking from the My Bookings page before the service starts." },
  { question: "How do payments work?", answer: "Payments can be made securely through KaamSetu during checkout." },
  { question: "Can I reschedule a booking?", answer: "Yes, bookings can be rescheduled based on expert availability." },
  { question: "How are experts verified?", answer: "Every expert goes through identity, document and profile verification." },
  { question: "How do refunds work?", answer: "Eligible refunds are processed back to the original payment method." },
];

const helpTopics = [
  { label: "Booking Issues", icon: CalendarClock },
  { label: "Payments", icon: ShieldCheck },
  { label: "Account Access", icon: CircleHelp },
  { label: "Vendor Registration", icon: Headphones },
  { label: "Technical Problem", icon: Zap },
  { label: "Refund Request", icon: ArrowUpRight },
];

const SupportPage = () => {
  const [openFaq, setOpenFaq] = useState(0);
  const [form, setForm] = useState({ fullName: "", email: "", subject: "", message: "" });
  const [submitting, setSubmitting] = useState(false);
  const updateForm = (patch) => setForm((prev) => ({ ...prev, ...patch }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.fullName.trim() || !form.email.trim() || !form.subject.trim() || !form.message.trim()) {
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
    } catch {
      toast.error("Failed to send your message.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <main className="ks-support-page">
      <div className="ks-support-orb ks-support-orb--one" aria-hidden="true" />
      <div className="ks-support-orb ks-support-orb--two" aria-hidden="true" />

      <section className="ks-support-hero">
        <motion.div
          initial={{ opacity: 0, y: 22 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: .55, ease: "easeOut" }}
          className="ks-support-hero__inner"
        >
          <div className="ks-support-eyebrow"><span className="ks-support-eyebrow__dot" /> KAAMSETU CARE <Sparkles size={14} /></div>
          <h1>We’re here to <span>help you.</span></h1>
          <p>Real people. Helpful answers. A smoother experience from booking to doorstep.</p>
          <div className="ks-support-hero__trust"><span><ShieldCheck size={16} /> Reliable assistance</span><i /><span><Clock3 size={16} /> Reply within 24 hours</span></div>
        </motion.div>
        <motion.div
          className="ks-support-hero__visual"
          initial={{ opacity: 0, scale: .94, rotate: 2 }}
          animate={{ opacity: 1, scale: 1, rotate: 0 }}
          transition={{ delay: .12, duration: .65 }}
        >
          <div className="ks-support-visual__glow" />
          <div className="ks-support-visual__orbit ks-support-visual__orbit--a" />
          <div className="ks-support-visual__orbit ks-support-visual__orbit--b" />
          <div className="ks-support-visual__main"><Headphones size={58} strokeWidth={1.35} /><span className="ks-support-visual__spark"><Sparkles size={19} /></span></div>
          <div className="ks-support-float ks-support-float--top"><span className="ks-support-float__icon"><MessageCircle size={17} /></span><span><b>We’re listening</b><small>How can we help?</small></span></div>
          <div className="ks-support-float ks-support-float--bottom"><span className="ks-support-live-dot" /> Support is ready</div>
        </motion.div>
      </section>

      <section className="ks-support-content">
        <div className="ks-support-section-heading">
          <div><span className="ks-support-kicker">HOW CAN WE HELP?</span><h2>Let’s get things <em>sorted.</em></h2></div>
          <p>Choose a topic or send us a message. We’ll take it from there.</p>
        </div>

        <div className="ks-support-topics">
          {helpTopics.map(({ label, icon: Icon }, index) => (
            <motion.button
              key={label}
              type="button"
              whileHover={{ y: -4 }}
              whileTap={{ scale: .97 }}
              onClick={() => updateForm({ subject: label })}
              className={`ks-support-topic ${form.subject === label ? "is-active" : ""}`}
            >
              <span className="ks-support-topic__icon"><Icon size={19} /></span>
              <span>{label}</span><ArrowUpRight size={15} className="ks-support-topic__arrow" />
            </motion.button>
          ))}
        </div>

        <div className="ks-support-contact-grid">
          <a className="ks-support-contact-card" href="mailto:support@kaamsetu.com">
            <span className="ks-support-contact-card__icon"><Mail size={21} /></span>
            <span className="ks-support-contact-card__label">DROP US AN EMAIL</span>
            <strong>support@kaamsetu.com</strong>
            <span className="ks-support-contact-card__foot">We usually reply within 24 hours <ArrowUpRight size={16} /></span>
          </a>
          <a className="ks-support-contact-card" href="tel:+919876543210">
            <span className="ks-support-contact-card__icon"><Phone size={21} /></span>
            <span className="ks-support-contact-card__label">GIVE US A CALL</span>
            <strong>+91 98765 43210</strong>
            <span className="ks-support-contact-card__foot">Talk to our support team <ArrowUpRight size={16} /></span>
          </a>
          <div className="ks-support-contact-card ks-support-contact-card--hours">
            <span className="ks-support-contact-card__icon"><Clock3 size={21} /></span>
            <span className="ks-support-contact-card__label">WE’RE ON IT</span>
            <strong>Within 24 Hours</strong>
            <span className="ks-support-contact-card__foot">Your query matters to us <CheckCircle2 size={16} /></span>
          </div>
        </div>

        <div className="ks-support-workspace">
          <motion.section
            className="ks-support-form-panel"
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: .15 }}
            transition={{ duration: .5 }}
          >
            <div className="ks-support-panel-heading">
              <span className="ks-support-panel-icon"><Send size={19} /></span>
              <div><span className="ks-support-kicker">SEND A MESSAGE</span><h2>Tell us what’s up.</h2></div>
            </div>
            <p className="ks-support-panel-copy">Share a few details and our team will get back to you.</p>
            <form onSubmit={handleSubmit} className="ks-support-form">
              <div className="ks-support-form__row">
                <label><span>Full name</span><input type="text" placeholder="e.g. Rajesh Sahu" value={form.fullName} onChange={(e) => updateForm({ fullName: e.target.value })} required /></label>
                <label><span>Email address</span><input type="email" placeholder="you@example.com" value={form.email} onChange={(e) => updateForm({ email: e.target.value })} required /></label>
              </div>
              <label><span>What do you need help with?</span><input type="text" placeholder="Choose a topic above or type here" value={form.subject} onChange={(e) => updateForm({ subject: e.target.value })} required /></label>
              <label><span>Your message</span><textarea rows="5" placeholder="Tell us a little more about the issue..." value={form.message} onChange={(e) => updateForm({ message: e.target.value })} required /></label>
              <div className="ks-support-form__footer"><span><ShieldCheck size={15} /> Your details stay safe with us.</span><button type="submit" disabled={submitting}>{submitting ? "Sending..." : "Send message"} <ArrowRight size={18} /></button></div>
            </form>
          </motion.section>

          <motion.aside
            className="ks-support-faq-panel"
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: .15 }}
            transition={{ duration: .5, delay: .08 }}
          >
            <span className="ks-support-kicker">QUICK ANSWERS</span>
            <h2>Good to know.</h2>
            <p className="ks-support-panel-copy">A few things people often ask us.</p>
            <div className="ks-support-faq-list">
              {faqs.map((faq, index) => {
                const isOpen = openFaq === index;
                return (
                  <div className={`ks-support-faq ${isOpen ? "is-open" : ""}`} key={faq.question}>
                    <button type="button" onClick={() => setOpenFaq(isOpen ? null : index)} aria-expanded={isOpen}>
                      <span className="ks-support-faq__number">0{index + 1}</span><span>{faq.question}</span><ChevronDown size={18} />
                    </button>
                    <AnimatePresence initial={false}>
                      {isOpen && <motion.div className="ks-support-faq__answer" initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: .25 }}><p>{faq.answer}</p></motion.div>}
                    </AnimatePresence>
                  </div>
                );
              })}
            </div>
            <div className="ks-support-faq-note"><MessageCircle size={18} /><span><b>Still have questions?</b><small>Send us a message and we’ll help you out.</small></span></div>
          </motion.aside>
        </div>
      </section>
    </main>
  );
};

export default SupportPage;
