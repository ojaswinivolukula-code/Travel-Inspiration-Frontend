import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../services/axiosInstance";

const Explore = () => {
  const navigate = useNavigate();
  const [destinations, setDestinations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [filters, setFilters] = useState({
    search: "",
    category: "",
    climate: "",
    season: "",
    maxBudget: "",
  });

  useEffect(() => {
    fetchDestinations();
  }, []);

  const fetchDestinations = async () => {
    setLoading(true);
    try {
      const res = await axiosInstance.get("/destinations", { params: filters });
      setDestinations(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  const handleSearch = () => fetchDestinations();

  return (
    <div style={{ padding: "32px", maxWidth: "1100px", margin: "0 auto", fontFamily: "'Segoe UI', sans-serif" }}>
      <button onClick={() => navigate(-1)} style={{ background: "none", border: "none", cursor: "pointer", color: "#1e40af", fontSize: "14px", fontWeight: "600", marginBottom: "16px", display: "flex", alignItems: "center", gap: "6px", padding: 0 }}>
        ← Back to Dashboard
      </button>

      <h1 style={{ fontSize: "28px", fontWeight: "700", marginBottom: "24px", color: "#0f172a" }}>Explore Destinations</h1>

      {/* Filters */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(160px, 1fr))", gap: "12px", marginBottom: "16px" }}>
        <input type="text" name="search" placeholder="Search..." onChange={handleChange} style={inputStyle} />
        <select name="category" onChange={handleChange} style={inputStyle}>
          <option value="">All Categories</option>
          <option value="adventure">Adventure</option>
          <option value="relaxation">Relaxation</option>
          <option value="culture">Culture</option>
          <option value="history">History</option>
          <option value="nature">Nature</option>
        </select>
        <select name="climate" onChange={handleChange} style={inputStyle}>
          <option value="">All Climates</option>
          <option value="tropical">Tropical</option>
          <option value="cold">Cold</option>
          <option value="temperate">Temperate</option>
          <option value="desert">Desert</option>
          <option value="mixed">Mixed</option>
        </select>
        <select name="season" onChange={handleChange} style={inputStyle}>
          <option value="">Best Season</option>
          <option value="spring">Spring</option>
          <option value="summer">Summer</option>
          <option value="autumn">Autumn</option>
          <option value="winter">Winter</option>
          <option value="all">All Year</option>
        </select>
        <input type="number" name="maxBudget" placeholder="Max Budget ($)" onChange={handleChange} style={inputStyle} />
      </div>

      <button onClick={handleSearch} style={btnStyle}>Apply Filters</button>

      {/* Cards */}
      {loading ? (
        <p style={{ textAlign: "center", padding: "40px", color: "#64748b" }}>Loading...</p>
      ) : destinations.length === 0 ? (
        <p style={{ textAlign: "center", padding: "40px", color: "#94a3b8" }}>No destinations found.</p>
      ) : (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: "20px", marginTop: "24px" }}>
          {destinations.map((dest) => (
            <div key={dest.id}
              style={{ background: "#fff", borderRadius: "12px", overflow: "hidden", boxShadow: "0 2px 8px rgba(0,0,0,0.08)", cursor: "pointer", transition: "transform 0.2s, box-shadow 0.2s" }}
              // ✅ FIX: correct route /destinations/:id
              onClick={() => navigate(`/destinations/${dest.id}`)}>
              <div style={{ height: "180px", overflow: "hidden", backgroundColor: "#f1f5f9" }}>
                {dest.image_url
                  ? <img src={dest.image_url} alt={dest.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                  : <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "48px" }}>🌍</div>
                }
              </div>
              <div style={{ padding: "16px" }}>
                <h3 style={{ fontSize: "16px", fontWeight: "700", color: "#0f172a", margin: "0 0 4px" }}>{dest.name}</h3>
                <p style={{ fontSize: "13px", color: "#64748b", margin: "0 0 10px" }}>{dest.country}</p>
                <div style={{ display: "flex", gap: "6px", flexWrap: "wrap" }}>
                  {dest.category && <span style={tagStyle}>{dest.category}</span>}
                  {dest.budget_estimate && <span style={{ ...tagStyle, backgroundColor: "#dcfce7", color: "#166534" }}>💰 ${dest.budget_estimate}</span>}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

const inputStyle = { padding: "10px 12px", border: "1px solid #e2e8f0", borderRadius: "8px", fontSize: "14px", width: "100%", outline: "none" };
const btnStyle = { backgroundColor: "#1e40af", color: "#fff", border: "none", padding: "10px 24px", borderRadius: "8px", fontSize: "14px", fontWeight: "600", cursor: "pointer", marginBottom: "8px" };
const tagStyle = { backgroundColor: "#e0f2fe", color: "#0369a1", padding: "2px 8px", borderRadius: "20px", fontSize: "11px", fontWeight: "500" };

export default Explore;