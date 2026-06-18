import { useEffect, useState } from "react";
import StickyNav from "@/components/home/StickyNav";

const LOGO_URL = "https://media.base44.com/images/public/6a19e1fc6c5eb736a0763b09/1824cf861_IMG_5119.png";
const THEATER_BANNER = "https://cdn.phoenixmovies.net/theatres/003/banner1.jpg";
const JASON_AUTUMN_PHOTO = "https://media.base44.com/images/public/6a19e1fc6c5eb736a0763b09/d186489c7_image.png";

export default function ClassicStateWayne() {
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
        .csw-grain-layer {
          position: fixed; inset: -50%;
          width: 200%; height: 200%;
          background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 200 200'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E");
          opacity: 0.045;
          pointer-events: none;
          z-index: 999;
          animation: grain 0.4s steps(1) infinite;
        }
        .csw-float { animation: float 5s ease-in-out infinite; }
        .csw-glow  { animation: glow-breathe 3.5s ease-in-out infinite; }
        .csw-shimmer-btn {
          position: relative; overflow: hidden; cursor: pointer; display: inline-block; text-decoration: none;
        }
        .csw-shimmer-btn::after {
          content: ''; position: absolute; top: -60%; left: -120%;
          width: 55%; height: 220%;
          background: linear-gradient(90deg, transparent, rgba(255,255,255,0.28), transparent);
          transform: skewX(-18deg);
          animation: shimmer 3.2s ease infinite;
        }
        .csw-feature-card { transition: background 0.3s, transform 0.3s; }
        .csw-feature-card:hover { background: #161410 !important; transform: translateY(-4px); }
      `}</style>

      <div className="csw-grain-layer" />
      <StickyNav logoUrl={LOGO_URL} />

      <div style={{ fontFamily: "'Barlow', sans-serif", background: "#080808", minHeight: "100vh", color: "#f5f1e8", overflowX: "hidden", paddingTop: "64px" }}>

        {/* ─── HERO ─── */}
        <section style={{ position: "relative", minHeight: "100vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "100px 24px 80px", overflow: "hidden", textAlign: "center" }}>

          {/* Theater banner as hero background */}
          <div style={{ position: "absolute", inset: 0, backgroundImage: `url(${THEATER_BANNER})`, backgroundSize: "cover", backgroundPosition: "center", opacity: 0.12 }} />

          <div className="csw-glow" style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%,-50%)", width: "700px", height: "700px", background: "radial-gradient(circle, rgba(230,180,80,0.16) 0%, transparent 68%)", pointerEvents: "none" }} />

          {/* Film reel icon */}
          <div className="csw-float" style={{ marginBottom: "48px", position: "relative" }}>
            <svg viewBox="0 0 160 160" width="150" height="150" style={{ filter: "drop-shadow(0 0 36px rgba(230,180,80,0.55))" }}>
              <defs>
                <radialGradient id="reelGold" cx="38%" cy="22%" r="72%">
                  <stop offset="0%"   stopColor="#f5d070" />
                  <stop offset="55%"  stopColor="#e6b450" />
                  <stop offset="100%" stopColor="#7a4e0a" />
                </radialGradient>
              </defs>
              {/* Outer ring */}
              <circle cx="80" cy="80" r="72" fill="none" stroke="url(#reelGold)" strokeWidth="6" />
              {/* Film reel body */}
              <circle cx="80" cy="80" r="55" fill="url(#reelGold)" opacity="0.15" />
              <circle cx="80" cy="80" r="55" fill="none" stroke="url(#reelGold)" strokeWidth="3" />
              {/* Center hub */}
              <circle cx="80" cy="80" r="16" fill="url(#reelGold)" />
              <circle cx="80" cy="80" r="8"  fill="#080808" />
              {/* Sprocket holes */}
              {[0, 60, 120, 180, 240, 300].map((deg) => {
                const rad = (deg * Math.PI) / 180;
                const x = 80 + 36 * Math.cos(rad);
                const y = 80 + 36 * Math.sin(rad);
                return <circle key={deg} cx={x} cy={y} r="7" fill="#080808" stroke="url(#reelGold)" strokeWidth="2" />;
              })}
            </svg>
          </div>

          <div style={fadeStyle(0.1)}>
            <span style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: "11px", fontWeight: 700, letterSpacing: "5px", color: "#e6b450", border: "1px solid rgba(230,180,80,0.45)", padding: "7px 18px", textTransform: "uppercase", borderRadius: "2px", display: "inline-block", marginBottom: "22px" }}>
              Official Partner
            </span>
          </div>

          <h1 style={{ ...fadeStyle(0.22), fontFamily: "'Anton', sans-serif", fontSize: "clamp(34px, 7vw, 72px)", lineHeight: 0.95, textTransform: "uppercase", letterSpacing: "2px", marginBottom: "20px" }}>
            CLASSIC STATE<br />
            <span style={{ color: "#e6b450" }}>WAYNE THEATER</span>
          </h1>

          {/* HUGE THANK YOU TO AUTUMN */}
          <div style={{ ...fadeStyle(0.30), margin: "0 auto 28px", maxWidth: "640px", background: "linear-gradient(135deg, rgba(230,180,80,0.15) 0%, rgba(230,180,80,0.06) 100%)", border: "1px solid rgba(230,180,80,0.5)", borderRadius: "4px", padding: "22px 32px" }}>
            <p style={{ fontFamily: "'Anton', sans-serif", fontSize: "clamp(18px, 3vw, 26px)", textTransform: "uppercase", letterSpacing: "2px", color: "#e6b450", marginBottom: "8px" }}>
              🙏 A HUGE THANK YOU TO AUTUMN!
            </p>
            <p style={{ fontFamily: "'Barlow', sans-serif", fontSize: "15px", color: "#f5f1e8", lineHeight: 1.65 }}>
              Autumn — your support and generosity have made a real impact on this mission. Thank you for believing in One Good Word...One Good Deed and for opening the doors of Classic State Wayne Theater to our community. We are truly grateful for you.
            </p>
          </div>

          <p style={{ ...fadeStyle(0.38), fontFamily: "'Barlow', sans-serif", fontSize: "18px", color: "#8a857c", maxWidth: "560px", lineHeight: 1.7, marginBottom: "16px" }}>
            One Good Word...One Good Deed LLC is proud to partner with Phoenix Theatres Classic State Wayne — your local movie theater serving the Wayne, Michigan community.
          </p>

          <p style={{ ...fadeStyle(0.45), fontFamily: "'Barlow Condensed', sans-serif", fontSize: "15px", color: "#e6b450", letterSpacing: "2px", marginBottom: "44px" }}>
            🎬 35310 Michigan Ave, Wayne, MI &nbsp;·&nbsp; (734) 326-4602
          </p>

          <div style={{ ...fadeStyle(0.52), display: "flex", gap: "16px", flexWrap: "wrap", justifyContent: "center" }}>
            <a
              href="https://www.phoenixmovies.net/theatres/classic-state-wayne/003"
              target="_blank"
              rel="noopener noreferrer"
              className="csw-shimmer-btn"
              style={{ fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 700, fontSize: "15px", letterSpacing: "3px", textTransform: "uppercase", color: "#080808", background: "linear-gradient(135deg, #f0c060 0%, #e6b450 50%, #c9922f 100%)", padding: "16px 40px", borderRadius: "2px", boxShadow: "0 0 40px rgba(230,180,80,0.3), 0 8px 28px rgba(0,0,0,0.6)" }}
            >
              Visit Their Website
            </a>
            <a
              href="tel:7343264602"
              style={{ fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 700, fontSize: "15px", letterSpacing: "3px", textTransform: "uppercase", color: "#e6b450", background: "transparent", border: "1px solid rgba(230,180,80,0.45)", padding: "16px 40px", borderRadius: "2px", textDecoration: "none" }}
            >
              Call Now
            </a>
          </div>

          <div style={{ position: "absolute", bottom: "28px", left: "50%", transform: "translateX(-50%)", color: "#3a3630", fontSize: "11px", letterSpacing: "4px", fontFamily: "'Barlow Condensed', sans-serif" }}>
            SCROLL
          </div>
        </section>

        {/* ─── DIVIDER ─── */}
        <div style={{ height: "1px", background: "linear-gradient(90deg, transparent, rgba(230,180,80,0.35), transparent)", margin: "0 10%" }} />

        {/* ─── PHOTOS ─── */}
        <section style={{ padding: "80px 24px", maxWidth: "1060px", margin: "0 auto" }}>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "3px" }}>
            <div style={{ borderRadius: "2px", overflow: "hidden", border: "1px solid rgba(230,180,80,0.3)" }}>
              <img src={JASON_AUTUMN_PHOTO} alt="Jason and Autumn at Classic State Wayne Theater" style={{ width: "100%", display: "block", objectFit: "cover" }} />
            </div>
            <div style={{ borderRadius: "2px", overflow: "hidden", border: "1px solid rgba(230,180,80,0.2)" }}>
              <img src={THEATER_BANNER} alt="Classic State Wayne Theater" style={{ width: "100%", display: "block", objectFit: "cover", height: "100%", minHeight: "250px" }} />
            </div>
          </div>
          <p style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: "12px", letterSpacing: "3px", color: "#8a857c", textAlign: "center", marginTop: "16px", textTransform: "uppercase" }}>
            Jason &amp; Autumn — Classic State Wayne Theater, Wayne, MI
          </p>
        </section>

        {/* ─── MISSION COPY ─── */}
        <section style={{ padding: "80px 24px 110px", maxWidth: "860px", margin: "0 auto", textAlign: "center" }}>
          <p style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: "12px", letterSpacing: "5px", color: "#e6b450", textTransform: "uppercase", marginBottom: "24px" }}>Why This Partnership Matters</p>
          <h2 style={{ fontFamily: "'Anton', sans-serif", fontSize: "clamp(32px, 5.5vw, 58px)", lineHeight: 1.05, textTransform: "uppercase", marginBottom: "36px" }}>
            WHERE STORIES<br /><span style={{ color: "#e6b450" }}>COME TO LIFE.</span>
          </h2>
          <p style={{ fontFamily: "'Barlow', sans-serif", fontSize: "19px", color: "#8a857c", lineHeight: 1.85, maxWidth: "660px", margin: "0 auto" }}>
            Movies have always had the power to move people — to change minds, open hearts, and inspire action. Classic State Wayne Theater is more than a cinema; it's a community gathering place. That's exactly the kind of space this movement needs. Stories matter. And Autumn gets that.
          </p>
        </section>

        {/* ─── DIVIDER ─── */}
        <div style={{ height: "1px", background: "linear-gradient(90deg, transparent, rgba(230,180,80,0.15), transparent)", margin: "0 10%" }} />

        {/* ─── FEATURES ─── */}
        <section style={{ padding: "90px 24px", background: "#0b0b0b" }}>
          <div style={{ maxWidth: "1060px", margin: "0 auto" }}>
            <p style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: "12px", letterSpacing: "5px", color: "#e6b450", textTransform: "uppercase", textAlign: "center", marginBottom: "64px" }}>About Classic State Wayne</p>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(270px, 1fr))", gap: "3px" }}>
              {[
                { num: "01", title: "Community Theater", body: "A neighborhood staple in Wayne, Michigan — bringing the magic of the movies to families and friends right in their own backyard." },
                { num: "02", title: "Phoenix Theatres", body: "Part of the Phoenix Theatres family, Classic State Wayne offers a full lineup of first-run films, special screenings, and community events." },
                { num: "03", title: "Wayne, MI Proud", body: "Located at 35310 Michigan Ave, Wayne, MI 48184. A local theater for a local community — the kind of place that brings people together." },
              ].map((f) => (
                <div key={f.num} className="csw-feature-card" style={{ padding: "52px 40px", background: "#111", borderTop: "2px solid #e6b450" }}>
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
            <p style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: "11px", letterSpacing: "5px", color: "#e6b450", textTransform: "uppercase", marginBottom: "20px" }}>Visit the Theater</p>
            <h3 style={{ fontFamily: "'Anton', sans-serif", fontSize: "clamp(26px, 4vw, 40px)", textTransform: "uppercase", letterSpacing: "1px", marginBottom: "20px" }}>
              Classic State Wayne Theater
            </h3>
            <div style={{ display: "flex", flexDirection: "column", gap: "10px", alignItems: "center", marginBottom: "28px" }}>
              <a
                href="https://www.google.com/maps?q=35310+Michigan+Avenue,+Wayne,+MI+48184"
                target="_blank"
                rel="noopener noreferrer"
                style={{ fontFamily: "'Barlow', sans-serif", fontSize: "16px", color: "#8a857c", textDecoration: "none" }}
                onMouseOver={e => e.target.style.color = "#e6b450"}
                onMouseOut={e => e.target.style.color = "#8a857c"}
              >
                📍 35310 Michigan Avenue, Wayne, MI 48184
              </a>
              <a
                href="tel:7343264602"
                style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: "22px", fontWeight: 700, letterSpacing: "2px", color: "#e6b450", textDecoration: "none" }}
                onMouseOver={e => e.target.style.opacity = "0.75"}
                onMouseOut={e => e.target.style.opacity = "1"}
              >
                📞 (734) 326-4602
              </a>
            </div>
            <div style={{ display: "flex", gap: "16px", justifyContent: "center", flexWrap: "wrap" }}>
              <a
                href="https://www.phoenixmovies.net/theatres/classic-state-wayne/003"
                target="_blank"
                rel="noopener noreferrer"
                style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: "14px", fontWeight: 700, letterSpacing: "2px", color: "#080808", background: "linear-gradient(135deg, #f0c060 0%, #e6b450 50%, #c9922f 100%)", textDecoration: "none", padding: "12px 28px", borderRadius: "2px", display: "inline-block" }}
              >
                See What's Playing →
              </a>
              <a
                href="https://www.google.com/maps?q=35310+Michigan+Avenue,+Wayne,+MI+48184"
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
        </section>

        {/* ─── FOOTER BAR ─── */}
        <div style={{ borderTop: "1px solid #141414", padding: "30px 24px", textAlign: "center" }}>
          <p style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: "11px", letterSpacing: "3px", color: "#2a2620", textTransform: "uppercase" }}>
            One Good Word...One Good Deed LLC &nbsp;|&nbsp; In Partnership with Classic State Wayne Theater &nbsp;|&nbsp; ogwogd.org
          </p>
        </div>
      </div>
    </>
  );
}