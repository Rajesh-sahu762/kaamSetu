import { useLayoutEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import {
  ArrowRight,
  BadgeCheck,
  BriefcaseBusiness,
  CalendarCheck,
  CalendarDays,
  Check,
  CheckCircle2,
  Clock3,
  MessageCircle,
  Search,
  ShieldCheck,
  Sparkles,
  Star,
  UserRound,
} from "lucide-react";
import "./HowItWorks.css";

gsap.registerPlugin(ScrollTrigger);

const customerSteps = [
  {
    title: "Find a Service",
    desc: "Browse trusted home services and choose exactly what you need, from repairs to everyday essentials.",
    visual: "search",
  },
  {
    title: "Connect with Experts",
    desc: "Explore verified professionals, compare their experience and reviews, and connect with the right expert.",
    visual: "expert",
  },
  {
    title: "Book & Get It Done",
    desc: "Pick a date and time that works for you, then let your selected professional take care of the job.",
    visual: "booking",
  },
  {
    title: "Rate & Review",
    desc: "Share your experience after the service and help the KaamSetu community choose with confidence.",
    visual: "review",
  },
];

const professionalSteps = [
  {
    title: "Create Profile",
    desc: "Register and submit your professional details.",
    visual: "search",
  },
  {
    title: "Get Verified",
    desc: "Our team verifies your documents and approves your profile.",
    visual: "expert",
  },
  {
    title: "Receive Leads",
    desc: "Start receiving service requests from nearby customers.",
    visual: "booking",
  },
  {
    title: "Earn More",
    desc: "Grow your business and increase your monthly income.",
    visual: "review",
  },
];

const tracks = {
  customer: {
    label: "For Customers",
    note: "From finding the right help to sharing your experience — every step stays simple.",
    cta: "Get Started Today",
    to: "/services",
    steps: customerSteps,
  },
  professional: {
    label: "For Professionals",
    note: "Set up your profile, get verified and turn your skills into new opportunities.",
    cta: "Get Started Today",
    to: "/register/vendor/Profile",
    steps: professionalSteps,
  },
};

const JourneyIllustration = ({ type }) => {
  if (type === "search") {
    return (
      <div className="how-visual how-visual--search" aria-hidden="true">
        <div className="how-visual__spark how-visual__spark--one"><Sparkles size={15} /></div>
        <div className="how-search-window">
          <div className="how-window-dots"><i /><i /><i /></div>
          <div className="how-search-field"><Search size={17} /><span>What service do you need?</span><span className="how-search-go"><ArrowRight size={14} /></span></div>
          <div className="how-search-tags"><span>AC Repair</span><span>Cleaning</span><span>Plumbing</span></div>
        </div>
        <div className="how-visual__orbit how-visual__orbit--search" />
      </div>
    );
  }

  if (type === "expert") {
    return (
      <div className="how-visual how-visual--expert" aria-hidden="true">
        <div className="how-expert-card">
          <div className="how-expert-avatar"><UserRound size={25} /></div>
          <div className="how-expert-info"><b>Verified Expert</b><span>Trusted professional</span><div className="how-mini-stars"><Star /><Star /><Star /><Star /><Star /></div></div>
          <span className="how-verified-mark"><BadgeCheck size={18} /></span>
        </div>
        <div className="how-chat-bubble"><MessageCircle size={17} /><span>Let's get it done!</span></div>
        <div className="how-visual__spark how-visual__spark--two"><ShieldCheck size={19} /></div>
      </div>
    );
  }

  if (type === "booking") {
    return (
      <div className="how-visual how-visual--booking" aria-hidden="true">
        <div className="how-calendar-card">
          <div className="how-calendar-head"><CalendarDays size={18} /><b>Your booking</b><span>•••</span></div>
          <div className="how-calendar-month">Available slots <span>June 2026</span></div>
          <div className="how-calendar-grid">{["M", "T", "W", "T", "F", "S", "S", "8", "9", "10", "11", "12", "13", "14"].map((day, index) => <span className={index === 10 ? "is-selected" : ""} key={index}>{day}</span>)}</div>
        </div>
        <div className="how-booking-confirm"><CheckCircle2 size={17} /><span>Booking confirmed</span></div>
        <div className="how-time-chip"><Clock3 size={15} /> 10:30 AM</div>
      </div>
    );
  }

  return (
    <div className="how-visual how-visual--review" aria-hidden="true">
      <div className="how-review-card">
        <div className="how-review-top"><span className="how-review-avatar">RS</span><div><b>Service completed</b><span>How was your experience?</span></div><CheckCircle2 size={18} /></div>
        <div className="how-review-stars"><Star /><Star /><Star /><Star /><Star /></div>
        <div className="how-review-lines"><i /><i /><i /></div>
        <div className="how-review-foot"><span>Excellent work!</span><Sparkles size={16} /></div>
      </div>
      <div className="how-visual__spark how-visual__spark--three"><Star size={17} /></div>
    </div>
  );
};

const stepIcons = [Search, UserRound, CalendarCheck, Star];

const HowItWorks = () => {
  const [activeTrack, setActiveTrack] = useState("customer");
  const sectionRef = useRef(null);
  const headingRef = useRef(null);
  const subtitleRef = useRef(null);
  const timelineRef = useRef(null);
  const progressRef = useRef(null);
  const ctaRef = useRef(null);

  const activeJourney = tracks[activeTrack];

  useLayoutEffect(() => {
    const section = sectionRef.current;
    const timeline = timelineRef.current;
    const steps = timeline?.querySelectorAll(".how-journey__step");
    if (!section || !timeline || !steps?.length) return undefined;

    const context = gsap.context(() => {
      const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      if (reduceMotion) {
        gsap.set([headingRef.current, subtitleRef.current, ...steps, ctaRef.current], { clearProps: "all" });
        gsap.set(progressRef.current, { scaleX: 1, scaleY: 1 });
        return;
      }

      const isMobile = window.matchMedia("(max-width: 767px)").matches;
      const illustrations = timeline.querySelectorAll(".how-journey__illustration");
      const markers = timeline.querySelectorAll(".how-journey__step-marker");
      const arrows = timeline.querySelectorAll(".how-journey__connector-arrow");
      gsap.set([headingRef.current, subtitleRef.current], { opacity: 0, y: 22 });
      gsap.set(steps, { opacity: 0.38, y: 28 });
      gsap.set(illustrations, { scale: 0.94, y: 12 });
      gsap.set(arrows, { opacity: 0.2, x: -5 });
      gsap.set(ctaRef.current, { opacity: 0, y: 18 });
      gsap.set(progressRef.current, { [isMobile ? "scaleY" : "scaleX"]: 0 });

      const journey = gsap.timeline({
        scrollTrigger: {
          trigger: section,
          start: "top 76%",
          end: "bottom 38%",
          scrub: 0.8,
          invalidateOnRefresh: true,
        },
      });

      journey
        .to(headingRef.current, { opacity: 1, y: 0, duration: 0.28, ease: "none" }, 0)
        .to(subtitleRef.current, { opacity: 1, y: 0, duration: 0.28, ease: "none" }, 0.08)
        .to(progressRef.current, { [isMobile ? "scaleY" : "scaleX"]: 1, duration: 1.45, ease: "none" }, 0.12)
        .to(steps, { opacity: 1, y: 0, duration: 0.72, stagger: 0.19, ease: "none" }, 0.16)
        .to(illustrations, { scale: 1, y: 0, duration: 0.8, stagger: 0.19, ease: "none" }, 0.16)
        .to(markers, { borderColor: "rgba(16, 185, 129, 0.78)", boxShadow: "0 0 0 7px rgba(16, 185, 129, 0.1), 0 0 24px rgba(16, 185, 129, 0.2)", duration: 0.42, stagger: 0.19, ease: "none" }, 0.2)
        .to(arrows, { opacity: 1, x: 0, duration: 0.32, stagger: 0.19, ease: "none" }, 0.34)
        .to(ctaRef.current, { opacity: 1, y: 0, duration: 0.25, ease: "none" }, 1.18);
    }, section);

    return () => context.revert();
  }, [activeTrack]);

  return (
    <section className="how-journey" ref={sectionRef} aria-labelledby="how-journey-title">
      <div className="how-journey__ambient how-journey__ambient--left" aria-hidden="true" />
      <div className="how-journey__ambient how-journey__ambient--right" aria-hidden="true" />
      <div className="how-journey__wave" aria-hidden="true" />

      <div className="how-journey__container">
        <header className="how-journey__header">
          <span className="how-journey__eyebrow"><Sparkles size={14} /> HOW IT WORKS</span>
          <h2 id="how-journey-title" ref={headingRef}>Simple, Fast &amp; <span>Reliable</span></h2>
          <p ref={subtitleRef}>A clear, dependable journey from the first step to a job well done — for customers and professionals alike.</p>
        </header>

        <div className="how-journey__switcher" role="tablist" aria-label="Choose your KaamSetu journey">
          {Object.entries(tracks).map(([key, track]) => (
            <button
              key={key}
              type="button"
              role="tab"
              aria-selected={activeTrack === key}
              className={`how-journey__tab ${activeTrack === key ? "is-active" : ""}`}
              onClick={() => setActiveTrack(key)}
            >
              {key === "customer" ? <UserRound size={16} /> : <BriefcaseBusiness size={16} />}
              {track.label}
            </button>
          ))}
        </div>

        <p className="how-journey__track-note" key={activeTrack}>{activeJourney.note}</p>

        <div className="how-journey__timeline" ref={timelineRef}>
          <div className="how-journey__rail" aria-hidden="true">
            <span className="how-journey__rail-base" />
            <span className="how-journey__rail-progress" ref={progressRef} />
          </div>

          {activeJourney.steps.map((step, index) => {
            const Icon = stepIcons[index];
            return (
              <article className="how-journey__step" key={`${activeTrack}-${step.title}`}>
                <div className="how-journey__step-marker">
                  <span className="how-journey__number">{String(index + 1).padStart(2, "0")}</span>
                  <span className="how-journey__marker-icon"><Icon size={17} /></span>
                </div>
                <div className="how-journey__illustration"><JourneyIllustration type={step.visual} /></div>
                <div className="how-journey__copy">
                  <span className="how-journey__step-kicker">STEP {String(index + 1).padStart(2, "0")}</span>
                  <h3>{step.title}</h3>
                  <p>{step.desc}</p>
                </div>
                {index < activeJourney.steps.length - 1 && <ArrowRight className="how-journey__connector-arrow" size={17} aria-hidden="true" />}
              </article>
            );
          })}
        </div>

        <div className="how-journey__footer" ref={ctaRef}>
          <div><span className="how-journey__footer-icon"><Check size={16} /></span><span>Ready when you are</span></div>
          <Link to={activeJourney.to} className="how-journey__cta">{activeJourney.cta}<ArrowRight size={18} /></Link>
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
