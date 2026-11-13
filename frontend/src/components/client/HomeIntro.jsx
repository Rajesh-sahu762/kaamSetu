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
    if (!root) return undefined;

    const navbarLogo = document.querySelector('header a[href="/"]');
    if (!navbarLogo) return undefined;

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
        const logo = root.querySelector(".ks-intro__logo");
        const stage = root.querySelector(".ks-intro__stage");
        const content = root.querySelector(".ks-home-content");
        const video = videoRef.current;

        if (reduceMotion) {
          html.classList.remove("kaamsetu-intro-active");
          gsap.set(navbarLogo, { clearProps: "opacity,visibility" });
          gsap.set([stage, content], { clearProps: "all" });
          return undefined;
        }

        const getLogoDestination = () => {
          const from = logo.getBoundingClientRect();
          const to = navbarLogo.getBoundingClientRect();

          return {
            x: to.left + to.width / 2 - (from.left + from.width / 2),
            y: to.top + to.height / 2 - (from.top + from.height / 2),
            scale: Math.min(
              to.width / from.width,
              to.height / from.height,
            ),
          };
        };

        gsap.set(navbarLogo, { autoAlpha: 0 });
        gsap.set(content, { autoAlpha: 0.72, y: mobile ? 18 : 28 });
        gsap.set(logo, { x: 0, y: 0, scale: 1, transformOrigin: "center center" });

        const timeline = gsap.timeline({
          defaults: { ease: "none" },
          scrollTrigger: {
            trigger: root,
            start: "top top",
            end: () => `+=${Math.round(window.innerHeight * (mobile ? 1.05 : tablet ? 1.2 : 1.35))}`,
            scrub: 1,
            pin: stage,
            pinSpacing: true,
            anticipatePin: 1,
            invalidateOnRefresh: true,
            refreshPriority: 1,
          },
        });

        timeline.to(
          logo,
          {
            x: () => getLogoDestination().x,
            y: () => getLogoDestination().y,
            scale: () => getLogoDestination().scale,
            duration: 0.78,
            ease: "power2.inOut",
          },
          0,
        );

        timeline.to(
          stage,
          {
            backgroundColor: "#080B09",
            duration: 0.75,
          },
          0,
        );

        if (video) {
          timeline.to(
            video,
            {
              scale: desktop ? 1.13 : 1.08,
              autoAlpha: 0.22,
              duration: 0.85,
            },
            0,
          );
        }

        timeline.to(
          root.querySelector(".ks-intro__shade"),
          { opacity: 0.9, duration: 0.8 },
          0,
        );

        timeline.to(
          content,
          {
            autoAlpha: 1,
            y: 0,
            duration: 0.55,
            ease: "power2.out",
          },
          0.48,
        );

        timeline.to(
          logo,
          { autoAlpha: 0, duration: 0.08 },
          0.9,
        );

        timeline.to(
          navbarLogo,
          { autoAlpha: 1, duration: 0.12, ease: "power1.out" },
          0.9,
        );

        timeline.to(
          stage,
          { autoAlpha: 0, duration: 0.1 },
          0.96,
        );

        const refresh = () => ScrollTrigger.refresh();
        const refreshTimer = window.setTimeout(refresh, 700);
        window.addEventListener("resize", refresh);

        return () => {
          window.clearTimeout(refreshTimer);
          window.removeEventListener("resize", refresh);
          gsap.set(navbarLogo, { clearProps: "opacity,visibility" });
        };
      },
    );

    return () => {
      media.revert();
      html.classList.remove("kaamsetu-intro-active");
      gsap.set(navbarLogo, { clearProps: "opacity,visibility" });
    };
  }, []);

  return (
    <>
      <section ref={rootRef} className="ks-intro" aria-label="KaamSetu introduction">
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
