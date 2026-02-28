import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../services/axiosInstance";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const Explore = () => {
  const navigate = useNavigate();
  const [destinations, setDestinations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [filters, setFilters] = useState({
    search: "", category: "", climate: "", season: "", maxBudget: "",
  });

  useEffect(() => { fetchDestinations(filters); }, [filters]);

  const fetchDestinations = async (f = filters) => {
    setLoading(true);
    try {
      const res = await axiosInstance.get("/destinations", { params: f });
      setDestinations(Array.isArray(res.data) ? res.data : []);
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  };

  const handleChange = (e) => setFilters((p) => ({ ...p, [e.target.name]: e.target.value }));
  const handleReset = () => setFilters({ search: "", category: "", climate: "", season: "", maxBudget: "" });
  const activeCount = Object.values(filters).filter(Boolean).length;

  const CATS = [
    { val: "", label: "All" },
    { val: "adventure",  label: "Adventure",  icon: "🧗" },
    { val: "relaxation", label: "Relaxation", icon: "🏖️" },
    { val: "culture",    label: "Culture",    icon: "🎭" },
    { val: "history",    label: "History",    icon: "🏛️" },
    { val: "nature",     label: "Nature",     icon: "🌿" },
  ];
  const CAT_ICONS  = { adventure:"🧗", relaxation:"🏖️", culture:"🎭", history:"🏛️", nature:"🌿" };
  const CLIM_ICONS = { tropical:"🌴", cold:"❄️", temperate:"🌤️", desert:"🏜️", mixed:"🌈" };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,700;0,900;1,400;1,700&family=DM+Sans:wght@300;400;500;600&display=swap');
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        :root {
          --sand:#F5EFE6; --sand-dark:#EAE0D5;
          --ink:#1C1917; --ink-light:#44403C; --ink-soft:#78716C;
          --terra:#C4552A; --terra-l:#E8724A;
          --gold:#D4A853; --white:#FDFAF7; --bdr:#E7E5E4;
        }
        html,body{ font-family:'DM Sans',sans-serif; background:var(--white); color:var(--ink); }

        /* NAV — warm dark brown, not pure black */
        .xnav{ background:#2D1B0E; padding:16px 48px; display:flex; align-items:center; justify-content:space-between; position:sticky; top:0; z-index:50; border-bottom:1px solid rgba(212,168,83,.2); }
        .xlogo{ font-family:'Playfair Display',serif; font-size:22px; font-weight:900; color:var(--gold); letter-spacing:1px; cursor:pointer; }

        /* HERO */
        .xhero{ background:linear-gradient(160deg,#2D1B0E 0%,#5C3520 50%,#8B4E2F 100%); padding:72px 48px 56px; position:relative; overflow:hidden; }
        .xhero-glow{ position:absolute; width:500px; height:500px; border-radius:50%; background:radial-gradient(circle,rgba(212,168,83,.18) 0%,transparent 70%); top:-120px; right:80px; pointer-events:none; }
        .xhero::after{ content:'Explore'; position:absolute; right:-10px; bottom:-30px; font-family:'Playfair Display',serif; font-size:160px; font-weight:900; font-style:italic; color:rgba(212,168,83,.06); pointer-events:none; white-space:nowrap; line-height:1; }
        .xeyebrow{ font-size:10px; font-weight:700; letter-spacing:4px; text-transform:uppercase; color:var(--gold); margin-bottom:14px; display:flex; align-items:center; gap:8px; }
        .xeyebrow::before{ content:''; width:24px; height:1px; background:var(--gold); display:block; }
        .xhtitle{ font-family:'Playfair Display',serif; font-size:clamp(38px,5vw,64px); font-weight:900; color:#fff; line-height:1.05; margin-bottom:14px; }
        .xhtitle em{ color:var(--gold); font-style:italic; }
        .xhsub{ font-size:15px; color:rgba(255,255,255,.6); font-weight:300; margin-bottom:28px; }
        .xstats{ display:flex; gap:36px; flex-wrap:wrap; }
        .xstat-n{ font-family:'Playfair Display',serif; font-size:28px; font-weight:700; color:var(--gold); line-height:1; }
        .xstat-l{ font-size:10px; color:rgba(255,255,255,.45); text-transform:uppercase; letter-spacing:2px; margin-top:2px; }
        .xfbadge{ display:inline-flex; align-items:center; gap:6px; background:rgba(212,168,83,.2); border:1px solid rgba(212,168,83,.35); color:var(--gold); font-size:11px; font-weight:600; letter-spacing:1px; padding:6px 14px; border-radius:20px; margin-top:20px; }

        /* BODY */
        .xbody{ padding:48px 48px 80px; max-width:1320px; margin:0 auto; }

        /* filter card overrides */
        .filter-hdr{ display:flex; align-items:center; justify-content:space-between; margin-bottom:24px; padding-bottom:20px; border-bottom:1px solid var(--sand-dark); }
        .filter-title{ font-family:'Playfair Display',serif; font-size:20px; font-weight:700; color:var(--ink); display:flex; align-items:center; gap:10px; }
        .filter-row{ display:grid; grid-template-columns:2fr 1fr 1fr 1fr 1fr; gap:14px; align-items:end; }
        .filter-grp{ display:flex; flex-direction:column; gap:6px; }
        .flbl{ font-size:9px !important; font-weight:700 !important; letter-spacing:2.5px !important; text-transform:uppercase !important; color:var(--ink-soft) !important; }
        .fsel{
          padding:0 38px 0 14px; border:1.5px solid var(--bdr); border-radius:10px;
          font-size:13px; font-family:'DM Sans',sans-serif; color:var(--ink);
          background:var(--sand); width:100%; outline:none; height:44px;
          transition:border-color .2s,background .2s,box-shadow .2s;
          appearance:none; line-height:44px;
          background-image:url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='8' viewBox='0 0 12 8'%3E%3Cpath d='M1 1l5 5 5-5' stroke='%2378716C' stroke-width='1.5' fill='none' stroke-linecap='round'/%3E%3C/svg%3E");
          background-repeat:no-repeat; background-position:right 14px center; padding-right:38px; cursor:pointer;
        }
        .fsel:focus{ border-color:var(--gold); background-color:var(--white); box-shadow:0 0 0 3px rgba(212,168,83,.15); }

        /* shadcn Input — fix alignment & style */
        .xbody input[type=text],.xbody input[type=number]{
          background:var(--sand) !important;
          border:1.5px solid var(--bdr) !important;
          font-family:'DM Sans',sans-serif !important;
          font-size:13px !important;
          color:var(--ink) !important;
          height:44px !important;
          border-radius:10px !important;
          padding:0 14px !important;
          line-height:1 !important;
          display:block !important;
        }
        .xbody input[type=text]::placeholder,.xbody input[type=number]::placeholder{
          color:var(--ink-soft) !important;
          opacity:1 !important;
        }
        .xbody input:focus{
          border-color:var(--gold) !important;
          background:var(--white) !important;
          box-shadow:0 0 0 3px rgba(212,168,83,.15) !important;
          outline:none !important;
        }

        /* image category badge — frosted glass */
        .dcat-badge{
          display:inline-flex; align-items:center; gap:5px;
          background:rgba(20,12,6,.72);
          color:var(--gold);
          backdrop-filter:blur(10px);
          -webkit-backdrop-filter:blur(10px);
          border:1px solid rgba(212,168,83,.35);
          font-family:'DM Sans',sans-serif;
          font-size:10px; font-weight:700;
          letter-spacing:1.8px; text-transform:uppercase;
          padding:5px 12px; border-radius:20px;
          box-shadow:0 2px 12px rgba(0,0,0,.3);
        }

        /* chips */
        .chip-row{ display:flex; gap:8px; flex-wrap:wrap; margin-bottom:32px; }

        /* section header */
        .sec-hdr{ display:flex; align-items:center; gap:16px; margin-bottom:28px; }
        .sec-title{ font-family:'Playfair Display',serif; font-size:26px; font-weight:800; color:var(--ink); white-space:nowrap; }
        .sec-line{ flex:1; height:1px; background:var(--bdr); }
        .sec-count{ font-size:10px; color:var(--ink-soft); text-transform:uppercase; letter-spacing:2px; white-space:nowrap; }

        /* cards */
        .cards-grid{ display:grid; grid-template-columns:repeat(auto-fill,minmax(320px,1fr)); gap:24px; }
        .dcard{ cursor:pointer; overflow:hidden; border-radius:22px !important; border:1px solid var(--bdr) !important; transition:transform .3s cubic-bezier(.4,0,.2,1),box-shadow .3s !important; background:var(--white) !important; }
        .dcard:hover{ transform:translateY(-8px) !important; box-shadow:0 28px 60px rgba(28,25,23,.13) !important; }
        .dimg{ height:210px; overflow:hidden; position:relative; background:linear-gradient(135deg,var(--sand),var(--sand-dark)); }
        .dimg img{ width:100%; height:100%; object-fit:cover; transition:transform .6s cubic-bezier(.4,0,.2,1); }
        .dcard:hover .dimg img{ transform:scale(1.08); }
        .dimg-ov{ position:absolute; inset:0; background:linear-gradient(to top,rgba(28,25,23,.5) 0%,transparent 55%); opacity:0; transition:opacity .3s; }
        .dcard:hover .dimg-ov{ opacity:1; }
        .dcat{ position:absolute; top:14px; left:14px; }
        .dnoimg{ width:100%; height:100%; display:flex; align-items:center; justify-content:center; font-size:56px; }
        .dcountry{ font-size:10px; color:var(--terra); letter-spacing:2.5px; text-transform:uppercase; font-weight:700; margin-bottom:8px; display:flex; align-items:center; gap:5px; }
        .dname{ font-family:'Playfair Display',serif; font-size:20px; font-weight:800; color:var(--ink); margin-bottom:8px; line-height:1.2; }
        .ddesc{ font-size:13px; color:var(--ink-soft); line-height:1.7; margin-bottom:18px; font-weight:300; }
        .dfooter{ display:flex; align-items:center; justify-content:space-between; padding-top:14px; border-top:1px solid var(--sand-dark); }
        .dtags{ display:flex; gap:6px; flex-wrap:wrap; }
        .darrow{ width:34px; height:34px; border-radius:50%; background:var(--ink); color:var(--gold); display:flex; align-items:center; justify-content:center; font-size:14px; flex-shrink:0; transition:all .25s; }
        .dcard:hover .darrow{ background:var(--terra); color:#fff; transform:translateX(3px); }

        /* loading / empty */
        .lwrap{ text-align:center; padding:100px 20px; }
        .ltitle{ font-family:'Playfair Display',serif; font-size:24px; font-style:italic; color:var(--ink-soft); margin-bottom:20px; }
        .ldots{ display:flex; gap:8px; justify-content:center; }
        .ld{ width:10px; height:10px; border-radius:50%; background:var(--gold); animation:ld 1.4s ease-in-out infinite; }
        .ld:nth-child(2){ animation-delay:.2s; } .ld:nth-child(3){ animation-delay:.4s; }
        @keyframes ld{0%,80%,100%{transform:scale(.6);opacity:.3}40%{transform:scale(1.2);opacity:1}}
        .ewrap{ text-align:center; padding:80px 24px; border:1.5px dashed var(--bdr); border-radius:24px; background:var(--sand); }
        .eico{ font-size:60px; margin-bottom:20px; opacity:.5; }
        .etitle{ font-family:'Playfair Display',serif; font-size:28px; font-weight:700; color:var(--ink); margin-bottom:8px; }
        .edesc{ font-size:14px; color:var(--ink-soft); font-weight:300; }

        @keyframes fadeUp{from{opacity:0;transform:translateY(20px)}to{opacity:1;transform:translateY(0)}}
        .au{animation:fadeUp .5s ease forwards;}
        .d1{animation-delay:.05s;opacity:0;} .d2{animation-delay:.12s;opacity:0;} .d3{animation-delay:.19s;opacity:0;}
        .cau{animation:fadeUp .45s ease forwards;opacity:0;}

        @media(max-width:768px){
          .xnav{padding:14px 20px;} .xhero{padding:48px 20px 40px;} .xhero::after{display:none;}
          .xbody{padding:28px 20px 60px;} .filter-row{grid-template-columns:1fr 1fr;}
        }
        @media(max-width:520px){ .filter-row{grid-template-columns:1fr;} }
      `}</style>

      <div style={{ background: "var(--white)", minHeight: "100vh" }}>

        {/* NAV */}
        <nav className="xnav">
          <Button variant="outline" onClick={() => navigate(-1)} style={{
            background: "rgba(212,168,83,.12)", border: "1px solid rgba(212,168,83,.25)",
            color: "var(--gold)", fontFamily: "'DM Sans',sans-serif", fontSize: "12px",
            fontWeight: 600, letterSpacing: "1px", textTransform: "uppercase",
            borderRadius: "50px", padding: "9px 20px", height: "auto",
          }}>
            ← Back
          </Button>
          <span className="xlogo" onClick={() => navigate("/")}>TravelX</span>
        </nav>

        {/* HERO */}
        <div className="xhero">
          <div className="xhero-glow" />
          <div style={{ position: "relative", zIndex: 1 }}>
            <div className="xeyebrow">Destination Discovery</div>
            <h1 className="xhtitle">Find your next<br /><em>great escape</em></h1>
            <p className="xhsub">Curated destinations handpicked for every kind of traveller</p>
            <div className="xstats">
              {[{ n: destinations.length, l: "Destinations" }, { n: 5, l: "Categories" }, { n: "12+", l: "Countries" }].map((s) => (
                <div key={s.l}><div className="xstat-n">{s.n}</div><div className="xstat-l">{s.l}</div></div>
              ))}
            </div>
            {activeCount > 0 && (
              <div className="xfbadge">✦ {activeCount} filter{activeCount > 1 ? "s" : ""} active — {destinations.length} result{destinations.length !== 1 ? "s" : ""}</div>
            )}
          </div>
        </div>

        <div className="xbody">

          {/* FILTER CARD */}
          <Card className="au d1" style={{ borderRadius: "24px", marginBottom: "32px", background: "var(--white)", border: "1px solid var(--bdr)", boxShadow: "0 4px 24px rgba(28,25,23,.08)" }}>
            <CardContent style={{ padding: "32px" }}>
              <div className="filter-hdr">
                <div className="filter-title">
                  Refine Results
                  {activeCount > 0 && (
                    <Badge style={{ background: "var(--terra)", color: "#fff", fontFamily: "'DM Sans',sans-serif", fontSize: "10px", borderRadius: "20px", padding: "2px 10px", border: "none" }}>
                      {activeCount} active
                    </Badge>
                  )}
                </div>
                {activeCount > 0 && (
                  <Button variant="ghost" onClick={handleReset} style={{ color: "var(--ink-soft)", fontFamily: "'DM Sans',sans-serif", fontSize: "12px", height: "auto", padding: "4px 8px" }}>
                    ✕ Clear all
                  </Button>
                )}
              </div>
              <div className="filter-row">
                <div className="filter-grp">
                  <Label className="flbl">Search</Label>
                  <Input type="text" name="search" value={filters.search} placeholder="Search destinations..." onChange={handleChange} />
                </div>
                {[
                  { name: "category", label: "Category", opts: [["","All Categories"],["adventure","🧗 Adventure"],["relaxation","🏖️ Relaxation"],["culture","🎭 Culture"],["history","🏛️ History"],["nature","🌿 Nature"]] },
                  { name: "climate",  label: "Climate",  opts: [["","All Climates"],["tropical","🌴 Tropical"],["cold","❄️ Cold"],["temperate","🌤️ Temperate"],["desert","🏜️ Desert"],["mixed","🌈 Mixed"]] },
                  { name: "season",   label: "Best Season", opts: [["","Any Season"],["spring","🌸 Spring"],["summer","☀️ Summer"],["autumn","🍂 Autumn"],["winter","❄️ Winter"],["all","✦ All Year"]] },
                ].map((f) => (
                  <div key={f.name} className="filter-grp">
                    <Label className="flbl">{f.label}</Label>
                    <select name={f.name} value={filters[f.name]} onChange={handleChange} className="fsel">
                      {f.opts.map(([v, l]) => <option key={v} value={v}>{l}</option>)}
                    </select>
                  </div>
                ))}
                <div className="filter-grp">
                  <Label className="flbl">Max Budget (₹)</Label>
                  <Input type="number" name="maxBudget" value={filters.maxBudget} placeholder="₹ Max" onChange={handleChange} />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* CHIPS */}
          <div className="chip-row au d2">
            {CATS.map((c) => (
              <Button key={c.val} onClick={() => setFilters((f) => ({ ...f, category: c.val }))}
                style={{
                  borderRadius: "50px", fontFamily: "'DM Sans',sans-serif", fontSize: "12px", fontWeight: 600,
                  height: "auto", padding: "8px 18px",
                  background: filters.category === c.val ? "var(--ink)" : "var(--white)",
                  color: filters.category === c.val ? "var(--gold)" : "var(--ink-soft)",
                  border: `1.5px solid ${filters.category === c.val ? "var(--ink)" : "var(--bdr)"}`,
                  transition: "all .2s",
                }}>
                {c.icon && <span style={{ marginRight: "4px" }}>{c.icon}</span>}{c.label}
              </Button>
            ))}
          </div>

          {/* SECTION HEADER */}
          <div className="sec-hdr au d3">
            <h2 className="sec-title">Destinations</h2>
            <div className="sec-line" />
            <span className="sec-count">{destinations.length} found</span>
          </div>

          {/* RESULTS */}
          {loading ? (
            <div className="lwrap">
              <p className="ltitle">Discovering destinations...</p>
              <div className="ldots"><div className="ld" /><div className="ld" /><div className="ld" /></div>
            </div>
          ) : destinations.length === 0 ? (
            <div className="ewrap">
              <div className="eico">🔍</div>
              <p className="etitle">No destinations found</p>
              <p className="edesc">Try adjusting your filters or clearing the search</p>
            </div>
          ) : (
            <div className="cards-grid">
              {destinations.map((dest, i) => (
                <Card key={dest.id} className="dcard cau" style={{ animationDelay: `${i * 0.06}s` }} onClick={() => navigate(`/destinations/${dest.id}`)}>
                  <div className="dimg">
                    {dest.image_url ? <img src={dest.image_url} alt={dest.name} /> : <div className="dnoimg">🌍</div>}
                    <div className="dimg-ov" />
                    {dest.category && (
                      <div className="dcat">
                        <span className="dcat-badge">
                          {CAT_ICONS[dest.category] || "✦"} {dest.category}
                        </span>
                      </div>
                    )}
                  </div>
                  <CardContent style={{ padding: "22px 24px" }}>
                    <div className="dcountry"><span>📍</span><span>{dest.country}</span></div>
                    <h3 className="dname">{dest.name}</h3>
                    <p className="ddesc">{dest.description?.slice(0, 90)}{dest.description?.length > 90 ? "..." : ""}</p>
                    <div className="dfooter">
                      <div className="dtags">
                        {dest.climate && (
                          <Badge variant="outline" style={{ fontFamily: "'DM Sans',sans-serif", fontSize: "10px", textTransform: "uppercase", letterSpacing: "0.8px", color: "var(--ink-soft)", borderColor: "var(--bdr)", background: "var(--sand)", borderRadius: "20px" }}>
                            {CLIM_ICONS[dest.climate] || "🌡"} {dest.climate}
                          </Badge>
                        )}
                        {dest.best_season && (
                          <Badge variant="outline" style={{ fontFamily: "'DM Sans',sans-serif", fontSize: "10px", textTransform: "uppercase", letterSpacing: "0.8px", color: "var(--gold)", borderColor: "#E8D5B0", background: "#FDF8EF", borderRadius: "20px" }}>
                            ✦ {dest.best_season}
                          </Badge>
                        )}
                        {dest.budget_estimate && (
                          <Badge variant="outline" style={{ fontFamily: "'DM Sans',sans-serif", fontSize: "10px", textTransform: "uppercase", letterSpacing: "0.8px", color: "var(--terra)", borderColor: "#EDD0C4", background: "#FDF1EC", borderRadius: "20px" }}>
                            ₹ {dest.budget_estimate}
                          </Badge>
                        )}
                      </div>
                      <div className="darrow">→</div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default Explore;