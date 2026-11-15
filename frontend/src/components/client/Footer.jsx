import { useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import {
  ArrowRight, ArrowUp, BriefcaseBusiness, Building2, ChevronDown,
  Headset, House, Mail, Send, ShieldCheck,
} from "lucide-react";
import { FaFacebookF, FaInstagram, FaLinkedinIn, FaXTwitter } from "react-icons/fa6";
import palaceLandscape from "../../assets/kaamsetu-footer-palace.svg";
import "./Footer.css";

const footerGroups = [
  { title: "Services", icon: BriefcaseBusiness, links: ["Electrician", "Plumber", "Carpenter", "Painter", "AC Repair"] },
  { title: "Company", icon: Building2, links: ["About Us", "How It Works", "Careers", "Contact", "Blog"] },
  { title: "Support", icon: Headset, links: ["Help Center", "Privacy Policy", "Terms", "Refund Policy", "FAQ"] },
];

const socials = [
  { label: "Facebook", Icon: FaFacebookF },
  { label: "Instagram", Icon: FaInstagram },
  { label: "LinkedIn", Icon: FaLinkedinIn },
  { label: "X", Icon: FaXTwitter },
];


function FooterEmblem() {
  return (
    <div className="ks-footer__emblem" aria-hidden="true">
      <div className="ks-footer__emblem-orbit ks-footer__emblem-orbit--one" />
      <div className="ks-footer__emblem-orbit ks-footer__emblem-orbit--two" />
      <div className="ks-footer__emblem-backplate"><House size={82} strokeWidth={1.8} /></div>
      <div className="ks-footer__emblem-shield"><ShieldCheck size={100} strokeWidth={1.7} /></div>
      <div className="ks-footer__emblem-platform"><span /></div>
    </div>
  );
}

const Footer = () => {
  const [openGroup, setOpenGroup] = useState(null);
  const reduceMotion = useReducedMotion();

  const scrollTop = () => window.scrollTo({ top: 0, behavior: reduceMotion ? "auto" : "smooth" });

  return (
    <footer className="ks-footer">
      <div className="ks-footer__ambient ks-footer__ambient--top" aria-hidden="true" />
      <div className="ks-footer__ambient ks-footer__ambient--right" aria-hidden="true" />
      <div className="ks-footer__curve ks-footer__curve--top" aria-hidden="true" />
      <div className="ks-footer__curve ks-footer__curve--bottom" aria-hidden="true" />
      <div className="ks-footer__dots ks-footer__dots--tl" aria-hidden="true" />
      <div className="ks-footer__dots ks-footer__dots--tr" aria-hidden="true" />
      <div className="ks-footer__dots ks-footer__dots--bl" aria-hidden="true" />
      <div className="ks-footer__dots ks-footer__dots--br" aria-hidden="true" />

      <div className="ks-footer__container">
        <div className="ks-footer__main">
          <motion.div className="ks-footer__brand" initial={reduceMotion ? false : { opacity: 0, y: 18 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: .15 }} transition={{ duration: .55 }}>
            <a className="ks-footer__wordmark" href="/" aria-label="KaamSetu home">
              <span>Kaam</span><strong>Setu</strong><i aria-hidden="true">✦</i>
            </a>
            <span className="ks-footer__tagline">TRUSTED SERVICES</span>
            <p>Connecting customers with trusted professionals across India. Find verified experts for every service you need.</p>
            <div className="ks-footer__socials" aria-label="Social media">
              {socials.map(({ label, Icon }) => (
                <span className="ks-footer__social" key={label} aria-label={label} title={label}>
                  <Icon size={19} />
                </span>
              ))}
            </div>
          </motion.div>

          <nav className="ks-footer__navigation" aria-label="Footer navigation">
            {footerGroups.map(({ title, icon: Icon, links }, index) => (
              <div className="ks-footer__nav-column" key={title}>
                <button className="ks-footer__nav-heading" type="button" aria-expanded={openGroup === title} onClick={() => setOpenGroup(openGroup === title ? null : title)}>
                  <span className="ks-footer__nav-icon"><Icon size={25} strokeWidth={2.3} /></span>
                  <span>{title}</span>
                  <ChevronDown className="ks-footer__nav-chevron" size={17} />
                </button>
                <ul className={openGroup === title ? "ks-footer__links is-open" : "ks-footer__links"}>
                  {links.map((link) => (
                    <li key={link}><a href="#" onClick={(event) => event.preventDefault()}><ArrowRight size={16} />{link}</a></li>
                  ))}
                </ul>
                {index < footerGroups.length - 1 && <span className="ks-footer__column-rule" aria-hidden="true" />}
              </div>
            ))}
          </nav>

          <aside className="ks-footer__newsletter" aria-label="Newsletter">
            <div className="ks-footer__paper-plane"><Send size={42} fill="currentColor" strokeWidth={1.4} /></div>
            <h3>Subscribe to Our Newsletter</h3>
            <p>Get the latest updates and exclusive offers.</p>
            <div className="ks-footer__newsletter-field" aria-disabled="true">
              <Mail size={19} />
              <input type="email" placeholder="Newsletter signup coming soon" disabled aria-label="Newsletter signup unavailable" />
              <button type="button" disabled aria-label="Newsletter signup unavailable"><ArrowRight size={22} /></button>
            </div>
            <small>Newsletter subscriptions are not enabled yet.</small>
          </aside>
        </div>

        <div className="ks-footer__scene" aria-hidden="true">
          <img className="ks-footer__palace" src={palaceLandscape} alt="" />
          <FooterEmblem />
        </div>

        <div className="ks-footer__bottom">
          <p>© {new Date().getFullYear()} KaamSetu. All rights reserved.</p>
          <div className="ks-footer__trust"><span><ShieldCheck size={32} /></span><b>Your Trust, Our Priority</b></div>
          <button className="ks-footer__back-top" type="button" onClick={scrollTop}>
            <span>Back To Top</span><i><ArrowUp size={22} /></i>
          </button>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
