import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import OverviewTab from "../components/destination/OverviewTab";
import PlacesTab from "../components/destination/PlacesTab";
import ActivitiesTab from "../components/destination/ActivitiesTab";
import CulinaryTab from "../components/destination/CulinaryTab";
import ReviewsTab from "../components/destination/ReviewsTab";
import axiosInstance from "../services/axiosInstance";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { number } from "zod";

const DestinationDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [destination, setDestination] = useState(null);
  const [places, setPlaces]           = useState([]);
  const [activities, setActivities]   = useState([]);
  const [culinary, setCulinary]       = useState([]);
  const [loading, setLoading]         = useState(true);
  const [selectedPlaces, setSelectedPlaces]         = useState([]);
  const [selectedActivities, setSelectedActivities] = useState([]);
  const [selectedCulinary, setSelectedCulinary]     = useState([]);
  const [saving, setSaving]       = useState(false);
  const [tripCreated, setTripCreated] = useState(false);
  const [error, setError]         = useState("");
  const [activeTab, setActiveTab] = useState("overview");

  useEffect(() => {
    const fetchAll = async () => {
      try {
        const destRes = await axiosInstance.get(`/destinations/${id}`);
        setDestination(Array.isArray(destRes.data) ? destRes.data[0] : destRes.data);
        try { const r = await axiosInstance.get(`/places/destination/${id}`);     setPlaces(Array.isArray(r.data) ? r.data : r.data.places || []); }     catch { setPlaces([]); }
        try { const r = await axiosInstance.get(`/activities/destination/${id}`); setActivities(Array.isArray(r.data) ? r.data : r.data.activities || []); } catch { setActivities([]); }
        try { const r = await axiosInstance.get(`/culinary/destination/${id}`);   setCulinary(Array.isArray(r.data) ? r.data : r.data.culinary || []); }   catch { setCulinary([]); }
      } catch { setError("Failed to load destination details"); }
      finally { setLoading(false); }
    };
    fetchAll();
  }, [id]);

  const toggle = (setter) => (itemId) =>
    setter((prev) => prev.includes(itemId) ? prev.filter((x) => x !== itemId) : [...prev, itemId]);

  const activityCost = selectedActivities.reduce((s, id) => s + (activities.find((a) => a.id === id)?.estimated_cost || 0), 0);
  const culinaryCost = selectedCulinary.reduce((s, id)   => s + (culinary.find((c)   => c.id === id)?.avg_price      || 0), 0);
  const placeCost    = selectedPlaces.reduce((s, id)     => s + (places.find((p)     => p.id === id)?.entry_fee      || 0), 0);
  const baseBudget   = (destination?.estimated_flight_cost || 0) + (destination?.estimated_stay_cost || 0) + (destination?.estimated_food_cost || 0);
  const totalBudget  = baseBudget + activityCost + culinaryCost + placeCost;
  const totalSelected = selectedPlaces.length + selectedActivities.length + selectedCulinary.length;

  const handleAddToTrip = async () => {
    setSaving(true);
    try {
      const tripRes = await axiosInstance.post("/trips", { destination_id: destination.id, total_budget: totalBudget, status: "planned",name:`Trip to ${destination.name}`,number_of_days:1 });
      const tripId = tripRes.data?.id || tripRes.data?.trip?.id;
      if (!tripId) throw new Error("Trip creation failed");
      for (const placeId    of selectedPlaces)     await axiosInstance.post(`/trips/${tripId}/places`,     { place_id:    placeId    });
      for (const activityId of selectedActivities) await axiosInstance.post(`/trips/${tripId}/activities`, { activity_id: activityId });
      for (const culinaryId of selectedCulinary)   await axiosInstance.post(`/trips/${tripId}/culinary`,  { culinary_id: culinaryId });
      setTripCreated(true);
      setTimeout(() => navigate(`/trips/${tripId}`), 1500);
    } catch { alert("Failed to create trip. Please try again."); }
    finally { setSaving(false); }
  };

  // ── Loading state ─────────────────────────────────────────────────────────
  if (loading) return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,700;0,900;1,400&family=DM+Sans:wght@300;400;500;600&display=swap');
        *{box-sizing:border-box;margin:0;padding:0;} body{font-family:'DM Sans',sans-serif;}
        @keyframes ld{0%,80%,100%{transform:scale(.6);opacity:.3}40%{transform:scale(1.2);opacity:1}}
      `}</style>
      <div style={{ display:"flex", justifyContent:"center", alignItems:"center", height:"100vh", background:"#FDFAF7", flexDirection:"column", gap:"20px", fontFamily:"'DM Sans',sans-serif" }}>
        <div style={{ fontSize:"64px" }}>🌍</div>
        <p style={{ fontFamily:"'Playfair Display',serif", fontSize:"22px", fontStyle:"italic", color:"#78716C" }}>Loading destination...</p>
        <div style={{ display:"flex", gap:"8px" }}>
          {[0,.2,.4].map((d,i)=><div key={i} style={{ width:"10px",height:"10px",borderRadius:"50%",background:"#D4A853",animation:`ld 1.4s ${d}s ease-in-out infinite` }}/>)}
        </div>
      </div>
    </>
  );

  if (!destination) return (
    <div style={{ display:"flex", justifyContent:"center", alignItems:"center", height:"100vh", background:"#FDFAF7", flexDirection:"column", gap:"16px", fontFamily:"'DM Sans',sans-serif" }}>
      <div style={{ fontSize:"56px" }}>😕</div>
      <p style={{ fontFamily:"'Playfair Display',serif", fontSize:"24px", color:"#1C1917" }}>Destination not found</p>
      {error && <p style={{ color:"#C4552A", fontSize:"14px" }}>{error}</p>}
      <Button onClick={() => navigate("/dashboard")} style={{ background:"#1C1917", color:"#D4A853", border:"none", padding:"12px 28px", borderRadius:"50px", fontFamily:"'DM Sans',sans-serif", fontWeight:600, height:"auto" }}>
        Go to Dashboard
      </Button>
    </div>
  );

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,700;0,900;1,400;1,700&family=DM+Sans:wght@300;400;500;600&display=swap');
        *, *::before, *::after { box-sizing:border-box; margin:0; padding:0; }
        :root{
          --sand:#F5EFE6; --sand-dark:#EAE0D5;
          --ink:#1C1917; --ink-light:#44403C; --ink-soft:#78716C;
          --terra:#C4552A; --terra-l:#E8724A;
          --gold:#D4A853; --white:#FDFAF7; --bdr:#E7E5E4;
        }
        html,body{ font-family:'DM Sans',sans-serif; background:var(--white); color:var(--ink); }

        /* HERO */
        .ddhero{ position:relative; height:72vh; min-height:440px; overflow:hidden; }
        .ddhimg{ width:100%; height:100%; object-fit:cover; transition:transform 8s ease; transform:scale(1.05); }
        .ddhero:hover .ddhimg{ transform:scale(1); }
        .ddhnone{ width:100%; height:100%; background:linear-gradient(160deg,#2D1B0E,#5C3520,#C4552A); display:flex; align-items:center; justify-content:center; font-size:120px; }
        .ddhgrad{ position:absolute; inset:0; background:linear-gradient(to bottom,rgba(28,25,23,.1) 0%,transparent 30%,transparent 50%,rgba(28,25,23,.85) 100%); }
        .ddhcontent{ position:absolute; bottom:0; left:0; right:0; padding:48px 56px; }
        .ddhbadges{ display:flex; gap:8px; margin-bottom:16px; flex-wrap:wrap; }
        .ddhtitle{ font-family:'Playfair Display',serif; font-size:clamp(36px,6vw,72px); font-weight:900; color:#fff; line-height:1.0; margin-bottom:12px; text-shadow:0 2px 20px rgba(0,0,0,.3); }
        .ddhmeta{ display:flex; align-items:center; gap:20px; flex-wrap:wrap; }
        .ddhmeta-item{ font-size:13px; color:rgba(255,255,255,.7); display:flex; align-items:center; gap:6px; }

        /* TABS — override shadcn to match TravelX style */
        .dd-tabs-wrap{
          background:var(--white);
          border-bottom:1px solid var(--bdr);
          position:sticky; top:0; z-index:40;
          padding:0 56px;
          box-shadow:0 2px 12px rgba(28,25,23,.06);
          overflow-x:auto;
        }
        .dd-tabs-wrap [role=tablist]{
          background:transparent !important;
          border-radius:0 !important;
          padding:0 !important;
          gap:0 !important;
          height:auto !important;
          display:flex;
          width:100%;
        }
        .dd-tabs-wrap [role=tab]{
          font-family:'DM Sans',sans-serif !important;
          font-size:13px !important;
          font-weight:600 !important;
          color:var(--ink-soft) !important;
          background:transparent !important;
          border-radius:0 !important;
          border-bottom:2.5px solid transparent !important;
          padding:18px 4px !important;
          margin-right:32px !important;
          white-space:nowrap !important;
          transition:all .2s !important;
          box-shadow:none !important;
          height:auto !important;
        }
        .dd-tabs-wrap [role=tab]:hover{ color:var(--ink) !important; }
        .dd-tabs-wrap [role=tab][data-state=active]{
          color:var(--ink) !important;
          border-bottom-color:var(--terra) !important;
          background:transparent !important;
        }
        .ddtab-count{
          display:inline-flex; align-items:center; justify-content:center;
          background:var(--sand); color:var(--ink-soft);
          font-size:10px; font-weight:700;
          padding:2px 7px; border-radius:10px; margin-left:7px;
          transition:all .2s;
        }
        [role=tab][data-state=active] .ddtab-count{ background:var(--terra); color:#fff; }

        /* CONTENT */
        .ddcontent{ max-width:1140px; margin:0 auto; padding:48px 56px 160px; }

        /* BUDGET BAR */
        .ddbbar{
          position:fixed; bottom:0; left:0; right:0;
          background:linear-gradient(135deg, #2D1B0E 0%, #4A2410 60%, #5C3520 100%);
          border-top:2px solid rgba(212,168,83,.2);
          box-shadow:0 -8px 40px rgba(28,25,23,.35);
          z-index:100; padding:14px 40px;
          display:flex; align-items:center; justify-content:space-between; gap:16px; flex-wrap:wrap;
        }
        .dbbitem{ text-align:center; }
        .dbblbl{ font-size:9px; color:rgba(255,255,255,.4); text-transform:uppercase; letter-spacing:1.5px; font-weight:600; margin-bottom:3px; font-family:'DM Sans',sans-serif; }
        .dbbval{ font-size:15px; font-weight:700; color:rgba(255,255,255,.9); font-family:'DM Sans',sans-serif; }
        .dbbval-g{ font-size:15px; font-weight:700; color:#6EE7B7; font-family:'DM Sans',sans-serif; }
        .dbbdiv{ width:1px; height:36px; background:rgba(255,255,255,.1); margin:0 4px; }
        .dbbtotal-lbl{ font-size:9px; color:rgba(255,255,255,.4); text-transform:uppercase; letter-spacing:1.5px; font-weight:600; margin-bottom:3px; font-family:'DM Sans',sans-serif; }
        .dbbtotal-val{ font-family:'Playfair Display',serif; font-size:26px; font-weight:900; color:var(--gold); line-height:1; }

        /* TOAST */
        .ddtoast{
          position:fixed; top:24px; right:24px;
          background:#16a34a; color:#fff;
          padding:16px 24px; border-radius:14px;
          font-weight:600; z-index:200;
          display:flex; gap:14px; align-items:center;
          box-shadow:0 8px 28px rgba(0,0,0,.2);
          font-family:'DM Sans',sans-serif;
          animation:toastIn .35s ease;
        }
        @keyframes toastIn{from{opacity:0;transform:translateY(-16px)}to{opacity:1;transform:translateY(0)}}
        @keyframes fadeUp{from{opacity:0;transform:translateY(20px)}to{opacity:1;transform:translateY(0)}}
        .au{animation:fadeUp .45s ease forwards;}

        @media(max-width:768px){
          .ddhero{height:55vh;} .ddhcontent{padding:28px 24px;}
          .dd-tabs-wrap{padding:0 20px;} .ddcontent{padding:28px 20px 160px;}
          .ddbbar{padding:14px 20px;}
        }
      `}</style>

      <div style={{ background: "var(--white)", minHeight: "100vh" }}>

        {/* TOAST */}
        {tripCreated && (
          <div className="ddtoast">
            ✅ Trip created successfully!
            <Button onClick={() => navigate("/dashboard")} style={{ background:"#fff", color:"#16a34a", border:"none", padding:"6px 14px", borderRadius:"8px", fontWeight:700, fontFamily:"'DM Sans',sans-serif", fontSize:"13px", height:"auto" }}>
              View My Trips
            </Button>
          </div>
        )}

        {/* HERO */}
        <div className="ddhero">
          {destination.image_url
            ? <img src={destination.image_url} alt={destination.name} className="ddhimg" />
            : <div className="ddhnone">🌍</div>
          }
          <div className="ddhgrad" />
          <Button onClick={() => navigate(-1)} style={{
            position:"absolute", top:28, left:28,
            background:"rgba(28,25,23,.55)", color:"#fff",
            backdropFilter:"blur(12px)", border:"1px solid rgba(255,255,255,.2)",
            padding:"10px 20px", borderRadius:"50px", fontSize:"13px", fontWeight:600,
            fontFamily:"'DM Sans',sans-serif", height:"auto",
          }}>
            ← Back
          </Button>
          <div className="ddhcontent">
            <div className="ddhbadges">
              {destination.category && (
                <Badge style={{ background:"rgba(255,255,255,.15)", color:"#fff", backdropFilter:"blur(10px)", border:"1px solid rgba(255,255,255,.2)", fontFamily:"'DM Sans',sans-serif", fontSize:"12px", fontWeight:500, borderRadius:"20px" }}>
                  {destination.category}
                </Badge>
              )}
              {destination.country && (
                <Badge style={{ background:"rgba(255,255,255,.15)", color:"#fff", backdropFilter:"blur(10px)", border:"1px solid rgba(255,255,255,.2)", fontFamily:"'DM Sans',sans-serif", fontSize:"12px", fontWeight:500, borderRadius:"20px" }}>
                  📍 {destination.country}
                </Badge>
              )}
              {destination.best_season && (
                <Badge style={{ background:"rgba(212,168,83,.25)", color:"var(--gold)", border:"1px solid rgba(212,168,83,.4)", fontFamily:"'DM Sans',sans-serif", fontSize:"12px", fontWeight:500, borderRadius:"20px" }}>
                  ✦ Best in {destination.best_season}
                </Badge>
              )}
            </div>
            <h1 className="ddhtitle">{destination.name}</h1>
            <div className="ddhmeta">
              {destination.climate && <div className="ddhmeta-item">🌡 {destination.climate} climate</div>}
              <div className="ddhmeta-item">📍 {places.length} places</div>
              <div className="ddhmeta-item">🎯 {activities.length} activities</div>
              <div className="ddhmeta-item">🍽️ {culinary.length} culinary picks</div>
            </div>
          </div>
        </div>

        {/* TABS */}
        <div className="dd-tabs-wrap">
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList>
              <TabsTrigger value="overview">✦ Overview</TabsTrigger>
              <TabsTrigger value="places">
                📍 Places <span className="ddtab-count">{places.length}</span>
              </TabsTrigger>
              <TabsTrigger value="activities">
                🎯 Activities <span className="ddtab-count">{activities.length}</span>
              </TabsTrigger>
              <TabsTrigger value="culinary">
                🍽️ Culinary <span className="ddtab-count">{culinary.length}</span>
              </TabsTrigger>
              <TabsTrigger value="reviews">⭐ Reviews</TabsTrigger>
            </TabsList>

            <div className="ddcontent au">
              <TabsContent value="overview">
                <OverviewTab destination={destination} places={places} activities={activities} setActiveTab={setActiveTab} />
              </TabsContent>
              <TabsContent value="places">
                <PlacesTab places={places} selectedPlaces={selectedPlaces} togglePlace={toggle(setSelectedPlaces)} />
              </TabsContent>
              <TabsContent value="activities">
                <ActivitiesTab activities={activities} selectedActivities={selectedActivities} toggleActivity={toggle(setSelectedActivities)} />
              </TabsContent>
              <TabsContent value="culinary">
                {/* ✅ FIXED: was toggle(setCulinary), now toggle(setSelectedCulinary) */}
                <CulinaryTab culinary={culinary} selectedCulinary={selectedCulinary} toggleCulinary={toggle(setSelectedCulinary)} />
              </TabsContent>
              <TabsContent value="reviews">
                <ReviewsTab destinationId={id} />
              </TabsContent>
            </div>
          </Tabs>
        </div>

        {/* BUDGET BAR */}
        <div className="ddbbar">
          <div style={{ display:"flex", gap:"20px", flexWrap:"wrap", alignItems:"center" }}>
            {[
              { label:"Flight",     val: destination?.estimated_flight_cost || 0, green: false },
              { label:"Stay",       val: destination?.estimated_stay_cost   || 0, green: false },
              { label:"Food",       val: destination?.estimated_food_cost   || 0, green: false },
              { label:"Activities", val: activityCost, green: true },
              { label:"Places",     val: placeCost,    green: true },
              { label:"Culinary",   val: culinaryCost, green: true },
            ].map((item) => (
              <div key={item.label} className="dbbitem">
                <div className="dbblbl">{item.label}</div>
                <div className={item.green ? "dbbval-g" : "dbbval"}>
                  {item.green ? "+" : ""}₹{item.val.toLocaleString()}
                </div>
              </div>
            ))}
            <div className="dbbdiv" />
            <div>
              <div className="dbbtotal-lbl">Total Budget</div>
              <div className="dbbtotal-val">₹{totalBudget.toLocaleString()}</div>
            </div>
          </div>

          <Button
            onClick={handleAddToTrip}
            disabled={saving}
            style={{
              background: "var(--terra)", color: "#fff", border: "none",
              padding: "14px 32px", borderRadius: "50px",
              fontSize: "14px", fontWeight: 700,
              fontFamily: "'DM Sans',sans-serif", height: "auto",
              boxShadow: "0 4px 20px rgba(196,85,42,.35)",
              display: "flex", alignItems: "center", gap: "8px",
              opacity: saving ? 0.7 : 1,
              transition: "all .25s",
            }}
          >
            {saving ? "Creating trip..." : (
              <>
                + Add to My Trip
                {totalSelected > 0 && (
                  <Badge style={{ background: "var(--ink)", color: "var(--gold)", fontFamily: "'DM Sans',sans-serif", fontSize: "11px", fontWeight: 700, padding: "3px 8px", borderRadius: "12px", border: "none" }}>
                    {totalSelected}
                  </Badge>
                )}
              </>
            )}
          </Button>
        </div>
      </div>
    </>
  );
};

const navBtnStyle = { background: "rgba(255,255,255,0.15)", border: "1px solid rgba(255,255,255,0.3)", color: "#fff", padding: "8px 16px", borderRadius: "50px", cursor: "pointer", fontSize: "14px", backdropFilter: "blur(10px)" };
const statusBtnStyle = (bg) => ({ background: bg, border: "none", color: "#fff", padding: "4px 12px", borderRadius: "20px", fontSize: "12px", fontWeight: "600", cursor: "pointer" });

export default DestinationDetail;