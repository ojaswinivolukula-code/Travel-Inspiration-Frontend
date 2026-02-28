import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import axiosInstance from "../services/axiosInstance";
import Community from "../pages/Community";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

const Dashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [destinations, setDestinations] = useState([]);
  const [places, setPlaces] = useState([]);
  const [trips, setTrips] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState(location.state?.tab || "discover");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [confirmDeleteId, setConfirmDeleteId] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [destRes, placeRes, tripsRes, reviewsRes] = await Promise.all([
          axiosInstance.get("/destinations"),
          axiosInstance.get("/places"),
          axiosInstance.get("/trips/my"),
          axiosInstance.get("/reviews/user/my-reviews"),
        ]);
        setDestinations(
          Array.isArray(destRes.data) ? destRes.data : destRes.data.data || [],
        );
        setPlaces(
          Array.isArray(placeRes.data)
            ? placeRes.data
            : placeRes.data.data || [],
        );
        setTrips(
          Array.isArray(tripsRes.data)
            ? tripsRes.data
            : tripsRes.data.data || [],
        );
        setReviews(
          Array.isArray(reviewsRes.data)
            ? reviewsRes.data
            : reviewsRes.data.reviews || [],
        );
      } catch (err) {
        console.error("Error fetching data:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    document.body.style.overflow = sidebarOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [sidebarOpen]);

  const handleDeleteTrip = async (e, tripId) => {
    e.stopPropagation();
    if (confirmDeleteId !== tripId) {
      setConfirmDeleteId(tripId);
      return;
    }
    try {
      await axiosInstance.delete(`/trips/${tripId}`);
      setTrips((prev) => prev.filter((t) => t.id !== tripId));
      setConfirmDeleteId(null);
    } catch (err) {
      console.error("Delete failed:", err);
      setConfirmDeleteId(null);
    }
  };

  const handleLogout = () => {
    logout();
    navigate("/");
  };
  const userName =
    user?.user_metadata?.name || user?.email?.split("@")[0] || "Traveler";
  const userInitial = userName[0].toUpperCase();

  const navItems = [
    { id: "discover", icon: "✦", label: "Discover" },
    { id: "destinations", icon: "◎", label: "Destinations" },
    { id: "trips", icon: "◈", label: "My Trips" },
    { id: "explore", icon: "⊕", label: "Explore" },
    { id: "journal", icon: "◇", label: "Journal" },
    { id: "community", icon: "◉", label: "Community" },
    { id: "deals", icon: "◆", label: "Deals" },
  ];

  const handleNavClick = (id) => {
    if (id === "explore") {
      navigate("/explore");
      return;
    }
    if (id === "journal") {
      navigate("/journal");
      return;
    }
    if (id === "deals") {
      navigate("/deals");
      return;
    }
    setActiveTab(id);
    setSidebarOpen(false);
  };

  const stats = [
    {
      label: "Destinations",
      value: destinations.length,
      icon: "🌍",
      accent: "#C4552A",
      pale: "#FDF0EB",
    },
    {
      label: "Places",
      value: places.length,
      icon: "📌",
      accent: "#5C7A5E",
      pale: "#EDF4EE",
    },
    {
      label: "My Trips",
      value: trips.filter((t) => t.destination_id).length,
      icon: "✈️",
      accent: "#D4A853",
      pale: "#FDF6E8",
    },
    {
      label: "Reviews",
      value: reviews.length,
      icon: "⭐",
      accent: "#7A5EA8",
      pale: "#F0ECFA",
    },
  ];

  const greetingTime = () => {
    const h = new Date().getHours();
    if (h < 12) return "Good Morning";
    if (h < 17) return "Good Afternoon";
    return "Good Evening";
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,700;0,900;1,400;1,700&family=DM+Sans:wght@300;400;500;600&display=swap');
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        :root {
          --sand: #F5EFE6; --sand-dark: #EAE0D5; --white: #FDFAF7;
          --ink: #1C1917; --ink-light: #44403C; --ink-soft: #78716C; --muted: #A8A29E;
          --terracotta: #C4552A; --terra-light: #E8724A; --gold: #D4A853;
          --sage: #5C7A5E; --border: #E7E5E4;
        }
        body { font-family: 'DM Sans', sans-serif; background: var(--white); color: var(--ink); margin: 0; }

        /* ── SIDEBAR ── */
        .sb {
          position: fixed; top: 0; left: 0; bottom: 0; width: 260px; z-index: 50;
          background: linear-gradient(160deg, #2D1B0E 0%, #5C3520 55%, #C4552A 100%);
          display: flex; flex-direction: column;
          transform: translateX(-100%);
          transition: transform 0.4s cubic-bezier(0.4,0,0.2,1); overflow: hidden;
        }
        .sb::before {
          content: ''; position: absolute; width: 350px; height: 350px; border-radius: 50%;
          background: radial-gradient(circle, rgba(212,168,83,0.15) 0%, transparent 70%);
          top: 20%; left: 50%; transform: translate(-50%, -50%); pointer-events: none;
        }
        .sb::after {
          content: ''; position: absolute; bottom: 0; left: 0; right: 0; height: 180px;
          background: radial-gradient(circle at 50% 120%, rgba(212,168,83,0.08) 0%, transparent 60%);
          pointer-events: none;
        }
        .sb.open { transform: translateX(0); }

        .sb-top { padding: 28px 24px 22px; border-bottom: 1px solid rgba(255,255,255,0.1); position: relative; z-index: 1; }
        .sb-logo { font-family: 'Playfair Display', serif; font-size: 24px; font-weight: 900; color: var(--gold); letter-spacing: 2px; }
        .sb-sub  { font-size: 9px; color: rgba(212,168,83,0.4); letter-spacing: 4px; text-transform: uppercase; margin-top: 4px; }

        .sb-nav { flex: 1; padding: 16px 12px; display: flex; flex-direction: column; gap: 2px; overflow-y: auto; position: relative; z-index: 1; }
        .sb-nav::-webkit-scrollbar { width: 3px; }
        .sb-nav::-webkit-scrollbar-thumb { background: rgba(212,168,83,0.2); border-radius: 2px; }

        .sb-btn {
          display: flex; align-items: center; gap: 12px; padding: 11px 14px; border-radius: 10px;
          border: none; background: transparent; font-family: 'DM Sans', sans-serif;
          font-size: 14px; font-weight: 500; color: rgba(255,255,255,0.42);
          cursor: pointer; text-align: left; width: 100%; transition: all 0.2s;
        }
        .sb-ico { font-size: 12px; color: rgba(212,168,83,0.35); transition: color 0.2s; flex-shrink: 0; }
        .sb-btn:hover { background: rgba(255,255,255,0.08); color: rgba(255,255,255,0.85); }
        .sb-btn:hover .sb-ico { color: var(--gold); }
        .sb-btn.active { background: rgba(255,255,255,0.12); color: #fff; border-left: 2px solid var(--gold); padding-left: 12px; }
        .sb-btn.active .sb-ico { color: var(--gold); }

        .sb-user { padding: 16px 20px; border-top: 1px solid rgba(255,255,255,0.1); display: flex; align-items: center; gap: 12px; position: relative; z-index: 1; }
        .sb-av {
          width: 40px; height: 40px; border-radius: 50%; flex-shrink: 0;
          background: linear-gradient(135deg, var(--gold) 0%, var(--terra-light) 100%);
          display: flex; align-items: center; justify-content: center;
          font-family: 'Playfair Display', serif; font-size: 18px; font-weight: 700; color: #fff;
          box-shadow: 0 4px 12px rgba(0,0,0,0.2);
        }
        .sb-uname { font-size: 14px; font-weight: 600; color: #fff; }
        .sb-out { font-size: 10px; letter-spacing: 1px; text-transform: uppercase; color: rgba(255,255,255,0.28); background: none; border: none; cursor: pointer; font-family: 'DM Sans', sans-serif; padding: 0; transition: color 0.2s; display: block; margin-top: 2px; }
        .sb-out:hover { color: var(--gold); }

        /* ── OVERLAY ── */
        .sb-ov { display: none; position: fixed; inset: 0; background: rgba(28,25,23,0.55); z-index: 40; backdrop-filter: blur(4px); }
        .sb-ov.open { display: block; }

        /* ── MOBILE HEADER ── */
        .mhdr {
          display: flex; align-items: center; justify-content: space-between;
          background: linear-gradient(90deg, #2D1B0E 0%, #5C3520 100%);
          padding: 13px 20px; position: sticky; top: 0; z-index: 30;
          border-bottom: 1px solid rgba(255,255,255,0.08);
        }
        .mhdr-logo { font-family: 'Playfair Display', serif; font-size: 20px; font-weight: 900; color: var(--gold); letter-spacing: 1px; }
        .mhdr-av { width: 34px; height: 34px; border-radius: 50%; background: linear-gradient(135deg, var(--gold) 0%, var(--terra-light) 100%); display: flex; align-items: center; justify-content: center; font-family: 'Playfair Display', serif; font-size: 15px; font-weight: 700; color: #fff; }

        /* shadcn-style hamburger */
        .hbg { width: 38px; height: 38px; border-radius: 8px; background: rgba(212,168,83,0.12); border: 1px solid rgba(212,168,83,0.25); cursor: pointer; display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 5px; transition: background 0.2s; }
        .hbg:hover { background: rgba(212,168,83,0.22); }
        .hbg-ln { display: block; width: 17px; height: 1.5px; background: var(--gold); border-radius: 2px; transition: all 0.35s cubic-bezier(0.4,0,0.2,1); transform-origin: center; }
        .hbg.open .hbg-ln:nth-child(1) { transform: translateY(6.5px) rotate(45deg); }
        .hbg.open .hbg-ln:nth-child(2) { opacity: 0; transform: scaleX(0); }
        .hbg.open .hbg-ln:nth-child(3) { transform: translateY(-6.5px) rotate(-45deg); }

        /* ── MAIN ── */
        .main { min-height: 100vh; background: var(--white); padding: 32px 20px; }

        /* ── BOTTOM NAV ── */
        .bnav { display: flex; justify-content: space-around; background: linear-gradient(90deg,#2D1B0E 0%,#5C3520 100%); padding: 8px 0 16px; position: sticky; bottom: 0; z-index: 30; border-top: 1px solid rgba(255,255,255,0.08); }
        .bnav-btn { background: none; border: none; cursor: pointer; display: flex; flex-direction: column; align-items: center; gap: 3px; font-size: 9px; font-family: 'DM Sans', sans-serif; letter-spacing: 0.5px; text-transform: uppercase; padding: 5px 6px; min-width: 40px; border-radius: 8px; transition: all 0.2s; }
        .bnav-btn:hover { background: rgba(212,168,83,0.08); }
        .bnav-ico { font-size: 15px; line-height: 1; }

        /* ── DESKTOP ── */
        @media (min-width: 768px) {
          .sb { transform: translateX(0) !important; }
          .mhdr { display: none; } .bnav { display: none; }
          .main { margin-left: 260px; padding: 48px 52px; }
        }

        /* ── WELCOME HERO ── */
        .pg-hero { margin-bottom: 40px; padding-bottom: 36px; border-bottom: 1px solid var(--border); position: relative; overflow: hidden; }
        .pg-tag { font-size: 10px; font-weight: 600; letter-spacing: 3.5px; text-transform: uppercase; color: var(--terracotta); margin-bottom: 12px; display: flex; align-items: center; gap: 8px; }
        .pg-tag::before { content: ''; display: block; width: 20px; height: 1.5px; background: var(--terracotta); border-radius: 2px; }
        .pg-name { font-family: 'Playfair Display', serif; font-size: clamp(28px,4.5vw,48px); font-weight: 400; color: var(--ink); line-height: 1.1; }
        .pg-name em { font-style: italic; font-weight: 700; color: var(--terracotta); }
        .pg-sub { font-size: 15px; color: var(--ink-soft); margin-top: 10px; line-height: 1.6; }
        .pg-wm { position: absolute; right: 0; top: 50%; transform: translateY(-50%); font-family: 'Playfair Display', serif; font-size: 140px; font-weight: 900; color: rgba(196,85,42,0.04); line-height: 1; pointer-events: none; display: none; }
        @media (min-width: 768px) { .pg-wm { display: block; } }

        /* ── STATS ── */
        .stats-grid { display: grid; grid-template-columns: repeat(2,1fr); gap: 16px; margin-bottom: 44px; }
        @media (min-width: 900px) { .stats-grid { grid-template-columns: repeat(4,1fr); } }

        /* shadcn Card override for stat cards */
        .stat-card-wrap {
          border-radius: 16px !important; border: 1.5px solid var(--border) !important;
          overflow: hidden; position: relative;
          transition: transform 0.3s ease, box-shadow 0.3s ease; cursor: default;
          background: var(--white) !important;
        }
        .stat-card-wrap:hover { transform: translateY(-4px); box-shadow: 0 16px 40px rgba(28,25,23,0.08); }
        .stat-bar { position: absolute; bottom: 0; left: 0; right: 0; height: 3px; }
        .stat-ico { width: 46px; height: 46px; border-radius: 12px; display: flex; align-items: center; justify-content: center; font-size: 20px; margin-bottom: 16px; }
        .stat-val { font-family: 'Playfair Display', serif; font-size: 44px; font-weight: 700; color: var(--ink); line-height: 1; }
        .stat-lbl { font-size: 10px; color: var(--ink-soft); text-transform: uppercase; letter-spacing: 2.5px; margin-top: 7px; font-weight: 500; }

        /* ── SECTION HEADER ── */
        .sec-hdr { display: flex; align-items: center; gap: 14px; margin-bottom: 24px; }
        .sec-title { font-family: 'Playfair Display', serif; font-size: 24px; font-weight: 700; color: var(--ink); white-space: nowrap; }
        .sec-meta { font-size: 10px; color: var(--muted); text-transform: uppercase; letter-spacing: 2px; white-space: nowrap; font-weight: 500; }

        /* ── CARDS ── */
        .cards-grid { display: grid; grid-template-columns: 1fr; gap: 20px; }
        @media (min-width: 480px)  { .cards-grid { grid-template-columns: repeat(2,1fr); } }
        @media (min-width: 1100px) { .cards-grid { grid-template-columns: repeat(3,1fr); } }

        /* shadcn Card override for dest/trip cards */
        .dest-card-wrap {
          border-radius: 16px !important; border: 1.5px solid var(--border) !important;
          overflow: hidden; cursor: pointer;
          transition: transform 0.3s ease, box-shadow 0.3s ease;
          background: var(--white) !important;
        }
        .dest-card-wrap:hover { transform: translateY(-5px); box-shadow: 0 20px 48px rgba(28,25,23,0.1); }
        .dest-img { height: 170px; overflow: hidden; background: var(--sand); }
        .dest-img img { width: 100%; height: 100%; object-fit: cover; transition: transform 0.5s ease; }
        .dest-card-wrap:hover .dest-img img { transform: scale(1.07); }
        .dest-no-img { width: 100%; height: 100%; display: flex; align-items: center; justify-content: center; font-size: 48px; background: linear-gradient(135deg, #F5EFE6, #EAE0D5); }
        .dest-body { padding: 18px 20px; }
        .dest-name { font-family: 'Playfair Display', serif; font-size: 17px; font-weight: 700; color: var(--ink); margin-bottom: 7px; }
        .dest-desc { font-size: 13px; color: var(--ink-soft); line-height: 1.65; margin-bottom: 14px; }
        .tag-row { display: flex; gap: 6px; flex-wrap: wrap; }

        /* shadcn Badge overrides */
        .badge-terra { background: #FDF0EB !important; color: var(--terracotta) !important; border: 1px solid #F0C8B8 !important; border-radius: 50px !important; font-size: 10px !important; font-weight: 500 !important; letter-spacing: 1px !important; text-transform: uppercase !important; padding: 4px 12px !important; }
        .badge-sage  { background: #EDF4EE !important; color: var(--sage) !important;       border: 1px solid #B8D4BA !important; border-radius: 50px !important; font-size: 10px !important; font-weight: 500 !important; letter-spacing: 1px !important; text-transform: uppercase !important; padding: 4px 12px !important; }
        .badge-gold  { background: #FDF6E8 !important; color: #A07830 !important;           border: 1px solid #EAD5A0 !important; border-radius: 50px !important; font-size: 10px !important; font-weight: 500 !important; letter-spacing: 1px !important; text-transform: uppercase !important; padding: 4px 12px !important; }
        .badge-plain { background: var(--sand) !important;    color: var(--ink-soft) !important;   border: 1px solid var(--border) !important; border-radius: 50px !important; font-size: 10px !important; font-weight: 500 !important; letter-spacing: 1px !important; text-transform: uppercase !important; padding: 4px 12px !important; }

        /* Trip card */
        .trip-card-wrap {
          border-radius: 16px !important; border: 1.5px solid var(--border) !important;
          overflow: hidden; cursor: pointer;
          transition: transform 0.3s ease, box-shadow 0.3s ease;
          background: var(--white) !important;
        }
        .trip-card-wrap:hover { transform: translateY(-5px); box-shadow: 0 20px 48px rgba(28,25,23,0.1); }
        .trip-banner { height: 114px; position: relative; overflow: hidden; background: linear-gradient(160deg,#2D1B0E 0%,#5C3520 55%,#C4552A 100%); display: flex; align-items: center; justify-content: center; font-size: 42px; }
        .trip-banner::before { content: ''; position: absolute; inset: 0; background: radial-gradient(circle at 70% 50%, rgba(212,168,83,0.12) 0%, transparent 60%); }
        .trip-body { padding: 18px 20px; }
        .trip-name { font-family: 'Playfair Display', serif; font-size: 16px; font-weight: 700; color: var(--ink); margin-bottom: 14px; }
        .trip-foot { display: flex; justify-content: space-between; align-items: center; }

        /* shadcn Button overrides */
        .btn-dark-tx {
          background: var(--ink) !important; color: var(--gold) !important;
          border: none !important; border-radius: 10px !important;
          font-family: 'DM Sans', sans-serif !important; font-weight: 600 !important;
          font-size: 14px !important; letter-spacing: 1px !important;
          transition: all 0.25s !important; height: auto !important; padding: 11px 26px !important;
        }
        .btn-dark-tx:hover { background: var(--terracotta) !important; color: #fff !important; box-shadow: 0 8px 24px rgba(196,85,42,0.3) !important; transform: translateY(-1px) !important; }

        .btn-del {
          font-size: 11px !important; font-family: 'DM Sans', sans-serif !important;
          font-weight: 600 !important; letter-spacing: 0.3px !important;
          padding: 5px 12px !important; border-radius: 8px !important;
          height: auto !important; transition: all 0.2s !important;
        }

        /* Empty state */
        .empty { text-align: center; padding: 80px 24px; border: 1.5px dashed var(--border); border-radius: 16px; background: var(--white); }
        .empty-ico { font-size: 52px; margin-bottom: 18px; opacity: 0.5; display: block; }
        .empty-title { font-family: 'Playfair Display', serif; font-size: 26px; font-weight: 700; color: var(--ink); margin-bottom: 10px; }
        .empty-desc  { font-size: 14px; color: var(--ink-soft); margin-bottom: 26px; line-height: 1.65; }

        .load-msg { text-align: center; padding: 64px; font-family: 'Playfair Display', serif; font-size: 20px; color: var(--ink-soft); font-style: italic; }

        @keyframes fadeUp { from { opacity: 0; transform: translateY(16px); } to { opacity: 1; transform: translateY(0); } }
        .au { animation: fadeUp 0.5s ease forwards; opacity: 0; }
        .d0 { animation-delay: 0s; } .d1 { animation-delay: 0.07s; } .d2 { animation-delay: 0.14s; }
        .d3 { animation-delay: 0.21s; } .d4 { animation-delay: 0.28s; }
      `}</style>

      <div
        style={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}
      >
        <div
          className={`sb-ov ${sidebarOpen ? "open" : ""}`}
          onClick={() => setSidebarOpen(false)}
        />

        {/* ── SIDEBAR ── */}
        <aside className={`sb ${sidebarOpen ? "open" : ""}`}>
          <div className="sb-top">
            <div className="sb-logo">TravelX</div>
            <div className="sb-sub">Explore the world</div>
          </div>
          <nav className="sb-nav">
            {navItems.map((item) => (
              <button
                key={item.id}
                className={`sb-btn ${activeTab === item.id ? "active" : ""}`}
                onClick={() => handleNavClick(item.id)}
              >
                <span className="sb-ico">{item.icon}</span>
                {item.label}
              </button>
            ))}
          </nav>
          <div className="sb-user">
            <div className="sb-av">{userInitial}</div>
            <div>
              <div className="sb-uname">{userName}</div>
              <button className="sb-out" onClick={handleLogout}>
                Log out
              </button>
            </div>
          </div>
        </aside>

        {/* ── MOBILE HEADER ── */}
        <header className="mhdr">
          <button
            className={`hbg ${sidebarOpen ? "open" : ""}`}
            onClick={() => setSidebarOpen((v) => !v)}
            aria-label="Menu"
          >
            <span className="hbg-ln" />
            <span className="hbg-ln" />
            <span className="hbg-ln" />
          </button>
          <span className="mhdr-logo">TravelX</span>
          <div className="mhdr-av">{userInitial}</div>
        </header>

        {/* ── MAIN ── */}
        <main className="main">
          {/* DISCOVER */}
          {activeTab === "discover" && (
            <div>
              <div className="pg-hero au d0">
                <div className="pg-tag">{greetingTime()}</div>
                <h1 className="pg-name">
                  Welcome back,
                  <br />
                  <em>{userName}</em>
                </h1>
                <p className="pg-sub">
                  Your next adventure awaits — where shall we go today?
                </p>
                <div className="pg-wm">✈</div>
              </div>

              <div className="stats-grid">
                {stats.map((s, i) => (
                  <Card key={s.label} className={`stat-card-wrap au d${i + 1}`}>
                    <CardContent
                      style={{ padding: "24px 20px", position: "relative" }}
                    >
                      <div className="stat-ico" style={{ background: s.pale }}>
                        {s.icon}
                      </div>
                      <div className="stat-val">{s.value}</div>
                      <div className="stat-lbl">{s.label}</div>
                      <div
                        className="stat-bar"
                        style={{ background: s.accent }}
                      />
                    </CardContent>
                  </Card>
                ))}
              </div>

              <div className="sec-hdr au d3">
                <h2 className="sec-title">Featured Destinations</h2>
                <Separator style={{ flex: 1 }} />
                <span className="sec-meta">{destinations.length} places</span>
              </div>

              {loading ? (
                <p className="load-msg">Curating destinations for you…</p>
              ) : destinations.length === 0 ? (
                <div className="empty">
                  <span className="empty-ico">🌍</span>
                  <p className="empty-title">No destinations yet</p>
                </div>
              ) : (
                <div className="cards-grid">
                  {destinations.slice(0, 6).map((d) => (
                    <DestCard key={d.id} dest={d} />
                  ))}
                </div>
              )}
            </div>
          )}

          {/* ALL DESTINATIONS */}
          {activeTab === "destinations" && (
            <div>
              <div className="sec-hdr">
                <h2 className="sec-title">All Destinations</h2>
                <Separator style={{ flex: 1 }} />
                <span className="sec-meta">{destinations.length} total</span>
              </div>
              {loading ? (
                <p className="load-msg">Loading…</p>
              ) : (
                <div className="cards-grid">
                  {destinations.map((d) => (
                    <DestCard key={d.id} dest={d} />
                  ))}
                </div>
              )}
            </div>
          )}

          {/* MY TRIPS */}
          {activeTab === "trips" && (
            <div>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  marginBottom: "28px",
                  flexWrap: "wrap",
                  gap: "12px",
                }}
              >
                <div className="sec-hdr" style={{ margin: 0, flex: 1 }}>
                  <h2 className="sec-title">My Trips</h2>
                  <Separator style={{ flex: 1 }} />
                </div>
                <Button
                  className="btn-dark-tx"
                  onClick={() => navigate("/explore")}
                >
                  + New Trip
                </Button>
              </div>

              {loading ? (
                <p className="load-msg">Loading your journeys…</p>
              ) : trips.filter((t) => t.destination_id).length === 0 ? (
                <div className="empty">
                  <span className="empty-ico">🧳</span>
                  <p className="empty-title">No trips planned yet</p>
                  <p className="empty-desc">
                    Start crafting your next adventure.
                  </p>
                  <Button
                    className="btn-dark-tx"
                    onClick={() => navigate("/explore")}
                  >
                    Plan First Trip
                  </Button>
                </div>
              ) : (
                <div className="cards-grid">
                  {trips
                    .filter((t) => t.destination_id)
                    .map((trip) => (
                      <Card
                        key={trip.id}
                        className="trip-card-wrap"
                        onClick={() => navigate(`/trips/${trip.id}`)}
                      >
                        <div className="trip-banner">🧳</div>
                        <CardContent style={{ padding: 0 }}>
                          <div className="trip-body">
                            <h3 className="trip-name">{trip.name}</h3>
                            <div className="trip-foot">
                              <div
                                style={{
                                  display: "flex",
                                  alignItems: "center",
                                  gap: "8px",
                                }}
                              >
                                <Badge
                                  className={
                                    trip.status === "completed"
                                      ? "badge-sage"
                                      : "badge-gold"
                                  }
                                >
                                  {trip.status || "planned"}
                                </Badge>
                                {trip.total_budget && (
                                  <span
                                    style={{
                                      fontSize: "12px",
                                      color: "var(--ink-soft)",
                                    }}
                                  >
                                    ₹
                                    {Number(trip.total_budget).toLocaleString()}
                                  </span>
                                )}
                              </div>
                              <Button
                                variant="outline"
                                size="sm"
                                className="btn-del"
                                onClick={(e) => handleDeleteTrip(e, trip.id)}
                                style={{
                                  background:
                                    confirmDeleteId === trip.id
                                      ? "#fef2f2"
                                      : "transparent",
                                  borderColor:
                                    confirmDeleteId === trip.id
                                      ? "#fca5a5"
                                      : "var(--border)",
                                  color:
                                    confirmDeleteId === trip.id
                                      ? "#ef4444"
                                      : "var(--ink-soft)",
                                }}
                              >
                                {confirmDeleteId === trip.id
                                  ? "Confirm?"
                                  : "Delete"}
                              </Button>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                </div>
              )}
            </div>
          )}

          {activeTab === "community" && <Community />}
          {activeTab === "journal" && (
            <EmptyTab
              icon="◇"
              title="Travel Journal"
              desc="Document your adventures and preserve memories."
              btn="Write Entry"
              onNav={() => navigate("/journal")}
            />
          )}
        </main>

        {/* ── BOTTOM NAV ── */}
        <nav className="bnav">
          {navItems.map((item) => (
            <button
              key={item.id}
              className="bnav-btn"
              onClick={() => handleNavClick(item.id)}
              style={{
                color:
                  activeTab === item.id
                    ? "var(--gold)"
                    : "rgba(255,255,255,0.35)",
              }}
            >
              <span className="bnav-ico">{item.icon}</span>
              {item.label}
            </button>
          ))}
        </nav>
      </div>
    </>
  );
};

const DestCard = ({ dest }) => {
  const navigate = useNavigate();
  return (
    <Card
      className="dest-card-wrap"
      onClick={() => navigate(`/destinations/${dest.id}`)}
    >
      <div className="dest-img">
        {dest.image_url ? (
          <img src={dest.image_url} alt={dest.name} loading="lazy" />
        ) : (
          <div className="dest-no-img">🌍</div>
        )}
      </div>
      <CardContent style={{ padding: 0 }}>
        <div className="dest-body">
          <h3 className="dest-name">{dest.name}</h3>
          <p className="dest-desc">
            {dest.description?.slice(0, 80)}
            {dest.description?.length > 80 ? "…" : ""}
          </p>
          <div className="tag-row">
            {dest.category && (
              <Badge className="badge-terra">{dest.category}</Badge>
            )}
            {dest.country && (
              <Badge className="badge-plain">📍 {dest.country}</Badge>
            )}
            {dest.budget_estimate && (
              <Badge className="badge-sage">$ {dest.budget_estimate}</Badge>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

const EmptyTab = ({ icon, title, desc, btn, onNav }) => (
  <div className="empty">
    <span className="empty-ico">{icon}</span>
    <p className="empty-title">{title}</p>
    <p className="empty-desc">{desc}</p>
    <Button className="btn-dark-tx" onClick={onNav}>
      {btn}
    </Button>
  </div>
);

export default Dashboard;
