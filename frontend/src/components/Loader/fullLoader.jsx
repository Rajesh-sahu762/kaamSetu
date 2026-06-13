import { useEffect, useRef, useState } from "react";

const SERVICES_INNER = [
  { emoji: "🔧", label: "Plumber",     angle: 0   },
  { emoji: "⚡", label: "Electrician", angle: 45  },
  { emoji: "🪚", label: "Carpenter",   angle: 90  },
  { emoji: "🎨", label: "Painter",     angle: 135 },
  { emoji: "🌿", label: "Gardener",    angle: 180 },
  { emoji: "🏗️", label: "Builder",     angle: 225 },
  { emoji: "🚗", label: "Mechanic",    angle: 270 },
  { emoji: "🧹", label: "Cleaner",     angle: 315 },
];

const SERVICES_OUTER = [
  { emoji: "🛁", label: "Plumbing",   angle: 20  },
  { emoji: "🏠", label: "Interior",   angle: 80  },
  { emoji: "💡", label: "Lighting",   angle: 140 },
  { emoji: "🔩", label: "Fabricator", angle: 200 },
  { emoji: "📐", label: "Architect",  angle: 260 },
  { emoji: "🌾", label: "Landscaper", angle: 320 },
];

const STATUS_MESSAGES = [
  "Finding your artisan",
  "Verifying credentials",
  "Bridging the connection",
  "Connecting you now",
];

const DEG = (d) => (d * Math.PI) / 180;

function useOrbit(services, radius, degreesPerSecond) {
  const [angles, setAngles] = useState(() => services.map((s) => s.angle));
  const lastRef = useRef(null);
  const rafRef = useRef(null);

  useEffect(() => {
    const tick = (ts) => {
      if (lastRef.current === null) lastRef.current = ts;
      const dt = (ts - lastRef.current) / 1000;
      lastRef.current = ts;
      setAngles((prev) => prev.map((a) => (a + degreesPerSecond * dt) % 360));
      rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafRef.current);
  }, [degreesPerSecond]);

  return angles;
}

function IconBubble({ emoji, label, x, y, delay }) {
  return (
    <div
      style={{
        position: "absolute",
        right: x - -410,
        top: y - -108,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 4,
        pointerEvents: "none",
        animation: `ks-iconPulse 3s ease-in-out ${delay}s infinite`,
      }}
    >
      <div
        style={{
          width: 44,
          height: 44,
          borderRadius: 10,
          background: "rgba(255,255,255,0.06)",
          border: "1px solid rgba(168,138,100,0.25)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: 20,
        }}
      >
        {emoji}
      </div>
      <span
        style={{
          fontFamily: "Geist, sans-serif",
          fontSize: 10,
          fontWeight: 500,
          color: "rgba(168,138,100,0.7)",
          letterSpacing: "0.04em",
          whiteSpace: "nowrap",
        }}
      >
        {label}
      </span>
    </div>
  );
}

function TravelDot({ delay, duration, top }) {
  return (
    <div
      style={{
        position: "absolute",
        top,
        width: 6,
        height: 6,
        borderRadius: "50%",
        background: "#A88A64",
        animation: `ks-dotTravel ${duration}s linear ${delay}s infinite`,
      }}
    />
  );
}

export default function KaamSetuLoader() {
  const [statusIdx, setStatusIdx] = useState(0);
  const [statusVisible, setStatusVisible] = useState(true);
  const [hexAngle1, setHexAngle1] = useState(0);
  const [hexAngle2, setHexAngle2] = useState(0);
  const hexRaf = useRef(null);
  const hexLast = useRef(null);


  const isMobile = window.innerWidth < 768;

const INNER_RADIUS = isMobile ? 140 : 220;
const OUTER_RADIUS = isMobile ? 220 : 340;

  const innerAngles = useOrbit(SERVICES_INNER, INNER_RADIUS, 360 / 22);
  const outerAngles = useOrbit(SERVICES_OUTER, OUTER_RADIUS, 360 / 35);




  useEffect(() => {
    const tick = (ts) => {
      if (hexLast.current === null) hexLast.current = ts;
      const dt = (ts - hexLast.current) / 1000;
      hexLast.current = ts;
      setHexAngle1((a) => a + 60 * dt);
      setHexAngle2((a) => a - 90 * dt);
      hexRaf.current = requestAnimationFrame(tick);
    };
    hexRaf.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(hexRaf.current);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setStatusVisible(false);
      setTimeout(() => {
        setStatusIdx((i) => (i + 1) % STATUS_MESSAGES.length);
        setStatusVisible(true);
      }, 300);
    }, 1600);
    return () => clearInterval(interval);
  }, []);

  const CX = 330;
  const CY = 220;

  const travelDots = [
    { delay: 0,   duration: 3.0, top: 18 },
    { delay: 0.7, duration: 3.8, top: 30 },
    { delay: 1.4, duration: 2.8, top: 12 },
    { delay: 2.1, duration: 3.4, top: 38 },
  ];

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Geist:wght@400;500;600&family=Inter:wght@400;500&display=swap');

        @keyframes ks-expandRing {
          0%   { transform: translate(-50%,-50%) scale(0.85); opacity: 0.4; }
          50%  { transform: translate(-50%,-50%) scale(1.05); opacity: 0.12; }
          100% { transform: translate(-50%,-50%) scale(0.85); opacity: 0.4; }
        }
        @keyframes ks-iconPulse {
          0%,100% { opacity: 0.55; }
          50%      { opacity: 1; }
        }
        @keyframes ks-corePulse {
          0%,100% { transform: scale(1); }
          50%      { transform: scale(1.06); }
        }
        @keyframes ks-progressFill {
          0%  { width: 0%; }
          80% { width: 100%; }
          100%{ width: 100%; }
        }
        @keyframes ks-shimmer {
          0%   { left: -60px; }
          80%  { left: 210px; }
          100% { left: 210px; }
        }
        @keyframes ks-dotTravel {
          0%   { left: -10px; opacity: 0; }
          8%   { opacity: 1; }
          92%  { opacity: 1; }
          100% { left: calc(100% + 10px); opacity: 0; }
        }
        @keyframes ks-fadeIn {
          from { opacity: 0; transform: translateY(6px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes ks-ringRotate {
          from { transform: rotate(0deg); }
          to   { transform: rotate(360deg); }
        }
      `}</style>

      <div
        style={{
          width: "100%",
          height: "100dvh",
minHeight: "100dvh",
          background: "#091426",
          position: "relative",
          overflow: "hidden",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontFamily: "Inter, sans-serif",
        }}
      >
        {/* Corner brackets */}
        {[
          { top: 20, left: 20,  borderTop: "1px solid #A88A64", borderLeft: "1px solid #A88A64" },
          { top: 20, right: 20, borderTop: "1px solid #A88A64", borderRight: "1px solid #A88A64" },
          { bottom: 20, left: 20,  borderBottom: "1px solid #A88A64", borderLeft: "1px solid #A88A64" },
          { bottom: 20, right: 20, borderBottom: "1px solid #A88A64", borderRight: "1px solid #A88A64" },
        ].map((s, i) => (
          <div key={i} style={{ position: "absolute", width: 36, height: 36, opacity: 0.3, ...s }} />
        ))}

        {/* Pulsing background rings */}
        {[
          { size: 480, delay: "0s" },
          { size: 340, delay: "0.6s" },
        ].map(({ size, delay }) => (
          <div
            key={size}
            style={{
              position: "absolute",
              width: size,
              height: size,
              borderRadius: "50%",
              border: "1px solid rgba(168,138,100,0.1)",
              top: "50%",
              left: "50%",
              animation: `ks-expandRing 4s ease-in-out ${delay} infinite`,
            }}
          />
        ))}

        {/* Orbit dashed tracks */}
        {[320, 480].map((size) => (
          <div
            key={size}
            style={{
              position: "absolute",
              width: size,
              height: size,
              top: "50%",
              left: "50%",
              transform: "translate(-50%,-50%)",
              borderRadius: "50%",
              border: "1px dashed rgba(168,138,100,0.1)",
            }}
          />
        ))}

        {/* Orbiting icon layer */}
        <div style={{ position: "absolute", inset: 0 }}>
          {SERVICES_INNER.map((s, i) => {
            const rad = DEG(innerAngles[i]);
            return (
              <IconBubble
                key={s.label}
                emoji={s.emoji}
                label={s.label}
                x={CX + INNER_RADIUS * Math.cos(rad)}
                y={CY + INNER_RADIUS * Math.sin(rad)}
                delay={i * 0.3}
              />
            );
          })}
          {SERVICES_OUTER.map((s, i) => {
            const rad = DEG(outerAngles[i]);
            return (
              <IconBubble
                key={s.label}
                emoji={s.emoji}
                label={s.label}
                x={CX + OUTER_RADIUS * Math.cos(rad)}
                y={CY + OUTER_RADIUS * Math.sin(rad)}
                delay={i * 0.4}
              />
            );
          })}
        </div>

        {/* Center Logo */}
        <div
          style={{
            position: "relative",
            zIndex: 10,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          {/* Hex spinner */}
          <div style={{ width: 80, height: 80, position: "relative", marginBottom: 20 }}>
            {/* Outer spinning ring */}
            <div
              style={{
                position: "absolute",
                inset: 0,
                borderRadius: 20,
                border: "2px solid #A88A64",
                transform: `rotate(${hexAngle1}deg)`,
              }}
            />
            {/* Inner counter-spinning ring */}
            <div
              style={{
                position: "absolute",
                inset: 8,
                borderRadius: 14,
                border: "1px solid rgba(168,138,100,0.35)",
                transform: `rotate(${hexAngle2}deg)`,
              }}
            />
            {/* Core */}
            <div
              style={{
                position: "absolute",
                inset: 14,
                background: "#A88A64",
                borderRadius: 12,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                animation: "ks-corePulse 2s ease-in-out infinite",
              }}
            >
              <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
                <path
                  d="M4 20 C8 8, 12 14, 14 10 C16 6, 20 14, 24 4"
                  stroke="white"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <circle cx="14" cy="22" r="3" fill="white" opacity="0.5" />
                <path d="M11 22 L17 22" stroke="white" strokeWidth="2" strokeLinecap="round" />
              </svg>
            </div>
          </div>

          {/* Brand name */}
          <div
            style={{
              fontFamily: "Geist, sans-serif",
              fontSize: 28,
              fontWeight: 600,
              color: "#fff",
              letterSpacing: "-0.02em",
              lineHeight: 1,
            }}
          >
            Kaam<span style={{ color: "#A88A64" }}>Setu</span>
          </div>

          {/* Tagline */}
          <div
            style={{
              fontFamily: "Inter, sans-serif",
              fontSize: 11,
              color: "rgba(255,255,255,0.28)",
              letterSpacing: "0.1em",
              textTransform: "uppercase",
              marginTop: 8,
            }}
          >
            Connecting Skills · Bridging Needs
          </div>

          {/* Progress bar */}
          <div
            style={{
              width: 200,
              height: 2,
              background: "rgba(255,255,255,0.07)",
              borderRadius: 2,
              marginTop: 28,
              overflow: "hidden",
              position: "relative",
            }}
          >
            <div
              style={{
                height: "100%",
                background: "#A88A64",
                borderRadius: 2,
                position: "relative",
                animation: "ks-progressFill 3.2s ease-in-out infinite",
              }}
            >
              <div
                style={{
                  position: "absolute",
                  top: 0,
                  bottom: 0,
                  width: 60,
                  background: "rgba(255,255,255,0.25)",
                  transform: "skewX(-20deg)",
                  animation: "ks-shimmer 3.2s ease-in-out infinite",
                }}
              />
            </div>
          </div>

          {/* Status text */}
          <div
            style={{
              fontFamily: "Geist, sans-serif",
              fontSize: 11,
              fontWeight: 500,
              color: "rgba(168,138,100,0.6)",
              letterSpacing: "0.06em",
              textTransform: "uppercase",
              marginTop: 12,
              minHeight: 16,
              opacity: statusVisible ? 1 : 0,
              transform: statusVisible ? "translateY(0)" : "translateY(4px)",
              transition: "opacity 0.3s ease, transform 0.3s ease",
            }}
          >
            {STATUS_MESSAGES[statusIdx]}
          </div>
        </div>

        {/* Bridge SVG at bottom */}
        <div
          style={{
            position: "absolute",
            bottom: 0,
            left: 0,
            right: 0,
            height: 80,
            pointerEvents: "none",
          }}
        >
          <svg viewBox="0 0 660 80" fill="none" style={{ width: "100%", height: "100%" }}>
            <path d="M0 70 Q165 20 330 40 Q495 60 660 10" stroke="rgba(168,138,100,0.12)" strokeWidth="1" />
            <path d="M0 76 Q165 32 330 52 Q495 72 660 22" stroke="rgba(168,138,100,0.06)" strokeWidth="1" />
            {[132, 264, 396, 528].map((x, i) => (
              <line key={i} x1={x} y1="0" x2={x} y2={40 + i * 8} stroke="rgba(168,138,100,0.1)" strokeWidth="1" strokeDasharray="3,4" />
            ))}
          </svg>

          {/* Travelling dots */}
          <div style={{ position: "absolute", inset: 0, overflow: "hidden" }}>
            {travelDots.map((d, i) => (
              <TravelDot key={i} {...d} />
            ))}
          </div>
        </div>
      </div>
    </>
  );
}