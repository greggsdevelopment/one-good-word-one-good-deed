import { useEffect, useState } from "react";
import StickyNav from "@/components/home/StickyNav";

const LOGO_URL = "https://media.base44.com/images/public/6a19e1fc6c5eb736a0763b09/1824cf861_IMG_5119.png";

export default function LivRiteRecovery() {
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
        .lrr-grain-layer {
          position: fixed; inset: -50%;
          width: 200%; height: 200%;
          background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 200 200'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E");
          opacity: 0.045;
          pointer-events: none;
          z-index: 999;
          animation: grain 0.4s steps(1) infinite;
        }
        .lrr-float { animation: float 5s ease-in-out infinite; }
        .lrr-glow  { animation: glow-breathe 3.5s ease-in-out infinite; }
        .lrr-shimmer-btn {
          position: relative; overflow: hidden; cursor: pointer; display: inline-block; text-decoration: none;
        }
        .lrr-shimmer-btn::after {
          content: ''; position: absolute; top: -60%; left: -120%;
          width: 55%; height: 220%;
          background: linear-gradient(90deg, transparent, rgba(255,255,255,0.28), transparent);
          transform: skewX(-18deg);
          animation: shimmer 3.2s ease infinite;
        }
        .lrr-feature-card { transition: background 0.3s, transform 0.3s; }
        .lrr-feature-card:hover { background: #161410 !important; transform: translateY(-4px); }
      `}</style>

      <div className="lrr-grain-layer" />
      <StickyNav logoUrl={LOGO_URL} />

      <div style={{ fontFamily: "'Barlow', sans-serif", background: "#080808", minHeight: "100vh", color: "#f5f1e8", overflowX: "hidden", paddingTop: "64px" }}>

        {/* ─── HERO ─── */}
        <section style={{ position: "relative", minHeight: "100vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "100px 24px 80px", overflow: "hidden", textAlign: "center" }}>

          <div className="lrr-glow" style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%,-50%)", width: "700px", height: "700px", background: "radial-gradient(circle, rgba(230,180,80,0.16) 0%, transparent 68%)", pointerEvents: "none" }} />

          {/* Heart / recovery icon */}
          <div className="lrr-float" style={{ marginBottom: "48px" }}>
            <svg viewBox="0 0 160 150" width="150" height="140" style={{ filter: "drop-shadow(0 0 36px rgba(230,180,80,0.55))" }}>
              <defs>
                <radialGradient id="heartGold" cx="38%" cy="22%" r="72%">
                  <stop offset="0%"   stopColor="#f5d070" />
                  <stop offset="55%"  stopColor="#e6b450" />
                  <stop offset="100%" stopColor="#7a4e0a" />
                </radialGradient>
              </defs>
              <path d="M80,130 C80,130 15,85 15,45 A30,30 0 0,1 80,35 A30,30 0 0,1 145,45 C145,85 80,130 80,130 Z" fill="url(#heartGold)" />
              {/* Pulse line inside heart */}
              <polyline points="48,68 58,68 65,50 72,86 80,55 88,75 95,68 112,68" fill="none" stroke="#080808" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" opacity="0.7" />
            </svg>
          </div>

          <div style={fadeStyle(0.1)}>
            <span style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: "11px", fontWeight: 700, letterSpacing: "5px", color: "#e6b450", border: "1px solid rgba(230,180,80,0.45)", padding: "7px 18px", textTransform: "uppercase", borderRadius: "2px", display: "inline-block", marginBottom: "22px" }}>
              Official Partner
            </span>
          </div>

          <h1 style={{ ...fadeStyle(0.22), fontFamily: "'Anton', sans-serif", fontSize: "clamp(38px, 7.5vw, 78px)", lineHeight: 0.95, textTransform: "uppercase", letterSpacing: "2px", marginBottom: "20px" }}>
            LIV RITE<br />
            <span style={{ color: "#e6b450" }}>RECOVERY</span>
          </h1>

          {/* HUGE THANK YOU TO BRENDA */}
          <div style={{ ...fadeStyle(0.30), margin: "0 auto 28px", maxWidth: "640px", background: "linear-gradient(135deg, rgba(230,180,80,0.15) 0%, rgba(230,180,80,0.06) 100%)", border: "1px solid rgba(230,180,80,0.5)", borderRadius: "4px", padding: "22px 32px" }}>
            <p style={{ fontFamily: "'Anton', sans-serif", fontSize: "clamp(18px, 3vw, 26px)", textTransform: "uppercase", letterSpacing: "2px", color: "#e6b450", marginBottom: "8px" }}>
              🙏 A HUGE THANK YOU TO BRENDA MACK!
            </p>
            <p style={{ fontFamily: "'Barlow', sans-serif", fontSize: "15px", color: "#f5f1e8", lineHeight: 1.65 }}>
              Brenda — your heart for this community is unmatched. You have poured yourself into helping people find their way back, and your support of this mission means more than words can say. We are deeply grateful for you and everything Live Rite Recovery stands for.
            </p>
          </div>

          <p style={{ ...fadeStyle(0.38), fontFamily: "'Barlow', sans-serif", fontSize: "18px", color: "#8a857c", maxWidth: "560px", lineHeight: 1.7, marginBottom: "16px" }}>
            One Good Word...One Good Deed LLC is proud to partner with Live Rite Recovery Corp — a non-profit dedicated to helping those with substance use disorder find the resources they need for long-term recovery.
          </p>

          <p style={{ ...fadeStyle(0.45), fontFamily: "'Barlow Condensed', sans-serif", fontSize: "15px", color: "#e6b450", letterSpacing: "2px", marginBottom: "44px" }}>
            💛 Recovery · Hope · Community
          </p>

          <div style={{ ...fadeStyle(0.52), display: "flex", gap: "16px", flexWrap: "wrap", justifyContent: "center" }}>
            <a
              href="https://liveritestructuredcorp.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="lrr-shimmer-btn"
              style={{ fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 700, fontSize: "15px", letterSpacing: "3px", textTransform: "uppercase", color: "#080808", background: "linear-gradient(135deg, #f0c060 0%, #e6b450 50%, #c9922f 100%)", padding: "16px 40px", borderRadius: "2px", boxShadow: "0 0 40px rgba(230,180,80,0.3), 0 8px 28px rgba(0,0,0,0.6)" }}
            >
              Visit Their Website
            </a>
            <a
              href="https://liveritestructuredcorp.com/resources/rrrc"
              target="_blank"
              rel="noopener noreferrer"
              style={{ fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 700, fontSize: "15px", letterSpacing: "3px", textTransform: "uppercase", color: "#e6b450", background: "transparent", border: "1px solid rgba(230,180,80,0.45)", padding: "16px 40px", borderRadius: "2px", textDecoration: "none" }}
            >
              Resource Center
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
            ONE GOOD WORD<br /><span style={{ color: "#e6b450" }}>CAN SAVE A LIFE.</span>
          </h2>
          <p style={{ fontFamily: "'Barlow', sans-serif", fontSize: "19px", color: "#8a857c", lineHeight: 1.85, maxWidth: "660px", margin: "0 auto" }}>
            Live Rite Recovery Corp and One Good Word...One Good Deed share the same heartbeat — showing up for people when it matters most. Recovery is hard. But with the right resources, the right community, and one good word at the right moment, it's possible. That's what this partnership is all about.
          </p>
        </section>

        {/* ─── DIVIDER ─── */}
        <div style={{ height: "1px", background: "linear-gradient(90deg, transparent, rgba(230,180,80,0.15), transparent)", margin: "0 10%" }} />

        {/* ─── FEATURES ─── */}
        <section style={{ padding: "90px 24px", background: "#0b0b0b" }}>
          <div style={{ maxWidth: "1060px", margin: "0 auto" }}>
            <p style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: "12px", letterSpacing: "5px", color: "#e6b450", textTransform: "uppercase", textAlign: "center", marginBottom: "64px" }}>What Live Rite Recovery Does</p>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(270px, 1fr))", gap: "3px" }}>
              {[
                { num: "01", title: "Recovery Resource Center", body: "Open to the public Monday–Friday, 9–5pm. Housing, food, clothing, employment, meetings — trained Recovery Care Technicians are ready to help." },
                { num: "02", title: "Housing & Support", body: "Nine recovery homes offering a structured, supportive environment for those taking their first steps toward a new life in recovery." },
                { num: "03", title: "Jobs & Career Training", body: "Live Rite partners with local employers and runs career training programs — including their Peer Recovery Coaching Academy — to help people rebuild." },
              ].map((f) => (
                <div key={f.num} className="lrr-feature-card" style={{ padding: "52px 40px", background: "#111", borderTop: "2px solid #e6b450" }}>
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
            <p style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: "11px", letterSpacing: "5px", color: "#e6b450", textTransform: "uppercase", marginBottom: "20px" }}>Connect with Live Rite Recovery</p>
            <h3 style={{ fontFamily: "'Anton', sans-serif", fontSize: "clamp(26px, 4vw, 40px)", textTransform: "uppercase", letterSpacing: "1px", marginBottom: "20px" }}>
              Live Rite Recovery Corp
            </h3>
            <p style={{ fontFamily: "'Barlow', sans-serif", fontSize: "15px", color: "#8a857c", marginBottom: "12px" }}>
              A non-profit helping those in substance use recovery with housing, food, employment, and community support.
            </p>
            <p style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: "14px", color: "#8a857c", marginBottom: "24px" }}>
              🕐 Resource Center: M–F, 9am–5pm
            </p>
            <div style={{ display: "flex", gap: "16px", justifyContent: "center", flexWrap: "wrap" }}>
              <a
                href="https://liveritestructuredcorp.com/"
                target="_blank"
                rel="noopener noreferrer"
                style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: "14px", fontWeight: 700, letterSpacing: "2px", color: "#080808", background: "linear-gradient(135deg, #f0c060 0%, #e6b450 50%, #c9922f 100%)", textDecoration: "none", padding: "12px 28px", borderRadius: "2px", display: "inline-block" }}
              >
                Visit Website →
              </a>
              <a
                href="https://liveritestructuredcorp.com/donate"
                target="_blank"
                rel="noopener noreferrer"
                style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: "14px", fontWeight: 700, letterSpacing: "2px", color: "#8a857c", textDecoration: "none", padding: "12px 28px", border: "1px solid rgba(230,180,80,0.3)", borderRadius: "2px" }}
                onMouseOver={e => e.target.style.color = "#e6b450"}
                onMouseOut={e => e.target.style.color = "#8a857c"}
              >
                Support Their Work →
              </a>
            </div>
          </div>
        </section>

        {/* ─── FOOTER BAR ─── */}
        <div style={{ borderTop: "1px solid #141414", padding: "30px 24px", textAlign: "center" }}>
          <p style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: "11px", letterSpacing: "3px", color: "#2a2620", textTransform: "uppercase" }}>
            One Good Word...One Good Deed LLC &nbsp;|&nbsp; In Partnership with Live Rite Recovery Corp &nbsp;|&nbsp; ogwogd.org
          </p>
        </div>
      </div>
    </>
  );
}