import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const API = "http://localhost:5000/api";

const EMPTY_DEST     = { name: "", country: "", description: "", category: "adventure", climate: "tropical", best_season: "all", estimated_flight_cost: "", estimated_stay_cost: "", estimated_food_cost: "", image_url: "" };
const EMPTY_PLACE    = { name: "", destination_id: "", description: "", entry_fee: "", best_time_to_visit: "", image_url: "" };
const EMPTY_ACTIVITY = { name: "", destination_id: "", description: "", type: "hiking", estimated_cost: "", cost_type: "optional", duration_hours: "" };
const EMPTY_CULINARY = { dish_name: "", destination_id: "", description: "", avg_price: "", image_url: "" };
const EMPTY_DEAL     = { title: "", destination_id: "", description: "", type: "flight", original_price: "", deal_price: "", valid_until: "", image_url: "", is_active: true };

const AdminDashboard = () => {
  const { logout } = useAuth();
  const navigate   = useNavigate();
  const [activeTab, setActiveTab]       = useState("overview");
  const [destinations, setDestinations] = useState([]);
  const [places, setPlaces]             = useState([]);
  const [activities, setActivities]     = useState([]);
  const [culinary, setCulinary]         = useState([]);
  const [deals, setDeals]               = useState([]);
  const [loading, setLoading]           = useState(true);
  const [modal, setModal]               = useState(null);
  const [saving, setSaving]             = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [sidebarOpen, setSidebarOpen]   = useState(false);

  const getHeaders = () => ({
    Authorization: `Bearer ${localStorage.getItem("token")}`,
    "Content-Type": "application/json",
  });

  const fetchAll = async () => {
    setLoading(true);
    try {
      const [d, p, a, c, dl] = await Promise.all([
        fetch(`${API}/destinations`, { headers: getHeaders() }).then(r => r.json()),
        fetch(`${API}/places`,       { headers: getHeaders() }).then(r => r.json()),
        fetch(`${API}/activities`,   { headers: getHeaders() }).then(r => r.json()),
        fetch(`${API}/culinary`,     { headers: getHeaders() }).then(r => r.json()),
        fetch(`${API}/deals`,        { headers: getHeaders() }).then(r => r.json()),
      ]);
      setDestinations(Array.isArray(d) ? d : []);
      setPlaces(Array.isArray(p) ? p : []);
      setActivities(Array.isArray(a) ? a : []);
      setCulinary(Array.isArray(c) ? c : []);
      setDeals(Array.isArray(dl) ? dl : []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchAll(); }, []);

  const openAdd  = (section) => {
    const empty = { destinations: EMPTY_DEST, places: EMPTY_PLACE, activities: EMPTY_ACTIVITY, culinary: EMPTY_CULINARY, deals: EMPTY_DEAL }[section];
    setModal({ type: "add", section, data: { ...empty } });
  };
  const openEdit = (section, item) => setModal({ type: "edit", section, data: { ...item } });

  const handleSave = async () => {
    setSaving(true);
    const { type, section, data } = modal;
    const urlMap = { destinations: `${API}/destinations`, places: `${API}/places`, activities: `${API}/activities`, culinary: `${API}/culinary`, deals: `${API}/deals` };
    const url    = type === "edit" ? `${urlMap[section]}/${data.id}` : urlMap[section];
    try {
      const res = await fetch(url, { method: type === "edit" ? "PUT" : "POST", headers: getHeaders(), body: JSON.stringify(data) });
      if (!res.ok) throw new Error("Save failed");
      setModal(null);
      fetchAll();
    } catch (err) {
      alert("Error saving: " + err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (section, id) => {
    const urlMap = { destinations: `${API}/destinations`, places: `${API}/places`, activities: `${API}/activities`, culinary: `${API}/culinary`, deals: `${API}/deals` };
    try {
      await fetch(`${urlMap[section]}/${id}`, { method: "DELETE", headers: getHeaders() });
      setDeleteConfirm(null);
      fetchAll();
    } catch { alert("Delete failed"); }
  };

  const updateField = (key, val) => setModal(m => ({ ...m, data: { ...m.data, [key]: val } }));
  const handleLogout = () => { logout(); navigate("/"); };

  const navItems = [
    { id: "overview",      icon: "◈", label: "Overview"     },
    { id: "destinations",  icon: "🌍", label: "Destinations" },
    { id: "places",        icon: "📍", label: "Places"       },
    { id: "activities",    icon: "🎯", label: "Activities"   },
    { id: "culinary",      icon: "🍽️", label: "Culinary"    },
    { id: "deals",         icon: "◆", label: "Deals"        },
  ];

  const stats = [
    { label: "Destinations", value: destinations.length, icon: "🌍", accent: "#C4552A", pale: "#FDF0EB", tab: "destinations" },
    { label: "Places",       value: places.length,       icon: "📍", accent: "#5C7A5E", pale: "#EDF4EE", tab: "places"       },
    { label: "Activities",   value: activities.length,   icon: "🎯", accent: "#D4A853", pale: "#FDF6E8", tab: "activities"   },
    { label: "Culinary",     value: culinary.length,     icon: "🍽️", accent: "#7A5EA8", pale: "#F0ECFA", tab: "culinary"    },
    { label: "Deals",        value: deals.length,        icon: "◆", accent: "#C4552A", pale: "#FDF0EB", tab: "deals"        },
  ];

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
        body { font-family: 'DM Sans', sans-serif; background: var(--white); color: var(--ink); }

        /* ── SIDEBAR ── */
        .asb {
          position: fixed; top: 0; left: 0; bottom: 0; width: 240px; z-index: 50;
          background: linear-gradient(160deg, #2D1B0E 0%, #5C3520 55%, #C4552A 100%);
          display: flex; flex-direction: column; overflow: hidden;
          transition: transform 0.4s cubic-bezier(0.4,0,0.2,1);
        }
        .asb::before {
          content: ''; position: absolute; width: 320px; height: 320px; border-radius: 50%;
          background: radial-gradient(circle, rgba(212,168,83,0.15) 0%, transparent 70%);
          top: 15%; left: 50%; transform: translate(-50%, -50%); pointer-events: none;
        }
        .asb-top { padding: 28px 22px 20px; border-bottom: 1px solid rgba(255,255,255,0.1); position: relative; z-index: 1; }
        .asb-logo { font-family: 'Playfair Display', serif; font-size: 20px; font-weight: 900; color: var(--gold); letter-spacing: 2px; }
        .asb-sub  { font-size: 9px; color: rgba(212,168,83,0.5); letter-spacing: 4px; text-transform: uppercase; margin-top: 3px; }
        .asb-badge { display: inline-block; background: rgba(212,168,83,0.2); border: 1px solid rgba(212,168,83,0.3); color: var(--gold); font-size: 8px; font-weight: 700; letter-spacing: 2px; text-transform: uppercase; padding: 2px 8px; border-radius: 20px; margin-top: 8px; }

        .asb-nav { flex: 1; padding: 14px 10px; display: flex; flex-direction: column; gap: 2px; overflow-y: auto; position: relative; z-index: 1; }
        .asb-btn {
          display: flex; align-items: center; gap: 11px; padding: 10px 13px; border-radius: 10px;
          border: none; background: transparent; font-family: 'DM Sans', sans-serif;
          font-size: 13px; font-weight: 500; color: rgba(255,255,255,0.4);
          cursor: pointer; text-align: left; width: 100%; transition: all 0.2s;
        }
        .asb-ico { font-size: 14px; transition: color 0.2s; flex-shrink: 0; width: 18px; text-align: center; }
        .asb-btn:hover { background: rgba(255,255,255,0.08); color: rgba(255,255,255,0.85); }
        .asb-btn.active { background: rgba(255,255,255,0.13); color: #fff; border-left: 2px solid var(--gold); padding-left: 11px; font-weight: 600; }

        .asb-user { padding: 14px 18px; border-top: 1px solid rgba(255,255,255,0.1); display: flex; align-items: center; gap: 11px; position: relative; z-index: 1; }
        .asb-av { width: 38px; height: 38px; border-radius: 50%; flex-shrink: 0; background: linear-gradient(135deg, var(--gold), var(--terra-light)); display: flex; align-items: center; justify-content: center; font-family: 'Playfair Display', serif; font-size: 16px; font-weight: 700; color: #fff; box-shadow: 0 4px 12px rgba(0,0,0,0.2); }
        .asb-uname { font-size: 13px; font-weight: 600; color: #fff; }
        .asb-out { font-size: 10px; letter-spacing: 1px; text-transform: uppercase; color: rgba(255,255,255,0.28); background: none; border: none; cursor: pointer; font-family: 'DM Sans', sans-serif; padding: 0; transition: color 0.2s; display: block; margin-top: 2px; }
        .asb-out:hover { color: var(--gold); }

        /* ── MOBILE HEADER ── */
        .amhdr { display: none; align-items: center; justify-content: space-between; background: linear-gradient(90deg,#2D1B0E,#5C3520); padding: 13px 20px; position: sticky; top: 0; z-index: 30; }
        .amhdr-logo { font-family: 'Playfair Display', serif; font-size: 18px; font-weight: 900; color: var(--gold); }
        .ahbg { width: 36px; height: 36px; border-radius: 8px; background: rgba(212,168,83,0.12); border: 1px solid rgba(212,168,83,0.25); cursor: pointer; display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 4px; }
        .ahbg-ln { display: block; width: 16px; height: 1.5px; background: var(--gold); border-radius: 2px; }

        /* ── MAIN ── */
        .amain { margin-left: 240px; min-height: 100vh; background: var(--white); padding: 40px 44px; }

        @media (max-width: 768px) {
          .asb { transform: translateX(-100%); }
          .asb.open { transform: translateX(0); }
          .amhdr { display: flex; }
          .amain { margin-left: 0; padding: 24px 16px; }
        }

        /* ── PAGE HEADER ── */
        .apg-hdr { margin-bottom: 36px; padding-bottom: 28px; border-bottom: 1px solid var(--border); }
        .apg-tag { font-size: 10px; font-weight: 600; letter-spacing: 3.5px; text-transform: uppercase; color: var(--terracotta); margin-bottom: 8px; display: flex; align-items: center; gap: 8px; }
        .apg-tag::before { content: ''; display: block; width: 18px; height: 1.5px; background: var(--terracotta); border-radius: 2px; }
        .apg-title { font-family: 'Playfair Display', serif; font-size: clamp(24px,3vw,36px); font-weight: 700; color: var(--ink); }
        .apg-title em { font-style: italic; color: var(--terracotta); }

        /* ── STATS ── */
        .astats { display: grid; grid-template-columns: repeat(5,1fr); gap: 16px; margin-bottom: 40px; }
        @media (max-width: 1100px) { .astats { grid-template-columns: repeat(3,1fr); } }
        @media (max-width: 600px)  { .astats { grid-template-columns: repeat(2,1fr); } }

        .astat {
          background: var(--white); border: 1.5px solid var(--border); border-radius: 16px;
          padding: 22px 18px; position: relative; overflow: hidden; cursor: pointer;
          transition: transform 0.3s, box-shadow 0.3s;
        }
        .astat:hover { transform: translateY(-4px); box-shadow: 0 16px 40px rgba(28,25,23,0.08); }
        .astat-ico { width: 42px; height: 42px; border-radius: 10px; display: flex; align-items: center; justify-content: center; font-size: 18px; margin-bottom: 14px; }
        .astat-val { font-family: 'Playfair Display', serif; font-size: 40px; font-weight: 700; color: var(--ink); line-height: 1; }
        .astat-lbl { font-size: 10px; color: var(--ink-soft); text-transform: uppercase; letter-spacing: 2px; margin-top: 6px; font-weight: 500; }
        .astat-bar { position: absolute; bottom: 0; left: 0; right: 0; height: 3px; }

        /* ── SECTION ── */
        .asec-hdr { display: flex; align-items: center; justify-content: space-between; margin-bottom: 24px; flex-wrap: wrap; gap: 12px; }
        .asec-title { font-family: 'Playfair Display', serif; font-size: 22px; font-weight: 700; color: var(--ink); }
        .asec-line { flex: 1; height: 1px; background: var(--border); margin: 0 16px; }
        .asec-count { font-size: 10px; color: var(--muted); text-transform: uppercase; letter-spacing: 2px; }

        .aadd-btn {
          background: var(--ink); color: var(--gold); border: none;
          padding: 10px 22px; border-radius: 10px; font-family: 'DM Sans', sans-serif;
          font-size: 13px; font-weight: 600; cursor: pointer; transition: all 0.2s;
          letter-spacing: 0.3px;
        }
        .aadd-btn:hover { background: var(--terracotta); color: #fff; box-shadow: 0 6px 20px rgba(196,85,42,0.3); transform: translateY(-1px); }

        /* ── TABLE ── */
        .atable-wrap { background: var(--white); border: 1.5px solid var(--border); border-radius: 16px; overflow: hidden; }
        .atable { width: 100%; border-collapse: collapse; }
        .atable thead tr { background: var(--sand); }
        .atable th { padding: 13px 16px; text-align: left; font-size: 10px; font-weight: 700; color: var(--ink-soft); text-transform: uppercase; letter-spacing: 1.5px; border-bottom: 1.5px solid var(--border); white-space: nowrap; }
        .atable td { padding: 13px 16px; font-size: 13px; color: var(--ink-light); border-bottom: 1px solid var(--border); vertical-align: middle; }
        .atable tbody tr:last-child td { border-bottom: none; }
        .atable tbody tr { transition: background 0.15s; }
        .atable tbody tr:hover { background: var(--sand); }
        .atable-name { font-weight: 600; color: var(--ink); }

        /* ── ACTION BTNS ── */
        .aact { display: flex; gap: 6px; }
        .aact-btn { border: none; padding: 5px 12px; border-radius: 8px; font-size: 11px; font-weight: 600; cursor: pointer; font-family: 'DM Sans', sans-serif; transition: all 0.2s; }
        .aact-edit { background: #FDF6E8; color: #A07830; border: 1px solid #EAD5A0; }
        .aact-edit:hover { background: var(--gold); color: #fff; }
        .aact-del  { background: #FDF0EB; color: var(--terracotta); border: 1px solid #F0C8B8; }
        .aact-del:hover  { background: var(--terracotta); color: #fff; }

        /* ── BADGE ── */
        .abadge { display: inline-block; font-size: 10px; font-weight: 600; padding: 3px 10px; border-radius: 20px; text-transform: capitalize; }
        .abadge-terra  { background: #FDF0EB; color: var(--terracotta); border: 1px solid #F0C8B8; }
        .abadge-sage   { background: #EDF4EE; color: var(--sage); border: 1px solid #B8D4BA; }
        .abadge-gold   { background: #FDF6E8; color: #A07830; border: 1px solid #EAD5A0; }
        .abadge-purple { background: #F0ECFA; color: #7A5EA8; border: 1px solid #D4C8F0; }
        .abadge-plain  { background: var(--sand); color: var(--ink-soft); border: 1px solid var(--border); }

        /* ── MODAL ── */
        .amodal-ov { position: fixed; inset: 0; background: rgba(28,25,23,0.6); z-index: 200; display: flex; align-items: center; justify-content: center; padding: 20px; backdrop-filter: blur(4px); }
        .amodal { background: var(--white); border-radius: 20px; padding: 32px; width: 100%; max-width: 580px; max-height: 90vh; overflow-y: auto; box-shadow: 0 24px 64px rgba(28,25,23,0.2); }
        .amodal::-webkit-scrollbar { width: 4px; }
        .amodal::-webkit-scrollbar-thumb { background: var(--border); border-radius: 4px; }
        .amodal-title { font-family: 'Playfair Display', serif; font-size: 22px; font-weight: 700; color: var(--ink); margin-bottom: 6px; }
        .amodal-sub { font-size: 12px; color: var(--ink-soft); margin-bottom: 28px; }
        .amodal-divider { height: 1px; background: var(--border); margin: 20px 0; }

        .afield { margin-bottom: 16px; }
        .alabel { display: block; font-size: 10px; font-weight: 700; color: var(--ink-soft); text-transform: uppercase; letter-spacing: 1.5px; margin-bottom: 6px; }
        .ainput, .aselect, .atextarea {
          width: 100%; padding: 11px 14px; border: 1.5px solid var(--border);
          border-radius: 10px; font-size: 13px; font-family: 'DM Sans', sans-serif;
          color: var(--ink); background: var(--sand); outline: none;
          transition: border-color 0.2s, box-shadow 0.2s, background 0.2s;
          box-sizing: border-box;
        }
        .ainput:focus, .aselect:focus, .atextarea:focus {
          border-color: var(--terracotta); background: var(--white);
          box-shadow: 0 0 0 3px rgba(196,85,42,0.1);
        }
        .atextarea { resize: vertical; min-height: 90px; }
        .aselect { appearance: none; background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='8'%3E%3Cpath d='M1 1l5 5 5-5' stroke='%2378716C' stroke-width='1.5' fill='none' stroke-linecap='round'/%3E%3C/svg%3E"); background-repeat: no-repeat; background-position: right 14px center; padding-right: 36px; }
        .ainput[type=number]::-webkit-inner-spin-button { -webkit-appearance: none; }
        .ainput[type=number] { -moz-appearance: textfield; }

        .afield-row { display: grid; gap: 12px; }
        .afield-row.cols2 { grid-template-columns: 1fr 1fr; }
        .afield-row.cols3 { grid-template-columns: 1fr 1fr 1fr; }
        @media (max-width: 520px) { .afield-row.cols2, .afield-row.cols3 { grid-template-columns: 1fr; } }

        .amodal-btns { display: flex; gap: 10px; justify-content: flex-end; margin-top: 28px; padding-top: 20px; border-top: 1px solid var(--border); }
        .acancel-btn { padding: 10px 22px; border-radius: 10px; border: 1.5px solid var(--border); background: var(--white); color: var(--ink-soft); font-family: 'DM Sans', sans-serif; font-size: 13px; font-weight: 600; cursor: pointer; transition: all 0.2s; }
        .acancel-btn:hover { background: var(--sand); border-color: var(--sand-dark); }
        .asave-btn { padding: 10px 28px; border-radius: 10px; border: none; background: var(--ink); color: var(--gold); font-family: 'DM Sans', sans-serif; font-size: 13px; font-weight: 600; cursor: pointer; transition: all 0.2s; }
        .asave-btn:hover:not(:disabled) { background: var(--terracotta); color: #fff; box-shadow: 0 6px 20px rgba(196,85,42,0.3); }
        .asave-btn:disabled { opacity: 0.55; cursor: not-allowed; }

        /* ── DELETE MODAL ── */
        .adel-modal { background: var(--white); border-radius: 20px; padding: 36px 32px; max-width: 380px; width: 100%; text-align: center; box-shadow: 0 24px 64px rgba(28,25,23,0.2); }
        .adel-ico { font-size: 44px; margin-bottom: 16px; }
        .adel-title { font-family: 'Playfair Display', serif; font-size: 20px; font-weight: 700; color: var(--ink); margin-bottom: 8px; }
        .adel-sub { font-size: 13px; color: var(--ink-soft); margin-bottom: 28px; line-height: 1.5; }
        .adel-btns { display: flex; gap: 10px; }
        .adel-cancel { flex: 1; padding: 11px; border-radius: 10px; border: 1.5px solid var(--border); background: var(--white); color: var(--ink-soft); font-family: 'DM Sans', sans-serif; font-weight: 600; cursor: pointer; }
        .adel-confirm { flex: 1; padding: 11px; border-radius: 10px; border: none; background: var(--terracotta); color: #fff; font-family: 'DM Sans', sans-serif; font-weight: 600; cursor: pointer; transition: all 0.2s; }
        .adel-confirm:hover { background: #A03E1A; box-shadow: 0 6px 18px rgba(196,85,42,0.35); }

        /* ── LOADING ── */
        .aload { text-align: center; padding: 80px 20px; font-family: 'Playfair Display', serif; font-size: 20px; color: var(--ink-soft); font-style: italic; }

        /* ── EMPTY TABLE ── */
        .aempty-row td { text-align: center; padding: 60px 20px; color: var(--muted); font-style: italic; }

        @keyframes fadeUp { from { opacity:0; transform:translateY(12px); } to { opacity:1; transform:translateY(0); } }
        .au { animation: fadeUp 0.4s ease both; }
        .d1{animation-delay:.05s;opacity:0} .d2{animation-delay:.1s;opacity:0} .d3{animation-delay:.15s;opacity:0} .d4{animation-delay:.2s;opacity:0} .d5{animation-delay:.25s;opacity:0}
      `}</style>

      {/* Overlay */}
      {sidebarOpen && <div onClick={() => setSidebarOpen(false)} style={{ position:"fixed", inset:0, background:"rgba(28,25,23,0.5)", zIndex:40, backdropFilter:"blur(4px)" }} />}

      {/* SIDEBAR */}
      <aside className={`asb ${sidebarOpen ? "open" : ""}`}>
        <div className="asb-top">
          <div className="asb-logo">TravelX</div>
          <div className="asb-sub">Control Panel</div>
          <div className="asb-badge">Admin</div>
        </div>
        <nav className="asb-nav">
          {navItems.map(item => (
            <button key={item.id} className={`asb-btn ${activeTab === item.id ? "active" : ""}`}
              onClick={() => { setActiveTab(item.id); setSidebarOpen(false); }}>
              <span className="asb-ico">{item.icon}</span>{item.label}
            </button>
          ))}
        </nav>
        <div className="asb-user">
          <div className="asb-av">A</div>
          <div>
            <div className="asb-uname">Admin</div>
            <button className="asb-out" onClick={handleLogout}>Log out</button>
          </div>
        </div>
      </aside>

      {/* MOBILE HEADER */}
      <header className="amhdr">
        <button className="ahbg" onClick={() => setSidebarOpen(v => !v)}>
          <span className="ahbg-ln"/><span className="ahbg-ln"/><span className="ahbg-ln"/>
        </button>
        <span className="amhdr-logo">TravelX Admin</span>
        <div style={{ width:36 }} />
      </header>

      {/* MAIN */}
      <main className="amain">

        {/* OVERVIEW */}
        {activeTab === "overview" && (
          <div>
            <div className="apg-hdr au">
              <div className="apg-tag">Control Panel</div>
              <h1 className="apg-title">Dashboard <em>Overview</em></h1>
            </div>
            {loading ? <p className="aload">Loading data…</p> : (
              <div className="astats">
                {stats.map((s, i) => (
                  <div key={s.label} className={`astat au d${i+1}`} onClick={() => setActiveTab(s.tab)}>
                    <div className="astat-ico" style={{ background: s.pale }}>{s.icon}</div>
                    <div className="astat-val">{s.value}</div>
                    <div className="astat-lbl">{s.label}</div>
                    <div className="astat-bar" style={{ background: s.accent }} />
                  </div>
                ))}
              </div>
            )}

            {/* Recent destinations preview */}
            {!loading && destinations.length > 0 && (
              <div className="au d5">
                <div className="asec-hdr">
                  <h2 className="asec-title">Recent Destinations</h2>
                  <div className="asec-line" />
                  <button className="aadd-btn" onClick={() => setActiveTab("destinations")}>View All →</button>
                </div>
                <div className="atable-wrap">
                  <table className="atable">
                    <thead><tr>
                      <th>Name</th><th>Country</th><th>Category</th><th>Actions</th>
                    </tr></thead>
                    <tbody>
                      {destinations.slice(0,5).map(d => (
                        <tr key={d.id}>
                          <td className="atable-name">{d.name}</td>
                          <td>{d.country || "—"}</td>
                          <td><span className="abadge abadge-terra">{d.category || "—"}</span></td>
                          <td><div className="aact">
                            <button className="aact-btn aact-edit" onClick={() => openEdit("destinations", d)}>Edit</button>
                            <button className="aact-btn aact-del" onClick={() => setDeleteConfirm({ section:"destinations", id:d.id, name:d.name })}>Delete</button>
                          </div></td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        )}

        {/* DESTINATIONS */}
        {activeTab === "destinations" && (
          <div>
            <div className="apg-hdr au">
              <div className="apg-tag">Manage</div>
              <h1 className="apg-title">Destinations</h1>
            </div>
            <div className="asec-hdr">
              <span className="asec-count">{destinations.length} total</span>
              <div className="asec-line" />
              <button className="aadd-btn" onClick={() => openAdd("destinations")}>+ Add New</button>
            </div>
            <div className="atable-wrap au">
              <table className="atable">
                <thead><tr>
                  <th>Name</th><th>Country</th><th>Category</th><th>Flight</th><th>Stay</th><th>Food</th><th>Actions</th>
                </tr></thead>
                <tbody>
                  {destinations.length === 0
                    ? <tr className="aempty-row"><td colSpan={7}>No destinations yet</td></tr>
                    : destinations.map(d => (
                    <tr key={d.id}>
                      <td className="atable-name">{d.name}</td>
                      <td>{d.country || "—"}</td>
                      <td><span className="abadge abadge-terra">{d.category || "—"}</span></td>
                      <td>{d.estimated_flight_cost ? `₹${Number(d.estimated_flight_cost).toLocaleString()}` : "—"}</td>
                      <td>{d.estimated_stay_cost   ? `₹${Number(d.estimated_stay_cost).toLocaleString()}`   : "—"}</td>
                      <td>{d.estimated_food_cost   ? `₹${Number(d.estimated_food_cost).toLocaleString()}`   : "—"}</td>
                      <td><div className="aact">
                        <button className="aact-btn aact-edit" onClick={() => openEdit("destinations", d)}>Edit</button>
                        <button className="aact-btn aact-del"  onClick={() => setDeleteConfirm({ section:"destinations", id:d.id, name:d.name })}>Delete</button>
                      </div></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* PLACES */}
        {activeTab === "places" && (
          <div>
            <div className="apg-hdr au">
              <div className="apg-tag">Manage</div>
              <h1 className="apg-title">Places</h1>
            </div>
            <div className="asec-hdr">
              <span className="asec-count">{places.length} total</span>
              <div className="asec-line" />
              <button className="aadd-btn" onClick={() => openAdd("places")}>+ Add New</button>
            </div>
            <div className="atable-wrap au">
              <table className="atable">
                <thead><tr>
                  <th>Name</th><th>Destination</th><th>Entry Fee</th><th>Best Time</th><th>Actions</th>
                </tr></thead>
                <tbody>
                  {places.length === 0
                    ? <tr className="aempty-row"><td colSpan={5}>No places yet</td></tr>
                    : places.map(p => (
                    <tr key={p.id}>
                      <td className="atable-name">{p.name}</td>
                      <td>{destinations.find(d => d.id === p.destination_id)?.name || "—"}</td>
                      <td>{p.entry_fee ? <span className="abadge abadge-sage">₹{p.entry_fee}</span> : <span className="abadge abadge-plain">Free</span>}</td>
                      <td>{p.best_time_to_visit || "—"}</td>
                      <td><div className="aact">
                        <button className="aact-btn aact-edit" onClick={() => openEdit("places", p)}>Edit</button>
                        <button className="aact-btn aact-del"  onClick={() => setDeleteConfirm({ section:"places", id:p.id, name:p.name })}>Delete</button>
                      </div></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ACTIVITIES */}
        {activeTab === "activities" && (
          <div>
            <div className="apg-hdr au">
              <div className="apg-tag">Manage</div>
              <h1 className="apg-title">Activities</h1>
            </div>
            <div className="asec-hdr">
              <span className="asec-count">{activities.length} total</span>
              <div className="asec-line" />
              <button className="aadd-btn" onClick={() => openAdd("activities")}>+ Add New</button>
            </div>
            <div className="atable-wrap au">
              <table className="atable">
                <thead><tr>
                  <th>Name</th><th>Destination</th><th>Type</th><th>Cost</th><th>Duration</th><th>Actions</th>
                </tr></thead>
                <tbody>
                  {activities.length === 0
                    ? <tr className="aempty-row"><td colSpan={6}>No activities yet</td></tr>
                    : activities.map(a => (
                    <tr key={a.id}>
                      <td className="atable-name">{a.name}</td>
                      <td>{destinations.find(d => d.id === a.destination_id)?.name || "—"}</td>
                      <td><span className="abadge abadge-gold">{a.type || "—"}</span></td>
                      <td>{a.estimated_cost ? `₹${Number(a.estimated_cost).toLocaleString()}` : "Free"}</td>
                      <td>{a.duration_hours ? `${a.duration_hours}h` : "—"}</td>
                      <td><div className="aact">
                        <button className="aact-btn aact-edit" onClick={() => openEdit("activities", a)}>Edit</button>
                        <button className="aact-btn aact-del"  onClick={() => setDeleteConfirm({ section:"activities", id:a.id, name:a.name })}>Delete</button>
                      </div></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* CULINARY */}
        {activeTab === "culinary" && (
          <div>
            <div className="apg-hdr au">
              <div className="apg-tag">Manage</div>
              <h1 className="apg-title">Culinary</h1>
            </div>
            <div className="asec-hdr">
              <span className="asec-count">{culinary.length} total</span>
              <div className="asec-line" />
              <button className="aadd-btn" onClick={() => openAdd("culinary")}>+ Add New</button>
            </div>
            <div className="atable-wrap au">
              <table className="atable">
                <thead><tr>
                  <th>Dish Name</th><th>Destination</th><th>Avg Price</th><th>Description</th><th>Actions</th>
                </tr></thead>
                <tbody>
                  {culinary.length === 0
                    ? <tr className="aempty-row"><td colSpan={5}>No culinary items yet</td></tr>
                    : culinary.map(c => (
                    <tr key={c.id}>
                      <td className="atable-name">{c.dish_name}</td>
                      <td>{destinations.find(d => d.id === c.destination_id)?.name || "—"}</td>
                      <td>{c.avg_price ? <span className="abadge abadge-purple">₹{c.avg_price}</span> : "—"}</td>
                      <td style={{ maxWidth:200, overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>{c.description?.slice(0,55) || "—"}</td>
                      <td><div className="aact">
                        <button className="aact-btn aact-edit" onClick={() => openEdit("culinary", c)}>Edit</button>
                        <button className="aact-btn aact-del"  onClick={() => setDeleteConfirm({ section:"culinary", id:c.id, name:c.dish_name })}>Delete</button>
                      </div></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* DEALS */}
        {activeTab === "deals" && (
          <div>
            <div className="apg-hdr au">
              <div className="apg-tag">Manage</div>
              <h1 className="apg-title">Deals</h1>
            </div>
            <div className="asec-hdr">
              <span className="asec-count">{deals.length} total</span>
              <div className="asec-line" />
              <button className="aadd-btn" onClick={() => openAdd("deals")}>+ Add New</button>
            </div>
            <div className="atable-wrap au">
              <table className="atable">
                <thead><tr>
                  <th>Title</th><th>Destination</th><th>Type</th><th>Original</th><th>Deal Price</th><th>Valid Until</th><th>Status</th><th>Actions</th>
                </tr></thead>
                <tbody>
                  {deals.length === 0
                    ? <tr className="aempty-row"><td colSpan={8}>No deals yet</td></tr>
                    : deals.map(d => (
                    <tr key={d.id}>
                      <td className="atable-name">{d.title}</td>
                      <td>{destinations.find(dest => dest.id === d.destination_id)?.name || "—"}</td>
                      <td><span className="abadge abadge-gold">{d.type || "—"}</span></td>
                      <td style={{ textDecoration:"line-through", color:"var(--muted)" }}>{d.original_price ? `₹${Number(d.original_price).toLocaleString()}` : "—"}</td>
                      <td><strong style={{ color:"var(--terracotta)" }}>{d.deal_price ? `₹${Number(d.deal_price).toLocaleString()}` : "—"}</strong></td>
                      <td>{d.valid_until ? new Date(d.valid_until).toLocaleDateString("en-IN", { day:"numeric", month:"short", year:"numeric" }) : "—"}</td>
                      <td><span className={`abadge ${d.is_active ? "abadge-sage" : "abadge-plain"}`}>{d.is_active ? "Active" : "Inactive"}</span></td>
                      <td><div className="aact">
                        <button className="aact-btn aact-edit" onClick={() => openEdit("deals", d)}>Edit</button>
                        <button className="aact-btn aact-del"  onClick={() => setDeleteConfirm({ section:"deals", id:d.id, name:d.title })}>Delete</button>
                      </div></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </main>

      {/* ADD/EDIT MODAL */}
      {modal && (
        <div className="amodal-ov" onClick={() => setModal(null)}>
          <div className="amodal" onClick={e => e.stopPropagation()}>
            <h2 className="amodal-title">{modal.type === "add" ? "Add" : "Edit"} {modal.section.slice(0,-1)}</h2>
            <p className="amodal-sub">{modal.type === "add" ? "Fill in the details below to create a new entry." : "Update the details below."}</p>

            {modal.section === "destinations" && <>
              <AField label="Name *"        value={modal.data.name}        onChange={v => updateField("name", v)} />
              <AField label="Country"       value={modal.data.country}     onChange={v => updateField("country", v)} />
              <AField label="Description"   value={modal.data.description} onChange={v => updateField("description", v)} textarea />
              <AField label="Image URL"     value={modal.data.image_url}   onChange={v => updateField("image_url", v)} />
              <div className="afield-row cols3">
                <ASelect label="Category"    value={modal.data.category}    onChange={v => updateField("category", v)}    options={["adventure","relaxation","culture","history","nature"]} />
                <ASelect label="Climate"     value={modal.data.climate}     onChange={v => updateField("climate", v)}     options={["tropical","cold","temperate","desert","mixed"]} />
                <ASelect label="Best Season" value={modal.data.best_season} onChange={v => updateField("best_season", v)} options={["spring","summer","autumn","winter","all"]} />
              </div>
              <div className="afield-row cols3">
                <AField label="Flight Cost ₹" value={modal.data.estimated_flight_cost} onChange={v => updateField("estimated_flight_cost", v)} type="number" />
                <AField label="Stay Cost ₹"   value={modal.data.estimated_stay_cost}   onChange={v => updateField("estimated_stay_cost", v)}   type="number" />
                <AField label="Food Cost ₹"   value={modal.data.estimated_food_cost}   onChange={v => updateField("estimated_food_cost", v)}    type="number" />
              </div>
            </>}

            {modal.section === "places" && <>
              <AField label="Name *"          value={modal.data.name}             onChange={v => updateField("name", v)} />
              <ADestSelect value={modal.data.destination_id} onChange={v => updateField("destination_id", v)} destinations={destinations} />
              <AField label="Description"     value={modal.data.description}      onChange={v => updateField("description", v)} textarea />
              <div className="afield-row cols2">
                <AField label="Entry Fee ₹"   value={modal.data.entry_fee}        onChange={v => updateField("entry_fee", v)} type="number" />
                <AField label="Best Time"     value={modal.data.best_time_to_visit} onChange={v => updateField("best_time_to_visit", v)} />
              </div>
              <AField label="Image URL"       value={modal.data.image_url}        onChange={v => updateField("image_url", v)} />
            </>}

            {modal.section === "activities" && <>
              <AField label="Name *"       value={modal.data.name}        onChange={v => updateField("name", v)} />
              <ADestSelect value={modal.data.destination_id} onChange={v => updateField("destination_id", v)} destinations={destinations} />
              <AField label="Description"  value={modal.data.description} onChange={v => updateField("description", v)} textarea />
              <div className="afield-row cols2">
                <ASelect label="Type"      value={modal.data.type}        onChange={v => updateField("type", v)} options={["hiking","festival","food","tour","water_sport","wildlife","adventure","cultural"]} />
                <ASelect label="Cost Type" value={modal.data.cost_type}   onChange={v => updateField("cost_type", v)} options={["included","optional","free"]} />
                <AField label="Cost ₹"     value={modal.data.estimated_cost}  onChange={v => updateField("estimated_cost", v)} type="number" />
                <AField label="Duration hrs" value={modal.data.duration_hours} onChange={v => updateField("duration_hours", v)} type="number" />
              </div>
            </>}

            {modal.section === "culinary" && <>
              <AField label="Dish Name *"  value={modal.data.dish_name}   onChange={v => updateField("dish_name", v)} />
              <ADestSelect value={modal.data.destination_id} onChange={v => updateField("destination_id", v)} destinations={destinations} />
              <AField label="Description"  value={modal.data.description} onChange={v => updateField("description", v)} textarea />
              <AField label="Avg Price ₹"  value={modal.data.avg_price}   onChange={v => updateField("avg_price", v)} type="number" />
              <AField label="Image URL"    value={modal.data.image_url}   onChange={v => updateField("image_url", v)} />
            </>}

            {modal.section === "deals" && <>
              <AField label="Title *"      value={modal.data.title}       onChange={v => updateField("title", v)} />
              <ADestSelect value={modal.data.destination_id} onChange={v => updateField("destination_id", v)} destinations={destinations} />
              <AField label="Description"  value={modal.data.description} onChange={v => updateField("description", v)} textarea />
              <div className="afield-row cols2">
                <ASelect label="Type"      value={modal.data.type}        onChange={v => updateField("type", v)} options={["flight","hotel","tour","package"]} />
                <AField label="Valid Until" value={modal.data.valid_until} onChange={v => updateField("valid_until", v)} type="date" />
                <AField label="Original Price ₹" value={modal.data.original_price} onChange={v => updateField("original_price", v)} type="number" />
                <AField label="Deal Price ₹"     value={modal.data.deal_price}     onChange={v => updateField("deal_price", v)}     type="number" />
              </div>
              <AField label="Image URL (optional)" value={modal.data.image_url} onChange={v => updateField("image_url", v)} />
              <div className="afield">
                <label className="alabel">Status</label>
                <select className="aselect" value={modal.data.is_active} onChange={e => updateField("is_active", e.target.value === "true")}>
                  <option value="true">Active</option>
                  <option value="false">Inactive</option>
                </select>
              </div>
            </>}

            <div className="amodal-btns">
              <button className="acancel-btn" onClick={() => setModal(null)}>Cancel</button>
              <button className="asave-btn" onClick={handleSave} disabled={saving}>{saving ? "Saving…" : "Save Changes"}</button>
            </div>
          </div>
        </div>
      )}

      {/* DELETE CONFIRM */}
      {deleteConfirm && (
        <div className="amodal-ov" onClick={() => setDeleteConfirm(null)}>
          <div className="adel-modal" onClick={e => e.stopPropagation()}>
            <div className="adel-ico">🗑️</div>
            <h2 className="adel-title">Delete "{deleteConfirm.name}"?</h2>
            <p className="adel-sub">This action cannot be undone. All related data will be permanently removed.</p>
            <div className="adel-btns">
              <button className="adel-cancel"  onClick={() => setDeleteConfirm(null)}>Cancel</button>
              <button className="adel-confirm" onClick={() => handleDelete(deleteConfirm.section, deleteConfirm.id)}>Delete</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

// ── Helper Components ──────────────────────────────────────────────────────────
const AField = ({ label, value, onChange, textarea, type = "text" }) => (
  <div className="afield">
    <label className="alabel">{label}</label>
    {textarea
      ? <textarea className="atextarea" value={value || ""} onChange={e => onChange(e.target.value)} />
      : <input className="ainput" type={type} value={value || ""} onChange={e => onChange(e.target.value)} />}
  </div>
);

const ASelect = ({ label, value, onChange, options }) => (
  <div className="afield">
    <label className="alabel">{label}</label>
    <select className="aselect" value={value || ""} onChange={e => onChange(e.target.value)}>
      {options.map(o => <option key={o} value={o}>{o}</option>)}
    </select>
  </div>
);

const ADestSelect = ({ value, onChange, destinations }) => (
  <div className="afield">
    <label className="alabel">Destination</label>
    <select className="aselect" value={value || ""} onChange={e => onChange(e.target.value)}>
      <option value="">Select Destination</option>
      {destinations.map(d => <option key={d.id} value={d.id}>{d.name}</option>)}
    </select>
  </div>
);

export default AdminDashboard;