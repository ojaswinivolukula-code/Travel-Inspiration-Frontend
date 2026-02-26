import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Dashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location=useLocation();
  const [destinations, setDestinations] = useState([]);
  const [places, setPlaces] = useState([]);
  const [trips, setTrips] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState( location.state?.tab||"discover");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [confirmDeleteId, setConfirmDeleteId] = useState(null);
  const token = sessionStorage.getItem("token");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const headers = { Authorization: `Bearer ${token}` };
        const [destRes, placeRes, tripsRes] = await Promise.all([
          fetch("http://localhost:5000/api/destinations", { headers }),
          fetch("http://localhost:5000/api/places", { headers }),
          fetch("http://localhost:5000/api/trips/my", { headers }),
        ]);
        const destJson = await destRes.json();
        const placeJson = await placeRes.json();
        const tripsJson = await tripsRes.json();
        setDestinations(
          Array.isArray(destJson) ? destJson : destJson.data || [],
        );
        setPlaces(Array.isArray(placeJson) ? placeJson : placeJson.data || []);
        setTrips(Array.isArray(tripsJson) ? tripsJson : tripsJson.data || []);
      } catch (err) {
        console.error("Error fetching data:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // ✅ DELETE TRIP FUNCTION
  const handleDeleteTrip = async (e, tripId) => {
    e.stopPropagation();
    if (confirmDeleteId !== tripId) {
      setConfirmDeleteId(tripId); // first click: show confirm UI
      return;
    }
    // second click: actually delete
    try {
      const headers = { Authorization: `Bearer ${token}` };
      await fetch(`http://localhost:5000/api/trips/${tripId}`, {
        method: "DELETE",
        headers,
      });
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

  const navItems = [
    { id: "discover", icon: "🗺️", label: "Discover" },
    { id: "destinations", icon: "📍", label: "Destinations" },
    { id: "trips", icon: "🧳", label: "My Trips" },
    { id: "journal", icon: "📖", label: "Journal" },
    { id: "community", icon: "👥", label: "Community" },
    { id: "deals", icon: "💰", label: "Deals" },
  ];

  const handleNavClick = (id) => {
    setActiveTab(id);
    setSidebarOpen(false);
  };

  return (
    <>
      <style>{`
        * { box-sizing: border-box; }
        body { margin: 0; }
        .travelx-sidebar { width: 220px; background-color: #0f172a; color: #fff; display: flex; flex-direction: column; padding: 24px 16px; position: fixed; height: 100vh; top: 0; left: -220px; z-index: 50; transition: left 0.3s ease; overflow-y: auto; }
        .travelx-sidebar.open { left: 0; }
        .travelx-overlay { display: none; position: fixed; inset: 0; background: rgba(0,0,0,0.5); z-index: 40; }
        .travelx-overlay.open { display: block; }
        .travelx-mobile-header { display: flex; align-items: center; justify-content: space-between; background-color: #0f172a; color: #fff; padding: 12px 16px; position: sticky; top: 0; z-index: 30; }
        .travelx-bottom-nav { display: flex; justify-content: space-around; background-color: #0f172a; padding: 8px 0 12px; position: sticky; bottom: 0; z-index: 30; }
        .travelx-main { margin-left: 0; padding: 16px; flex: 1; }
        .stats-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 12px; margin-bottom: 24px; }
        .cards-grid { display: grid; grid-template-columns: 1fr; gap: 16px; }
        @media (min-width: 480px) { .cards-grid { grid-template-columns: repeat(2, 1fr); } }
        @media (min-width: 768px) {
          .travelx-sidebar { left: 0 !important; }
          .travelx-mobile-header { display: none; }
          .travelx-bottom-nav { display: none; }
          .travelx-main { margin-left: 220px; padding: 32px; }
          .stats-grid { grid-template-columns: repeat(4, 1fr); }
          .cards-grid { grid-template-columns: repeat(3, 1fr); }
        }
        .nav-btn { display: flex; align-items: center; gap: 12px; padding: 10px 12px; border-radius: 8px; border: none; background: transparent; color: #94a3b8; font-size: 14px; cursor: pointer; text-align: left; width: 100%; transition: all 0.2s; }
        .nav-btn:hover { background: rgba(255,255,255,0.05); color: #fff; }
        .nav-btn.active { background: #1e40af; color: #fff; }
        .dest-card { background: #fff; border-radius: 12px; overflow: hidden; box-shadow: 0 1px 3px rgba(0,0,0,0.08); cursor: pointer; transition: transform 0.2s, box-shadow 0.2s; }
        .dest-card:hover { transform: translateY(-2px); box-shadow: 0 4px 12px rgba(0,0,0,0.12); }
        .bottom-nav-btn { background: none; border: none; cursor: pointer; display: flex; flex-direction: column; align-items: center; gap: 2px; font-size: 10px; padding: 4px 6px; min-width: 44px; }
        .trip-card { background: #fff; border-radius: 12px; overflow: hidden; box-shadow: 0 1px 3px rgba(0,0,0,0.08); cursor: pointer; transition: transform 0.2s, box-shadow 0.2s; }
        .trip-card:hover { transform: translateY(-2px); box-shadow: 0 4px 12px rgba(0,0,0,0.12); }
        .delete-btn { background: none; border: none; cursor: pointer; font-size: 16px; padding: 4px 6px; border-radius: 6px; color: #ef4444; transition: background 0.2s; }
        .delete-btn:hover { background: #fee2e2; }
      `}</style>

      <div
        style={{
          display: "flex",
          flexDirection: "column",
          minHeight: "100vh",
          backgroundColor: "#f8fafc",
          fontFamily: "'Segoe UI', sans-serif",
        }}
      >
        <div
          className={`travelx-overlay ${sidebarOpen ? "open" : ""}`}
          onClick={() => setSidebarOpen(false)}
        />

        {/* Sidebar */}
        <aside className={`travelx-sidebar ${sidebarOpen ? "open" : ""}`}>
          <div
            style={{
              fontSize: "20px",
              fontWeight: "bold",
              marginBottom: "32px",
              paddingLeft: "8px",
            }}
          >
            ✈️ TravelX
          </div>
          <nav
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "4px",
              flex: 1,
            }}
          >
            {navItems.map((item) => (
              <button
                key={item.id}
                className={`nav-btn ${activeTab === item.id ? "active" : ""}`}
                onClick={() => handleNavClick(item.id)}
              >
                <span style={{ fontSize: "18px" }}>{item.icon}</span>
                {item.label}
              </button>
            ))}
          </nav>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "10px",
              padding: "16px 8px",
              borderTop: "1px solid #1e293b",
            }}
          >
            <div
              style={{
                width: "36px",
                height: "36px",
                borderRadius: "50%",
                backgroundColor: "#1e40af",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontWeight: "bold",
                flexShrink: 0,
              }}
            >
              {userName[0].toUpperCase()}
            </div>
            <div>
              <div
                style={{
                  fontSize: "13px",
                  fontWeight: "600",
                  color: "#e2e8f0",
                }}
              >
                {userName}
              </div>
              <button
                onClick={handleLogout}
                style={{
                  background: "none",
                  border: "none",
                  color: "#64748b",
                  fontSize: "12px",
                  cursor: "pointer",
                  padding: 0,
                }}
              >
                Logout
              </button>
            </div>
          </div>
        </aside>

        {/* Mobile Header */}
        <header className="travelx-mobile-header">
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            style={{
              background: "none",
              border: "none",
              color: "#fff",
              fontSize: "24px",
              cursor: "pointer",
              lineHeight: 1,
            }}
          >
            ☰
          </button>
          <span style={{ fontWeight: "bold", fontSize: "18px" }}>
            ✈️ TravelX
          </span>
          <div
            style={{
              width: "32px",
              height: "32px",
              borderRadius: "50%",
              backgroundColor: "#1e40af",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontWeight: "bold",
              fontSize: "14px",
            }}
          >
            {userName[0].toUpperCase()}
          </div>
        </header>

        {/* Main */}
        <main className="travelx-main">
          <div style={{ marginBottom: "20px" }}>
            <h1
              style={{
                fontSize: "clamp(18px, 4vw, 26px)",
                fontWeight: "700",
                color: "#0f172a",
                margin: "0 0 4px",
              }}
            >
              Good day, {userName}! 👋
            </h1>
            <p style={{ color: "#64748b", margin: 0, fontSize: "14px" }}>
              Where are we going next?
            </p>
          </div>

          {/* DISCOVER */}
          {activeTab === "discover" && (
            <div>
              <div className="stats-grid">
                {[
                  {
                    label: "Destinations",
                    value: destinations.length,
                    icon: "🌍",
                  },
                  { label: "Places", value: places.length, icon: "📌" },
                  {
                    label: "My Trips",
                    value: trips.filter((t) => t.destination_id).length,
                    icon: "✈️",
                  },
                  { label: "Reviews", value: 0, icon: "⭐" },
                ].map((s) => (
                  <div
                    key={s.label}
                    style={{
                      backgroundColor: "#fff",
                      borderRadius: "12px",
                      padding: "16px",
                      textAlign: "center",
                      boxShadow: "0 1px 3px rgba(0,0,0,0.08)",
                    }}
                  >
                    <div style={{ fontSize: "28px" }}>{s.icon}</div>
                    <div
                      style={{
                        fontSize: "24px",
                        fontWeight: "700",
                        color: "#0f172a",
                        margin: "6px 0 2px",
                      }}
                    >
                      {s.value}
                    </div>
                    <div style={{ fontSize: "12px", color: "#64748b" }}>
                      {s.label}
                    </div>
                  </div>
                ))}
              </div>
              <h2
                style={{
                  fontSize: "17px",
                  fontWeight: "700",
                  color: "#0f172a",
                  margin: "0 0 16px",
                }}
              >
                Featured Destinations
              </h2>
              {loading ? (
                <p
                  style={{
                    textAlign: "center",
                    color: "#64748b",
                    padding: "40px",
                  }}
                >
                  Loading...
                </p>
              ) : destinations.length === 0 ? (
                <p
                  style={{
                    textAlign: "center",
                    color: "#94a3b8",
                    padding: "40px",
                  }}
                >
                  No destinations available yet.
                </p>
              ) : (
                <div className="cards-grid">
                  {destinations.slice(0, 6).map((d) => (
                    <DestCard key={d.id} dest={d} />
                  ))}
                </div>
              )}
            </div>
          )}

          {/* DESTINATIONS */}
          {activeTab === "destinations" && (
            <div>
              <h2
                style={{
                  fontSize: "17px",
                  fontWeight: "700",
                  margin: "0 0 16px",
                }}
              >
                All Destinations
              </h2>
              {loading ? (
                <p style={{ textAlign: "center", color: "#64748b" }}>
                  Loading...
                </p>
              ) : destinations.length === 0 ? (
                <p style={{ textAlign: "center", color: "#94a3b8" }}>
                  No destinations found.
                </p>
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
                  marginBottom: "20px",
                  flexWrap: "wrap",
                  gap: "10px",
                }}
              >
                <h2 style={{ fontSize: "17px", fontWeight: "700", margin: 0 }}>
                  My Trips
                </h2>
                <button onClick={() => navigate("/explore")} style={btnStyle}>
                  + Create Trip
                </button>
              </div>

              {loading ? (
                <p style={{ textAlign: "center", color: "#64748b" }}>
                  Loading...
                </p>
              ) : trips.filter((t) => t.destination_id).length === 0 ? (
                <div
                  style={{
                    textAlign: "center",
                    padding: "60px 20px",
                    color: "#64748b",
                  }}
                >
                  <div style={{ fontSize: "56px", marginBottom: "12px" }}>
                    🧳
                  </div>
                  <h3 style={{ marginBottom: "8px", color: "#0f172a" }}>
                    No trips yet!
                  </h3>
                  <p style={{ marginBottom: "20px" }}>
                    Start planning your first adventure.
                  </p>
                  <button onClick={() => navigate("/explore")} style={btnStyle}>
                    Create My First Trip
                  </button>
                </div>
              ) : (
                <div className="cards-grid">
                  {trips
                    .filter((trip) => trip.destination_id)
                    .map((trip) => (
                      <div
                        key={trip.id}
                        className="trip-card"
                        onClick={() => navigate(`/trips/${trip.id}`)}
                      >
                        <div
                          style={{
                            height: "140px",
                            background:
                              "linear-gradient(135deg, #1e40af, #0ea5e9)",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            fontSize: "48px",
                          }}
                        >
                          🧳
                        </div>
                        <div style={{ padding: "14px" }}>
                          <h3
                            style={{
                              fontSize: "15px",
                              fontWeight: "600",
                              color: "#0f172a",
                              margin: "0 0 8px",
                            }}
                          >
                            {trip.name}
                          </h3>
                          <div
                            style={{
                              display: "flex",
                              justifyContent: "space-between",
                              alignItems: "center",
                            }}
                          >
                            <div
                              style={{
                                display: "flex",
                                alignItems: "center",
                                gap: "8px",
                              }}
                            >
                              <span
                                style={{
                                  fontSize: "11px",
                                  padding: "2px 8px",
                                  borderRadius: "20px",
                                  backgroundColor:
                                    trip.status === "completed"
                                      ? "#dcfce7"
                                      : "#fef3c7",
                                  color:
                                    trip.status === "completed"
                                      ? "#166534"
                                      : "#92400e",
                                  fontWeight: "500",
                                }}
                              >
                                {trip.status || "planned"}
                              </span>
                              {trip.total_budget && (
                                <span
                                  style={{ fontSize: "12px", color: "#64748b" }}
                                >
                                  ₹{Number(trip.total_budget).toLocaleString()}
                                </span>
                              )}
                            </div>
                            {/* ✅ DELETE BUTTON */}
                            <button
                              className="delete-btn"
                              onClick={(e) => handleDeleteTrip(e, trip.id)}
                              title="Delete trip"
                              style={{
                                background:
                                  confirmDeleteId === trip.id
                                    ? "#fee2e2"
                                    : "none",
                                border: "none",
                                cursor: "pointer",
                                fontSize: "13px",
                                padding: "4px 8px",
                                borderRadius: "6px",
                                color: "#ef4444",
                                fontWeight:
                                  confirmDeleteId === trip.id ? "600" : "400",
                              }}
                            >
                              {confirmDeleteId === trip.id ? "Confirm?" : "🗑️"}
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                </div>
              )}
            </div>
          )}

          {activeTab === "journal" && (
            <EmptyState
              icon="📖"
              title="Your Travel Journal"
              desc="Document your adventures and memories."
              btnLabel="Write New Entry"
            />
          )}
          {activeTab === "community" && (
            <EmptyState
              icon="👥"
              title="Community"
              desc="Connect with fellow travelers and get inspired."
              btnLabel="Browse Posts"
            />
          )}
          {activeTab === "deals" && (
            <EmptyState
              icon="💰"
              title="Exclusive Travel Deals"
              desc="Find the best deals on flights, hotels and tours."
              btnLabel="Browse Deals"
            />
          )}
        </main>

        {/* Bottom Nav */}
        <nav className="travelx-bottom-nav">
          {navItems.map((item) => (
            <button
              key={item.id}
              className="bottom-nav-btn"
              onClick={() => setActiveTab(item.id)}
              style={{ color: activeTab === item.id ? "#60a5fa" : "#64748b" }}
            >
              <span style={{ fontSize: "20px" }}>{item.icon}</span>
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
    <div
      className="dest-card"
      onClick={() => navigate(`/destinations/${dest.id}`)}
    >
      <div
        style={{
          height: "150px",
          backgroundColor: "#f1f5f9",
          overflow: "hidden",
        }}
      >
        {dest.image_url ? (
          <img
            src={dest.image_url}
            alt={dest.name}
            style={{ width: "100%", height: "100%", objectFit: "cover" }}
          />
        ) : (
          <div
            style={{
              width: "100%",
              height: "100%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "48px",
            }}
          >
            🌍
          </div>
        )}
      </div>
      <div style={{ padding: "14px" }}>
        <h3
          style={{
            fontSize: "15px",
            fontWeight: "600",
            color: "#0f172a",
            margin: "0 0 6px",
          }}
        >
          {dest.name}
        </h3>
        <p
          style={{
            fontSize: "13px",
            color: "#64748b",
            margin: "0 0 10px",
            lineHeight: "1.5",
          }}
        >
          {dest.description?.slice(0, 80)}
          {dest.description?.length > 80 ? "..." : ""}
        </p>
        <div style={{ display: "flex", gap: "6px", flexWrap: "wrap" }}>
          {dest.category && <span style={tagStyle}>{dest.category}</span>}
          {dest.country && <span style={tagStyle}>📍 {dest.country}</span>}
          {dest.budget_estimate && (
            <span
              style={{
                ...tagStyle,
                backgroundColor: "#dcfce7",
                color: "#166534",
              }}
            >
              💰 ${dest.budget_estimate}
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

const EmptyState = ({ icon, title, desc, btnLabel }) => (
  <div style={{ textAlign: "center", padding: "60px 20px", color: "#64748b" }}>
    <div style={{ fontSize: "56px", marginBottom: "12px" }}>{icon}</div>
    <h3 style={{ marginBottom: "8px", color: "#0f172a" }}>{title}</h3>
    <p style={{ marginBottom: "20px" }}>{desc}</p>
    <button style={btnStyle}>{btnLabel}</button>
  </div>
);

const btnStyle = {
  backgroundColor: "#1e40af",
  color: "#fff",
  border: "none",
  padding: "10px 20px",
  borderRadius: "8px",
  fontSize: "14px",
  fontWeight: "600",
  cursor: "pointer",
};
const tagStyle = {
  backgroundColor: "#e0f2fe",
  color: "#0369a1",
  padding: "2px 8px",
  borderRadius: "20px",
  fontSize: "11px",
  fontWeight: "500",
};

export default Dashboard;
