import { useEffect, useState } from "react";
import StickyNav from "@/components/home/StickyNav";

const LOGO_URL = "https://media.base44.com/images/public/6a19e1fc6c5eb736a0763b09/1824cf861_IMG_5119.png";

export default function FullyPromoted() {
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
        .fp-grain-layer {
          position: fixed; inset: -50%;
          width: 200%; height: 200%;
          background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 200 200'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E");
          opacity: 0.045;
          pointer-events: none;
          z-index: 999;
          animation: grain 0.4s steps(1) infinite;
        }
        .fp-float { animation: float 5s ease-in-out infinite; }
        .fp-glow  { animation: glow-breathe 3.5s ease-in-out infinite; }
        .fp-shimmer-btn {
          position: relative; overflow: hidden; cursor: pointer; display: inline-block; text-decoration: none;
        }
        .fp-shimmer-btn::after {
          content: ''; position: absolute; top: -60%; left: -120%;
          width: 55%; height: 220%;
          background: linear-gradient(90deg, transparent, rgba(255,255,255,0.28), transparent);
          transform: skewX(-18deg);
          animation: shimmer 3.2s ease infinite;
        }
        .fp-feature-card { transition: background 0.3s, transform 0.3s; }
        .fp-feature-card:hover { background: #161410 !important; transform: translateY(-4px); }
      `}</style>

      <div className="fp-grain-layer" />
      <StickyNav logoUrl={LOGO_URL} />

      <div style={{ fontFamily: "'Barlow', sans-serif", background: "#080808", minHeight: "100vh", color: "#f5f1e8", overflowX: "hidden", paddingTop: "64px" }}>

        {/* ─── HERO ─────────────────────────────────────────── */}
        <section style={{ position: "relative", minHeight: "100vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "100px 24px 80px", overflow: "hidden", textAlign: "center" }}>

          <div className="fp-glow" style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%,-50%)", width: "700px", height: "700px", background: "radial-gradient(circle, rgba(230,180,80,0.16) 0%, transparent 68%)", pointerEvents: "none" }} />

          {/* Shirt / branding icon */}
          <div className="fp-float" style={{ marginBottom: "48px" }}>
            <svg viewBox="0 0 160 140" width="160" height="140" style={{ filter: "drop-shadow(0 0 36px rgba(230,180,80,0.55))" }}>
              <defs>
                <radialGradient id="shirtGold" cx="38%" cy="22%" r="72%">
                  <stop offset="0%"   stopColor="#f5d070" />
                  <stop offset="55%"  stopColor="#e6b450" />
                  <stop offset="100%" stopColor="#7a4e0a" />
                </radialGradient>
              </defs>
              {/* T-Shirt shape */}
              <path d="M30,20 L10,50 L35,58 L35,120 L125,120 L125,58 L150,50 L130,20 L105,35 Q80,48 55,35 Z" fill="url(#shirtGold)" />
              {/* Collar */}
              <path d="M55,35 Q80,55 105,35" fill="none" stroke="#080808" strokeWidth="4" strokeLinecap="round" />
            </svg>
          </div>

          <div style={fadeStyle(0.1)}>
            <span style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: "11px", fontWeight: 700, letterSpacing: "5px", color: "#e6b450", border: "1px solid rgba(230,180,80,0.45)", padding: "7px 18px", textTransform: "uppercase", borderRadius: "2px", display: "inline-block", marginBottom: "22px" }}>
              Official Partner
            </span>
          </div>

          <h1 style={{ ...fadeStyle(0.22), fontFamily: "'Anton', sans-serif", fontSize: "clamp(38px, 7.5vw, 78px)", lineHeight: 0.95, textTransform: "uppercase", letterSpacing: "2px", marginBottom: "20px" }}>
            FULLY<br />
            <span style={{ color: "#e6b450" }}>PROMOTED</span>
          </h1>

          {/* BIG THANK YOU */}
          <div style={{ ...fadeStyle(0.30), margin: "0 auto 28px", maxWidth: "640px", background: "linear-gradient(135deg, rgba(230,180,80,0.15) 0%, rgba(230,180,80,0.06) 100%)", border: "1px solid rgba(230,180,80,0.5)", borderRadius: "4px", padding: "22px 32px" }}>
            <p style={{ fontFamily: "'Anton', sans-serif", fontSize: "clamp(18px, 3vw, 26px)", textTransform: "uppercase", letterSpacing: "2px", color: "#e6b450", marginBottom: "8px" }}>
              🙏 HUGE THANKS TO TOM &amp; GINA CASTLE!
            </p>
            <p style={{ fontFamily: "'Barlow', sans-serif", fontSize: "15px", color: "#f5f1e8", lineHeight: 1.65 }}>
              Tom and Gina — your generosity and belief in this mission mean the world to us. You didn't just support a cause, you joined a movement. We are deeply grateful for everything you do.
            </p>
          </div>

          <p style={{ ...fadeStyle(0.38), fontFamily: "'Barlow', sans-serif", fontSize: "18px", color: "#8a857c", maxWidth: "560px", lineHeight: 1.7, marginBottom: "16px" }}>
            One Good Word...One Good Deed LLC is proud to partner with Fully Promoted Plymouth — your local experts in branded apparel and promotional products that make your message stick.
          </p>

          <p style={{ ...fadeStyle(0.45), fontFamily: "'Barlow Condensed', sans-serif", fontSize: "15px", color: "#e6b450", letterSpacing: "2px", marginBottom: "44px" }}>
            📍 Plymouth, MI &nbsp;·&nbsp; Branded Apparel &amp; Promotional Products
          </p>

          <div style={{ ...fadeStyle(0.52), display: "flex", gap: "16px", flexWrap: "wrap", justifyContent: "center" }}>
            <a
              href="https://fullypromoted.com/locations/plymouth-mi/"
              target="_blank"
              rel="noopener noreferrer"
              className="fp-shimmer-btn"
              style={{ fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 700, fontSize: "15px", letterSpacing: "3px", textTransform: "uppercase", color: "#080808", background: "linear-gradient(135deg, #f0c060 0%, #e6b450 50%, #c9922f 100%)", padding: "16px 40px", borderRadius: "2px", boxShadow: "0 0 40px rgba(230,180,80,0.3), 0 8px 28px rgba(0,0,0,0.6)" }}
            >
              Visit Their Website
            </a>
            <a
              href="https://fullypromoted.com/locations/plymouth-mi/"
              target="_blank"
              rel="noopener noreferrer"
              style={{ fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 700, fontSize: "15px", letterSpacing: "3px", textTransform: "uppercase", color: "#e6b450", background: "transparent", border: "1px solid rgba(230,180,80,0.45)", padding: "16px 40px", borderRadius: "2px", textDecoration: "none" }}
            >
              Get a Quote
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
            YOUR BRAND.<br /><span style={{ color: "#e6b450" }}>YOUR MISSION.</span>
          </h2>
          <p style={{ fontFamily: "'Barlow', sans-serif", fontSize: "19px", color: "#8a857c", lineHeight: 1.85, maxWidth: "660px", margin: "0 auto 48px" }}>
            Every wristband, every shirt, every piece of branded gear that carries this movement's message — it spreads one good word further. Fully Promoted Plymouth helps make that happen. Tom and Gina understand that a brand is more than a logo — it's a statement about who you are and what you stand for.
          </p>

          {/* Shout out cards */}
          <div style={{ display: "flex", gap: "24px", flexWrap: "wrap", justifyContent: "center", maxWidth: "760px", margin: "0 auto" }}>
            {[
              { name: "Tom Castle", emoji: "🏆", title: "Champion of the Cause", body: "Tom, your willingness to pour into this community speaks volumes. You saw the mission and you showed up. That's what real partnership looks like." },
              { name: "Gina Castle", emoji: "💛", title: "Heart of the Movement", body: "Gina, your warmth and support have been a blessing to this organization. Thank you for believing in One Good Word...One Good Deed with everything you have." },
            ].map((person) => (
              <div key={person.name} style={{ flex: "1", minWidth: "280px", border: "1px solid rgba(230,180,80,0.4)", borderRadius: "2px", padding: "36px 32px", background: "#0d0c0a", textAlign: "center" }}>
                <div style={{ fontSize: "36px", marginBottom: "12px" }}>{person.emoji}</div>
                <p style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: "11px", letterSpacing: "4px", color: "#e6b450", textTransform: "uppercase", marginBottom: "10px" }}>{person.title}</p>
                <h3 style={{ fontFamily: "'Anton', sans-serif", fontSize: "28px", textTransform: "uppercase", color: "#f5f1e8", marginBottom: "16px" }}>{person.name}</h3>
                <p style={{ fontFamily: "'Barlow', sans-serif", fontSize: "15px", color: "#8a857c", lineHeight: 1.75 }}>{person.body}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ─── DIVIDER ─── */}
        <div style={{ height: "1px", background: "linear-gradient(90deg, transparent, rgba(230,180,80,0.15), transparent)", margin: "0 10%" }} />

        {/* ─── FEATURES ─── */}
        <section style={{ padding: "90px 24px", background: "#0b0b0b" }}>
          <div style={{ maxWidth: "1060px", margin: "0 auto" }}>
            <p style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: "12px", letterSpacing: "5px", color: "#e6b450", textTransform: "uppercase", textAlign: "center", marginBottom: "64px" }}>What Fully Promoted Does</p>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(270px, 1fr))", gap: "3px" }}>
              {[
                { num: "01", title: "Branded Apparel", body: "Custom shirts, hats, hoodies, and more — screen printed or embroidered to represent your brand at every event, school visit, and community gathering." },
                { num: "02", title: "Promotional Products", body: "From pens to banners to giveaways — Fully Promoted helps your message reach further with quality promotional items that leave a lasting impression." },
                { num: "03", title: "Plymouth Local", body: "Based in Plymouth, MI — Tom and Gina run a shop that cares about the community it serves. Local business, local values, local impact." },
              ].map((f) => (
                <div key={f.num} className="fp-feature-card" style={{ padding: "52px 40px", background: "#111", borderTop: "2px solid #e6b450" }}>
                  <p style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: "11px", letterSpacing: "4px", color: "#e6b450", marginBottom: "16px" }}>{f.num}</p>
                  <h3 style={{ fontFamily: "'Anton', sans-serif", fontSize: "22px", textTransform: "uppercase", letterSpacing: "1px", marginBottom: "14px" }}>{f.title}</h3>
                  <p style={{ fontFamily: "'Barlow', sans-serif", fontSize: "15px", color: "#8a857c", lineHeight: 1.75 }}>{f.body}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ─── CONTACT CARD ─── */}
        <section style={{ padding: "90px 24px", textAlign: "center" }}>
          <div style={{ maxWidth: "700px", margin: "0 auto", border: "1px solid rgba(230,180,80,0.25)", padding: "60px 48px", borderRadius: "2px", background: "#0d0c0a" }}>
            <p style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: "11px", letterSpacing: "5px", color: "#e6b450", textTransform: "uppercase", marginBottom: "20px" }}>Connect with Tom &amp; Gina</p>
            <h3 style={{ fontFamily: "'Anton', sans-serif", fontSize: "clamp(26px, 4vw, 40px)", textTransform: "uppercase", letterSpacing: "1px", marginBottom: "24px" }}>
              Fully Promoted — Plymouth, MI
            </h3>
            <div style={{ display: "flex", flexDirection: "column", gap: "10px", alignItems: "center" }}>
              <p style={{ fontFamily: "'Barlow', sans-serif", fontSize: "16px", color: "#8a857c", lineHeight: 1.7 }}>
                📍 Plymouth, Michigan
              </p>
              <p style={{ fontFamily: "'Barlow', sans-serif", fontSize: "15px", color: "#8a857c" }}>
                👕 Branded Apparel &amp; Promotional Products
              </p>
              <div style={{ display: "flex", gap: "16px", marginTop: "12px", flexWrap: "wrap", justifyContent: "center" }}>
                <a
                  href="https://fullypromoted.com/locations/plymouth-mi/"
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: "14px", fontWeight: 700, letterSpacing: "2px", color: "#080808", background: "linear-gradient(135deg, #f0c060 0%, #e6b450 50%, #c9922f 100%)", textDecoration: "none", padding: "12px 28px", borderRadius: "2px", display: "inline-block" }}
                >
                  Visit Website →
                </a>
                <a
                  href="https://fullypromoted.com/locations/plymouth-mi/"
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: "14px", fontWeight: 700, letterSpacing: "2px", color: "#8a857c", textDecoration: "none", padding: "12px 28px", border: "1px solid rgba(230,180,80,0.3)", borderRadius: "2px" }}
                  onMouseOver={e => e.target.style.color = "#e6b450"}
                  onMouseOut={e => e.target.style.color = "#8a857c"}
                >
                  Get a Quote →
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* ─── FOOTER BAR ─── */}
        <div style={{ borderTop: "1px solid #141414", padding: "30px 24px", textAlign: "center" }}>
          <p style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: "11px", letterSpacing: "3px", color: "#2a2620", textTransform: "uppercase" }}>
            One Good Word...One Good Deed LLC &nbsp;|&nbsp; In Partnership with Fully Promoted — Plymouth, MI &nbsp;|&nbsp; ogwogd.org
          </p>
        </div>
      </div>
    </>
  );
}