import { useEffect, useState } from "react";
import StickyNav from "@/components/home/StickyNav";

const LOGO_URL = "https://media.base44.com/images/public/6a19e1fc6c5eb736a0763b09/1824cf861_IMG_5119.png";

export default function TreeFortBikes() {
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
        .tfb-grain-layer {
          position: fixed; inset: -50%;
          width: 200%; height: 200%;
          background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 200 200'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E");
          opacity: 0.045;
          pointer-events: none;
          z-index: 999;
          animation: grain 0.4s steps(1) infinite;
        }
        .tfb-float { animation: float 5s ease-in-out infinite; }
        .tfb-glow  { animation: glow-breathe 3.5s ease-in-out infinite; }
        .tfb-shimmer-btn {
          position: relative; overflow: hidden; cursor: pointer; display: inline-block; text-decoration: none;
        }
        .tfb-shimmer-btn::after {
          content: ''; position: absolute; top: -60%; left: -120%;
          width: 55%; height: 220%;
          background: linear-gradient(90deg, transparent, rgba(255,255,255,0.28), transparent);
          transform: skewX(-18deg);
          animation: shimmer 3.2s ease infinite;
        }
        .tfb-feature-card { transition: background 0.3s, transform 0.3s; }
        .tfb-feature-card:hover { background: #161410 !important; transform: translateY(-4px); }
      `}</style>

      <div className="tfb-grain-layer" />
      <StickyNav logoUrl={LOGO_URL} />

      <div style={{ fontFamily: "'Barlow', sans-serif", background: "#080808", minHeight: "100vh", color: "#f5f1e8", overflowX: "hidden", paddingTop: "64px" }}>

        {/* ─── HERO ─────────────────────────────────────────── */}
        <section style={{ position: "relative", minHeight: "100vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "100px 24px 80px", overflow: "hidden", textAlign: "center" }}>

          <div className="tfb-glow" style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%,-50%)", width: "700px", height: "700px", background: "radial-gradient(circle, rgba(230,180,80,0.16) 0%, transparent 68%)", pointerEvents: "none" }} />

          {/* Bicycle icon */}
          <div className="tfb-float" style={{ marginBottom: "48px" }}>
            <svg viewBox="0 0 240 150" width="280" height="175" style={{ filter: "drop-shadow(0 0 36px rgba(230,180,80,0.55))" }}>
              <defs>
                <radialGradient id="bikeGold" cx="38%" cy="22%" r="72%">
                  <stop offset="0%"   stopColor="#f5d070" />
                  <stop offset="55%"  stopColor="#e6b450" />
                  <stop offset="100%" stopColor="#7a4e0a" />
                </radialGradient>
              </defs>
              {/* Wheels */}
              <circle cx="55"  cy="110" r="34" fill="none" stroke="url(#bikeGold)" strokeWidth="5" />
              <circle cx="55"  cy="110" r="4"  fill="url(#bikeGold)" />
              <circle cx="185" cy="110" r="34" fill="none" stroke="url(#bikeGold)" strokeWidth="5" />
              <circle cx="185" cy="110" r="4"  fill="url(#bikeGold)" />
              {/* Spokes */}
              <line x1="55" y1="76" x2="55" y2="144" stroke="url(#bikeGold)" strokeWidth="1.5" opacity="0.6" />
              <line x1="21" y1="110" x2="89" y2="110" stroke="url(#bikeGold)" strokeWidth="1.5" opacity="0.6" />
              <line x1="185" y1="76" x2="185" y2="144" stroke="url(#bikeGold)" strokeWidth="1.5" opacity="0.6" />
              <line x1="151" y1="110" x2="219" y2="110" stroke="url(#bikeGold)" strokeWidth="1.5" opacity="0.6" />
              {/* Frame */}
              <path d="M55,110 L110,60 L150,60 L185,110 M110,60 L110,110 M150,60 L150,110 M110,60 L150,110" fill="none" stroke="url(#bikeGold)" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round" />
              {/* Handlebar */}
              <path d="M150,60 L150,45 L160,42" fill="none" stroke="url(#bikeGold)" strokeWidth="4" strokeLinecap="round" />
              {/* Seat */}
              <line x1="105" y1="58" x2="118" y2="58" stroke="url(#bikeGold)" strokeWidth="6" strokeLinecap="round" />
            </svg>
          </div>

          <div style={fadeStyle(0.1)}>
            <span style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: "11px", fontWeight: 700, letterSpacing: "5px", color: "#e6b450", border: "1px solid rgba(230,180,80,0.45)", padding: "7px 18px", textTransform: "uppercase", borderRadius: "2px", display: "inline-block", marginBottom: "22px" }}>
              Official Partner
            </span>
          </div>

          <h1 style={{ ...fadeStyle(0.22), fontFamily: "'Anton', sans-serif", fontSize: "clamp(40px, 8vw, 84px)", lineHeight: 0.95, textTransform: "uppercase", letterSpacing: "2px", marginBottom: "20px" }}>
            TREE FORT<br />
            <span style={{ color: "#e6b450" }}>BIKES</span>
          </h1>

          <p style={{ ...fadeStyle(0.38), fontFamily: "'Barlow', sans-serif", fontSize: "18px", color: "#8a857c", maxWidth: "560px", lineHeight: 1.7, marginBottom: "16px" }}>
            One Good Word...One Good Deed LLC is proud to partner with Tree Fort Bikes — Ypsilanti's trusted bicycle shop featuring bikes, parts, accessories, and expert repairs for riders of every kind.
          </p>

          <p style={{ ...fadeStyle(0.45), fontFamily: "'Barlow Condensed', sans-serif", fontSize: "15px", color: "#e6b450", letterSpacing: "2px", marginBottom: "12px" }}>
            📍 1866 Whittaker Rd, Ypsilanti, MI 48197
          </p>
          <p style={{ ...fadeStyle(0.5), fontFamily: "'Barlow Condensed', sans-serif", fontSize: "14px", color: "#8a857c", letterSpacing: "1px", marginBottom: "44px" }}>
            ⭐ 4.6 Stars · 288 Google Reviews &nbsp;·&nbsp; 🚲 Paint Creek Crossing
          </p>

          <div style={{ ...fadeStyle(0.56), display: "flex", gap: "16px", flexWrap: "wrap", justifyContent: "center" }}>
            <a
              href="https://www.treefortbikes.com"
              target="_blank"
              rel="noopener noreferrer"
              className="tfb-shimmer-btn"
              style={{ fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 700, fontSize: "15px", letterSpacing: "3px", textTransform: "uppercase", color: "#080808", background: "linear-gradient(135deg, #f0c060 0%, #e6b450 50%, #c9922f 100%)", padding: "16px 40px", borderRadius: "2px", boxShadow: "0 0 40px rgba(230,180,80,0.3), 0 8px 28px rgba(0,0,0,0.6)" }}
            >
              Visit Their Website
            </a>
            <a
              href="tel:8883331559"
              style={{ fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 700, fontSize: "15px", letterSpacing: "3px", textTransform: "uppercase", color: "#e6b450", background: "transparent", border: "1px solid rgba(230,180,80,0.45)", padding: "16px 40px", borderRadius: "2px", textDecoration: "none" }}
            >
              Call (888) 333-1559
            </a>
          </div>

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
            KEEP RIDERS MOVING.<br />KEEP COMMUNITIES MOVING.
          </h2>
          <p style={{ fontFamily: "'Barlow', sans-serif", fontSize: "19px", color: "#8a857c", lineHeight: 1.85, maxWidth: "660px", margin: "0 auto" }}>
            Tree Fort Bikes has been keeping riders on the road for years — bikes, parts, accessories, and the kind of honest repairs that build trust one ride at a time. That same reliability and heart for the community is exactly what this movement stands on. When local businesses show up for their neighbors, everyone moves forward together.
          </p>
        </section>

        {/* ─── DIVIDER ───────────────────────────────────────── */}
        <div style={{ height: "1px", background: "linear-gradient(90deg, transparent, rgba(230,180,80,0.15), transparent)", margin: "0 10%" }} />

        {/* ─── FEATURES ──────────────────────────────────────── */}
        <section style={{ padding: "90px 24px", background: "#0b0b0b" }}>
          <div style={{ maxWidth: "1060px", margin: "0 auto" }}>
            <p style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: "12px", letterSpacing: "5px", color: "#e6b450", textTransform: "uppercase", textAlign: "center", marginBottom: "64px" }}>What Tree Fort Bikes Brings</p>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(270px, 1fr))", gap: "3px" }}>
              {[
                { num: "01", title: "Bikes & Gear", body: "A full range of bicycles and accessories for every rider — from first-timers to seasoned cyclists chasing their next adventure." },
                { num: "02", title: "Expert Repairs", body: "Skilled mechanics who keep your ride running smooth. Honest work, fair pricing, and the kind of care that earns 288 five-star reviews." },
                { num: "03", title: "Washtenaw County Proud", body: "Rooted in Paint Creek Crossing, Ypsilanti. A trusted local name serving riders across Washtenaw County and beyond." },
              ].map((f) => (
                <div key={f.num} className="tfb-feature-card" style={{ padding: "52px 40px", background: "#111", borderTop: "2px solid #e6b450" }}>
                  <p style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: "11px", letterSpacing: "4px", color: "#e6b450", marginBottom: "16px" }}>{f.num}</p>
                  <h3 style={{ fontFamily: "'Anton', sans-serif", fontSize: "22px", textTransform: "uppercase", letterSpacing: "1px", marginBottom: "14px" }}>{f.title}</h3>
                  <p style={{ fontFamily: "'Barlow', sans-serif", fontSize: "15px", color: "#8a857c", lineHeight: 1.75 }}>{f.body}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ─── LOCATION / CTA CARD ──────────────────────────── */}
        <section style={{ padding: "90px 24px", textAlign: "center" }}>
          <div style={{ maxWidth: "700px", margin: "0 auto", border: "1px solid rgba(230,180,80,0.25)", padding: "60px 48px", borderRadius: "2px", background: "#0d0c0a" }}>
            <p style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: "11px", letterSpacing: "5px", color: "#e6b450", textTransform: "uppercase", marginBottom: "20px" }}>Come Visit Tree Fort Bikes</p>
            <h3 style={{ fontFamily: "'Anton', sans-serif", fontSize: "clamp(26px, 4vw, 40px)", textTransform: "uppercase", letterSpacing: "1px", marginBottom: "24px" }}>
              Tree Fort Bikes
            </h3>
            <div style={{ display: "flex", flexDirection: "column", gap: "10px", alignItems: "center" }}>
              <p style={{ fontFamily: "'Barlow', sans-serif", fontSize: "16px", color: "#8a857c", lineHeight: 1.7 }}>
                📍 1866 Whittaker Rd, Ypsilanti, MI 48197
              </p>
              <p style={{ fontFamily: "'Barlow', sans-serif", fontSize: "15px", color: "#8a857c" }}>
                🏬 Paint Creek Crossing &nbsp;·&nbsp; ⭐ 4.6 Stars · 288 Reviews
              </p>
              <a
                href="tel:8883331559"
                style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: "22px", fontWeight: 700, letterSpacing: "2px", color: "#e6b450", textDecoration: "none", marginTop: "4px" }}
                onMouseOver={e => e.target.style.opacity = "0.75"}
                onMouseOut={e => e.target.style.opacity = "1"}
              >
                📞 (888) 333-1559
              </a>
              <div style={{ display: "flex", gap: "16px", marginTop: "12px", flexWrap: "wrap", justifyContent: "center" }}>
                <a
                  href="https://www.treefortbikes.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: "14px", fontWeight: 700, letterSpacing: "2px", color: "#080808", background: "linear-gradient(135deg, #f0c060 0%, #e6b450 50%, #c9922f 100%)", textDecoration: "none", padding: "12px 28px", borderRadius: "2px", display: "inline-block" }}
                >
                  Visit Website →
                </a>
                <a
                  href="https://www.google.com/maps/place/1866+Whittaker+Rd+Ypsilanti+MI+48197"
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

        {/* ─── FOOTER BAR ────────────────────────────────────── */}
        <div style={{ borderTop: "1px solid #141414", padding: "30px 24px", textAlign: "center" }}>
          <p style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: "11px", letterSpacing: "3px", color: "#2a2620", textTransform: "uppercase" }}>
            One Good Word...One Good Deed LLC &nbsp;|&nbsp; In Partnership with Tree Fort Bikes — Ypsilanti, MI &nbsp;|&nbsp; ogwogd.org
          </p>
        </div>
      </div>
    </>
  );
}