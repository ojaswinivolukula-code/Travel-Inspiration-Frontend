import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export default function LandingPage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [menuOpen]);

  const handleGetStarted = () => navigate(user ? "/dashboard" : "/register");
  const handleLogin = () => navigate("/login");
  const scrollTo = (id) => { document.getElementById(id)?.scrollIntoView({ behavior: "smooth" }); setMenuOpen(false); };

  const destinations = [
    { name: "Goa",         country: "India",       emoji: "🏖️", tag: "Relaxation" },
    { name: "Jaipur",      country: "India",       emoji: "🏰", tag: "History"    },
    { name: "Bali",        country: "Indonesia",   emoji: "🌺", tag: "Nature"     },
    { name: "Tokyo",       country: "Japan",       emoji: "🏙️", tag: "Culture"    },
    { name: "Switzerland", country: "Switzerland", emoji: "🏔️", tag: "Adventure"  },
    { name: "Paris",       country: "France",      emoji: "🗼", tag: "Romance"    },
  ];

  const features = [
    { icon: "🗺️", title: "Trip Planner",      desc: "Plan your perfect trip with destinations, activities, places and budget — all in one place." },
    { icon: "💰", title: "Budget Estimator",   desc: "Know exactly what your dream trip will cost before you go — flights, stay, food and more."  },
    { icon: "📖", title: "Travel Journal",     desc: "Document and share your adventures with a beautiful digital diary and photo memories."        },
    { icon: "👥", title: "Traveler Community", desc: "Connect with like-minded explorers, follow their journeys and share your own stories."        },
  ];

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,700;0,900;1,400;1,700&family=DM+Sans:wght@300;400;500;600&display=swap');
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        :root {
          --sand: #F5EFE6; --sand-dark: #EAE0D5;
          --ink: #1C1917; --ink-light: #44403C; --ink-soft: #78716C;
          --terracotta: #C4552A; --terracotta-light: #E8724A;
          --gold: #D4A853; --white: #FDFAF7; --border: #E7E5E4;
        }
        html { scroll-behavior: smooth; }
        body { font-family: 'DM Sans', sans-serif; background: var(--white); color: var(--ink); overflow-x: hidden; }

        .nav {
          position: fixed; top: 0; left: 0; right: 0; z-index: 100;
          display: flex; align-items: center; justify-content: space-between;
          padding: 20px 40px; transition: all 0.4s ease;
        }
        .nav.scrolled { background: rgba(253,250,247,0.96); backdrop-filter: blur(12px); padding: 14px 40px; box-shadow: 0 1px 0 rgba(0,0,0,0.07); }
        .nav-logo { font-family: 'Playfair Display', serif; font-size: 22px; font-weight: 900; letter-spacing: 1px; color: #fff; transition: color 0.4s; cursor: pointer; }
        .nav.scrolled .nav-logo { color: var(--ink); }
        .nav-links { display: flex; align-items: center; gap: 28px; }
        .nav-link { font-size: 13px; font-weight: 500; color: rgba(255,255,255,0.8); background: none; border: none; cursor: pointer; transition: color 0.2s; font-family: 'DM Sans', sans-serif; }
        .nav.scrolled .nav-link { color: var(--ink-soft); }
        .nav-link:hover { color: var(--terracotta) !important; }

        .hbg { display: none; width: 38px; height: 38px; border-radius: 8px; background: rgba(255,255,255,0.12); border: 1px solid rgba(255,255,255,0.2); cursor: pointer; flex-direction: column; align-items: center; justify-content: center; gap: 5px; transition: all 0.2s; }
        .nav.scrolled .hbg { background: var(--sand); border-color: var(--border); }
        .hbg-ln { display: block; width: 17px; height: 1.5px; border-radius: 2px; background: #fff; transition: all 0.35s cubic-bezier(0.4,0,0.2,1); transform-origin: center; }
        .nav.scrolled .hbg-ln { background: var(--ink); }
        .hbg.open .hbg-ln:nth-child(1) { transform: translateY(6.5px) rotate(45deg); }
        .hbg.open .hbg-ln:nth-child(2) { opacity: 0; transform: scaleX(0); }
        .hbg.open .hbg-ln:nth-child(3) { transform: translateY(-6.5px) rotate(-45deg); }

        .sheet-ov { display: none; position: fixed; inset: 0; background: rgba(28,25,23,0.55); z-index: 190; backdrop-filter: blur(4px); }
        .sheet-ov.open { display: block; }
        .sheet { position: fixed; top: 0; right: -100%; bottom: 0; width: min(320px,85vw); z-index: 195; background: linear-gradient(160deg,#2D1B0E 0%,#5C3520 60%,#C4552A 100%); display: flex; flex-direction: column; transition: right 0.4s cubic-bezier(0.4,0,0.2,1); }
        .sheet.open { right: 0; }
        .sheet-hdr { display: flex; align-items: center; justify-content: space-between; padding: 22px 26px; border-bottom: 1px solid rgba(255,255,255,0.1); }
        .sheet-logo { font-family: 'Playfair Display', serif; font-size: 20px; font-weight: 900; color: var(--gold); letter-spacing: 1px; }
        .sheet-nav { flex: 1; padding: 28px 20px; display: flex; flex-direction: column; gap: 4px; }
        .sheet-lnk { font-family: 'DM Sans', sans-serif; font-size: 15px; font-weight: 500; color: rgba(255,255,255,0.6); background: none; border: none; text-align: left; padding: 12px 14px; border-radius: 10px; cursor: pointer; transition: all 0.2s; display: flex; align-items: center; gap: 10px; }
        .sheet-lnk:hover { background: rgba(255,255,255,0.08); color: #fff; }
        .sheet-dot { width: 5px; height: 5px; border-radius: 50%; background: var(--gold); opacity: 0.5; }
        .sheet-actions { padding: 20px; border-top: 1px solid rgba(255,255,255,0.1); display: flex; flex-direction: column; gap: 10px; }

        .hero { min-height: 100vh; position: relative; display: flex; flex-direction: column; align-items: center; justify-content: center; text-align: center; padding: 120px 24px 80px; overflow: hidden; }
        .hero-bg { position: absolute; inset: 0; background: linear-gradient(160deg,#2D1B0E 0%,#5C3520 35%,#8B4E2F 65%,#C4552A 100%); }
        .hero-overlay { position: absolute; inset: 0; background: url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.03'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E"); }
        .hero-glow { position: absolute; width: 600px; height: 600px; border-radius: 50%; background: radial-gradient(circle,rgba(212,168,83,0.2) 0%,transparent 70%); top: 50%; left: 50%; transform: translate(-50%,-50%); }
        .hero-content { position: relative; z-index: 1; max-width: 780px; }
        .hero-tag { display: inline-flex; align-items: center; gap: 8px; background: rgba(255,255,255,0.12); backdrop-filter: blur(8px); border: 1px solid rgba(255,255,255,0.2); color: var(--gold); font-size: 12px; font-weight: 600; letter-spacing: 2px; text-transform: uppercase; padding: 8px 18px; border-radius: 50px; margin-bottom: 28px; animation: fadeUp 0.6s ease both; }
        .hero-title { font-family: 'Playfair Display', serif; font-size: clamp(42px,7vw,88px); font-weight: 900; line-height: 1.05; color: #fff; margin-bottom: 24px; animation: fadeUp 0.6s 0.1s ease both; }
        .hero-title em { color: var(--gold); font-style: italic; }
        .hero-desc { font-size: clamp(16px,2vw,19px); color: rgba(255,255,255,0.75); line-height: 1.7; max-width: 520px; margin: 0 auto 44px; animation: fadeUp 0.6s 0.2s ease both; }
        .hero-btns { display: flex; gap: 14px; justify-content: center; flex-wrap: wrap; animation: fadeUp 0.6s 0.3s ease both; }
        .hero-scroll { position: absolute; bottom: 32px; left: 50%; transform: translateX(-50%); display: flex; flex-direction: column; align-items: center; gap: 8px; color: rgba(255,255,255,0.5); font-size: 11px; letter-spacing: 2px; text-transform: uppercase; animation: bounce 2s infinite; }
        .hero-scroll-line { width: 1px; height: 40px; background: linear-gradient(to bottom,rgba(255,255,255,0.4),transparent); }

        .section { padding: 100px 40px; }
        .section-inner { max-width: 1200px; margin: 0 auto; }
        .section-tag { font-size: 11px; font-weight: 700; letter-spacing: 3px; text-transform: uppercase; color: var(--terracotta); margin-bottom: 12px; }
        .section-title { font-family: 'Playfair Display', serif; font-size: clamp(32px,4vw,52px); font-weight: 800; color: var(--ink); line-height: 1.15; margin-bottom: 16px; }
        .section-title em { color: var(--terracotta); font-style: italic; }
        .section-desc { font-size: 16px; color: var(--ink-light); max-width: 480px; line-height: 1.7; margin-bottom: 56px; }

        .dest-grid { display: grid; grid-template-columns: repeat(3,1fr); gap: 20px; }
        .dest-card { background: var(--sand); border-radius: 20px; padding: 28px; border: 1px solid var(--sand-dark); cursor: pointer; transition: all 0.3s; position: relative; overflow: hidden; }
        .dest-card:hover { transform: translateY(-6px); box-shadow: 0 20px 50px rgba(0,0,0,0.1); background: var(--white); }
        .dest-emoji { font-size: 42px; margin-bottom: 16px; display: block; line-height: 1; }
        .dest-name { font-family: 'Playfair Display', serif; font-size: 26px; font-weight: 800; color: var(--ink); margin-bottom: 4px; margin-top: 10px; }
        .dest-country { font-size: 13px; color: var(--ink-soft); }
        .dest-arrow { position: absolute; bottom: 28px; right: 28px; width: 36px; height: 36px; border-radius: 50%; background: var(--ink); color: #fff; display: flex; align-items: center; justify-content: center; font-size: 14px; opacity: 0; transition: opacity 0.2s; }
        .dest-card:hover .dest-arrow { opacity: 1; }

        .features-section { background: var(--sand); padding: 100px 40px; }
        .features-grid { display: grid; grid-template-columns: repeat(2,1fr); gap: 24px; max-width: 1000px; margin: 0 auto; }
        .feature-card { background: var(--white); border-radius: 20px; padding: 40px 36px; border: 1px solid var(--sand-dark); transition: all 0.3s; }
        .feature-card:hover { transform: translateY(-4px); box-shadow: 0 16px 40px rgba(0,0,0,0.07); }
        .feature-icon { font-size: 36px; margin-bottom: 20px; width: 64px; height: 64px; border-radius: 16px; background: var(--sand); display: flex; align-items: center; justify-content: center; }
        .feature-title { font-family: 'Playfair Display', serif; font-size: 22px; font-weight: 800; color: var(--ink); margin-bottom: 10px; }
        .feature-desc { font-size: 14px; color: var(--ink-light); line-height: 1.7; }

        .cta-section { padding: 120px 40px; text-align: center; background: linear-gradient(135deg,var(--ink) 0%,#3D2010 100%); position: relative; overflow: hidden; }
        .cta-glow { position: absolute; width: 500px; height: 500px; border-radius: 50%; background: radial-gradient(circle,rgba(212,168,83,0.15) 0%,transparent 70%); top: 50%; left: 50%; transform: translate(-50%,-50%); }
        .cta-content { position: relative; z-index: 1; }
        .cta-title { font-family: 'Playfair Display', serif; font-size: clamp(36px,5vw,64px); font-weight: 900; color: #fff; margin-bottom: 20px; line-height: 1.1; }
        .cta-title em { color: var(--gold); font-style: italic; }
        .cta-desc { font-size: 17px; color: rgba(255,255,255,0.65); margin-bottom: 44px; max-width: 440px; margin-left: auto; margin-right: auto; line-height: 1.7; }

        .footer { background: #0F0A07; color: rgba(255,255,255,0.4); text-align: center; padding: 32px 40px; font-size: 13px; }
        .footer-logo { font-family: 'Playfair Display', serif; font-size: 20px; font-weight: 900; color: var(--gold); margin-bottom: 12px; }

        @keyframes fadeUp { from { opacity: 0; transform: translateY(24px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes bounce { 0%,100% { transform: translateX(-50%) translateY(0); } 50% { transform: translateX(-50%) translateY(8px); } }

        @media (max-width: 768px) {
          .nav { padding: 16px 20px; } .nav.scrolled { padding: 12px 20px; }
          .nav-links { display: none; } .hbg { display: flex; }
          .hero { padding: 100px 20px 80px; }
          .section { padding: 70px 20px; } .dest-grid { grid-template-columns: 1fr; }
          .features-section { padding: 70px 20px; } .features-grid { grid-template-columns: 1fr; }
          .cta-section { padding: 80px 20px; } .footer { padding: 24px 20px; }
        }
        @media (max-width: 480px) { .hero-btns { flex-direction: column; align-items: center; } }
      `}</style>

      {/* NAVBAR */}
      <nav className={`nav ${scrolled ? "scrolled" : ""}`}>
        <div className="nav-logo" onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}>TravelX</div>
        <div className="nav-links">
          <button className="nav-link" onClick={() => scrollTo("destinations")}>Destinations</button>
          <button className="nav-link" onClick={() => scrollTo("features")}>Features</button>

          {/* LOGIN BUTTON — card style */}
          <button
            onClick={handleLogin}
            style={{
              fontFamily: "'DM Sans',sans-serif",
              fontSize: "13px",
              fontWeight: "500",
              color: scrolled ? "var(--ink)" : "#fff",
              background: scrolled ? "var(--sand)" : "rgba(255,255,255,0.12)",
              border: scrolled ? "1px solid var(--sand-dark)" : "1px solid rgba(255,255,255,0.25)",
              borderRadius: "12px",
              padding: "8px 20px",
              cursor: "pointer",
              transition: "all 0.25s ease",
              backdropFilter: "blur(8px)",
            }}
            onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-2px)"; e.currentTarget.style.boxShadow = "0 8px 24px rgba(0,0,0,0.12)"; }}
            onMouseLeave={e => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "none"; }}
          >
            Login
          </button>

          {/* GET STARTED BUTTON — card style with terracotta */}
          <button
            onClick={handleGetStarted}
            style={{
              fontFamily: "'DM Sans',sans-serif",
              fontSize: "13px",
              fontWeight: "600",
              color: "#fff",
              background: "var(--terracotta)",
              border: "1px solid rgba(196,85,42,0.3)",
              borderRadius: "12px",
              padding: "8px 20px",
              cursor: "pointer",
              transition: "all 0.25s ease",
              boxShadow: "0 4px 16px rgba(196,85,42,0.35)",
            }}
            onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-2px)"; e.currentTarget.style.boxShadow = "0 8px 28px rgba(196,85,42,0.5)"; e.currentTarget.style.background = "var(--terracotta-light)"; }}
            onMouseLeave={e => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "0 4px 16px rgba(196,85,42,0.35)"; e.currentTarget.style.background = "var(--terracotta)"; }}
          >
            Get Started
          </button>
        </div>
        <button className={`hbg ${menuOpen ? "open" : ""}`} onClick={() => setMenuOpen(v => !v)} aria-label="Menu">
          <span className="hbg-ln" /><span className="hbg-ln" /><span className="hbg-ln" />
        </button>
      </nav>

      {/* MOBILE SHEET */}
      <div className={`sheet-ov ${menuOpen ? "open" : ""}`} onClick={() => setMenuOpen(false)} />
      <div className={`sheet ${menuOpen ? "open" : ""}`}>
        <div className="sheet-hdr">
          <span className="sheet-logo">TravelX</span>
          <Button variant="ghost" size="icon" onClick={() => setMenuOpen(false)} style={{ color: "rgba(255,255,255,0.7)" }}>✕</Button>
        </div>
        <nav className="sheet-nav">
          {["Destinations", "Features", "Community"].map(l => (
            <button key={l} className="sheet-lnk" onClick={() => scrollTo(l.toLowerCase())}>
              <span className="sheet-dot" />{l}
            </button>
          ))}
        </nav>
        <div className="sheet-actions">
          <Button variant="outline" onClick={() => { handleLogin(); setMenuOpen(false); }}
            style={{ borderColor: "rgba(255,255,255,0.25)", color: "rgba(255,255,255,0.85)", background: "transparent", width: "100%", fontFamily: "'DM Sans',sans-serif" }}>
            Sign In
          </Button>
          <Button onClick={() => { handleGetStarted(); setMenuOpen(false); }}
            style={{ background: "var(--gold)", color: "var(--ink)", width: "100%", fontFamily: "'DM Sans',sans-serif", fontWeight: "700" }}>
            Get Started →
          </Button>
        </div>
      </div>

      {/* HERO */}
      <section className="hero">
        <div className="hero-bg" /><div className="hero-overlay" /><div className="hero-glow" />
        <div className="hero-content">
          <div className="hero-tag">✦ Your Next Adventure Awaits</div>
          <h1 className="hero-title">Explore the World<br />on Your Own <em>Terms</em></h1>
          <p className="hero-desc">Discover breathtaking destinations, craft perfect itineraries, and connect with a global community of passionate travelers.</p>
          <div className="hero-btns">
            <Button size="lg" onClick={handleGetStarted} style={{ background: "var(--terracotta)", color: "#fff", border: "none", fontFamily: "'DM Sans',sans-serif", fontWeight: "600", fontSize: "15px", padding: "16px 40px", borderRadius: "50px", height: "auto", boxShadow: "0 8px 30px rgba(196,85,42,0.4)" }}>
              Start Exploring →
            </Button>
            <Button size="lg" variant="outline" onClick={handleLogin} style={{ background: "transparent", color: "#fff", borderColor: "rgba(255,255,255,0.4)", fontFamily: "'DM Sans',sans-serif", fontWeight: "600", fontSize: "15px", padding: "16px 40px", borderRadius: "50px", height: "auto" }}>
              I have an account
            </Button>
          </div>
        </div>
        <div className="hero-scroll"><div className="hero-scroll-line" />scroll</div>
      </section>

      {/* DESTINATIONS */}
      <section className="section" id="destinations">
        <div className="section-inner">
          <div className="section-tag">✦ Top Picks</div>
          <h2 className="section-title">Destinations That Will<br /><em>Take Your Breath Away</em></h2>
          <p className="section-desc">From ancient temples to pristine beaches, discover the world's most inspiring places.</p>
          <div className="dest-grid">
            {destinations.map((d) => (
              <div key={d.name} className="dest-card" onClick={handleGetStarted}>
                <span className="dest-emoji">{d.emoji}</span>
                <Badge style={{ background: "var(--terracotta)", color: "#fff", borderRadius: "50px", fontSize: "10px", letterSpacing: "1px", textTransform: "uppercase", padding: "4px 12px", border: "none" }}>
                  {d.tag}
                </Badge>
                <div className="dest-name">{d.name}</div>
                <div className="dest-country">{d.country}</div>
                <div className="dest-arrow">→</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FEATURES */}
      <section className="features-section" id="features">
        <div className="section-inner" style={{ maxWidth: "1000px" }}>
          <div style={{ textAlign: "center", marginBottom: "56px" }}>
            <div className="section-tag" style={{ display: "flex", justifyContent: "center" }}>✦ Why TravelX</div>
            <h2 className="section-title" style={{ textAlign: "center" }}>Everything You Need to<br /><em>Travel Smarter</em></h2>
          </div>
          <div className="features-grid">
            {features.map((f) => (
              <div key={f.title} className="feature-card">
                <div className="feature-icon">{f.icon}</div>
                <div className="feature-title">{f.title}</div>
                <div className="feature-desc">{f.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="cta-section" id="community">
        <div className="cta-glow" />
        <div className="cta-content">
          <h2 className="cta-title">Ready to Start Your<br /><em>Next Journey?</em></h2>
          <p className="cta-desc">Join thousands of travelers who plan smarter, travel better, and share more.</p>
          <Button size="lg" onClick={handleGetStarted} style={{ background: "var(--terracotta)", color: "#fff", border: "none", fontFamily: "'DM Sans',sans-serif", fontWeight: "600", fontSize: "16px", padding: "18px 48px", borderRadius: "50px", height: "auto", boxShadow: "0 8px 30px rgba(196,85,42,0.4)" }}>
            Create Free Account →
          </Button>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="footer">
        <div className="footer-logo">TravelX</div>
        <p>© {new Date().getFullYear()} TravelX. Built for explorers, by explorers.</p>
      </footer>
    </>
  );
}