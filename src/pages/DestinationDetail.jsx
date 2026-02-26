import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

const DestinationDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [destination, setDestination] = useState(null);
  const [places, setPlaces] = useState([]);
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("overview");
  const [selectedPlaces, setSelectedPlaces] = useState([]);
  const [selectedActivities, setSelectedActivities] = useState([]);
  const [selectedCulinary, setSelectedCulinary] = useState([]);
  const [culinary, setCulinary] = useState([]);
  const [saving, setSaving] = useState(false);
  const [tripCreated, setTripCreated] = useState(false);

  useEffect(() => {
    const fetchAll = async () => {
      try {
        const token = sessionStorage.getItem("token");
        const headers = { Authorization: `Bearer ${token}` };
        const [destRes, placesRes, activitiesRes, culinaryRes] = await Promise.all([
          fetch(`http://localhost:5000/api/destinations/${id}`, { headers }),
          fetch(`http://localhost:5000/api/places/${id}`, { headers }),
          fetch(`http://localhost:5000/api/activities/destination/${id}`, { headers }),
          fetch(`http://localhost:5000/api/culinary/${id}`, { headers }),
        ]);
        const destData = await destRes.json();
        const placesData = await placesRes.json();
        const activitiesData = await activitiesRes.json();
        const culinaryData = await culinaryRes.json();

        setDestination(Array.isArray(destData) ? destData[0] : destData);
        setPlaces(Array.isArray(placesData) ? placesData : []);
        setActivities(Array.isArray(activitiesData) ? activitiesData : []);
        setCulinary(Array.isArray(culinaryData) ? culinaryData : []);
      } catch (err) {
        console.error("Error fetching destination:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchAll();
  }, [id]);

  const togglePlace = (place) => setSelectedPlaces((prev) => prev.find((p) => p.id === place.id) ? prev.filter((p) => p.id !== place.id) : [...prev, place]);
  const toggleActivity = (activity) => setSelectedActivities((prev) => prev.find((a) => a.id === activity.id) ? prev.filter((a) => a.id !== activity.id) : [...prev, activity]);
  const toggleCulinary = (item) => setSelectedCulinary((prev) => prev.find((c) => c.id === item.id) ? prev.filter((c) => c.id !== item.id) : [...prev, item]);

  const activityCost = selectedActivities.reduce((sum, a) => sum + (a.estimated_cost || 0), 0);
  const culinaryCost = selectedCulinary.reduce((sum, c) => sum + (c.avg_price || 0), 0);
  const placeCost = selectedPlaces.reduce((sum, p) => sum + (p.entry_fee || 0), 0);
  const baseBudget = (destination?.estimated_flight_cost || 0) + (destination?.estimated_stay_cost || 0) + (destination?.estimated_food_cost || 0);
  const totalBudget = baseBudget + activityCost + culinaryCost + placeCost;

  // ✅ FIXED: clean single function, reads token fresh, navigates to trip detail
  const handleAddToTrip = async () => {
    setSaving(true);
    try {
      const token = sessionStorage.getItem("token");
      if (!token) {
        alert("You must be logged in to create a trip!");
        setSaving(false);
        return;
      }
      const hdrs = { "Content-Type": "application/json", Authorization: `Bearer ${token}` };

      // Step 1: Create trip
      const tripRes = await fetch("http://localhost:5000/api/trips", {
        method: "POST",
        headers: hdrs,
        body: JSON.stringify({
          name: `Trip to ${destination.name}`,
          status: "planned",
          total_budget: totalBudget,
          destination_id: destination.id,
        }),
      });
      const tripData = await tripRes.json();
      const tripId = tripData?.id || tripData?.[0]?.id;
      if (!tripId) throw new Error("Trip creation failed");

      // Step 2: Save selected places
      for (const place of selectedPlaces) {
        await fetch("http://localhost:5000/api/trip-items/places", {
          method: "POST",
          headers: hdrs,
          body: JSON.stringify({ trip_id: tripId, place_id: place.id }),
        });
      }

      // Step 3: Save selected activities
      for (const activity of selectedActivities) {
        await fetch("http://localhost:5000/api/trip-items/activities", {
          method: "POST",
          headers: hdrs,
          body: JSON.stringify({ trip_id: tripId, activity_id: activity.id }),
        });
      }

      // Step 4: Save selected culinary
      for (const item of selectedCulinary) {
        await fetch("http://localhost:5000/api/trip-items/culinary", {
          method: "POST",
          headers: hdrs,
          body: JSON.stringify({ trip_id: tripId, culinary_id: item.id }),
        });
      }

      setTripCreated(true);
      // ✅ Navigate to trip detail page (not dashboard) so user sees their selections
      setTimeout(() => navigate(`/trips/${tripId}`), 1500);
    } catch (err) {
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  if (loading) return (
    <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh", color: "#64748b" }}>
      <div style={{ textAlign: "center" }}><div style={{ fontSize: "48px", marginBottom: "16px" }}>🌍</div><p>Loading destination...</p></div>
    </div>
  );

  if (!destination) return (
    <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh" }}>
      <div style={{ textAlign: "center" }}>
        <div style={{ fontSize: "48px" }}>😕</div>
        <p>Destination not found</p>
        <button onClick={() => navigate(-1)} style={btnStyle}>Go Back</button>
      </div>
    </div>
  );

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;700;900&family=Lato:wght@300;400;700&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body { font-family: 'Lato', sans-serif; }
        .detail-hero { position: relative; height: 70vh; min-height: 400px; overflow: hidden; }
        .hero-img { width: 100%; height: 100%; object-fit: cover; filter: brightness(0.6); }
        .hero-placeholder { width: 100%; height: 100%; background: linear-gradient(135deg, #0f172a, #1e3a5f); display: flex; align-items: center; justify-content: center; font-size: 120px; }
        .hero-overlay { position: absolute; bottom: 0; left: 0; right: 0; padding: 40px; background: linear-gradient(transparent, rgba(0,0,0,0.8)); color: #fff; }
        .hero-back { position: absolute; top: 24px; left: 24px; background: rgba(255,255,255,0.2); border: 1px solid rgba(255,255,255,0.3); color: #fff; padding: 8px 16px; border-radius: 50px; cursor: pointer; font-size: 14px; backdrop-filter: blur(10px); }
        .hero-back:hover { background: rgba(255,255,255,0.3); }
        .detail-tabs { display: flex; gap: 0; border-bottom: 1px solid #e2e8f0; background: #fff; position: sticky; top: 0; z-index: 10; overflow-x: auto; }
        .tab-btn { padding: 16px 24px; border: none; background: none; font-size: 14px; font-weight: 600; color: #64748b; cursor: pointer; white-space: nowrap; border-bottom: 3px solid transparent; transition: all 0.2s; font-family: 'Lato', sans-serif; }
        .tab-btn.active { color: #0f172a; border-bottom-color: #f59e0b; }
        .tab-btn:hover { color: #0f172a; }
        .detail-content { max-width: 1100px; margin: 0 auto; padding: 40px 24px 120px; }
        .info-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(180px, 1fr)); gap: 16px; margin-bottom: 40px; }
        .info-card { background: #f8fafc; border-radius: 12px; padding: 20px; text-align: center; border: 1px solid #e2e8f0; }
        .places-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap: 20px; }
        .place-card { background: #fff; border-radius: 16px; overflow: hidden; box-shadow: 0 2px 8px rgba(0,0,0,0.08); transition: transform 0.2s, box-shadow 0.2s; }
        .place-card:hover { transform: translateY(-4px); box-shadow: 0 8px 24px rgba(0,0,0,0.12); }
        .activities-list { display: grid; grid-template-columns: repeat(auto-fill, minmax(300px, 1fr)); gap: 16px; }
        .activity-card { background: #fff; border-radius: 12px; padding: 20px; box-shadow: 0 2px 8px rgba(0,0,0,0.06); transition: transform 0.2s; }
        .activity-card:hover { transform: translateY(-2px); }
        @media (max-width: 768px) { .detail-hero { height: 50vh; } .hero-overlay { padding: 20px; } .detail-content { padding: 24px 16px 120px; } }
      `}</style>

      <div style={{ background: "#f8fafc", minHeight: "100vh" }}>
        <div className="detail-hero">
          {destination.image_url ? <img src={destination.image_url} alt={destination.name} className="hero-img" /> : <div className="hero-placeholder">🌍</div>}
          <button className="hero-back" onClick={() => navigate("/dashboard")}>← Back</button>
          <div className="hero-overlay">
            <div style={{ display: "flex", gap: "8px", marginBottom: "12px", flexWrap: "wrap" }}>
              {destination.category && <span style={heroTag}>{destination.category}</span>}
              {destination.country && <span style={heroTag}>📍 {destination.country}</span>}
            </div>
            <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: "clamp(28px, 5vw, 52px)", fontWeight: "900", color: "#fff", marginBottom: "8px" }}>{destination.name}</h1>
            {destination.budget_estimate && <p style={{ color: "#fcd34d", fontSize: "16px", fontWeight: "600" }}>💰 Estimated Budget: ${destination.budget_estimate}</p>}
          </div>
        </div>

        <div className="detail-tabs">
          {[
            { id: "overview", label: "Overview" },
            { id: "places", label: `Places (${places.length})` },
            { id: "activities", label: `Activities (${activities.length})` },
            { id: "culinary", label: `Culinary (${culinary.length})` },
            { id: "reviews", label: "Reviews" },
          ].map((tab) => (
            <button key={tab.id} className={`tab-btn ${activeTab === tab.id ? "active" : ""}`} onClick={() => setActiveTab(tab.id)}>{tab.label}</button>
          ))}
        </div>

        <div className="detail-content">
          {activeTab === "overview" && (
            <div>
              <div className="info-grid">
                {destination.country && <div className="info-card"><div style={{ fontSize: "28px", marginBottom: "8px" }}>🌍</div><div style={{ fontSize: "11px", color: "#94a3b8", textTransform: "uppercase", letterSpacing: "1px", marginBottom: "4px" }}>Country</div><div style={{ fontWeight: "700", color: "#0f172a" }}>{destination.country}</div></div>}
                {destination.category && <div className="info-card"><div style={{ fontSize: "28px", marginBottom: "8px" }}>🏷️</div><div style={{ fontSize: "11px", color: "#94a3b8", textTransform: "uppercase", letterSpacing: "1px", marginBottom: "4px" }}>Category</div><div style={{ fontWeight: "700", color: "#0f172a" }}>{destination.category}</div></div>}
                {destination.budget_estimate && <div className="info-card"><div style={{ fontSize: "28px", marginBottom: "8px" }}>💰</div><div style={{ fontSize: "11px", color: "#94a3b8", textTransform: "uppercase", letterSpacing: "1px", marginBottom: "4px" }}>Est. Budget</div><div style={{ fontWeight: "700", color: "#0f172a" }}>${destination.budget_estimate}</div></div>}
                {destination.best_time_to_visit && <div className="info-card"><div style={{ fontSize: "28px", marginBottom: "8px" }}>📅</div><div style={{ fontSize: "11px", color: "#94a3b8", textTransform: "uppercase", letterSpacing: "1px", marginBottom: "4px" }}>Best Time</div><div style={{ fontWeight: "700", color: "#0f172a" }}>{destination.best_time_to_visit}</div></div>}
                <div className="info-card"><div style={{ fontSize: "28px", marginBottom: "8px" }}>📍</div><div style={{ fontSize: "11px", color: "#94a3b8", textTransform: "uppercase", letterSpacing: "1px", marginBottom: "4px" }}>Places</div><div style={{ fontWeight: "700", color: "#0f172a" }}>{places.length} spots</div></div>
                <div className="info-card"><div style={{ fontSize: "28px", marginBottom: "8px" }}>🎯</div><div style={{ fontSize: "11px", color: "#94a3b8", textTransform: "uppercase", letterSpacing: "1px", marginBottom: "4px" }}>Activities</div><div style={{ fontWeight: "700", color: "#0f172a" }}>{activities.length} things to do</div></div>
              </div>
              {destination.description && (
                <div style={{ background: "#fff", borderRadius: "16px", padding: "32px", marginBottom: "32px", boxShadow: "0 2px 8px rgba(0,0,0,0.06)" }}>
                  <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: "24px", marginBottom: "16px", color: "#0f172a" }}>About {destination.name}</h2>
                  <p style={{ lineHeight: "1.8", color: "#475569", fontSize: "16px" }}>{destination.description}</p>
                </div>
              )}
              {places.length > 0 && (
                <div>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
                    <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: "22px", color: "#0f172a" }}>Top Places</h2>
                    <button onClick={() => setActiveTab("places")} style={{ background: "none", border: "none", color: "#f59e0b", fontWeight: "600", cursor: "pointer", fontSize: "14px" }}>View all →</button>
                  </div>
                  <div className="places-grid">{places.slice(0, 3).map((place) => <PlaceCard key={place.id} place={place} />)}</div>
                </div>
              )}
            </div>
          )}

          {activeTab === "places" && (
            <div>
              <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: "28px", marginBottom: "24px", color: "#0f172a" }}>Places to Visit</h2>
              {places.length === 0 ? <EmptyState icon="📍" text="No places added yet." /> : (
                <div className="places-grid">
                  {places.map((place) => {
                    const selected = selectedPlaces.find((p) => p.id === place.id);
                    return (
                      <div key={place.id} className="place-card" onClick={() => togglePlace(place)} style={{ border: selected ? "2px solid #f59e0b" : "2px solid transparent", cursor: "pointer" }}>
                        <div style={{ height: "180px", overflow: "hidden", background: "#f1f5f9", position: "relative" }}>
                          {place.image_url ? <img src={place.image_url} alt={place.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} /> : <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "48px" }}>📍</div>}
                          {selected && <div style={{ position: "absolute", top: "8px", right: "8px", background: "#f59e0b", borderRadius: "50%", width: "28px", height: "28px", display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontWeight: "bold" }}>✓</div>}
                        </div>
                        <div style={{ padding: "16px" }}>
                          <h3 style={{ fontSize: "16px", fontWeight: "700", color: "#0f172a", marginBottom: "6px" }}>{place.name}</h3>
                          {place.description && <p style={{ fontSize: "13px", color: "#64748b", lineHeight: "1.5", marginBottom: "10px" }}>{place.description?.slice(0, 100)}...</p>}
                          {place.entry_fee > 0 && <span style={placeTag}>💰 Entry: ₹{place.entry_fee}</span>}
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
              <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: "28px", marginBottom: "24px", color: "#0f172a" }}>Things to Do</h2>
              {activities.length === 0 ? <EmptyState icon="🎯" text="No activities added yet." /> : (
                <div className="activities-list">
                  {activities.map((activity) => {
                    const selected = selectedActivities.find((a) => a.id === activity.id);
                    return (
                      <div key={activity.id} className="activity-card" onClick={() => toggleActivity(activity)} style={{ borderLeft: selected ? "4px solid #10b981" : "4px solid #f59e0b", cursor: "pointer", position: "relative" }}>
                        {selected && <div style={{ position: "absolute", top: "12px", right: "12px", background: "#10b981", borderRadius: "50%", width: "24px", height: "24px", display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontSize: "12px", fontWeight: "bold" }}>✓</div>}
                        <h3 style={{ fontSize: "16px", fontWeight: "700", color: "#0f172a", marginBottom: "8px" }}>{activity.name}</h3>
                        {activity.description && <p style={{ fontSize: "14px", color: "#64748b", lineHeight: "1.6", marginBottom: "12px" }}>{activity.description}</p>}
                        <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
                          {activity.type && <span style={actTag}>{activity.type}</span>}
                          {activity.duration_hours && <span style={actTag}>⏱ {activity.duration_hours}hrs</span>}
                          {activity.estimated_cost > 0 && <span style={{ ...actTag, background: "#dcfce7", color: "#166534" }}>💰 ₹{activity.estimated_cost}</span>}
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
              <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: "28px", marginBottom: "24px", color: "#0f172a" }}>🍽️ Local Cuisine</h2>
              {culinary.length === 0 ? <EmptyState icon="🍽️" text="No culinary data added yet." /> : (
                <div className="places-grid">
                  {culinary.map((item) => {
                    const selected = selectedCulinary.find((c) => c.id === item.id);
                    return (
                      <div key={item.id} className="place-card" onClick={() => toggleCulinary(item)} style={{ border: selected ? "2px solid #f59e0b" : "2px solid transparent", cursor: "pointer" }}>
                        <div style={{ height: "160px", overflow: "hidden", background: "#fef3c7", position: "relative" }}>
                          {item.image_url ? <img src={item.image_url} alt={item.dish_name} style={{ width: "100%", height: "100%", objectFit: "cover" }} /> : <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "48px" }}>🍽️</div>}
                          {selected && <div style={{ position: "absolute", top: "8px", right: "8px", background: "#f59e0b", borderRadius: "50%", width: "28px", height: "28px", display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontWeight: "bold" }}>✓</div>}
                        </div>
                        <div style={{ padding: "16px" }}>
                          <h3 style={{ fontSize: "16px", fontWeight: "700", color: "#0f172a", marginBottom: "6px" }}>{item.dish_name}</h3>
                          {item.description && <p style={{ fontSize: "13px", color: "#64748b", lineHeight: "1.5", marginBottom: "8px" }}>{item.description}</p>}
                          {item.avg_price && <span style={{ ...actTag, background: "#dcfce7", color: "#166534" }}>💰 ₹{item.avg_price}</span>}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {activeTab === "reviews" && (
            <div>
              <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: "28px", marginBottom: "24px", color: "#0f172a" }}>Traveler Reviews</h2>
              <EmptyState icon="⭐" text="No reviews yet. Be the first to review!" />
            </div>
          )}
        </div>

        {/* Trip Created Toast */}
        {tripCreated && (
          <div style={{ position: "fixed", top: "20px", right: "20px", background: "#10b981", color: "#fff", padding: "16px 20px", borderRadius: "10px", fontWeight: "600", zIndex: 200, display: "flex", gap: "12px", alignItems: "center" }}>
            ✅ Trip created successfully!
            <button onClick={() => navigate("/dashboard")} style={{ background: "#fff", color: "#10b981", border: "none", padding: "6px 12px", borderRadius: "6px", fontWeight: "600", cursor: "pointer" }}>
              View My Trips
            </button>
          </div>
        )}

        {/* Budget Panel */}
        <div style={{ position: "fixed", bottom: 0, left: 0, right: 0, background: "#fff", borderTop: "1px solid #e2e8f0", padding: "16px 24px", display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "12px", zIndex: 100, boxShadow: "0 -4px 12px rgba(0,0,0,0.08)" }}>
          <div style={{ display: "flex", gap: "24px", flexWrap: "wrap" }}>
            {[
              { label: "Base", value: `₹${baseBudget.toLocaleString()}`, color: "#0f172a" },
              { label: "Activities", value: `+₹${activityCost.toLocaleString()}`, color: "#10b981" },
              { label: "Places", value: `+₹${placeCost.toLocaleString()}`, color: "#10b981" },
              { label: "Culinary", value: `+₹${culinaryCost.toLocaleString()}`, color: "#10b981" },
            ].map((item) => (
              <div key={item.label} style={{ textAlign: "center" }}>
                <div style={{ fontSize: "11px", color: "#94a3b8", textTransform: "uppercase", letterSpacing: "1px" }}>{item.label}</div>
                <div style={{ fontWeight: "700", color: item.color }}>{item.value}</div>
              </div>
            ))}
            <div style={{ textAlign: "center", borderLeft: "1px solid #e2e8f0", paddingLeft: "24px" }}>
              <div style={{ fontSize: "11px", color: "#94a3b8", textTransform: "uppercase", letterSpacing: "1px" }}>Total Budget</div>
              <div style={{ fontWeight: "800", color: "#f59e0b", fontSize: "18px" }}>₹{totalBudget.toLocaleString()}</div>
            </div>
          </div>
          <button onClick={handleAddToTrip} disabled={saving}
            style={{ background: "linear-gradient(135deg, #f59e0b, #ef4444)", color: "#fff", border: "none", padding: "14px 28px", borderRadius: "50px", fontSize: "15px", fontWeight: "700", cursor: saving ? "not-allowed" : "pointer", opacity: saving ? 0.7 : 1 }}>
            {saving ? "Saving..." : "+ Add to My Trip"}
          </button>
        </div>
      </div>
    </>
  );
};

const PlaceCard = ({ place }) => (
  <div className="place-card">
    <div style={{ height: "180px", overflow: "hidden", background: "#f1f5f9" }}>
      {place.image_url ? <img src={place.image_url} alt={place.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} /> : <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "48px" }}>📍</div>}
    </div>
    <div style={{ padding: "16px" }}>
      <h3 style={{ fontSize: "16px", fontWeight: "700", color: "#0f172a", marginBottom: "6px" }}>{place.name}</h3>
      {place.description && <p style={{ fontSize: "13px", color: "#64748b", lineHeight: "1.5", marginBottom: "10px" }}>{place.description?.slice(0, 100)}...</p>}
      <div style={{ display: "flex", gap: "6px", flexWrap: "wrap" }}>{place.type && <span style={placeTag}>{place.type}</span>}</div>
    </div>
  </div>
);

const EmptyState = ({ icon, text }) => (
  <div style={{ textAlign: "center", padding: "60px 20px", color: "#94a3b8" }}>
    <div style={{ fontSize: "48px", marginBottom: "12px" }}>{icon}</div>
    <p style={{ fontSize: "16px" }}>{text}</p>
  </div>
);

const heroTag = { background: "rgba(255,255,255,0.2)", color: "#fff", padding: "4px 12px", borderRadius: "20px", fontSize: "13px", backdropFilter: "blur(10px)" };
const placeTag = { background: "#e0f2fe", color: "#0369a1", padding: "2px 8px", borderRadius: "20px", fontSize: "11px", fontWeight: "500" };
const actTag = { background: "#fef3c7", color: "#92400e", padding: "3px 10px", borderRadius: "20px", fontSize: "12px", fontWeight: "500" };
const btnStyle = { backgroundColor: "#0f172a", color: "#fff", border: "none", padding: "10px 24px", borderRadius: "8px", cursor: "pointer", marginTop: "16px" };

export default DestinationDetail;