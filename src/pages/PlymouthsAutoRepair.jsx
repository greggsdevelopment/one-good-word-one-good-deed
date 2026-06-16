import { useEffect, useState } from "react";
import StickyNav from "@/components/home/StickyNav";

const LOGO_URL = "https://media.base44.com/images/public/6a19e1fc6c5eb736a0763b09/1824cf861_IMG_5119.png";

export default function PlymouthsAutoRepair() {
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
        .par-grain-layer {
          position: fixed; inset: -50%;
          width: 200%; height: 200%;
          background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 200 200'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E");
          opacity: 0.045;
          pointer-events: none;
          z-index: 999;
          animation: grain 0.4s steps(1) infinite;
        }
        .par-float { animation: float 5s ease-in-out infinite; }
        .par-glow  { animation: glow-breathe 3.5s ease-in-out infinite; }
        .par-shimmer-btn {
          position: relative; overflow: hidden; cursor: pointer; display: inline-block; text-decoration: none;
        }
        .par-shimmer-btn::after {
          content: ''; position: absolute; top: -60%; left: -120%;
          width: 55%; height: 220%;
          background: linear-gradient(90deg, transparent, rgba(255,255,255,0.28), transparent);
          transform: skewX(-18deg);
          animation: shimmer 3.2s ease infinite;
        }
        .par-feature-card { transition: background 0.3s, transform 0.3s; }
        .par-feature-card:hover { background: #161410 !important; transform: translateY(-4px); }
      `}</style>

      <div className="par-grain-layer" />
      <StickyNav logoUrl={LOGO_URL} />

      <div style={{ fontFamily: "'Barlow', sans-serif", background: "#080808", minHeight: "100vh", color: "#f5f1e8", overflowX: "hidden", paddingTop: "64px" }}>

        {/* ─── HERO ─────────────────────────────────────────── */}
        <section style={{ position: "relative", minHeight: "100vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "100px 24px 80px", overflow: "hidden", textAlign: "center" }}>

          <div className="par-glow" style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%,-50%)", width: "700px", height: "700px", background: "radial-gradient(circle, rgba(230,180,80,0.16) 0%, transparent 68%)", pointerEvents: "none" }} />

          {/* Wrench / auto repair icon */}
          <div className="par-float" style={{ marginBottom: "48px" }}>
            <svg viewBox="0 0 160 160" width="140" height="140" style={{ filter: "drop-shadow(0 0 36px rgba(230,180,80,0.55))" }}>
              <defs>
                <radialGradient id="wrenchGold" cx="38%" cy="22%" r="72%">
                  <stop offset="0%"   stopColor="#f5d070" />
                  <stop offset="55%"  stopColor="#e6b450" />
                  <stop offset="100%" stopColor="#7a4e0a" />
                </radialGradient>
              </defs>
              {/* Wrench body */}
              <rect x="70" y="30" width="20" height="90" rx="10" fill="url(#wrenchGold)" />
              {/* Wrench head top */}
              <rect x="52" y="28" width="56" height="22" rx="11" fill="url(#wrenchGold)" />
              <rect x="62" y="22" width="14" height="16" rx="4" fill="#080808" />
              <rect x="84" y="22" width="14" height="16" rx="4" fill="#080808" />
              {/* Wrench handle bottom */}
              <circle cx="80" cy="122" r="14" fill="url(#wrenchGold)" />
              <circle cx="80" cy="122" r="6" fill="#080808" />
            </svg>
          </div>

          <div style={fadeStyle(0.1)}>
            <span style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: "11px", fontWeight: 700, letterSpacing: "5px", color: "#e6b450", border: "1px solid rgba(230,180,80,0.45)", padding: "7px 18px", textTransform: "uppercase", borderRadius: "2px", display: "inline-block", marginBottom: "22px" }}>
              Official Partner
            </span>
          </div>

          <h1 style={{ ...fadeStyle(0.22), fontFamily: "'Anton', sans-serif", fontSize: "clamp(34px, 7vw, 72px)", lineHeight: 0.95, textTransform: "uppercase", letterSpacing: "2px", marginBottom: "20px" }}>
            PLYMOUTH'S AUTO<br />
            <span style={{ color: "#e6b450" }}>REPAIR &amp; MUFFLER</span>
          </h1>

          {/* BIG SHOUT OUT */}
          <div style={{ ...fadeStyle(0.30), margin: "0 auto 28px", maxWidth: "640px", background: "linear-gradient(135deg, rgba(230,180,80,0.15) 0%, rgba(230,180,80,0.06) 100%)", border: "1px solid rgba(230,180,80,0.5)", borderRadius: "4px", padding: "22px 32px" }}>
            <p style={{ fontFamily: "'Anton', sans-serif", fontSize: "clamp(18px, 3vw, 26px)", textTransform: "uppercase", letterSpacing: "2px", color: "#e6b450", marginBottom: "8px" }}>
              🙏 HUGE SHOUT OUT TO SAM &amp; ABRAHAM!
            </p>
            <p style={{ fontFamily: "'Barlow', sans-serif", fontSize: "15px", color: "#f5f1e8", lineHeight: 1.65 }}>
              Sam and Abraham — your generosity, your integrity, and your heart for this community mean everything to us. We are beyond grateful for your support of this mission. Thank you for being the real deal.
            </p>
          </div>

          <p style={{ ...fadeStyle(0.38), fontFamily: "'Barlow', sans-serif", fontSize: "18px", color: "#8a857c", maxWidth: "560px", lineHeight: 1.7, marginBottom: "16px" }}>
            One Good Word...One Good Deed LLC is proud to partner with Plymouth's most trusted auto shop — honest work, fair prices, and a crew that treats every customer like family.
          </p>

          <p style={{ ...fadeStyle(0.45), fontFamily: "'Barlow Condensed', sans-serif", fontSize: "15px", color: "#e6b450", letterSpacing: "2px", marginBottom: "44px" }}>
            📍 605 Ann Arbor Rd, Plymouth, MI 48170 &nbsp;·&nbsp; ⭐ 4.9 Stars · 235+ Reviews
          </p>

          <div style={{ ...fadeStyle(0.52), display: "flex", gap: "16px", flexWrap: "wrap", justifyContent: "center" }}>
            <a
              href="https://plymouthsautorepair.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="par-shimmer-btn"
              style={{ fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 700, fontSize: "15px", letterSpacing: "3px", textTransform: "uppercase", color: "#080808", background: "linear-gradient(135deg, #f0c060 0%, #e6b450 50%, #c9922f 100%)", padding: "16px 40px", borderRadius: "2px", boxShadow: "0 0 40px rgba(230,180,80,0.3), 0 8px 28px rgba(0,0,0,0.6)" }}
            >
              Visit Their Website
            </a>
            <a
              href="tel:7346671250"
              style={{ fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 700, fontSize: "15px", letterSpacing: "3px", textTransform: "uppercase", color: "#e6b450", background: "transparent", border: "1px solid rgba(230,180,80,0.45)", padding: "16px 40px", borderRadius: "2px", textDecoration: "none" }}
            >
              Call (734) 667-1250
            </a>
          </div>

          <div style={{ position: "absolute", bottom: "28px", left: "50%", transform: "translateX(-50%)", color: "#3a3630", fontSize: "11px", letterSpacing: "4px", fontFamily: "'Barlow Condensed', sans-serif" }}>
            SCROLL
          </div>
        </section>

        {/* ─── DIVIDER ─── */}
        <div style={{ height: "1px", background: "linear-gradient(90deg, transparent, rgba(230,180,80,0.35), transparent)", margin: "0 10%" }} />

        {/* ─── MISSION COPY ─── */}
        <section style={{ padding: "110px 24px", maxWidth: "860px", margin: "0 auto", textAlign: "center" }}>
          <p style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: "12px", letterSpacing: "5px", color: "#e6b450", textTransform: "uppercase", marginBottom: "24px" }}>Why This Partnership Matters</p>
          <h2 style={{ fontFamily: "'Anton', sans-serif", fontSize: "clamp(32px, 5.5vw, 58px)", lineHeight: 1.05, textTransform: "uppercase", marginBottom: "36px" }}>
            HONEST WORK.<br /><span style={{ color: "#e6b450" }}>REAL COMMUNITY.</span>
          </h2>
          <p style={{ fontFamily: "'Barlow', sans-serif", fontSize: "19px", color: "#8a857c", lineHeight: 1.85, maxWidth: "660px", margin: "0 auto" }}>
            Abraham built Plymouth's Auto Repair on one principle — treat every customer the way you'd want your own family treated. No upselling, no phantom repairs, no surprises. That kind of integrity is exactly what this movement is about. When honest people show up for each other, communities change.
          </p>
        </section>

        {/* ─── DIVIDER ─── */}
        <div style={{ height: "1px", background: "linear-gradient(90deg, transparent, rgba(230,180,80,0.15), transparent)", margin: "0 10%" }} />

        {/* ─── FEATURES ─── */}
        <section style={{ padding: "90px 24px", background: "#0b0b0b" }}>
          <div style={{ maxWidth: "1060px", margin: "0 auto" }}>
            <p style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: "12px", letterSpacing: "5px", color: "#e6b450", textTransform: "uppercase", textAlign: "center", marginBottom: "64px" }}>What Makes Them Special</p>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(270px, 1fr))", gap: "3px" }}>
              {[
                { num: "01", title: "Honest Every Time", body: "Abraham tells you exactly what's wrong — and what isn't. 235+ five-star reviews from Plymouth drivers who found a mechanic they can actually trust." },
                { num: "02", title: "Same-Day Walk-Ins", body: "No appointment needed for most services. Brakes, oil changes, exhaust, diagnostics — in and out the same day. Walk-ins always welcome." },
                { num: "03", title: "Plymouth Proud", body: "Rooted at 605 Ann Arbor Rd, serving Plymouth, Canton, Northville and all of SE Michigan. This is a local shop with a local heart." },
              ].map((f) => (
                <div key={f.num} className="par-feature-card" style={{ padding: "52px 40px", background: "#111", borderTop: "2px solid #e6b450" }}>
                  <p style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: "11px", letterSpacing: "4px", color: "#e6b450", marginBottom: "16px" }}>{f.num}</p>
                  <h3 style={{ fontFamily: "'Anton', sans-serif", fontSize: "22px", textTransform: "uppercase", letterSpacing: "1px", marginBottom: "14px" }}>{f.title}</h3>
                  <p style={{ fontFamily: "'Barlow', sans-serif", fontSize: "15px", color: "#8a857c", lineHeight: 1.75 }}>{f.body}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ─── LOCATION / CTA CARD ─── */}
        <section style={{ padding: "90px 24px", textAlign: "center" }}>
          <div style={{ maxWidth: "700px", margin: "0 auto", border: "1px solid rgba(230,180,80,0.25)", padding: "60px 48px", borderRadius: "2px", background: "#0d0c0a" }}>
            <p style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: "11px", letterSpacing: "5px", color: "#e6b450", textTransform: "uppercase", marginBottom: "20px" }}>Come See Sam &amp; Abraham</p>
            <h3 style={{ fontFamily: "'Anton', sans-serif", fontSize: "clamp(26px, 4vw, 40px)", textTransform: "uppercase", letterSpacing: "1px", marginBottom: "24px" }}>
              Plymouth's Auto Repair &amp; Muffler
            </h3>
            <div style={{ display: "flex", flexDirection: "column", gap: "10px", alignItems: "center" }}>
              <p style={{ fontFamily: "'Barlow', sans-serif", fontSize: "16px", color: "#8a857c", lineHeight: 1.7 }}>
                📍 605 Ann Arbor Rd, Plymouth, MI 48170
              </p>
              <p style={{ fontFamily: "'Barlow', sans-serif", fontSize: "15px", color: "#8a857c" }}>
                ⭐ 4.9 Stars · 235+ Reviews &nbsp;·&nbsp; 🔧 Walk-Ins Welcome
              </p>
              <a
                href="tel:7346671250"
                style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: "22px", fontWeight: 700, letterSpacing: "2px", color: "#e6b450", textDecoration: "none", marginTop: "4px" }}
                onMouseOver={e => e.target.style.opacity = "0.75"}
                onMouseOut={e => e.target.style.opacity = "1"}
              >
                📞 (734) 667-1250
              </a>
              <div style={{ display: "flex", gap: "16px", marginTop: "12px", flexWrap: "wrap", justifyContent: "center" }}>
                <a
                  href="https://plymouthsautorepair.com/"
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: "14px", fontWeight: 700, letterSpacing: "2px", color: "#080808", background: "linear-gradient(135deg, #f0c060 0%, #e6b450 50%, #c9922f 100%)", textDecoration: "none", padding: "12px 28px", borderRadius: "2px", display: "inline-block" }}
                >
                  Visit Website →
                </a>
                <a
                  href="https://www.google.com/maps/place/605+Ann+Arbor+Rd+Plymouth+MI+48170"
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: "14px", fontWeight: 700, letterSpacing: "2px", color: "#8a857c", textDecoration: "none", padding: "12px 28px", border: "1px solid rgba(230,180,80,0.3)", borderRadius: "2px" }}
                  onMouseOver={e => e.target.style.color = "#e6b450"}
                  onMouseOut={e => e.target.style.color = "#8a857c"}
                >
                  Get Directions →
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* ─── FOOTER BAR ─── */}
        <div style={{ borderTop: "1px solid #141414", padding: "30px 24px", textAlign: "center" }}>
          <p style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: "11px", letterSpacing: "3px", color: "#2a2620", textTransform: "uppercase" }}>
            One Good Word...One Good Deed LLC &nbsp;|&nbsp; In Partnership with Plymouth's Auto Repair &amp; Muffler — Plymouth, MI &nbsp;|&nbsp; ogwogd.org
          </p>
        </div>
      </div>
    </>
  );
}