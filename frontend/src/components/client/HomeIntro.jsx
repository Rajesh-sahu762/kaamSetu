import { useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import "./HomeIntro.css";

gsap.registerPlugin(ScrollTrigger);

const HomeIntro = ({ children }) => {
  const rootRef = useRef(null);
  const videoRef = useRef(null);

  useLayoutEffect(() => {
    const root = rootRef.current;
    const navbar = document.querySelector("header");
    const navbarLogo = navbar?.querySelector('a[href="/"]');

    if (!root || !navbar || !navbarLogo) return undefined;

    const html = document.documentElement;
    html.classList.add("kaamsetu-intro-active");

    const media = gsap.matchMedia();

    media.add(
      {
        desktop: "(min-width: 1024px)",
        tablet: "(min-width: 640px) and (max-width: 1023px)",
        mobile: "(max-width: 639px)",
        reduceMotion: "(prefers-reduced-motion: reduce)",
      },
      (context) => {
        const { desktop, tablet, mobile, reduceMotion } = context.conditions;
        const stage = root.querySelector(".ks-intro__stage");
        const panel = root.querySelector(".ks-intro__panel");
        const logo = root.querySelector(".ks-intro__logo");
        const content = root.querySelector(".ks-home-content");
        const video = videoRef.current;
        const scrollHint = root.querySelector(".ks-intro__scroll-hint");

        if (reduceMotion) {
          html.classList.remove("kaamsetu-intro-active");
          gsap.set([stage, content, navbar], { clearProps: "all" });
          return undefined;
        }

        const getLogoDestination = () => {
          const from = logo.getBoundingClientRect();
          const to = navbarLogo.getBoundingClientRect();

          return {
            x: to.left + to.width / 2 - (from.left + from.width / 2),
            y: to.top + to.height / 2 - (from.top + from.height / 2),
            scale: Math.min(to.width / from.width, to.height / from.height),
          };
        };

        gsap.set(navbar, { autoAlpha: 0, pointerEvents: "none" });
        gsap.set(content, { autoAlpha: 1, y: 0 });
        gsap.set(panel, {
          width: mobile ? "90vw" : tablet ? "86vw" : "min(82vw, 1120px)",
          height: mobile ? "72svh" : "76svh",
          borderRadius: mobile ? 18 : 4,
          scale: 1,
          transformOrigin: "center center",
        });
        gsap.set(logo, { x: 0, y: 0, scale: 1, transformOrigin: "center center" });
        gsap.set(stage, { autoAlpha: 1 });
        gsap.set(video, { scale: 1.02, autoAlpha: 1 });

        const timeline = gsap.timeline({
          defaults: { ease: "none" },
          scrollTrigger: {
            trigger: root,
            start: "top top",
            end: () => `+=${Math.round(window.innerHeight * (mobile ? 1.15 : tablet ? 1.25 : 1.4))}`,
            scrub: 1,
            pin: stage,
            pinSpacing: true,
            anticipatePin: 1,
            invalidateOnRefresh: true,
            refreshPriority: 1,
          },
        });

        timeline.to(
          panel,
          {
            width: "100vw",
            height: "100svh",
            borderRadius: 0,
            duration: 0.82,
            ease: "power2.inOut",
          },
          0,
        );

        timeline.to(
          root.querySelector(".ks-intro__panel-surface"),
          { backgroundColor: "#080B09", duration: 0.82 },
          0,
        );

        timeline.to(
          root.querySelector(".ks-intro__preview-nav"),
          { autoAlpha: 0, y: -14, duration: 0.35 },
          0.34,
        );

        timeline.to(
          root.querySelector(".ks-intro__ticker"),
          { autoAlpha: 0, y: 18, duration: 0.25 },
          0.45,
        );

        timeline.to(
          logo,
          {
            x: () => getLogoDestination().x,
            y: () => getLogoDestination().y,
            scale: () => getLogoDestination().scale,
            duration: 0.78,
            ease: "power2.inOut",
          },
          0.12,
        );

        timeline.to(
          root.querySelector(".ks-intro__panel-copy"),
          { autoAlpha: 0, y: 20, duration: 0.25 },
          0.3,
        );

        timeline.to(
          video,
          { scale: desktop ? 1.1 : 1.06, autoAlpha: 0.28, duration: 0.82 },
          0,
        );

        timeline.to(
          root.querySelector(".ks-intro__shade"),
          { opacity: 0.94, duration: 0.82 },
          0,
        );

        timeline.to(
          navbar,
          {
            autoAlpha: 1,
            pointerEvents: "auto",
            duration: 0.12,
            ease: "power1.out",
          },
          0.86,
        );

        timeline.to(
          logo,
          { autoAlpha: 0, duration: 0.08 },
          0.91,
        );

        timeline.to(
          stage,
          { autoAlpha: 0, duration: 0.12 },
          0.96,
        );

        const refresh = () => ScrollTrigger.refresh();
        const refreshTimer = window.setTimeout(refresh, 500);
        window.addEventListener("resize", refresh);

        return () => {
          window.clearTimeout(refreshTimer);
          window.removeEventListener("resize", refresh);
          gsap.set(navbar, { clearProps: "opacity,visibility,pointer-events" });
        };
      },
    );

    return () => {
      media.revert();
      html.classList.remove("kaamsetu-intro-active");
      gsap.set(navbar, { clearProps: "opacity,visibility,pointer-events" });
    };
  }, []);

  return (
    <>
      <section ref={rootRef} className="ks-intro" aria-label="KaamSetu website introduction">
        <div className="ks-intro__stage">
          <video
            ref={videoRef}
            className="ks-intro__video"
            src="/videos/kaamsetu-intro.mp4"
            autoPlay
            muted
            loop
            playsInline
            preload="metadata"
            aria-hidden="true"
            onError={(event) => {
              event.currentTarget.style.display = "none";
            }}
          />

          <div className="ks-intro__shade" />
          <div className="ks-intro__grain" aria-hidden="true" />

          <div className="ks-intro__panel">
            <div className="ks-intro__panel-surface">
              <div className="ks-intro__preview-nav">
                <nav aria-label="Preview navigation">
                  <span>Services</span>
                  <span>Experts</span>
                  <span>Support</span>
                </nav>
                <span className="ks-intro__preview-cta">Become a Pro <span>↗</span></span>
              </div>

              <div className="ks-intro__panel-copy">
                <span className="ks-intro__eyebrow">YOUR SPACE. OUR EXPERTISE.</span>
                <p>Trusted hands for every corner of your home.</p>
              </div>

              <div className="ks-intro__ticker" aria-hidden="true">
                <span>FIND TRUSTED PROFESSIONALS</span>
                <span>•</span>
                <span>BOOK WITH CONFIDENCE</span>
                <span>•</span>
                <span>QUALITY YOU CAN TRUST</span>
                <span>•</span>
                <span>FIND TRUSTED PROFESSIONALS</span>
              </div>
            </div>
          </div>

          <div className="ks-intro__logo" aria-label="KaamSetu">
            <span className="ks-intro__wordmark">
              <span>Kaam</span>
              <span>Setu</span>
            </span>
            <span className="ks-intro__tagline">Trusted Services</span>
          </div>

          <div className="ks-intro__scroll-hint" aria-hidden="true">
            <span className="ks-intro__scroll-line" />
            <span>Scroll to explore</span>
          </div>
        </div>
      </section>

      <div className="ks-home-content">{children}</div>
    </>
  );
};

export default HomeIntro;
