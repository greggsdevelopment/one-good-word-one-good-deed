import { useEffect, useState } from "react";
import StickyNav from "@/components/home/StickyNav";

const LOGO_URL = "https://media.base44.com/images/public/6a19e1fc6c5eb736a0763b09/1824cf861_IMG_5119.png";
const PAPAS_PHOTO = "https://media.base44.com/images/public/6a19e1fc6c5eb736a0763b09/5c3032956_IMG_5516.png";

export default function PapasPizza() {
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
        .papas-grain-layer {
          position: fixed; inset: -50%;
          width: 200%; height: 200%;
          background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 200 200'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E");
          opacity: 0.045;
          pointer-events: none;
          z-index: 999;
          animation: grain 0.4s steps(1) infinite;
        }
        .papas-float { animation: float 5s ease-in-out infinite; }
        .papas-glow  { animation: glow-breathe 3.5s ease-in-out infinite; }
        .papas-shimmer-btn {
          position: relative; overflow: hidden; cursor: pointer; display: inline-block; text-decoration: none;
        }
        .papas-shimmer-btn::after {
          content: ''; position: absolute; top: -60%; left: -120%;
          width: 55%; height: 220%;
          background: linear-gradient(90deg, transparent, rgba(255,255,255,0.28), transparent);
          transform: skewX(-18deg);
          animation: shimmer 3.2s ease infinite;
        }
        .papas-feature-card { transition: background 0.3s, transform 0.3s; }
        .papas-feature-card:hover { background: #161410 !important; transform: translateY(-4px); }
      `}</style>

      <div className="papas-grain-layer" />
      <StickyNav logoUrl={LOGO_URL} />

      <div style={{ fontFamily: "'Barlow', sans-serif", background: "#080808", minHeight: "100vh", color: "#f5f1e8", overflowX: "hidden", paddingTop: "64px" }}>

        {/* ─── HERO ─────────────────────────────────────────── */}
        <section style={{ position: "relative", minHeight: "100vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "100px 24px 80px", overflow: "hidden", textAlign: "center" }}>

          <div className="papas-glow" style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%,-50%)", width: "700px", height: "700px", background: "radial-gradient(circle, rgba(230,180,80,0.16) 0%, transparent 68%)", pointerEvents: "none" }} />

          {/* Pizza icon */}
          <div className="papas-float" style={{ marginBottom: "48px" }}>
            <svg viewBox="0 0 160 160" width="150" height="150" style={{ filter: "drop-shadow(0 0 36px rgba(230,180,80,0.55))" }}>
              <defs>
                <radialGradient id="pizzaGold" cx="38%" cy="22%" r="72%">
                  <stop offset="0%"   stopColor="#f5d070" />
                  <stop offset="55%"  stopColor="#e6b450" />
                  <stop offset="100%" stopColor="#7a4e0a" />
                </radialGradient>
              </defs>
              {/* Crust */}
              <circle cx="80" cy="80" r="72" fill="url(#pizzaGold)" />
              {/* Sauce */}
              <circle cx="80" cy="80" r="58" fill="#c0392b" opacity="0.85" />
              {/* Cheese */}
              <circle cx="80" cy="80" r="50" fill="#f5c842" opacity="0.75" />
              {/* Slice lines */}
              <line x1="80" y1="22" x2="80" y2="138" stroke="url(#pizzaGold)" strokeWidth="2" opacity="0.5" />
              <line x1="22" y1="80" x2="138" y2="80" stroke="url(#pizzaGold)" strokeWidth="2" opacity="0.5" />
              <line x1="38" y1="38" x2="122" y2="122" stroke="url(#pizzaGold)" strokeWidth="2" opacity="0.5" />
              <line x1="122" y1="38" x2="38" y2="122" stroke="url(#pizzaGold)" strokeWidth="2" opacity="0.5" />
              {/* Toppings */}
              <circle cx="80" cy="55" r="5" fill="#7a4e0a" opacity="0.8" />
              <circle cx="60" cy="85" r="5" fill="#7a4e0a" opacity="0.8" />
              <circle cx="100" cy="90" r="4" fill="#7a4e0a" opacity="0.8" />
              <circle cx="90" cy="68" r="3.5" fill="#7a4e0a" opacity="0.8" />
            </svg>
          </div>

          <div style={fadeStyle(0.1)}>
            <span style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: "11px", fontWeight: 700, letterSpacing: "5px", color: "#e6b450", border: "1px solid rgba(230,180,80,0.45)", padding: "7px 18px", textTransform: "uppercase", borderRadius: "2px", display: "inline-block", marginBottom: "22px" }}>
              Official Partner
            </span>
          </div>

          <h1 style={{ ...fadeStyle(0.22), fontFamily: "'Anton', sans-serif", fontSize: "clamp(38px, 7.5vw, 78px)", lineHeight: 0.95, textTransform: "uppercase", letterSpacing: "2px", marginBottom: "20px" }}>
            PAPA'S PIZZA<br />
            <span style={{ color: "#e6b450" }}>&amp; BBQ</span>
          </h1>

          <p style={{ ...fadeStyle(0.38), fontFamily: "'Barlow', sans-serif", fontSize: "18px", color: "#8a857c", maxWidth: "560px", lineHeight: 1.7, marginBottom: "16px" }}>
            One Good Word...One Good Deed LLC is proud to partner with Papa's Pizza & BBQ — a Westland, Michigan staple bringing bold flavors and community love to every table.
          </p>

          <p style={{ ...fadeStyle(0.45), fontFamily: "'Barlow Condensed', sans-serif", fontSize: "15px", color: "#e6b450", letterSpacing: "2px", marginBottom: "44px" }}>
            📍 1980 N Wayne Rd, Westland, MI 48185 &nbsp;·&nbsp; ⭐ 4.8 (111 Reviews)
          </p>

          <div style={{ ...fadeStyle(0.52), display: "flex", gap: "16px", flexWrap: "wrap", justifyContent: "center" }}>
            <a
              href="https://www.google.com/maps/search/1980+N+Wayne+Rd+Westland+MI+48185"
              target="_blank"
              rel="noopener noreferrer"
              className="papas-shimmer-btn"
              style={{ fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 700, fontSize: "15px", letterSpacing: "3px", textTransform: "uppercase", color: "#080808", background: "linear-gradient(135deg, #f0c060 0%, #e6b450 50%, #c9922f 100%)", padding: "16px 40px", borderRadius: "2px", boxShadow: "0 0 40px rgba(230,180,80,0.3), 0 8px 28px rgba(0,0,0,0.6)" }}
            >
              Get Directions
            </a>
            <a
              href="tel:7343287272"
              style={{ fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 700, fontSize: "15px", letterSpacing: "3px", textTransform: "uppercase", color: "#e6b450", background: "transparent", border: "1px solid rgba(230,180,80,0.45)", padding: "16px 40px", borderRadius: "2px", textDecoration: "none" }}
            >
              Call (734) 328-7272
            </a>
          </div>

          <div style={{ position: "absolute", bottom: "28px", left: "50%", transform: "translateX(-50%)", color: "#3a3630", fontSize: "11px", letterSpacing: "4px", fontFamily: "'Barlow Condensed', sans-serif" }}>
            SCROLL
          </div>
        </section>

        {/* ─── DIVIDER ───────────────────────────────────────── */}
        <div style={{ height: "1px", background: "linear-gradient(90deg, transparent, rgba(230,180,80,0.35), transparent)", margin: "0 10%" }} />

        {/* ─── PHOTO ─────────────────────────────────────────── */}
        <section style={{ padding: "80px 24px 0" }}>
          <div style={{ maxWidth: "900px", margin: "0 auto", border: "1px solid rgba(230,180,80,0.2)", overflow: "hidden", borderRadius: "2px" }}>
            <img
              src={PAPAS_PHOTO}
              alt="Papa's Pizza & BBQ — Westland, MI"
              style={{ width: "100%", display: "block", objectFit: "cover", maxHeight: "480px" }}
            />
          </div>
        </section>

        {/* ─── MISSION COPY ──────────────────────────────────── */}
        <section style={{ padding: "110px 24px", maxWidth: "860px", margin: "0 auto", textAlign: "center" }}>
          <p style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: "12px", letterSpacing: "5px", color: "#e6b450", textTransform: "uppercase", marginBottom: "24px" }}>Why This Partnership Matters</p>
          <h2 style={{ fontFamily: "'Anton', sans-serif", fontSize: "clamp(32px, 5.5vw, 58px)", lineHeight: 1.05, textTransform: "uppercase", marginBottom: "36px" }}>
            GOOD FOOD.<br /><span style={{ color: "#e6b450" }}>GOOD PEOPLE.</span>
          </h2>
          <p style={{ fontFamily: "'Barlow', sans-serif", fontSize: "19px", color: "#8a857c", lineHeight: 1.85, maxWidth: "660px", margin: "0 auto" }}>
            Great communities are fed — literally and figuratively — by businesses that care. Papa's Pizza & BBQ isn't just serving incredible food; they're serving the spirit of the neighborhood. That's the kind of energy this mission runs on.
          </p>
        </section>

        {/* ─── DIVIDER ───────────────────────────────────────── */}
        <div style={{ height: "1px", background: "linear-gradient(90deg, transparent, rgba(230,180,80,0.15), transparent)", margin: "0 10%" }} />

        {/* ─── FEATURES ──────────────────────────────────────── */}
        <section style={{ padding: "90px 24px", background: "#0b0b0b" }}>
          <div style={{ maxWidth: "1060px", margin: "0 auto" }}>
            <p style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: "12px", letterSpacing: "5px", color: "#e6b450", textTransform: "uppercase", textAlign: "center", marginBottom: "64px" }}>What Papa's Brings</p>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(270px, 1fr))", gap: "3px" }}>
              {[
                { num: "01", title: "Pizza & BBQ", body: "A one-of-a-kind combo — bold BBQ flavors meets the comfort of great pizza. Open late, rated 4.8 stars by over 111 customers." },
                { num: "02", title: "Westland Rooted", body: "Located at 1980 N Wayne Rd, Papa's is a true local gem — the kind of spot that becomes part of the neighborhood fabric." },
                { num: "03", title: "Community First", body: "Open until midnight, serving families, night owls, and everyone in between. This is community dining done right." },
              ].map((f) => (
                <div key={f.num} className="papas-feature-card" style={{ padding: "52px 40px", background: "#111", borderTop: "2px solid #e6b450" }}>
                  <p style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: "11px", letterSpacing: "4px", color: "#e6b450", marginBottom: "16px" }}>{f.num}</p>
                  <h3 style={{ fontFamily: "'Anton', sans-serif", fontSize: "22px", textTransform: "uppercase", letterSpacing: "1px", marginBottom: "14px" }}>{f.title}</h3>
                  <p style={{ fontFamily: "'Barlow', sans-serif", fontSize: "15px", color: "#8a857c", lineHeight: 1.75 }}>{f.body}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ─── LOCATION CARD ─────────────────────────────────── */}
        <section style={{ padding: "90px 24px", textAlign: "center" }}>
          <div style={{ maxWidth: "700px", margin: "0 auto", border: "1px solid rgba(230,180,80,0.25)", padding: "60px 48px", borderRadius: "2px", background: "#0d0c0a" }}>
            <p style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: "11px", letterSpacing: "5px", color: "#e6b450", textTransform: "uppercase", marginBottom: "20px" }}>Come Visit</p>
            <h3 style={{ fontFamily: "'Anton', sans-serif", fontSize: "clamp(28px, 4vw, 42px)", textTransform: "uppercase", letterSpacing: "1px", marginBottom: "24px" }}>
              Papa's Pizza &amp; BBQ
            </h3>
            <div style={{ display: "flex", flexDirection: "column", gap: "10px", alignItems: "center" }}>
              <p style={{ fontFamily: "'Barlow', sans-serif", fontSize: "16px", color: "#8a857c", lineHeight: 1.7 }}>
                📍 1980 N Wayne Rd, Westland, MI 48185
              </p>
              <p style={{ fontFamily: "'Barlow', sans-serif", fontSize: "15px", color: "#8a857c" }}>
                🕐 Open · Closes 12 AM &nbsp;·&nbsp; ⭐ 4.8 Stars
              </p>
              <a
                href="tel:7343287272"
                style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: "20px", fontWeight: 700, letterSpacing: "2px", color: "#e6b450", textDecoration: "none", transition: "opacity 0.2s" }}
                onMouseOver={e => e.target.style.opacity = "0.75"}
                onMouseOut={e => e.target.style.opacity = "1"}
              >
                📞 (734) 328-7272
              </a>
              <a
                href="https://www.google.com/maps/search/1980+N+Wayne+Rd+Westland+MI+48185"
                target="_blank"
                rel="noopener noreferrer"
                style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: "14px", fontWeight: 700, letterSpacing: "2px", color: "#8a857c", textDecoration: "none", marginTop: "4px" }}
                onMouseOver={e => e.target.style.color = "#e6b450"}
                onMouseOut={e => e.target.style.color = "#8a857c"}
              >
                Get Directions →
              </a>
            </div>
          </div>
        </section>

        {/* ─── FOOTER BAR ────────────────────────────────────── */}
        <div style={{ borderTop: "1px solid #141414", padding: "30px 24px", textAlign: "center" }}>
          <p style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: "11px", letterSpacing: "3px", color: "#2a2620", textTransform: "uppercase" }}>
            One Good Word...One Good Deed LLC &nbsp;|&nbsp; In Partnership with Papa's Pizza &amp; BBQ — Westland, MI &nbsp;|&nbsp; ogwogd.org
          </p>
        </div>
      </div>
    </>
  );
}