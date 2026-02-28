import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../services/axiosInstance";


const Deals = ({ insideDashboard = false }) => {
  const navigate = useNavigate();
  const [deals, setDeals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeType, setActiveType] = useState("");

  useEffect(() => {
    fetchDeals();
  }, [activeType]);

  const fetchDeals = async () => {
    setLoading(true);
    try {
      const params = activeType ? { type: activeType } : {};
      const res = await axiosInstance.get("/deals", { params });
      setDeals(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const typeIcons = { flight: "✈️", hotel: "🏨", tour: "🗺️", package: "🎁" };
  const typeColors = {
    flight: { bg: "#eff6ff", color: "#1d4ed8", border: "#bfdbfe" },
    hotel: { bg: "#f0fdf4", color: "#15803d", border: "#bbf7d0" },
    tour: { bg: "#fef9c3", color: "#a16207", border: "#fde68a" },
    package: { bg: "#fdf4ff", color: "#7e22ce", border: "#e9d5ff" },
  };

  const isExpiringSoon = (date) => {
    if (!date) return false;
    const diff = (new Date(date) - new Date()) / (1000 * 60 * 60 * 24);
    return diff >= 0 && diff <= 7;
  };
  const isExpired = (date) => date && new Date(date) < new Date();

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,700;0,900;1,400;1,700&family=DM+Sans:wght@300;400;500;600&display=swap');

        :root {
          --sand: #F5EFE6; --sand-dark: #EAE0D5;
          --ink: #1C1917; --ink-light: #44403C; --ink-soft: #78716C;
          --terracotta: #C4552A; --terracotta-light: #E8724A;
          --gold: #D4A853; --white: #FDFAF7; --border: #E7E5E4;
          --cream: #FAF6F1;
        }

        .deals-page { font-family: 'DM Sans', sans-serif; background: var(--white); min-height: 100vh; }

        /* ── Top Bar — matches Explore navbar ── */
        .deals-topbar {
          background: #2D1B0E;
          padding: 16px 48px;
          display: flex; align-items: center; justify-content: space-between;
          position: sticky; top: 0; z-index: 50;
          border-bottom: 1px solid rgba(212,168,83,0.2);
        }
        .topbar-logo {
          font-family: 'Playfair Display', serif;
          font-size: 22px; font-weight: 900; color: var(--gold);
          letter-spacing: 1px; cursor: pointer;
        }
        .back-btn {
          display: flex; align-items: center; gap: 7px;
          background: rgba(212,168,83,0.12);
          border: 1px solid rgba(212,168,83,0.25);
          color: var(--gold);
          font-family: 'DM Sans', sans-serif;
          font-size: 12px; font-weight: 600;
          letter-spacing: 1px; text-transform: uppercase;
          padding: 9px 20px; border-radius: 50px;
          cursor: pointer; transition: all 0.2s;
        }
        .back-btn:hover { background: rgba(212,168,83,0.22); }

        /* ── Hero ── */
        .deals-hero {
          padding: 72px 40px 60px; position: relative; overflow: hidden;
          background: linear-gradient(160deg, #2D1B0E 0%, #5C3520 50%, #8B4E2F 100%);
          text-align: center;
        }
        .deals-hero-overlay { position: absolute; inset: 0; background: url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.03'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E"); pointer-events: none; }
        .deals-hero-glow { position: absolute; width: 500px; height: 500px; border-radius: 50%; background: radial-gradient(circle, rgba(212,168,83,0.18) 0%, transparent 70%); top: 50%; left: 50%; transform: translate(-50%,-50%); pointer-events: none; }
        .hero-content { position: relative; z-index: 1; }
        .hero-tag { display: inline-flex; align-items: center; gap: 8px; background: rgba(255,255,255,0.1); backdrop-filter: blur(8px); border: 1px solid rgba(255,255,255,0.2); color: var(--gold); font-size: 11px; font-weight: 600; letter-spacing: 2px; text-transform: uppercase; padding: 7px 16px; border-radius: 50px; margin-bottom: 20px; }
        .hero-title { font-family: 'Playfair Display', serif; font-size: clamp(32px, 5vw, 60px); font-weight: 900; color: #fff; line-height: 1.1; margin-bottom: 14px; }
        .hero-title em { color: var(--gold); font-style: italic; }
        .hero-sub { font-size: 15px; color: rgba(255,255,255,0.7); font-weight: 300; max-width: 440px; margin: 0 auto; line-height: 1.7; }

        /* ── Body ── */
        .deals-body { max-width: 1200px; margin: 0 auto; padding: 40px 40px 80px; }

        /* ── Filter Chips ── */
        .filter-row { display: flex; gap: 8px; flex-wrap: wrap; margin-bottom: 36px; }
        .filter-chip {
          display: flex; align-items: center; gap: 7px;
          padding: 9px 18px; border-radius: 12px;
          border: 1.5px solid var(--border); background: var(--white);
          color: var(--ink-soft); font-family: 'DM Sans', sans-serif;
          font-size: 13px; font-weight: 500; cursor: pointer; transition: all 0.25s;
        }
        .filter-chip:hover { border-color: var(--terracotta); color: var(--terracotta); background: #FDF8EF; transform: translateY(-1px); }
        .filter-chip.active { background: var(--ink); color: var(--gold); border-color: var(--ink); box-shadow: 0 4px 14px rgba(28,25,23,0.2); }

        /* ── Section Header ── */
        .sec-hdr { display: flex; align-items: center; gap: 14px; margin-bottom: 24px; }
        .sec-title { font-family: 'Playfair Display', serif; font-size: 26px; font-weight: 800; color: var(--ink); white-space: nowrap; }
        .sec-line { flex: 1; height: 1px; background: var(--sand-dark); }
        .sec-count { font-size: 11px; color: var(--ink-soft); text-transform: uppercase; letter-spacing: 2px; white-space: nowrap; background: var(--sand); padding: 4px 12px; border-radius: 20px; }

        /* ── Deals Grid ── */
        .deals-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(320px, 1fr)); gap: 24px; }

        .deal-card {
          background: var(--white); border-radius: 20px; overflow: hidden;
          border: 1px solid var(--sand-dark); transition: all 0.3s;
          position: relative; animation: fadeUp 0.4s ease both;
        }
        .deal-card:hover { transform: translateY(-6px); box-shadow: 0 20px 50px rgba(28,25,23,0.11); }
        .deal-card.expired { opacity: 0.58; }

        .deal-img {
          height: 190px; overflow: hidden; position: relative;
          background: linear-gradient(135deg, var(--sand), var(--sand-dark));
        }
        .deal-img img { width: 100%; height: 100%; object-fit: cover; transition: transform 0.5s; display: block; }
        .deal-card:hover .deal-img img { transform: scale(1.06); }
        .deal-no-img { width: 100%; height: 100%; display: flex; align-items: center; justify-content: center; font-size: 56px; }

        .discount-pill {
          position: absolute; top: 12px; left: 12px;
          background: linear-gradient(135deg, #ef4444, #dc2626);
          color: #fff; font-family: 'DM Sans', sans-serif;
          font-size: 12px; font-weight: 800; padding: 4px 12px;
          border-radius: 20px; letter-spacing: 0.5px;
          box-shadow: 0 4px 12px rgba(239,68,68,0.4);
        }
        .expiry-pill {
          position: absolute; top: 12px; right: 12px;
          background: rgba(0,0,0,0.6); backdrop-filter: blur(8px);
          color: #fff; font-size: 10px; font-weight: 600;
          padding: 4px 10px; border-radius: 20px; letter-spacing: 0.3px;
          font-family: 'DM Sans', sans-serif;
        }
        .expiry-pill.soon { background: linear-gradient(135deg, #f59e0b, #d97706); }
        .expiry-pill.gone  { background: #94a3b8; }

        .deal-body { padding: 20px; }
        .deal-dest { font-size: 10px; color: var(--terracotta); letter-spacing: 2.5px; text-transform: uppercase; font-weight: 600; margin-bottom: 6px; font-family: 'DM Sans', sans-serif; }
        .deal-title { font-family: 'Playfair Display', serif; font-size: 17px; font-weight: 800; color: var(--ink); margin-bottom: 8px; line-height: 1.35; }
        .deal-desc { font-size: 13px; color: var(--ink-soft); line-height: 1.65; margin-bottom: 16px; font-weight: 300; }

        .deal-pricing { display: flex; align-items: center; gap: 10px; padding: 14px 16px; background: var(--cream); border-radius: 14px; margin-bottom: 16px; border: 1px solid var(--sand-dark); }
        .deal-original { font-size: 13px; color: var(--ink-soft); text-decoration: line-through; }
        .deal-price { font-family: 'Playfair Display', serif; font-size: 28px; font-weight: 900; color: var(--ink); line-height: 1; }
        .deal-savings { font-size: 11px; color: #16a34a; font-weight: 700; margin-left: auto; background: #dcfce7; padding: 4px 10px; border-radius: 20px; white-space: nowrap; }

        .deal-footer { display: flex; align-items: center; justify-content: space-between; }
        .deal-type-tag { display: flex; align-items: center; gap: 5px; font-size: 11px; font-weight: 600; padding: 5px 12px; border-radius: 20px; border: 1px solid; font-family: 'DM Sans', sans-serif; }

        .explore-btn {
          background: var(--sand); color: var(--ink);
          border: 1.5px solid var(--sand-dark);
          padding: 9px 18px; border-radius: 12px;
          font-family: 'DM Sans', sans-serif; font-weight: 600;
          font-size: 12px; cursor: pointer; transition: all 0.25s;
        }
        .explore-btn:hover:not(:disabled) { background: var(--ink); color: var(--gold); border-color: var(--ink); transform: translateY(-2px); box-shadow: 0 6px 20px rgba(28,25,23,0.15); }
        .explore-btn:disabled { opacity: 0.45; cursor: not-allowed; }

        /* ── Loading / Empty ── */
        .loading-dots { display: flex; gap: 8px; justify-content: center; padding: 80px; }
        .ld { width: 8px; height: 8px; border-radius: 50%; background: var(--gold); animation: pulse 1.4s ease-in-out infinite; }
        .ld:nth-child(2) { animation-delay: 0.2s; }
        .ld:nth-child(3) { animation-delay: 0.4s; }

        .empty-state { text-align: center; padding: 70px 24px; border: 1px dashed var(--border); border-radius: 20px; background: rgba(255,255,255,0.6); }
        .empty-ico { font-size: 52px; margin-bottom: 12px; opacity: 0.5; }
        .empty-ttl { font-family: 'Playfair Display', serif; font-size: 24px; font-weight: 800; color: var(--ink); margin-bottom: 7px; }
        .empty-dsc { font-size: 13px; color: var(--ink-soft); font-weight: 300; }

        @keyframes fadeUp { from { opacity: 0; transform: translateY(16px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes pulse { 0%,80%,100%{transform:scale(0.8);opacity:0.4} 40%{transform:scale(1.2);opacity:1} }

        /* ── Responsive ── */
        @media (max-width: 768px) {
          .deals-topbar { padding: 14px 20px; }
          .deals-hero { padding: 72px 20px 48px; }
          .deals-body { padding: 28px 16px 60px; }
          .deals-grid { grid-template-columns: 1fr; }
          .sec-title { font-size: 22px; }
        }
        @media (max-width: 480px) {
          .filter-row { gap: 6px; }
          .filter-chip { padding: 8px 14px; font-size: 12px; }
        }
      `}</style>

      <div className="deals-page">
        {/* ── Top Bar ── */}
        {!insideDashboard && (
          <div className="deals-topbar">
            <button className="back-btn" onClick={() => navigate("/dashboard")}>
              ← Dashboard
            </button>
            <span className="topbar-logo" onClick={() => navigate("/")}>
              TravelX
            </span>
          </div>
        )}

        {/* ── Hero ── */}
        <div
          className="deals-hero"
          style={
            insideDashboard ? { paddingTop: "60px", borderRadius: "20px" } : {}
          }
        >
          <div className="deals-hero-overlay" />
          <div className="deals-hero-glow" />
          <div className="hero-content">
            <div className="hero-tag">✦ Limited Time Offers</div>
            <h1 className="hero-title">
              Exclusive Travel
              <br />
              <em>Deals & Offers</em>
            </h1>
            <p className="hero-sub">
              Handpicked deals on flights, stays and experiences — updated
              regularly
            </p>
          </div>
        </div>

        {/* ── Body ── */}
        <div className="deals-body">
          {/* Filter Chips */}
          <div className="filter-row">
            {[
              { label: "All Deals", val: "", icon: "✦" },
              { label: "Flights", val: "flight", icon: "✈️" },
              { label: "Hotels", val: "hotel", icon: "🏨" },
              { label: "Tours", val: "tour", icon: "🗺️" },
              { label: "Packages", val: "package", icon: "🎁" },
            ].map((t) => (
              <button
                key={t.val}
                className={`filter-chip ${activeType === t.val ? "active" : ""}`}
                onClick={() => setActiveType(t.val)}
              >
                <span>{t.icon}</span>
                {t.label}
              </button>
            ))}
          </div>

          {/* Section Header */}
          <div className="sec-hdr">
            <h2 className="sec-title">
              {activeType
                ? `${typeIcons[activeType]} ${activeType.charAt(0).toUpperCase() + activeType.slice(1)} Deals`
                : "All Deals"}
            </h2>
            <div className="sec-line" />
            <span className="sec-count">
              {deals.length} deal{deals.length !== 1 ? "s" : ""}
            </span>
          </div>

          {/* Content */}
          {loading ? (
            <div className="loading-dots">
              <div className="ld" />
              <div className="ld" />
              <div className="ld" />
            </div>
          ) : deals.length === 0 ? (
            <div className="empty-state">
              <div className="empty-ico">🏷️</div>
              <p className="empty-ttl">No deals available</p>
              <p className="empty-dsc">Check back soon for exciting offers</p>
            </div>
          ) : (
            <div className="deals-grid">
              {deals.map((deal, idx) => {
                const expired = isExpired(deal.valid_until);
                const expiringSoon = isExpiringSoon(deal.valid_until);
                const colors = typeColors[deal.type] || typeColors.package;
                const savings = deal.original_price - deal.deal_price;
                const daysLeft = deal.valid_until
                  ? Math.ceil(
                      (new Date(deal.valid_until) - new Date()) /
                        (1000 * 60 * 60 * 24),
                    )
                  : null;

                return (
                  <div
                    key={deal.id}
                    className={`deal-card ${expired ? "expired" : ""}`}
                    style={{ animationDelay: `${idx * 0.06}s` }}
                  >
                    <div className="deal-img">
                      {deal.image_url || deal.destinations?.image_url ? (
                        <img
                          src={deal.image_url || deal.destinations?.image_url}
                          alt={deal.title}
                        />
                      ) : (
                        <div className="deal-no-img">
                          {typeIcons[deal.type] || "🏷️"}
                        </div>
                      )}
                      {deal.discount_percent && (
                        <div className="discount-pill">
                          {deal.discount_percent}% OFF
                        </div>
                      )}
                      {deal.valid_until && (
                        <div
                          className={`expiry-pill ${expired ? "gone" : expiringSoon ? "soon" : ""}`}
                        >
                          {expired
                            ? "Expired"
                            : expiringSoon
                              ? `⚡ ${daysLeft}d left`
                              : `Until ${new Date(deal.valid_until).toLocaleDateString("en-IN", { day: "numeric", month: "short" })}`}
                        </div>
                      )}
                    </div>

                    <div className="deal-body">
                      {deal.destinations && (
                        <div className="deal-dest">
                          📍 {deal.destinations.name},{" "}
                          {deal.destinations.country}
                        </div>
                      )}
                      <h3 className="deal-title">{deal.title}</h3>
                      {deal.description && (
                        <p className="deal-desc">{deal.description}</p>
                      )}

                      <div className="deal-pricing">
                        <div>
                          <div className="deal-original">
                            ₹{Number(deal.original_price).toLocaleString()}
                          </div>
                          <div className="deal-price">
                            ₹{Number(deal.deal_price).toLocaleString()}
                          </div>
                        </div>
                        {savings > 0 && (
                          <div className="deal-savings">
                            Save ₹{Number(savings).toLocaleString()}
                          </div>
                        )}
                      </div>

                      <div className="deal-footer">
                        <div
                          className="deal-type-tag"
                          style={{
                            background: colors.bg,
                            color: colors.color,
                            borderColor: colors.border,
                          }}
                        >
                          {typeIcons[deal.type]} {deal.type}
                        </div>
                        <button
                          className="explore-btn"
                          disabled={expired}
                          onClick={() =>
                            deal.destination_id &&
                            navigate(`/destinations/${deal.destination_id}`)
                          }
                        >
                          {expired ? "Expired" : "Explore →"}
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default Deals;
