import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

const TripDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [trip, setTrip] = useState(null);
  const [details, setDetails] = useState({ places: [], activities: [], culinary: [] });
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("places");

  const token = sessionStorage.getItem("token");
  const headers = { Authorization: `Bearer ${token}` };

 useEffect(() => {
  const fetchTripDetails = async () => {
    try {
      const token = sessionStorage.getItem("token"); // ✅ read fresh
      if (!token) return;
      const headers = { Authorization: `Bearer ${token}` }; // ✅ define here
      const res = await fetch(`http://localhost:5000/api/trips/${id}/details`, { headers });
      const data = await res.json();
      console.log("TRIP DETAILS:", data);
      setTrip(data.trip || null);
      setDetails({
        places: data.places || [],
        activities: data.activities || [],
        culinary: data.culinary || [],
      });
    } catch (err) {
      console.error("Error fetching trip details:", err);
    } finally {
      setLoading(false);
    }
  };
  fetchTripDetails();
}, [id]);

  if (loading) return (
    <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh", color: "#64748b" }}>
      <div style={{ textAlign: "center" }}>
        <div style={{ fontSize: "48px", marginBottom: "16px" }}>🧳</div>
        <p>Loading trip details...</p>
      </div>
    </div>
  );

  const totalItems = details.places.length + details.activities.length + details.culinary.length;

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;700;900&family=Lato:wght@300;400;700&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body { font-family: 'Lato', sans-serif; }
        .trip-tabs { display: flex; border-bottom: 1px solid #e2e8f0; background: #fff; position: sticky; top: 0; z-index: 10; overflow-x: auto; }
        .trip-tab-btn { padding: 14px 24px; border: none; background: none; font-size: 14px; font-weight: 600; color: #64748b; cursor: pointer; white-space: nowrap; border-bottom: 3px solid transparent; transition: all 0.2s; font-family: 'Lato', sans-serif; }
        .trip-tab-btn.active { color: #0f172a; border-bottom-color: #1e40af; }
        .trip-tab-btn:hover { color: #0f172a; }
        .items-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap: 20px; }
        .item-card { background: #fff; border-radius: 16px; overflow: hidden; box-shadow: 0 2px 8px rgba(0,0,0,0.08); }
        .activity-item { background: #fff; border-radius: 12px; padding: 20px; box-shadow: 0 2px 8px rgba(0,0,0,0.06); border-left: 4px solid #1e40af; }
        .activities-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(300px, 1fr)); gap: 16px; }
      `}</style>

      <div style={{ background: "#f8fafc", minHeight: "100vh" }}>

        {/* Header */}
        <div style={{ background: "linear-gradient(135deg, #0f172a, #1e3a5f)", padding: "32px 24px", color: "#fff" }}>
          
          {/* ✅ Two navigation buttons */}
          <div style={{ display: "flex", gap: "12px", marginBottom: "20px", flexWrap: "wrap" }}>
            <button onClick={() => navigate("/dashboard")}
              style={{ background: "rgba(255,255,255,0.15)", border: "1px solid rgba(255,255,255,0.3)", color: "#fff", padding: "8px 16px", borderRadius: "50px", cursor: "pointer", fontSize: "14px", backdropFilter: "blur(10px)" }}>
              🏠 Dashboard
            </button>
            <button onClick={() => navigate("/dashboard", { state: { tab: "trips" } })}
              style={{ background: "rgba(255,255,255,0.15)", border: "1px solid rgba(255,255,255,0.3)", color: "#fff", padding: "8px 16px", borderRadius: "50px", cursor: "pointer", fontSize: "14px", backdropFilter: "blur(10px)" }}>
              🧳 My Trips
            </button>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: "16px", flexWrap: "wrap" }}>
            <div style={{ fontSize: "48px" }}>🧳</div>
            <div>
              <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: "clamp(24px, 4vw, 36px)", fontWeight: "900", marginBottom: "8px" }}>
                {trip?.name || "My Trip"}
              </h1>
              <div style={{ display: "flex", gap: "12px", flexWrap: "wrap", alignItems: "center" }}>
                <span style={{ background: trip?.status === "completed" ? "#10b981" : "#f59e0b", color: "#fff", padding: "4px 12px", borderRadius: "20px", fontSize: "12px", fontWeight: "600" }}>
                  {trip?.status || "planned"}
                </span>
                {trip?.total_budget && (
                  <span style={{ color: "#fcd34d", fontSize: "15px", fontWeight: "600" }}>
                    💰 Total Budget: ₹{Number(trip.total_budget).toLocaleString()}
                  </span>
                )}
                <span style={{ color: "#94a3b8", fontSize: "13px" }}>
                  {totalItems} items selected
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="trip-tabs">
          {[
            { id: "places", label: `📍 Places (${details.places.length})` },
            { id: "activities", label: `🎯 Activities (${details.activities.length})` },
            { id: "culinary", label: `🍽️ Culinary (${details.culinary.length})` },
          ].map((tab) => (
            <button key={tab.id} className={`trip-tab-btn ${activeTab === tab.id ? "active" : ""}`} onClick={() => setActiveTab(tab.id)}>
              {tab.label}
            </button>
          ))}
        </div>

        {/* Content */}
        <div style={{ maxWidth: "1100px", margin: "0 auto", padding: "32px 24px" }}>

          {activeTab === "places" && (
            <div>
              <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: "24px", marginBottom: "20px", color: "#0f172a" }}>Selected Places</h2>
              {details.places.length === 0 ? <EmptyState icon="📍" text="No places selected for this trip." /> : (
                <div className="items-grid">
                  {details.places.map((item) => {
                    const place = item.places || item;
                    return (
                      <div key={item.id} className="item-card">
                        <div style={{ height: "180px", overflow: "hidden", background: "#f1f5f9" }}>
                          {place.image_url ? <img src={place.image_url} alt={place.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} /> : <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "48px" }}>📍</div>}
                        </div>
                        <div style={{ padding: "16px" }}>
                          <h3 style={{ fontSize: "16px", fontWeight: "700", color: "#0f172a", marginBottom: "6px" }}>{place.name}</h3>
                          {place.description && <p style={{ fontSize: "13px", color: "#64748b", lineHeight: "1.5", marginBottom: "10px" }}>{place.description?.slice(0, 100)}...</p>}
                          <div style={{ display: "flex", gap: "6px", flexWrap: "wrap" }}>
                            {place.type && <span style={tagStyle}>{place.type}</span>}
                            {place.entry_fee > 0 && <span style={{ ...tagStyle, background: "#dcfce7", color: "#166534" }}>💰 ₹{place.entry_fee}</span>}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {activeTab === "activities" && (
            <div>
              <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: "24px", marginBottom: "20px", color: "#0f172a" }}>Selected Activities</h2>
              {details.activities.length === 0 ? <EmptyState icon="🎯" text="No activities selected for this trip." /> : (
                <div className="activities-grid">
                  {details.activities.map((item) => {
                    const activity = item.activities || item;
                    return (
                      <div key={item.id} className="activity-item">
                        <h3 style={{ fontSize: "16px", fontWeight: "700", color: "#0f172a", marginBottom: "8px" }}>{activity.name}</h3>
                        {activity.description && <p style={{ fontSize: "14px", color: "#64748b", lineHeight: "1.6", marginBottom: "12px" }}>{activity.description}</p>}
                        <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
                          {activity.type && <span style={tagStyle}>{activity.type}</span>}
                          {activity.duration_hours && <span style={tagStyle}>⏱ {activity.duration_hours}hrs</span>}
                          {activity.estimated_cost > 0 && <span style={{ ...tagStyle, background: "#dcfce7", color: "#166534" }}>💰 ₹{activity.estimated_cost}</span>}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {activeTab === "culinary" && (
            <div>
              <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: "24px", marginBottom: "20px", color: "#0f172a" }}>Selected Cuisine</h2>
              {details.culinary.length === 0 ? <EmptyState icon="🍽️" text="No culinary items selected for this trip." /> : (
                <div className="items-grid">
                  {details.culinary.map((item) => {
                    const food = item.culinary || item;
                    return (
                      <div key={item.id} className="item-card">
                        <div style={{ height: "160px", overflow: "hidden", background: "#fef3c7" }}>
                          {food.image_url ? <img src={food.image_url} alt={food.dish_name} style={{ width: "100%", height: "100%", objectFit: "cover" }} /> : <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "48px" }}>🍽️</div>}
                        </div>
                        <div style={{ padding: "16px" }}>
                          <h3 style={{ fontSize: "16px", fontWeight: "700", color: "#0f172a", marginBottom: "6px" }}>{food.dish_name}</h3>
                          {food.description && <p style={{ fontSize: "13px", color: "#64748b", lineHeight: "1.5", marginBottom: "8px" }}>{food.description}</p>}
                          {food.avg_price && <span style={{ ...tagStyle, background: "#dcfce7", color: "#166534" }}>💰 ₹{food.avg_price}</span>}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </>
  );
};

const EmptyState = ({ icon, text }) => (
  <div style={{ textAlign: "center", padding: "60px 20px", color: "#94a3b8" }}>
    <div style={{ fontSize: "48px", marginBottom: "12px" }}>{icon}</div>
    <p style={{ fontSize: "16px" }}>{text}</p>
  </div>
);

const tagStyle = { background: "#e0f2fe", color: "#0369a1", padding: "3px 10px", borderRadius: "20px", fontSize: "12px", fontWeight: "500" };

export default TripDetail;