import { useEffect, useState } from "react";
import StickyNav from "@/components/home/StickyNav";

const LOGO_URL = "https://media.base44.com/images/public/6a19e1fc6c5eb736a0763b09/1824cf861_IMG_5119.png";

export default function TDKeleman() {
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
        .tdk-grain-layer {
          position: fixed; inset: -50%;
          width: 200%; height: 200%;
          background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 200 200'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E");
          opacity: 0.045;
          pointer-events: none;
          z-index: 999;
          animation: grain 0.4s steps(1) infinite;
        }
        .tdk-float { animation: float 5s ease-in-out infinite; }
        .tdk-glow  { animation: glow-breathe 3.5s ease-in-out infinite; }
        .tdk-shimmer-btn {
          position: relative; overflow: hidden; cursor: pointer; display: inline-block; text-decoration: none;
        }
        .tdk-shimmer-btn::after {
          content: ''; position: absolute; top: -60%; left: -120%;
          width: 55%; height: 220%;
          background: linear-gradient(90deg, transparent, rgba(255,255,255,0.28), transparent);
          transform: skewX(-18deg);
          animation: shimmer 3.2s ease infinite;
        }
        .tdk-feature-card { transition: background 0.3s, transform 0.3s; }
        .tdk-feature-card:hover { background: #161410 !important; transform: translateY(-4px); }
      `}</style>

      <div className="tdk-grain-layer" />
      <StickyNav logoUrl={LOGO_URL} />

      <div style={{ fontFamily: "'Barlow', sans-serif", background: "#080808", minHeight: "100vh", color: "#f5f1e8", overflowX: "hidden", paddingTop: "64px" }}>

        {/* ─── HERO ─────────────────────────────────────────── */}
        <section style={{ position: "relative", minHeight: "100vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "100px 24px 80px", overflow: "hidden", textAlign: "center" }}>

          <div className="tdk-glow" style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%,-50%)", width: "700px", height: "700px", background: "radial-gradient(circle, rgba(230,180,80,0.16) 0%, transparent 68%)", pointerEvents: "none" }} />

          {/* Truck / hauling icon */}
          <div className="tdk-float" style={{ marginBottom: "48px" }}>
            <svg viewBox="0 0 240 160" width="280" height="186" style={{ filter: "drop-shadow(0 0 36px rgba(230,180,80,0.55))" }}>
              <defs>
                <radialGradient id="truckGold" cx="38%" cy="22%" r="72%">
                  <stop offset="0%"   stopColor="#f5d070" />
                  <stop offset="55%"  stopColor="#e6b450" />
                  <stop offset="100%" stopColor="#7a4e0a" />
                </radialGradient>
              </defs>
              {/* Trailer / flatbed */}
              <rect x="10"  y="70" width="160" height="30" rx="3" fill="url(#truckGold)" />
              {/* Flatbed load lines */}
              <rect x="20"  y="62" width="140" height="8" rx="2" fill="url(#truckGold)" opacity="0.7" />
              {/* Cab */}
              <rect x="170" y="55" width="58"  height="45" rx="5" fill="url(#truckGold)" />
              {/* Cab window */}
              <rect x="180" y="62" width="30"  height="20" rx="3" fill="#080808" opacity="0.7" />
              {/* Trailer wheels */}
              <circle cx="45"  cy="108" r="14" fill="#111" stroke="url(#truckGold)" strokeWidth="4" />
              <circle cx="45"  cy="108" r="5"  fill="url(#truckGold)" />
              <circle cx="105" cy="108" r="14" fill="#111" stroke="url(#truckGold)" strokeWidth="4" />
              <circle cx="105" cy="108" r="5"  fill="url(#truckGold)" />
              {/* Cab wheels */}
              <circle cx="200" cy="108" r="14" fill="#111" stroke="url(#truckGold)" strokeWidth="4" />
              <circle cx="200" cy="108" r="5"  fill="url(#truckGold)" />
            </svg>
          </div>

          <div style={fadeStyle(0.1)}>
            <span style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: "11px", fontWeight: 700, letterSpacing: "5px", color: "#e6b450", border: "1px solid rgba(230,180,80,0.45)", padding: "7px 18px", textTransform: "uppercase", borderRadius: "2px", display: "inline-block", marginBottom: "22px" }}>
              Official Partner
            </span>
          </div>

          <h1 style={{ ...fadeStyle(0.22), fontFamily: "'Anton', sans-serif", fontSize: "clamp(38px, 7.5vw, 78px)", lineHeight: 0.95, textTransform: "uppercase", letterSpacing: "2px", marginBottom: "20px" }}>
            T.D. KELEMAN<br />
            <span style={{ color: "#e6b450" }}>TRUCKING LLC</span>
          </h1>

          <p style={{ ...fadeStyle(0.38), fontFamily: "'Barlow', sans-serif", fontSize: "18px", color: "#8a857c", maxWidth: "560px", lineHeight: 1.7, marginBottom: "16px" }}>
            One Good Word...One Good Deed LLC is proud to partner with T.D. Keleman Trucking LLC — a Livonia, Michigan-based carrier specializing in flatbed and heavy hauling across the region.
          </p>

          <p style={{ ...fadeStyle(0.45), fontFamily: "'Barlow Condensed', sans-serif", fontSize: "15px", color: "#e6b450", letterSpacing: "2px", marginBottom: "44px" }}>
            📍 Livonia, Michigan
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
            MOVING LOADS.<br />MOVING COMMUNITIES.
          </h2>
          <p style={{ fontFamily: "'Barlow', sans-serif", fontSize: "19px", color: "#8a857c", lineHeight: 1.85, maxWidth: "660px", margin: "0 auto" }}>
            T.D. Keleman Trucking LLC knows what it means to carry weight — literally. Their dedication to reliable, professional service mirrors the values we carry every day: showing up, doing the work, and never leaving someone behind. Businesses like this are the backbone of our communities.
          </p>
        </section>

        {/* ─── DIVIDER ───────────────────────────────────────── */}
        <div style={{ height: "1px", background: "linear-gradient(90deg, transparent, rgba(230,180,80,0.15), transparent)", margin: "0 10%" }} />

        {/* ─── FEATURES ──────────────────────────────────────── */}
        <section style={{ padding: "90px 24px", background: "#0b0b0b" }}>
          <div style={{ maxWidth: "1060px", margin: "0 auto" }}>
            <p style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: "12px", letterSpacing: "5px", color: "#e6b450", textTransform: "uppercase", textAlign: "center", marginBottom: "64px" }}>What T.D. Keleman Brings</p>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(270px, 1fr))", gap: "3px" }}>
              {[
                { num: "01", title: "Flatbed Hauling", body: "Specialized flatbed transport built for oversized and uniquely shaped loads that standard carriers can't handle." },
                { num: "02", title: "Heavy Hauling", body: "Equipped and experienced for heavy haul operations — moving the loads that demand skill, precision, and trust." },
                { num: "03", title: "Michigan Rooted", body: "Based in Livonia, MI and committed to the local economy. A name you can count on close to home." },
              ].map((f) => (
                <div key={f.num} className="tdk-feature-card" style={{ padding: "52px 40px", background: "#111", borderTop: "2px solid #e6b450" }}>
                  <p style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: "11px", letterSpacing: "4px", color: "#e6b450", marginBottom: "16px" }}>{f.num}</p>
                  <h3 style={{ fontFamily: "'Anton', sans-serif", fontSize: "22px", textTransform: "uppercase", letterSpacing: "1px", marginBottom: "14px" }}>{f.title}</h3>
                  <p style={{ fontFamily: "'Barlow', sans-serif", fontSize: "15px", color: "#8a857c", lineHeight: 1.75 }}>{f.body}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ─── FLEET PHOTOS ──────────────────────────────────── */}
        <section style={{ padding: "90px 24px", background: "#080808" }}>
          <div style={{ maxWidth: "1060px", margin: "0 auto" }}>
            <p style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: "12px", letterSpacing: "5px", color: "#e6b450", textTransform: "uppercase", textAlign: "center", marginBottom: "16px" }}>The Fleet</p>
            <h2 style={{ fontFamily: "'Anton', sans-serif", fontSize: "clamp(28px, 4vw, 46px)", textTransform: "uppercase", textAlign: "center", marginBottom: "48px" }}>FLEET PHOTOS</h2>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "3px" }}>
                {[
                { src: "https://media.base44.com/images/public/6a19e1fc6c5eb736a0763b09/00ee3dcf0_truck_photo_1.png", alt: "T.D. Keleman Trucking — Flatbed Rig" },
                { src: "https://media.base44.com/images/public/6a19e1fc6c5eb736a0763b09/e734f9c72_truck_photo_2.png", alt: "T.D. Keleman Trucking — Fleet Shot" },
              ].map((photo) => (
                <div
                  key={photo.src}
                  style={{
                    aspectRatio: "16/9",
                    border: "1px solid rgba(230,180,80,0.2)",
                    overflow: "hidden",
                    position: "relative",
                  }}
                >
                  <img
                    src={photo.src}
                    alt={photo.alt}
                    style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
                  />
                </div>
              ))}
            </div>
          </div>
        </section>



        {/* ─── FOOTER BAR ────────────────────────────────────── */}
        <div style={{ borderTop: "1px solid #141414", padding: "30px 24px", textAlign: "center" }}>
          <p style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: "11px", letterSpacing: "3px", color: "#2a2620", textTransform: "uppercase" }}>
            One Good Word...One Good Deed LLC &nbsp;|&nbsp; In Partnership with T.D. Keleman Trucking LLC &nbsp;|&nbsp; ogwogd.org
          </p>
        </div>
      </div>
    </>
  );
}