import { useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Footer from "@/components/client/Footer";
import "./HomeIntro.css";

gsap.registerPlugin(ScrollTrigger);

const HomeIntro = ({ children }) => {
  const rootRef = useRef(null);
  const videoRef = useRef(null);

  useLayoutEffect(() => {
    const root = rootRef.current;
    const track = root?.querySelector(".ks-intro__scroll-track");
    const stage = root?.querySelector(".ks-intro__stage");
    const navbar = document.querySelector("header");
    const navbarLogo = navbar?.querySelector('a[href="/"]');
    const content = root?.querySelector(".ks-home-content");

    if (!root || !track || !stage || !navbar || !navbarLogo || !content) {
      return undefined;
    }

    const html = document.documentElement;
    const body = document.body;
    const previousHtmlOverflow = html.style.overflow;
    const previousBodyOverflow = body.style.overflow;
    let touchStartY = 0;

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
        const panel = root.querySelector(".ks-intro__panel");
        const logo = root.querySelector(".ks-intro__logo");
        const video = videoRef.current;
        const scrollHint = root.querySelector(".ks-intro__scroll-hint");
        const previewNav = root.querySelector(".ks-intro__preview-nav");
        const ticker = root.querySelector(".ks-intro__ticker");
        const panelCopy = root.querySelector(".ks-intro__panel-copy");
        const panelSurface = root.querySelector(".ks-intro__panel-surface");
        const shade = root.querySelector(".ks-intro__shade");

        const restorePage = () => {
          html.classList.remove("kaamsetu-site-scroll-active");
          html.style.overflow = previousHtmlOverflow;
          body.style.overflow = previousBodyOverflow;
        };

        const lockDocumentForSiteScroll = () => {
          html.style.overflow = "hidden";
          body.style.overflow = "hidden";
          html.classList.add("kaamsetu-site-scroll-active");
        };

        if (reduceMotion) {
          html.classList.remove("kaamsetu-intro-active");
          gsap.set([stage, content, navbar], { clearProps: "all" });
          track.style.height = "0px";
          gsap.set(content, { autoAlpha: 1, pointerEvents: "auto" });
          gsap.set(stage, { autoAlpha: 0, pointerEvents: "none" });
          gsap.set(navbar, { autoAlpha: 1, pointerEvents: "auto" });
          return restorePage;
        }

        const introScrollFactor = mobile ? 2.8 : tablet ? 2.7 : 2.6;
        track.style.height = `${(introScrollFactor + 1) * 100}svh`;

        const showIntroState = () => {
          // During the intro/reverse phase the inner website must not be
          // visible, scrollable, or interactive. This prevents two scrollbars
          // and prevents clicks from switching scroll ownership mid-transition.
          gsap.set(content, {
            autoAlpha: 0,
            pointerEvents: "none",
            overflow: "hidden",
          });
          gsap.set(stage, { autoAlpha: 1, pointerEvents: "auto" });
          gsap.set(navbar, { autoAlpha: 0, pointerEvents: "none" });
        };

        const showWebsiteState = () => {
          gsap.set(content, {
            autoAlpha: 1,
            pointerEvents: "auto",
            overflowX: "hidden",
            overflowY: "auto",
          });
          gsap.set(stage, { autoAlpha: 0, pointerEvents: "none" });
          gsap.set(navbar, { autoAlpha: 1, pointerEvents: "auto" });
        };

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
        gsap.set(content, { autoAlpha: 0, y: 0 });
        gsap.set(stage, { autoAlpha: 1, pointerEvents: "auto" });
        gsap.set(panel, {
          width: mobile ? "78vw" : tablet ? "72vw" : "min(66vw, 860px)",
          height: mobile ? "58svh" : tablet ? "62svh" : "60svh",
          borderRadius: mobile ? 18 : 4,
          xPercent: -50,
          yPercent: -50,
          left: "50%",
          top: "50%",
          transformOrigin: "center center",
        });
        gsap.set(logo, {
          x: 0,
          y: 0,
          scale: 1,
          autoAlpha: 1,
          transformOrigin: "center center",
        });
        gsap.set(video, { scale: 1.02, autoAlpha: 1 });


        const timeline = gsap.timeline({
          defaults: { ease: "none" },
          scrollTrigger: {
            trigger: track,
            start: "top top",
            end: () =>
              `+=${Math.round(window.innerHeight * introScrollFactor)}`,
            scrub: 1.4,
            anticipatePin: 1,
            invalidateOnRefresh: true,
            refreshPriority: 1,
            onLeave: () => {
              // Switch scroll ownership only when the complete intro timeline
              // has reached its end. No website content is revealed early.
              lockDocumentForSiteScroll();
              content.scrollTop = 0;
              showWebsiteState();
            },
            onEnterBack: () => {
              // Keep the real navbar visible while the intro logo retraces
              // its path from the navbar. The timeline crossfade handles
              // hiding the navbar only as the logo moves away from it.
              restorePage();
              // Immediately hand the viewport back to the intro. The real
              // navbar stays visible; the scrubbed logo tween reverses from
              // its navbar position while the inner page scrollbar is hidden.
              gsap.set(content, {
                autoAlpha: 0,
                pointerEvents: "none",
                overflow: "hidden",
              });
              gsap.set(stage, { autoAlpha: 1, pointerEvents: "auto" });
            },
            onLeaveBack: () => {
              restorePage();
              content.scrollTop = 0;
              showIntroState();
            },
          },
        });

        timeline.to(
          panel,
          {
            width: "100vw",
            height: "100svh",
            borderRadius: 0,
            duration: 0.62,
            ease: "power2.inOut",
          },
          0,
        );

        timeline.to(
          panelSurface,
          { backgroundColor: "#080B09", duration: 0.62 },
          0,
        );

        timeline.to(previewNav, { autoAlpha: 0, y: -14, duration: 0.24 }, 0.28);
        timeline.to(ticker, { autoAlpha: 0, y: 18, duration: 0.2 }, 0.34);
        timeline.to(panelCopy, { autoAlpha: 0, y: 20, duration: 0.2 }, 0.3);

        timeline.to(
          logo,
          {
            x: () => getLogoDestination().x,
            y: () => getLogoDestination().y,
            scale: () => getLogoDestination().scale,
            duration: 0.72,
            ease: "power2.inOut",
          },
          0.18,
        );

        timeline.to(
          logo.querySelector(".ks-intro__wordmark span:first-child"),
          { color: "#FFFFFF", duration: 0.3 },
          0.38,
        );
        timeline.to(
          logo.querySelector(".ks-intro__wordmark span:last-child"),
          { color: "#39F58A", duration: 0.3 },
          0.38,
        );
        timeline.to(
          logo.querySelector(".ks-intro__tagline"),
          { color: "rgba(255,255,255,0.78)", duration: 0.3 },
          0.38,
        );

        timeline.to(
          video,
          { scale: desktop ? 1.1 : 1.06, autoAlpha: 0.2, duration: 0.72 },
          0,
        );
        timeline.to(shade, { opacity: 0.96, duration: 0.72 }, 0);

        timeline.to(
          navbar,
          {
            autoAlpha: 1,
            pointerEvents: "auto",
            duration: 0.12,
            ease: "power1.out",
          },
          0.76,
        );

        timeline.to(
          logo,
          { autoAlpha: 0, duration: 0.2, ease: "power1.inOut" },
          0.88,
        );

        timeline.to(
          scrollHint,
          { autoAlpha: 0, y: 12, duration: 0.1 },
          0.84,
        );

        // Reveal the real site only after the box has filled the viewport
        // and the logo has completed its navbar handoff. These tweens also
        // reverse naturally when the user scrolls back up.
        timeline.to(
          content,
          { autoAlpha: 1, pointerEvents: "auto", duration: 0.22, ease: "power1.inOut" },
          1.02,
        );

        timeline.to(
          stage,
          { autoAlpha: 0, pointerEvents: "none", duration: 0.22, ease: "power1.inOut" },
          1.02,
        );

        timeline.to({}, { duration: 0.18 });

        // Capture wheel input at document level, not only over the content
        // panel. This keeps scrolling responsive even when the pointer is
        // resting over the fixed navbar at the intro-to-site handoff.
        const handleGlobalWheel = (event) => {
          if (!html.classList.contains("kaamsetu-site-scroll-active")) return;

          event.preventDefault();

          let deltaY = event.deltaY;
          if (event.deltaMode === 1) deltaY *= 16;
          if (event.deltaMode === 2) deltaY *= window.innerHeight;

          const nextScrollTop = content.scrollTop + deltaY;
          const maxScrollTop = content.scrollHeight - content.clientHeight;

          if (deltaY < 0 && nextScrollTop < 0) {
            content.scrollTop = 0;
            restorePage();
            window.scrollTo(0, Math.max(0, window.scrollY + nextScrollTop));
            ScrollTrigger.update();
            return;
          }

          content.scrollTop = Math.max(0, Math.min(maxScrollTop, nextScrollTop));
        };

        const handleTouchStart = (event) => {
          touchStartY = event.touches[0]?.clientY ?? 0;
        };

        const handleTouchMove = (event) => {
          const currentY = event.touches[0]?.clientY ?? touchStartY;
          const delta = currentY - touchStartY;

          if (content.scrollTop <= 0 && delta > 8) {
            event.preventDefault();
            restorePage();
            window.scrollTo(0, Math.max(0, window.scrollY - Math.min(delta, 140)));
            ScrollTrigger.update();
            touchStartY = currentY;
          }
        };

        document.addEventListener("wheel", handleGlobalWheel, { passive: false, capture: true });
        content.addEventListener("touchstart", handleTouchStart, { passive: true });
        content.addEventListener("touchmove", handleTouchMove, { passive: false });

        return () => {
          document.removeEventListener("wheel", handleGlobalWheel, true);
          content.removeEventListener("touchstart", handleTouchStart);
          content.removeEventListener("touchmove", handleTouchMove);
          restorePage();
        };
      },
    );

    return () => {
      media.revert();
      html.classList.remove("kaamsetu-intro-active");
      html.style.overflow = previousHtmlOverflow;
      body.style.overflow = previousBodyOverflow;
      gsap.set(navbar, { clearProps: "opacity,visibility,pointer-events" });
    };
  }, []);

  return (
    <div ref={rootRef} className="ks-intro">
      <div className="ks-intro__scroll-track" aria-hidden="true" />

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

      <div className="ks-home-content">
        <div className="ks-home-content__inner">
          {children}
          <Footer />
        </div>
      </div>
    </div>
  );
};

export default HomeIntro;
