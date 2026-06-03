import { useEffect, useState } from "react";
import StickyNav from "@/components/home/StickyNav";

const LOGO_URL = "https://media.base44.com/images/public/6a19e1fc6c5eb736a0763b09/1824cf861_IMG_5119.png";

export default function WristbandBros() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 120);
    return () => clearTimeout(t);
  }, []);

  const fadeStyle = (delay) => ({
    opacity: visible ? 1 : 0,
    transform: visible ? "translateY(0)" : "translateY(28px)",
    transition: `opacity 0.8s ease ${delay}s, transform 0.8s ease ${delay}s`,
  });

  return (
    <>
      <style>{`
        @keyframes float {
          0%,100% { transform: translateY(0px) rotate(-1.5deg); }
          50%      { transform: translateY(-20px) rotate(1.5deg); }
        }
        @keyframes pulse-ring {
          0%   { transform: translate(-50%,-50%) scale(1); opacity: 0.55; }
          100% { transform: translate(-50%,-50%) scale(1.5); opacity: 0; }
        }
        @keyframes glow-breathe {
          0%,100% { opacity: 0.45; }
          50%      { opacity: 0.85; }
        }
        @keyframes grain {
          0%,100% { transform:translate(0,0); }
          20%  { transform:translate(-2%,-3%); }
          40%  { transform:translate(3%,2%); }
          60%  { transform:translate(-3%,3%); }
          80%  { transform:translate(2%,-2%); }
        }
        @keyframes shimmer {
          0%   { left: -120%; }
          100% { left: 200%; }
        }

        .wb-grain-layer {
          position: fixed; inset: -50%;
          width: 200%; height: 200%;
          background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 200 200'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E");
          opacity: 0.045;
          pointer-events: none;
          z-index: 999;
          animation: grain 0.4s steps(1) infinite;
        }
        .wb-wristband-float { animation: float 4.5s ease-in-out infinite; }
        .wb-glow-breathe    { animation: glow-breathe 3.5s ease-in-out infinite; }

        .wb-shimmer-btn {
          position: relative;
          overflow: hidden;
          cursor: pointer;
          display: inline-block;
          text-decoration: none;
        }
        .wb-shimmer-btn::after {
          content: '';
          position: absolute;
          top: -60%; left: -120%;
          width: 55%; height: 220%;
          background: linear-gradient(90deg, transparent, rgba(255,255,255,0.28), transparent);
          transform: skewX(-18deg);
          animation: shimmer 3.2s ease infinite;
        }

        .wb-feature-card {
          transition: background 0.3s, transform 0.3s;
        }
        .wb-feature-card:hover {
          background: #161410 !important;
          transform: translateY(-4px);
        }
      `}</style>

      <div className="wb-grain-layer" />

      <StickyNav logoUrl={LOGO_URL} />

      <div style={{ fontFamily: "'Barlow', sans-serif", background: "#080808", minHeight: "100vh", color: "#f5f1e8", overflowX: "hidden", paddingTop: "64px" }}>

        {/* ─── HERO ─────────────────────────────────────────── */}
        <section style={{ position: "relative", minHeight: "100vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "100px 24px 80px", overflow: "hidden", textAlign: "center" }}>

          <div className="wb-glow-breathe" style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%,-50%)", width: "700px", height: "700px", background: "radial-gradient(circle, rgba(230,180,80,0.16) 0%, transparent 68%)", pointerEvents: "none" }} />

          <div style={{ position: "relative", marginBottom: "52px" }}>
            <div style={{ position: "absolute", top: "50%", left: "50%", width: "340px", height: "340px", borderRadius: "50%", border: "1.5px solid rgba(230,180,80,0.45)", animation: "pulse-ring 2.8s ease-out infinite" }} />
            <div style={{ position: "absolute", top: "50%", left: "50%", width: "340px", height: "340px", borderRadius: "50%", border: "1.5px solid rgba(230,180,80,0.3)", animation: "pulse-ring 2.8s ease-out infinite 1.4s" }} />

            <div className="wb-wristband-float">
              <svg viewBox="0 0 300 300" width="290" height="290" style={{ filter: "drop-shadow(0 0 36px rgba(230,180,80,0.55))" }}>
                <defs>
                  <radialGradient id="bandGold" cx="38%" cy="22%" r="72%">
                    <stop offset="0%"   stopColor="#f5d070" />
                    <stop offset="55%"  stopColor="#e6b450" />
                    <stop offset="100%" stopColor="#7a4e0a" />
                  </radialGradient>
                  <radialGradient id="centerFill" cx="50%" cy="40%" r="55%">
                    <stop offset="0%"   stopColor="#141210" />
                    <stop offset="100%" stopColor="#080808" />
                  </radialGradient>
                  <filter id="glow" x="-25%" y="-25%" width="150%" height="150%">
                    <feGaussianBlur stdDeviation="7" result="b" />
                    <feMerge><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge>
                  </filter>
                  <path id="arcTop"    d="M 36,150 a 114,114 0 1,1 228,0" />
                  <path id="arcBottom" d="M 36,150 a 114,114 0 1,0 228,0" />
                </defs>
                <circle cx="150" cy="150" r="114" fill="none" stroke="url(#bandGold)" strokeWidth="42" filter="url(#glow)" />
                <circle cx="150" cy="150" r="93"  fill="none" stroke="rgba(255,230,120,0.22)" strokeWidth="1" />
                <circle cx="150" cy="150" r="135" fill="none" stroke="rgba(255,230,120,0.12)" strokeWidth="1" />
                <path d="M 78,78 a 86,86 0 0,1 144,0" fill="none" stroke="rgba(255,255,255,0.14)" strokeWidth="9" strokeLinecap="round" />
                <text fontFamily="Anton" fontSize="13.5" fill="#0a0905" letterSpacing="3.5">
                  <textPath href="#arcTop"    startOffset="11%">ONE GOOD WORD</textPath>
                </text>
                <text fontFamily="Anton" fontSize="13.5" fill="#0a0905" letterSpacing="3.5">
                  <textPath href="#arcBottom" startOffset="11%">ONE GOOD DEED</textPath>
                </text>
                <circle cx="150" cy="150" r="56" fill="url(#centerFill)" />
                <path d="M150,170 C130,155 112,140 112,125 C112,113 122,105 133,108 C140,110 146,115 150,120 C154,115 160,110 167,108 C178,105 188,113 188,125 C188,140 170,155 150,170 Z" fill="#e6b450" opacity="0.9" />
              </svg>
            </div>
          </div>

          <div style={fadeStyle(0.1)}>
            <span style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: "11px", fontWeight: 700, letterSpacing: "5px", color: "#e6b450", border: "1px solid rgba(230,180,80,0.45)", padding: "7px 18px", textTransform: "uppercase", borderRadius: "2px", display: "inline-block", marginBottom: "22px" }}>
              Official Partnership
            </span>
          </div>

          <h1 style={{ ...fadeStyle(0.22), fontFamily: "'Anton', sans-serif", fontSize: "clamp(46px, 9vw, 90px)", lineHeight: 0.95, textTransform: "uppercase", letterSpacing: "2px", marginBottom: "20px" }}>
            WEAR THE<br />
            <span style={{ color: "#e6b450" }}>MOVEMENT</span>
          </h1>

          <p style={{ ...fadeStyle(0.38), fontFamily: "'Barlow', sans-serif", fontSize: "18px", color: "#8a857c", maxWidth: "540px", lineHeight: 1.7, marginBottom: "44px" }}>
            One Good Word...One Good Deed LLC has officially partnered with Wristband Bros to bring the movement to your wrist. Custom wristbands built to spread love and stop hate.
          </p>

          <div style={fadeStyle(0.52)}>
            <a href="https://www.wristbandbros.com" target="_blank" rel="noopener noreferrer" className="wb-shimmer-btn" style={{ fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 700, fontSize: "17px", letterSpacing: "3px", textTransform: "uppercase", color: "#080808", background: "linear-gradient(135deg, #f0c060 0%, #e6b450 50%, #c9922f 100%)", padding: "18px 52px", borderRadius: "2px", boxShadow: "0 0 50px rgba(230,180,80,0.38), 0 10px 36px rgba(0,0,0,0.65)" }}>
              Shop Wristband Bros
            </a>
          </div>

          <p style={{ ...fadeStyle(0.65), marginTop: "18px", fontFamily: "'Barlow Condensed', sans-serif", fontSize: "12px", letterSpacing: "3px", color: "#3a3630", textTransform: "uppercase" }}>
            WristbandBros.com
          </p>

          <div style={{ position: "absolute", bottom: "28px", left: "50%", transform: "translateX(-50%)", color: "#3a3630", fontSize: "11px", letterSpacing: "4px", fontFamily: "'Barlow Condensed', sans-serif" }}>
            SCROLL
          </div>
        </section>

        {/* ─── DIVIDER ───────────────────────────────────────── */}
        <div style={{ height: "1px", background: "linear-gradient(90deg, transparent, rgba(230,180,80,0.35), transparent)", margin: "0 10%" }} />

        {/* ─── MISSION COPY ──────────────────────────────────── */}
        <section style={{ padding: "110px 24px", maxWidth: "860px", margin: "0 auto", textAlign: "center" }}>
          <p style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: "12px", letterSpacing: "5px", color: "#e6b450", textTransform: "uppercase", marginBottom: "24px" }}>Why This Partnership Matters</p>
          <h2 style={{ fontFamily: "'Anton', sans-serif", fontSize: "clamp(32px, 5.5vw, 58px)", lineHeight: 1.05, textTransform: "uppercase", marginBottom: "36px" }}>
            ONE WRISTBAND.<br />A THOUSAND CONVERSATIONS.
          </h2>
          <p style={{ fontFamily: "'Barlow', sans-serif", fontSize: "19px", color: "#8a857c", lineHeight: 1.85, maxWidth: "660px", margin: "0 auto" }}>
            Every wristband worn is a word spoken without saying a thing. It tells the person next to you where you stand. It tells the child being bullied that someone sees them. It tells the world that love is not passive. It is something you wear, something you carry, and something you choose every single day.
          </p>
        </section>

        {/* ─── DIVIDER ───────────────────────────────────────── */}
        <div style={{ height: "1px", background: "linear-gradient(90deg, transparent, rgba(230,180,80,0.15), transparent)", margin: "0 10%" }} />

        {/* ─── FEATURES ──────────────────────────────────────── */}
        <section style={{ padding: "90px 24px", background: "#0b0b0b" }}>
          <div style={{ maxWidth: "1060px", margin: "0 auto" }}>
            <p style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: "12px", letterSpacing: "5px", color: "#e6b450", textTransform: "uppercase", textAlign: "center", marginBottom: "64px" }}>What Wristband Bros Brings</p>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(270px, 1fr))", gap: "3px" }}>
              {[
                { num: "01", title: "Fully Custom Design", body: "Your message. Your colors. Your cause. Every wristband is built exactly the way the movement needs it." },
                { num: "03", title: "Fast Turnaround", body: "Super rush options available. Get your order when you need it without cutting corners on quality." },
              ].map((f) => (
                <div key={f.num} className="wb-feature-card" style={{ padding: "52px 40px", background: "#111", borderTop: "2px solid #e6b450" }}>
                  <p style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: "11px", letterSpacing: "4px", color: "#e6b450", marginBottom: "16px" }}>{f.num}</p>
                  <h3 style={{ fontFamily: "'Anton', sans-serif", fontSize: "22px", textTransform: "uppercase", letterSpacing: "1px", marginBottom: "14px" }}>{f.title}</h3>
                  <p style={{ fontFamily: "'Barlow', sans-serif", fontSize: "15px", color: "#8a857c", lineHeight: 1.75 }}>{f.body}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ─── FINAL CTA ─────────────────────────────────────── */}
        <section style={{ padding: "130px 24px", textAlign: "center", position: "relative", overflow: "hidden" }}>
          <div className="wb-glow-breathe" style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%,-50%)", width: "600px", height: "400px", background: "radial-gradient(ellipse, rgba(230,180,80,0.1) 0%, transparent 68%)", pointerEvents: "none" }} />
          <p style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: "12px", letterSpacing: "5px", color: "#e6b450", textTransform: "uppercase", marginBottom: "24px" }}>Ready to Wear the Movement?</p>
          <h2 style={{ fontFamily: "'Anton', sans-serif", fontSize: "clamp(38px, 7vw, 68px)", textTransform: "uppercase", lineHeight: 1.05, marginBottom: "48px" }}>
            ORDER YOUR<br />WRISTBAND TODAY
          </h2>
          <a href="https://www.wristbandbros.com" target="_blank" rel="noopener noreferrer" className="wb-shimmer-btn" style={{ fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 700, fontSize: "18px", letterSpacing: "3px", textTransform: "uppercase", color: "#080808", background: "linear-gradient(135deg, #f0c060 0%, #e6b450 50%, #c9922f 100%)", padding: "22px 64px", borderRadius: "2px", boxShadow: "0 0 70px rgba(230,180,80,0.35), 0 14px 48px rgba(0,0,0,0.75)" }}>
            Visit WristbandBros.com
          </a>
          <p style={{ marginTop: "22px", fontFamily: "'Barlow Condensed', sans-serif", fontSize: "13px", letterSpacing: "2px", color: "#3a3630" }}>
            Custom Wristbands &nbsp;|&nbsp; Happiness Guaranteed
          </p>
        </section>

        {/* ─── FOOTER BAR ────────────────────────────────────── */}
        <div style={{ borderTop: "1px solid #141414", padding: "30px 24px", textAlign: "center" }}>
          <p style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: "11px", letterSpacing: "3px", color: "#2a2620", textTransform: "uppercase" }}>
            One Good Word...One Good Deed LLC &nbsp;|&nbsp; In Partnership with Wristband Bros &nbsp;|&nbsp; ogwogd.org
          </p>
        </div>
      </div>
    </>
  );
}