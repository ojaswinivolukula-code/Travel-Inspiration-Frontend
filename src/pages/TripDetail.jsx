import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axiosInstance from "../services/axiosInstance";

// ─── Share Modal ──────────────────────────────────────────────────────────────
const ShareModal = ({ trip, details, onClose, onShared }) => {
  const [sharing, setSharing] = useState(false);
  const [visibility, setVisibility] = useState("public");

  const totalItems = details.places.length + details.activities.length + details.culinary.length;
  const content = [
    `🧳 Trip: ${trip?.name || "My Trip"}`,
    trip?.status ? `📌 Status: ${trip.status}` : "",
    totalItems > 0 ? `✅ ${totalItems} items planned (${details.places.length} places, ${details.activities.length} activities, ${details.culinary.length} culinary)` : "",
    trip?.total_budget ? `💰 Budget: ₹${Number(trip.total_budget).toLocaleString()}` : "",
  ].filter(Boolean).join("\n");

  const handleShare = async () => {
    setSharing(true);
    try {
      await axiosInstance.post("/posts", {
        title: `Trip: ${trip?.name || "My Trip"}`,
        content,
        trip_id: trip?.id,
        visibility,
      });
      onShared();
      onClose();
    } catch (err) {
      console.error(err);
    } finally {
      setSharing(false);
    }
  };

  return (
    <div style={{
      position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)",
      zIndex: 10000, display: "flex", alignItems: "center", justifyContent: "center", padding: "20px",
    }}>
      <div style={{
        background: "white", borderRadius: "20px", padding: "32px",
        maxWidth: "480px", width: "100%", boxShadow: "0 16px 48px rgba(0,0,0,0.2)",
        fontFamily: "'Lato', sans-serif",
      }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "20px" }}>
          <h3 style={{ fontSize: "20px", fontWeight: "800", color: "#0f172a", fontFamily: "'Playfair Display', serif" }}>
            🌍 Share to Community
          </h3>
          <button onClick={onClose} style={{ background: "none", border: "none", fontSize: "20px", cursor: "pointer", color: "#94a3b8" }}>✕</button>
        </div>

        {/* Preview */}
        <div style={{ background: "#f8fafc", borderRadius: "12px", padding: "16px", marginBottom: "20px", border: "1px solid #e2e8f0" }}>
          <div style={{ fontSize: "13px", fontWeight: "700", color: "#0f172a", marginBottom: "8px" }}>
            {trip?.name || "My Trip"}
          </div>
          <div style={{ fontSize: "12px", color: "#64748b", lineHeight: "1.8", whiteSpace: "pre-line" }}>
            {content}
          </div>
        </div>

        <div style={{ marginBottom: "20px" }}>
          <label style={{ display: "block", fontSize: "11px", fontWeight: "700", color: "#64748b", textTransform: "uppercase", letterSpacing: "1px", marginBottom: "8px" }}>
            Who can see this?
          </label>
          <div style={{ display: "flex", gap: "8px" }}>
            {[
              { val: "public", label: "🌍 Public" },
              { val: "followers", label: "👥 Followers" },
              { val: "private", label: "🔒 Private" },
            ].map((opt) => (
              <button key={opt.val} onClick={() => setVisibility(opt.val)} style={{
                flex: 1, padding: "9px 6px", borderRadius: "8px", border: "1.5px solid",
                borderColor: visibility === opt.val ? "#1e40af" : "#e2e8f0",
                background: visibility === opt.val ? "#eff6ff" : "#fff",
                color: visibility === opt.val ? "#1e40af" : "#64748b",
                fontSize: "12px", fontWeight: "600", cursor: "pointer", fontFamily: "'Lato', sans-serif",
              }}>{opt.label}</button>
            ))}
          </div>
        </div>

        <div style={{ display: "flex", gap: "12px" }}>
          <button onClick={onClose} style={{
            flex: 1, padding: "12px", background: "#f1f5f9", border: "none",
            borderRadius: "10px", fontWeight: "600", cursor: "pointer", color: "#475569", fontFamily: "'Lato', sans-serif",
          }}>Cancel</button>
          <button onClick={handleShare} disabled={sharing} style={{
            flex: 2, padding: "12px",
            background: "linear-gradient(135deg, #1e40af, #3b82f6)",
            border: "none", borderRadius: "10px", fontWeight: "700", cursor: "pointer",
            color: "white", fontSize: "14px", fontFamily: "'Lato', sans-serif",
            opacity: sharing ? 0.7 : 1,
          }}>
            {sharing ? "Sharing..." : "🚀 Share Now"}
          </button>
        </div>
      </div>
    </div>
  );
};

// ─── Main ─────────────────────────────────────────────────────────────────────
const TripDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [trip, setTrip] = useState(null);
  const [details, setDetails] = useState({ places: [], activities: [], culinary: [] });
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("places");
  const [showShare, setShowShare] = useState(false);
  const [shareToast, setShareToast] = useState(false);

  useEffect(() => {
    const fetchTripDetails = async () => {
      try {
        const res = await axiosInstance.get(`/trips/${id}/details`);
        const data = res.data;
        setTrip(data.trip || null);
        setDetails({ places: data.places || [], activities: data.activities || [], culinary: data.culinary || [] });
      } catch (err) {
        console.error("Error fetching trip details:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchTripDetails();
  }, [id]);

  const handleStatusUpdate = async (newStatus) => {
    try {
      await axiosInstance.patch(`/trips/${id}/status`, { status: newStatus });
      const res = await axiosInstance.get(`/trips/${id}/details`);
      setTrip(res.data.trip || null);
    } catch (err) {
      console.error("Status update failed:", err);
    }
  };

  const handleShared = () => {
    setShareToast(true);
    setTimeout(() => setShareToast(false), 3500);
  };

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

        @keyframes toastIn { from{opacity:0;transform:translateY(20px)}to{opacity:1;transform:translateY(0)} }
      `}</style>

      {/* Toast */}
      {shareToast && (
        <div style={{
          position: "fixed", bottom: "24px", right: "24px", zIndex: 9999,
          background: "#16a34a", color: "white", padding: "12px 20px",
          borderRadius: "10px", fontSize: "14px", fontWeight: "600",
          boxShadow: "0 4px 16px rgba(0,0,0,0.18)", animation: "toastIn .3s ease",
          fontFamily: "'Lato', sans-serif",
        }}>
          ✅ Shared to Community!
        </div>
      )}

      {/* Share Modal */}
      {showShare && (
        <ShareModal
          trip={trip}
          details={details}
          onClose={() => setShowShare(false)}
          onShared={handleShared}
        />
      )}

      <div style={{ background: "#f8fafc", minHeight: "100vh" }}>
        {/* Header */}
        <div style={{ background: "linear-gradient(135deg, #0f172a, #1e3a5f)", padding: "32px 24px", color: "#fff" }}>
          <div style={{ display: "flex", gap: "12px", marginBottom: "20px", flexWrap: "wrap" }}>
            <button onClick={() => navigate("/dashboard")} style={navBtnStyle}>🏠 Dashboard</button>
            <button onClick={() => navigate("/dashboard", { state: { tab: "trips" } })} style={navBtnStyle}>🧳 My Trips</button>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: "16px", flexWrap: "wrap" }}>
            <div style={{ fontSize: "48px" }}>🧳</div>
            <div style={{ flex: 1 }}>
              <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: "clamp(24px, 4vw, 36px)", fontWeight: "900", marginBottom: "8px" }}>
                {trip?.name || "My Trip"}
              </h1>
              <div style={{ display: "flex", gap: "12px", flexWrap: "wrap", alignItems: "center" }}>
                <span style={{ background: trip?.status === "completed" ? "#10b981" : "#f59e0b", color: "#fff", padding: "4px 12px", borderRadius: "20px", fontSize: "12px", fontWeight: "600" }}>
                  {trip?.status || "planned"}
                </span>
                {trip?.status === "planned" && (
                  <button onClick={() => handleStatusUpdate("ongoing")} style={statusBtnStyle("#3b82f6")}>🚀 Mark as Ongoing</button>
                )}
                {trip?.status === "ongoing" && (
                  <button onClick={() => handleStatusUpdate("completed")} style={statusBtnStyle("#10b981")}>✅ Mark as Completed</button>
                )}
                {trip?.status === "completed" && (
                  <button onClick={() => navigate(`/review/${trip.destination_id}`)} style={statusBtnStyle("#8b5cf6")}>✍️ Write a Review</button>
                )}
                {trip?.total_budget && (
                  <span style={{ color: "#fcd34d", fontSize: "15px", fontWeight: "600" }}>
                    💰 ₹{Number(trip.total_budget).toLocaleString()}
                  </span>
                )}
                <span style={{ color: "#94a3b8", fontSize: "13px" }}>{totalItems} items</span>

                {/* ✅ Share to Community button */}
                <button onClick={() => setShowShare(true)} style={{
                  background: "linear-gradient(135deg, #f59e0b, #ef4444)",
                  border: "none", color: "#fff", padding: "6px 16px",
                  borderRadius: "20px", fontSize: "12px", fontWeight: "700",
                  cursor: "pointer", fontFamily: "'Lato', sans-serif", letterSpacing: "0.3px",
                }}>
                  🌍 Share to Community
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="trip-tabs">
          {[
            { id: "places",     label: `📍 Places (${details.places.length})` },
            { id: "activities", label: `🎯 Activities (${details.activities.length})` },
            { id: "culinary",   label: `🍽️ Culinary (${details.culinary.length})` },
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
              <h2 style={sectionTitle}>Selected Places</h2>
              {details.places.length === 0 ? <EmptyState icon="📍" text="No places selected for this trip." /> : (
                <div className="items-grid">
                  {details.places.map((item) => {
                    const place = item.places || item;
                    return (
                      <div key={item.id} className="item-card">
                        <div style={{ height: "180px", overflow: "hidden", background: "#f1f5f9" }}>
                          {place.image_url
                            ? <img src={place.image_url} alt={place.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                            : <div style={imgPlaceholder}>📍</div>}
                        </div>
                        <div style={{ padding: "16px" }}>
                          <h3 style={cardTitle}>{place.name}</h3>
                          {place.description && <p style={cardDesc}>{place.description?.slice(0, 100)}...</p>}
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
              <h2 style={sectionTitle}>Selected Activities</h2>
              {details.activities.length === 0 ? <EmptyState icon="🎯" text="No activities selected for this trip." /> : (
                <div className="activities-grid">
                  {details.activities.map((item) => {
                    const activity = item.activities || item;
                    return (
                      <div key={item.id} className="activity-item">
                        <h3 style={{ ...cardTitle, marginBottom: "8px" }}>{activity.name}</h3>
                        {activity.description && <p style={{ ...cardDesc, marginBottom: "12px" }}>{activity.description}</p>}
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
              <h2 style={sectionTitle}>Selected Cuisine</h2>
              {details.culinary.length === 0 ? <EmptyState icon="🍽️" text="No culinary items selected for this trip." /> : (
                <div className="items-grid">
                  {details.culinary.map((item) => {
                    const food = item.culinary || item;
                    return (
                      <div key={item.id} className="item-card">
                        <div style={{ height: "160px", overflow: "hidden", background: "#fef3c7" }}>
                          {food.image_url
                            ? <img src={food.image_url} alt={food.dish_name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                            : <div style={imgPlaceholder}>🍽️</div>}
                        </div>
                        <div style={{ padding: "16px" }}>
                          <h3 style={cardTitle}>{food.dish_name}</h3>
                          {food.description && <p style={cardDesc}>{food.description}</p>}
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

const navBtnStyle = { background: "rgba(255,255,255,0.15)", border: "1px solid rgba(255,255,255,0.3)", color: "#fff", padding: "8px 16px", borderRadius: "50px", cursor: "pointer", fontSize: "14px", backdropFilter: "blur(10px)" };
const statusBtnStyle = (bg) => ({ background: bg, border: "none", color: "#fff", padding: "4px 12px", borderRadius: "20px", fontSize: "12px", fontWeight: "600", cursor: "pointer" });
const sectionTitle = { fontFamily: "'Playfair Display', serif", fontSize: "24px", marginBottom: "20px", color: "#0f172a" };
const cardTitle = { fontSize: "16px", fontWeight: "700", color: "#0f172a", marginBottom: "6px" };
const cardDesc = { fontSize: "13px", color: "#64748b", lineHeight: "1.5", marginBottom: "10px" };
const imgPlaceholder = { width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "48px" };
const tagStyle = { background: "#e0f2fe", color: "#0369a1", padding: "3px 10px", borderRadius: "20px", fontSize: "12px", fontWeight: "500" };

const EmptyState = ({ icon, text }) => (
  <div style={{ textAlign: "center", padding: "60px 20px", color: "#94a3b8" }}>
    <div style={{ fontSize: "48px", marginBottom: "12px" }}>{icon}</div>
    <p style={{ fontSize: "16px" }}>{text}</p>
  </div>
);

export default TripDetail;