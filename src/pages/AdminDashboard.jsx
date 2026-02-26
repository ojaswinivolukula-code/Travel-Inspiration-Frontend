import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const AdminDashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("overview");
  const [destinations, setDestinations] = useState([]);
  const [places, setPlaces] = useState([]);
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);

  const token = sessionStorage.getItem("token");
  const headers = { Authorization: `Bearer ${token}`, "Content-Type": "application/json" };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [destRes, placeRes, actRes] = await Promise.all([
          fetch("http://localhost:5000/api/destinations", { headers }),
          fetch("http://localhost:5000/api/places", { headers }),
          fetch("http://localhost:5000/api/activities", { headers }),
        ]);
        setDestinations(await destRes.json());
        setPlaces(await placeRes.json());
        setActivities(await actRes.json());
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleLogout = () => { logout(); navigate("/"); };

  return (
    <div style={styles.container}>
      {/* Sidebar */}
      <aside style={styles.sidebar}>
        <div style={styles.logo}>⚙️ Admin Panel</div>
        <nav style={styles.nav}>
          {[
            { id: "overview", icon: "📊", label: "Overview" },
            { id: "destinations", icon: "🌍", label: "Destinations" },
            { id: "places", icon: "📍", label: "Places" },
            { id: "activities", icon: "🎯", label: "Activities" },
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              style={{ ...styles.navItem, ...(activeTab === item.id ? styles.navItemActive : {}) }}
            >
              <span>{item.icon}</span> {item.label}
            </button>
          ))}
        </nav>
        <div style={styles.userSection}>
          <div style={styles.avatar}>A</div>
          <div>
            <div style={styles.userName}>Admin</div>
            <button onClick={handleLogout} style={styles.logoutBtn}>Logout</button>
          </div>
        </div>
      </aside>

      {/* Main */}
      <main style={styles.main}>
        <div style={styles.header}>
          <h1 style={styles.title}>
            {activeTab === "overview" && "Dashboard Overview"}
            {activeTab === "destinations" && "Manage Destinations"}
            {activeTab === "places" && "Manage Places"}
            {activeTab === "activities" && "Manage Activities"}
          </h1>
        </div>

        {/* Overview */}
        {activeTab === "overview" && (
          <div style={styles.statsGrid}>
            {[
              { label: "Destinations", value: destinations.length, icon: "🌍", color: "#dbeafe" },
              { label: "Places", value: places.length, icon: "📍", color: "#dcfce7" },
              { label: "Activities", value: activities.length, icon: "🎯", color: "#fef9c3" },
            ].map((stat) => (
              <div key={stat.label} style={{ ...styles.statCard, backgroundColor: stat.color }}>
                <span style={styles.statIcon}>{stat.icon}</span>
                <div style={styles.statValue}>{stat.value}</div>
                <div style={styles.statLabel}>{stat.label}</div>
              </div>
            ))}
          </div>
        )}

        {/* Destinations */}
        {activeTab === "destinations" && (
          <div>
            {loading ? <p>Loading...</p> : (
              <table style={styles.table}>
                <thead>
                  <tr>
                    <th style={styles.th}>Name</th>
                    <th style={styles.th}>Country</th>
                    <th style={styles.th}>Category</th>
                    <th style={styles.th}>Budget</th>
                  </tr>
                </thead>
                <tbody>
                  {destinations.map((d) => (
                    <tr key={d.id} style={styles.tr}>
                      <td style={styles.td}>{d.name}</td>
                      <td style={styles.td}>{d.country || "—"}</td>
                      <td style={styles.td}>{d.category || "—"}</td>
                      <td style={styles.td}>{d.budget_estimate ? `$${d.budget_estimate}` : "—"}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        )}

        {/* Places */}
        {activeTab === "places" && (
          <div>
            {loading ? <p>Loading...</p> : (
              <table style={styles.table}>
                <thead>
                  <tr>
                    <th style={styles.th}>Name</th>
                    <th style={styles.th}>Type</th>
                    <th style={styles.th}>Description</th>
                  </tr>
                </thead>
                <tbody>
                  {places.map((p) => (
                    <tr key={p.id} style={styles.tr}>
                      <td style={styles.td}>{p.name}</td>
                      <td style={styles.td}>{p.type || "—"}</td>
                      <td style={styles.td}>{p.description?.slice(0, 60) || "—"}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        )}

        {/* Activities */}
        {activeTab === "activities" && (
          <div>
            {loading ? <p>Loading...</p> : (
              <table style={styles.table}>
                <thead>
                  <tr>
                    <th style={styles.th}>Name</th>
                    <th style={styles.th}>Category</th>
                    <th style={styles.th}>Duration</th>
                  </tr>
                </thead>
                <tbody>
                  {activities.map((a) => (
                    <tr key={a.id} style={styles.tr}>
                      <td style={styles.td}>{a.name}</td>
                      <td style={styles.td}>{a.category || "—"}</td>
                      <td style={styles.td}>{a.duration || "—"}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        )}
      </main>
    </div>
  );
};

const styles = {
  container: { display: "flex", minHeight: "100vh", backgroundColor: "#f8fafc", fontFamily: "'Segoe UI', sans-serif" },
  sidebar: { width: "220px", backgroundColor: "#1e293b", color: "#fff", display: "flex", flexDirection: "column", padding: "24px 16px", position: "fixed", height: "100vh" },
  logo: { fontSize: "18px", fontWeight: "bold", marginBottom: "32px", paddingLeft: "8px" },
  nav: { display: "flex", flexDirection: "column", gap: "4px", flex: 1 },
  navItem: { display: "flex", alignItems: "center", gap: "10px", padding: "10px 12px", borderRadius: "8px", border: "none", background: "transparent", color: "#94a3b8", fontSize: "14px", cursor: "pointer", textAlign: "left" },
  navItemActive: { backgroundColor: "#7c3aed", color: "#fff" },
  userSection: { display: "flex", alignItems: "center", gap: "10px", padding: "16px 8px", borderTop: "1px solid #334155" },
  avatar: { width: "32px", height: "32px", borderRadius: "50%", backgroundColor: "#7c3aed", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: "bold", flexShrink: 0 },
  userName: { fontSize: "13px", fontWeight: "600", color: "#e2e8f0" },
  logoutBtn: { background: "none", border: "none", color: "#64748b", fontSize: "12px", cursor: "pointer", padding: 0 },
  main: { marginLeft: "220px", flex: 1, padding: "32px" },
  header: { marginBottom: "28px" },
  title: { fontSize: "24px", fontWeight: "700", color: "#0f172a", margin: 0 },
  statsGrid: { display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "20px" },
  statCard: { borderRadius: "12px", padding: "24px", textAlign: "center" },
  statIcon: { fontSize: "32px" },
  statValue: { fontSize: "36px", fontWeight: "700", color: "#0f172a", margin: "8px 0 4px" },
  statLabel: { fontSize: "14px", color: "#475569", fontWeight: "500" },
  table: { width: "100%", borderCollapse: "collapse", backgroundColor: "#fff", borderRadius: "12px", overflow: "hidden", boxShadow: "0 1px 3px rgba(0,0,0,0.08)" },
  th: { padding: "12px 16px", textAlign: "left", backgroundColor: "#f1f5f9", fontSize: "13px", fontWeight: "600", color: "#475569", borderBottom: "1px solid #e2e8f0" },
  tr: { borderBottom: "1px solid #f1f5f9" },
  td: { padding: "12px 16px", fontSize: "14px", color: "#334155" },
};

export default AdminDashboard;