import { useEffect, useState } from "react";
import StickyNav from "@/components/home/StickyNav";

const LOGO_URL = "https://media.base44.com/images/public/6a19e1fc6c5eb736a0763b09/1824cf861_IMG_5119.png";

export default function SubwayTaylor() {
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
        .subway-grain-layer {
          position: fixed; inset: -50%;
          width: 200%; height: 200%;
          background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 200 200'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E");
          opacity: 0.045;
          pointer-events: none;
          z-index: 999;
          animation: grain 0.4s steps(1) infinite;
        }
        .subway-float { animation: float 5s ease-in-out infinite; }
        .subway-glow  { animation: glow-breathe 3.5s ease-in-out infinite; }
        .subway-shimmer-btn {
          position: relative; overflow: hidden; cursor: pointer; display: inline-block; text-decoration: none;
        }
        .subway-shimmer-btn::after {
          content: ''; position: absolute; top: -60%; left: -120%;
          width: 55%; height: 220%;
          background: linear-gradient(90deg, transparent, rgba(255,255,255,0.28), transparent);
          transform: skewX(-18deg);
          animation: shimmer 3.2s ease infinite;
        }
        .subway-feature-card { transition: background 0.3s, transform 0.3s; }
        .subway-feature-card:hover { background: #161410 !important; transform: translateY(-4px); }
      `}</style>

      <div className="subway-grain-layer" />
      <StickyNav logoUrl={LOGO_URL} />

      <div style={{ fontFamily: "'Barlow', sans-serif", background: "#080808", minHeight: "100vh", color: "#f5f1e8", overflowX: "hidden", paddingTop: "64px" }}>

        {/* ─── HERO ─────────────────────────────────────────── */}
        <section style={{ position: "relative", minHeight: "100vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "100px 24px 80px", overflow: "hidden", textAlign: "center" }}>

          <div className="subway-glow" style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%,-50%)", width: "700px", height: "700px", background: "radial-gradient(circle, rgba(255,199,0,0.14) 0%, transparent 68%)", pointerEvents: "none" }} />

          {/* TikTok / Collectibles icon */}
          <div className="subway-float" style={{ marginBottom: "48px" }}>
            <svg viewBox="0 0 160 160" width="140" height="140" style={{ filter: "drop-shadow(0 0 36px rgba(230,180,80,0.55))" }}>
              <defs>
                <radialGradient id="tikGold" cx="38%" cy="22%" r="72%">
                  <stop offset="0%"   stopColor="#f5d070" />
                  <stop offset="55%"  stopColor="#e6b450" />
                  <stop offset="100%" stopColor="#7a4e0a" />
                </radialGradient>
              </defs>
              {/* TikTok-style music note shape */}
              <path d="M100,20 L100,95 A25,25 0 1,1 75,70 L75,45 A50,50 0 0,0 125,95 A50,50 0 0,1 100,20 Z" fill="url(#tikGold)" />
            </svg>
          </div>

          <div style={fadeStyle(0.1)}>
            <span style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: "11px", fontWeight: 700, letterSpacing: "5px", color: "#e6b450", border: "1px solid rgba(230,180,80,0.45)", padding: "7px 18px", textTransform: "uppercase", borderRadius: "2px", display: "inline-block", marginBottom: "22px" }}>
              Official Partner
            </span>
          </div>

          <h1 style={{ ...fadeStyle(0.22), fontFamily: "'Anton', sans-serif", fontSize: "clamp(38px, 7.5vw, 78px)", lineHeight: 0.95, textTransform: "uppercase", letterSpacing: "2px", marginBottom: "20px" }}>
            AD COLLECTIBLES<br />
            <span style={{ color: "#e6b450" }}>BY ALI</span>
          </h1>

          {/* BIG THANK YOU TO ALI */}
          <div style={{ ...fadeStyle(0.30), margin: "0 auto 28px", maxWidth: "600px", background: "linear-gradient(135deg, rgba(230,180,80,0.15) 0%, rgba(230,180,80,0.06) 100%)", border: "1px solid rgba(230,180,80,0.5)", borderRadius: "4px", padding: "20px 32px" }}>
            <p style={{ fontFamily: "'Anton', sans-serif", fontSize: "clamp(18px, 3vw, 26px)", textTransform: "uppercase", letterSpacing: "2px", color: "#e6b450", marginBottom: "6px" }}>
              🙏 A HUGE THANK YOU TO ALI!
            </p>
            <p style={{ fontFamily: "'Barlow', sans-serif", fontSize: "15px", color: "#f5f1e8", lineHeight: 1.6 }}>
              Ali's generous support and belief in our mission means the world to us. We are beyond grateful for everything he does.
            </p>
          </div>

          <p style={{ ...fadeStyle(0.38), fontFamily: "'Barlow', sans-serif", fontSize: "18px", color: "#8a857c", maxWidth: "560px", lineHeight: 1.7, marginBottom: "16px" }}>
            One Good Word...One Good Deed LLC is proud to partner with Ali — entrepreneur, collector, and community champion. Follow his TikTok for exclusive collectibles drops and more.
          </p>

          <p style={{ ...fadeStyle(0.45), fontFamily: "'Barlow Condensed', sans-serif", fontSize: "15px", color: "#e6b450", letterSpacing: "2px", marginBottom: "44px" }}>
            🎵 @adcollectibles on TikTok
          </p>

          <div style={{ ...fadeStyle(0.52), display: "flex", gap: "16px", flexWrap: "wrap", justifyContent: "center" }}>
            <a
              href="https://www.tiktok.com/@adcollectibles"
              target="_blank"
              rel="noopener noreferrer"
              className="subway-shimmer-btn"
              style={{ fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 700, fontSize: "15px", letterSpacing: "3px", textTransform: "uppercase", color: "#080808", background: "linear-gradient(135deg, #f0c060 0%, #e6b450 50%, #c9922f 100%)", padding: "16px 40px", borderRadius: "2px", boxShadow: "0 0 40px rgba(230,180,80,0.3), 0 8px 28px rgba(0,0,0,0.6)" }}
            >
              Follow on TikTok
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
            RARE FINDS.<br />REAL COMMUNITY.
          </h2>
          <p style={{ fontFamily: "'Barlow', sans-serif", fontSize: "19px", color: "#8a857c", lineHeight: 1.85, maxWidth: "660px", margin: "0 auto" }}>
            Ali built AD Collectibles from passion — a love for the rare, the special, and the stories behind every piece. That same passion is what drives this movement. When you support entrepreneurs like Ali, you're investing in the kind of community that lifts everyone up.
          </p>
        </section>

        {/* ─── DIVIDER ─── */}
        <div style={{ height: "1px", background: "linear-gradient(90deg, transparent, rgba(230,180,80,0.15), transparent)", margin: "0 10%" }} />

        {/* ─── FEATURES ─── */}
        <section style={{ padding: "90px 24px", background: "#0b0b0b" }}>
          <div style={{ maxWidth: "1060px", margin: "0 auto" }}>
            <p style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: "12px", letterSpacing: "5px", color: "#e6b450", textTransform: "uppercase", textAlign: "center", marginBottom: "64px" }}>What Ali Brings to the Table</p>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(270px, 1fr))", gap: "3px" }}>
              {[
                { num: "01", title: "Exclusive Collectibles", body: "Ali sources rare and unique finds that you won't see anywhere else. Follow @adcollectibles on TikTok to catch every drop." },
                { num: "02", title: "Entrepreneur Spirit", body: "From Subway owner to TikTok collectibles entrepreneur — Ali embodies the hustle, heart, and community values we champion." },
                { num: "03", title: "Taylor, MI Proud", body: "Rooted in Taylor, Michigan. Ali represents the best of what a local entrepreneur can be — driven, generous, and community-first." },
              ].map((f) => (
                <div key={f.num} className="subway-feature-card" style={{ padding: "52px 40px", background: "#111", borderTop: "2px solid #e6b450" }}>
                  <p style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: "11px", letterSpacing: "4px", color: "#e6b450", marginBottom: "16px" }}>{f.num}</p>
                  <h3 style={{ fontFamily: "'Anton', sans-serif", fontSize: "22px", textTransform: "uppercase", letterSpacing: "1px", marginBottom: "14px" }}>{f.title}</h3>
                  <p style={{ fontFamily: "'Barlow', sans-serif", fontSize: "15px", color: "#8a857c", lineHeight: 1.75 }}>{f.body}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ─── LOCATION CARD ─── */}
        <section style={{ padding: "90px 24px", textAlign: "center" }}>
          <div style={{ maxWidth: "700px", margin: "0 auto", display: "flex", flexDirection: "column", gap: "24px" }}>

            {/* TikTok card */}
            <div style={{ border: "1px solid rgba(230,180,80,0.45)", padding: "48px", borderRadius: "2px", background: "#0d0c0a" }}>
              <p style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: "11px", letterSpacing: "5px", color: "#e6b450", textTransform: "uppercase", marginBottom: "16px" }}>Follow Ali's Business</p>
              <h3 style={{ fontFamily: "'Anton', sans-serif", fontSize: "clamp(26px, 4vw, 40px)", textTransform: "uppercase", letterSpacing: "1px", marginBottom: "20px" }}>
                AD Collectibles
              </h3>
              <p style={{ fontFamily: "'Barlow', sans-serif", fontSize: "15px", color: "#8a857c", marginBottom: "24px" }}>
                🎵 @adcollectibles on TikTok
              </p>
              <a
                href="https://www.tiktok.com/@adcollectibles"
                target="_blank"
                rel="noopener noreferrer"
                style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: "15px", fontWeight: 700, letterSpacing: "2px", color: "#080808", background: "linear-gradient(135deg, #f0c060 0%, #e6b450 50%, #c9922f 100%)", textDecoration: "none", padding: "14px 36px", borderRadius: "2px", display: "inline-block" }}
              >
                Follow on TikTok →
              </a>
            </div>

            {/* Subway card */}
            <div style={{ border: "1px solid rgba(230,180,80,0.15)", padding: "40px 48px", borderRadius: "2px", background: "#0a0908" }}>
              <p style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: "11px", letterSpacing: "5px", color: "#8a857c", textTransform: "uppercase", marginBottom: "14px" }}>Also Visit Ali's Subway</p>
              <h3 style={{ fontFamily: "'Anton', sans-serif", fontSize: "clamp(22px, 3vw, 32px)", textTransform: "uppercase", letterSpacing: "1px", marginBottom: "18px", color: "#f5f1e8" }}>
                Subway — Taylor, MI
              </h3>
              <div style={{ display: "flex", flexDirection: "column", gap: "8px", alignItems: "center" }}>
                <p style={{ fontFamily: "'Barlow', sans-serif", fontSize: "15px", color: "#8a857c" }}>
                  📍 23475 Eureka Rd, Taylor, MI 48180
                </p>
                <p style={{ fontFamily: "'Barlow', sans-serif", fontSize: "14px", color: "#8a857c" }}>
                  🕐 Open · Closes 9 PM
                </p>
                <a
                  href="https://www.google.com/maps/search/23475+Eureka+Rd+Taylor+MI+48180"
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: "14px", fontWeight: 700, letterSpacing: "2px", color: "#8a857c", textDecoration: "none", marginTop: "6px" }}
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
            One Good Word...One Good Deed LLC &nbsp;|&nbsp; In Partnership with Ali — AD Collectibles &amp; Subway Taylor, MI &nbsp;|&nbsp; ogwogd.org
          </p>
        </div>
      </div>
    </>
  );
}