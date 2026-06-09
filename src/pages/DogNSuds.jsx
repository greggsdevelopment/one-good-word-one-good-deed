import { useEffect, useState } from "react";
import StickyNav from "@/components/home/StickyNav";

const LOGO_URL = "https://media.base44.com/images/public/6a19e1fc6c5eb736a0763b09/1824cf861_IMG_5119.png";

export default function DogNSuds() {
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
        .dns-grain-layer {
          position: fixed; inset: -50%;
          width: 200%; height: 200%;
          background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 200 200'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E");
          opacity: 0.045;
          pointer-events: none;
          z-index: 999;
          animation: grain 0.4s steps(1) infinite;
        }
        .dns-float { animation: float 4.8s ease-in-out infinite; }
        .dns-glow  { animation: glow-breathe 3.5s ease-in-out infinite; }
        .dns-shimmer-btn {
          position: relative; overflow: hidden; cursor: pointer; display: inline-block; text-decoration: none;
        }
        .dns-shimmer-btn::after {
          content: ''; position: absolute; top: -60%; left: -120%;
          width: 55%; height: 220%;
          background: linear-gradient(90deg, transparent, rgba(255,255,255,0.28), transparent);
          transform: skewX(-18deg);
          animation: shimmer 3.2s ease infinite;
        }
        .dns-feature-card { transition: background 0.3s, transform 0.3s; }
        .dns-feature-card:hover { background: #161410 !important; transform: translateY(-4px); }
      `}</style>

      <div className="dns-grain-layer" />
      <StickyNav logoUrl={LOGO_URL} />

      <div style={{ fontFamily: "'Barlow', sans-serif", background: "#080808", minHeight: "100vh", color: "#f5f1e8", overflowX: "hidden", paddingTop: "64px" }}>

        {/* ─── HERO ─────────────────────────────────────────── */}
        <section style={{ position: "relative", minHeight: "100vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "100px 24px 80px", overflow: "hidden", textAlign: "center" }}>

          <div className="dns-glow" style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%,-50%)", width: "700px", height: "700px", background: "radial-gradient(circle, rgba(230,180,80,0.16) 0%, transparent 68%)", pointerEvents: "none" }} />

          {/* Paw print icon */}
          <div className="dns-float" style={{ marginBottom: "48px" }}>
            <svg viewBox="0 0 200 200" width="220" height="220" style={{ filter: "drop-shadow(0 0 36px rgba(230,180,80,0.55))" }}>
              <defs>
                <radialGradient id="pawGold" cx="38%" cy="22%" r="72%">
                  <stop offset="0%"   stopColor="#f5d070" />
                  <stop offset="55%"  stopColor="#e6b450" />
                  <stop offset="100%" stopColor="#7a4e0a" />
                </radialGradient>
              </defs>
              {/* Main paw pad */}
              <ellipse cx="100" cy="130" rx="38" ry="32" fill="url(#pawGold)" />
              {/* Toe pads */}
              <ellipse cx="58"  cy="90"  rx="18" ry="22" fill="url(#pawGold)" />
              <ellipse cx="86"  cy="72"  rx="18" ry="22" fill="url(#pawGold)" />
              <ellipse cx="114" cy="72"  rx="18" ry="22" fill="url(#pawGold)" />
              <ellipse cx="142" cy="90"  rx="18" ry="22" fill="url(#pawGold)" />
            </svg>
          </div>

          <div style={fadeStyle(0.1)}>
            <span style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: "11px", fontWeight: 700, letterSpacing: "5px", color: "#e6b450", border: "1px solid rgba(230,180,80,0.45)", padding: "7px 18px", textTransform: "uppercase", borderRadius: "2px", display: "inline-block", marginBottom: "22px" }}>
              Official Partner
            </span>
          </div>

          <h1 style={{ ...fadeStyle(0.22), fontFamily: "'Anton', sans-serif", fontSize: "clamp(42px, 8vw, 82px)", lineHeight: 0.95, textTransform: "uppercase", letterSpacing: "2px", marginBottom: "20px" }}>
            DOG N SUDS<br />
            <span style={{ color: "#e6b450" }}>PET GROOMING</span>
          </h1>

          <p style={{ ...fadeStyle(0.38), fontFamily: "'Barlow', sans-serif", fontSize: "18px", color: "#8a857c", maxWidth: "540px", lineHeight: 1.7, marginBottom: "16px" }}>
            One Good Word...One Good Deed LLC is proud to partner with Dog N Suds Pet Grooming — a community staple with over 25 years of loving care for your furry family members.
          </p>

          <p style={{ ...fadeStyle(0.45), fontFamily: "'Barlow Condensed', sans-serif", fontSize: "15px", color: "#e6b450", letterSpacing: "2px", marginBottom: "44px" }}>
            📍 2729 S Wayne Rd, Westland, MI
          </p>

          <div style={fadeStyle(0.52)}>
            <a
              href="https://www.facebook.com/dognsudspetgrooming/"
              target="_blank"
              rel="noopener noreferrer"
              className="dns-shimmer-btn"
              style={{ fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 700, fontSize: "17px", letterSpacing: "3px", textTransform: "uppercase", color: "#080808", background: "linear-gradient(135deg, #f0c060 0%, #e6b450 50%, #c9922f 100%)", padding: "18px 52px", borderRadius: "2px", boxShadow: "0 0 50px rgba(230,180,80,0.38), 0 10px 36px rgba(0,0,0,0.65)" }}
            >
              Visit Us on Facebook
            </a>
          </div>

          <p style={{ ...fadeStyle(0.65), marginTop: "18px", fontFamily: "'Barlow Condensed', sans-serif", fontSize: "12px", letterSpacing: "3px", color: "#3a3630", textTransform: "uppercase" }}>
            facebook.com/dognsudspetgrooming
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
            25+ YEARS OF LOVE.<br />ONE COMMUNITY.
          </h2>
          <p style={{ fontFamily: "'Barlow', sans-serif", fontSize: "19px", color: "#8a857c", lineHeight: 1.85, maxWidth: "660px", margin: "0 auto" }}>
            Dog N Suds has been a trusted name in Westland, MI for over two and a half decades. Their commitment to compassionate care for every pet reflects the same heart of service that drives One Good Word...One Good Deed. When businesses root themselves in the community, everyone thrives.
          </p>
        </section>

        {/* ─── DIVIDER ───────────────────────────────────────── */}
        <div style={{ height: "1px", background: "linear-gradient(90deg, transparent, rgba(230,180,80,0.15), transparent)", margin: "0 10%" }} />

        {/* ─── FEATURES ──────────────────────────────────────── */}
        <section style={{ padding: "90px 24px", background: "#0b0b0b" }}>
          <div style={{ maxWidth: "1060px", margin: "0 auto" }}>
            <p style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: "12px", letterSpacing: "5px", color: "#e6b450", textTransform: "uppercase", textAlign: "center", marginBottom: "64px" }}>What Dog N Suds Offers</p>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(270px, 1fr))", gap: "3px" }}>
              {[
                { num: "01", title: "25+ Years Experience", body: "Over two and a half decades of professional grooming means your pet is in the most trusted hands in Westland." },
                { num: "02", title: "Community Rooted", body: "A locally owned business that has grown alongside the Westland community — familiar faces who genuinely care." },
                { num: "03", title: "Full Grooming Services", body: "Baths, cuts, nail trims, and more — everything your furry family member needs to look and feel their best." },
              ].map((f) => (
                <div key={f.num} className="dns-feature-card" style={{ padding: "52px 40px", background: "#111", borderTop: "2px solid #e6b450" }}>
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
          <div className="dns-glow" style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%,-50%)", width: "600px", height: "400px", background: "radial-gradient(ellipse, rgba(230,180,80,0.1) 0%, transparent 68%)", pointerEvents: "none" }} />
          <p style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: "12px", letterSpacing: "5px", color: "#e6b450", textTransform: "uppercase", marginBottom: "24px" }}>Ready to Book?</p>
          <h2 style={{ fontFamily: "'Anton', sans-serif", fontSize: "clamp(38px, 7vw, 68px)", textTransform: "uppercase", lineHeight: 1.05, marginBottom: "16px" }}>
            GIVE YOUR PET THE<br />CARE THEY DESERVE
          </h2>
          <p style={{ fontFamily: "'Barlow', sans-serif", fontSize: "16px", color: "#8a857c", marginBottom: "48px" }}>
            📍 2729 S Wayne Rd, Westland, MI
          </p>
          <a
            href="https://www.facebook.com/dognsudspetgrooming/"
            target="_blank"
            rel="noopener noreferrer"
            className="dns-shimmer-btn"
            style={{ fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 700, fontSize: "18px", letterSpacing: "3px", textTransform: "uppercase", color: "#080808", background: "linear-gradient(135deg, #f0c060 0%, #e6b450 50%, #c9922f 100%)", padding: "22px 64px", borderRadius: "2px", boxShadow: "0 0 70px rgba(230,180,80,0.35), 0 14px 48px rgba(0,0,0,0.75)" }}
          >
            Connect on Facebook
          </a>
          <p style={{ marginTop: "22px", fontFamily: "'Barlow Condensed', sans-serif", fontSize: "13px", letterSpacing: "2px", color: "#3a3630" }}>
            25+ Years of Trust &nbsp;|&nbsp; Westland, MI
          </p>
        </section>

        {/* ─── FOOTER BAR ────────────────────────────────────── */}
        <div style={{ borderTop: "1px solid #141414", padding: "30px 24px", textAlign: "center" }}>
          <p style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: "11px", letterSpacing: "3px", color: "#2a2620", textTransform: "uppercase" }}>
            One Good Word...One Good Deed LLC &nbsp;|&nbsp; In Partnership with Dog N Suds Pet Grooming &nbsp;|&nbsp; ogwogd.org
          </p>
        </div>
      </div>
    </>
  );
}