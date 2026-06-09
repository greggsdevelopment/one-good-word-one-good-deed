import { useEffect, useState } from "react";
import StickyNav from "@/components/home/StickyNav";

const LOGO_URL = "https://media.base44.com/images/public/6a19e1fc6c5eb736a0763b09/1824cf861_IMG_5119.png";

export default function GooseheadInsurance() {
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
          0%,100% { transform: translateY(0px) rotate(-1deg); }
          50%      { transform: translateY(-18px) rotate(1deg); }
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

        .gh-grain-layer {
          position: fixed; inset: -50%;
          width: 200%; height: 200%;
          background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 200 200'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E");
          opacity: 0.045;
          pointer-events: none;
          z-index: 999;
          animation: grain 0.4s steps(1) infinite;
        }
        .gh-icon-float { animation: float 5s ease-in-out infinite; }
        .gh-glow-breathe { animation: glow-breathe 3.5s ease-in-out infinite; }

        .gh-shimmer-btn {
          position: relative;
          overflow: hidden;
          cursor: pointer;
          display: inline-block;
          text-decoration: none;
        }
        .gh-shimmer-btn::after {
          content: '';
          position: absolute;
          top: -60%; left: -120%;
          width: 55%; height: 220%;
          background: linear-gradient(90deg, transparent, rgba(255,255,255,0.28), transparent);
          transform: skewX(-18deg);
          animation: shimmer 3.2s ease infinite;
        }

        .gh-feature-card {
          transition: background 0.3s, transform 0.3s;
        }
        .gh-feature-card:hover {
          background: #161410 !important;
          transform: translateY(-4px);
        }
      `}</style>

      <div className="gh-grain-layer" />

      <StickyNav logoUrl={LOGO_URL} />

      <div style={{ fontFamily: "'Barlow', sans-serif", background: "#080808", minHeight: "100vh", color: "#f5f1e8", overflowX: "hidden", paddingTop: "64px" }}>

        {/* ─── HERO ─────────────────────────────────────────── */}
        <section style={{ position: "relative", minHeight: "100vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "100px 24px 80px", overflow: "hidden", textAlign: "center" }}>

          <div className="gh-glow-breathe" style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%,-50%)", width: "700px", height: "700px", background: "radial-gradient(circle, rgba(230,180,80,0.16) 0%, transparent 68%)", pointerEvents: "none" }} />

          {/* Shield Icon */}
          <div className="gh-icon-float" style={{ marginBottom: "52px" }}>
            <svg viewBox="0 0 260 300" width="200" height="230" style={{ filter: "drop-shadow(0 0 36px rgba(230,180,80,0.55))" }}>
              <defs>
                <radialGradient id="shieldGold" cx="38%" cy="22%" r="72%">
                  <stop offset="0%"   stopColor="#f5d070" />
                  <stop offset="55%"  stopColor="#e6b450" />
                  <stop offset="100%" stopColor="#7a4e0a" />
                </radialGradient>
                <filter id="shieldGlow" x="-25%" y="-25%" width="150%" height="150%">
                  <feGaussianBlur stdDeviation="7" result="b" />
                  <feMerge><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge>
                </filter>
              </defs>
              {/* Shield shape */}
              <path d="M130,10 L240,55 L240,145 C240,215 130,285 130,285 C130,285 20,215 20,145 L20,55 Z" fill="url(#shieldGold)" filter="url(#shieldGlow)" />
              <path d="M130,32 L222,70 L222,145 C222,203 130,263 130,263 C130,263 38,203 38,145 L38,70 Z" fill="rgba(0,0,0,0.3)" />
              {/* Heart inside */}
              <path d="M130,185 C105,168 84,150 84,132 C84,118 95,108 108,112 C116,114 123,120 130,127 C137,120 144,114 152,112 C165,108 176,118 176,132 C176,150 155,168 130,185 Z" fill="#f5d070" opacity="0.95" />
            </svg>
          </div>

          <div style={fadeStyle(0.1)}>
            <span style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: "11px", fontWeight: 700, letterSpacing: "5px", color: "#e6b450", border: "1px solid rgba(230,180,80,0.45)", padding: "7px 18px", textTransform: "uppercase", borderRadius: "2px", display: "inline-block", marginBottom: "22px" }}>
              Official Partnership
            </span>
          </div>

          <h1 style={{ ...fadeStyle(0.22), fontFamily: "'Anton', sans-serif", fontSize: "clamp(46px, 9vw, 90px)", lineHeight: 0.95, textTransform: "uppercase", letterSpacing: "2px", marginBottom: "20px" }}>
            PROTECT YOUR<br />
            <span style={{ color: "#e6b450" }}>FUTURE</span>
          </h1>

          <p style={{ ...fadeStyle(0.38), fontFamily: "'Barlow', sans-serif", fontSize: "18px", color: "#8a857c", maxWidth: "540px", lineHeight: 1.7, marginBottom: "44px" }}>
            One Good Word...One Good Deed LLC has officially partnered with Goosehead Insurance to bring you comprehensive insurance solutions. Contact our agent Rebecca Frolka for personalized coverage.
          </p>

          <div style={{ ...fadeStyle(0.52), display: "flex", flexDirection: "column", alignItems: "center", gap: "16px" }}>
            <a href="mailto:Rebecca.frolka@goosehead.com" className="gh-shimmer-btn" style={{ fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 700, fontSize: "17px", letterSpacing: "3px", textTransform: "uppercase", color: "#080808", background: "linear-gradient(135deg, #f0c060 0%, #e6b450 50%, #c9922f 100%)", padding: "18px 52px", borderRadius: "2px", boxShadow: "0 0 50px rgba(230,180,80,0.38), 0 10px 36px rgba(0,0,0,0.65)" }}>
              Contact Rebecca
            </a>
            <a href="tel:8102249438" style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: "16px", letterSpacing: "3px", color: "#e6b450", textDecoration: "none", display: "flex", alignItems: "center", gap: "8px" }}>
              📞 810-224-9438
            </a>
          </div>

          <p style={{ ...fadeStyle(0.65), marginTop: "18px", fontFamily: "'Barlow Condensed', sans-serif", fontSize: "12px", letterSpacing: "3px", color: "#3a3630", textTransform: "uppercase" }}>
            Rebecca.frolka@goosehead.com
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
            COVERAGE BUILT ON<br />TRUST & COMMUNITY.
          </h2>
          <p style={{ fontFamily: "'Barlow', sans-serif", fontSize: "19px", color: "#8a857c", lineHeight: 1.85, maxWidth: "660px", margin: "0 auto" }}>
            We believe in protecting what matters most — your family, your home, your future. Through this partnership, the One Good Word...One Good Deed community gets access to a trusted agent who shares our values of love, integrity, and service.
          </p>
        </section>

        {/* ─── DIVIDER ───────────────────────────────────────── */}
        <div style={{ height: "1px", background: "linear-gradient(90deg, transparent, rgba(230,180,80,0.15), transparent)", margin: "0 10%" }} />

        {/* ─── FEATURES ──────────────────────────────────────── */}
        <section style={{ padding: "90px 24px", background: "#0b0b0b" }}>
          <div style={{ maxWidth: "1060px", margin: "0 auto" }}>
            <p style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: "12px", letterSpacing: "5px", color: "#e6b450", textTransform: "uppercase", textAlign: "center", marginBottom: "64px" }}>What Goosehead Insurance Offers</p>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(270px, 1fr))", gap: "3px" }}>
              {[
                { num: "01", title: "Home Insurance", body: "Protect your home and everything inside it with comprehensive coverage tailored to your needs." },
                { num: "02", title: "Auto Insurance", body: "Get the right coverage at the right price, with access to dozens of top carriers." },
                { num: "03", title: "Life Insurance", body: "Secure your family's financial future with personalized life insurance plans." },
              ].map((f) => (
                <div key={f.num} className="gh-feature-card" style={{ padding: "52px 40px", background: "#111", borderTop: "2px solid #e6b450" }}>
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
          <div className="gh-glow-breathe" style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%,-50%)", width: "600px", height: "400px", background: "radial-gradient(ellipse, rgba(230,180,80,0.1) 0%, transparent 68%)", pointerEvents: "none" }} />
          <p style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: "12px", letterSpacing: "5px", color: "#e6b450", textTransform: "uppercase", marginBottom: "24px" }}>Ready to Get Protected?</p>
          <h2 style={{ fontFamily: "'Anton', sans-serif", fontSize: "clamp(38px, 7vw, 68px)", textTransform: "uppercase", lineHeight: 1.05, marginBottom: "16px" }}>
            REACH OUT TO<br />REBECCA TODAY
          </h2>
          <p style={{ fontFamily: "'Barlow', sans-serif", fontSize: "18px", color: "#8a857c", marginBottom: "48px" }}>
            Call or email — she's here to help you find the right coverage.
          </p>
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "20px" }}>
            <a href="mailto:Rebecca.frolka@goosehead.com" className="gh-shimmer-btn" style={{ fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 700, fontSize: "18px", letterSpacing: "3px", textTransform: "uppercase", color: "#080808", background: "linear-gradient(135deg, #f0c060 0%, #e6b450 50%, #c9922f 100%)", padding: "22px 64px", borderRadius: "2px", boxShadow: "0 0 70px rgba(230,180,80,0.35), 0 14px 48px rgba(0,0,0,0.75)" }}>
              Contact Rebecca
            </a>
            <a href="tel:8102249438" style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: "20px", letterSpacing: "3px", color: "#e6b450", textDecoration: "none" }}>
              📞 810-224-9438
            </a>
          </div>
          <p style={{ marginTop: "22px", fontFamily: "'Barlow Condensed', sans-serif", fontSize: "13px", letterSpacing: "2px", color: "#3a3630" }}>
            Goosehead Insurance &nbsp;|&nbsp; Rebecca Frolka &nbsp;|&nbsp; Rebecca.frolka@goosehead.com
          </p>
        </section>

        {/* ─── FOOTER BAR ────────────────────────────────────── */}
        <div style={{ borderTop: "1px solid #141414", padding: "30px 24px", textAlign: "center" }}>
          <p style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: "11px", letterSpacing: "3px", color: "#2a2620", textTransform: "uppercase" }}>
            One Good Word...One Good Deed LLC &nbsp;|&nbsp; In Partnership with Goosehead Insurance &nbsp;|&nbsp; ogwogd.org
          </p>
        </div>
      </div>
    </>
  );
}