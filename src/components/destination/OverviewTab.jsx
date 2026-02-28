import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const OverviewTab = ({ destination, places, activities, setActiveTab }) => {
  const infoItems = [
    destination.country && {
      icon: "🌍",
      label: "Country",
      value: destination.country,
    },
    destination.category && {
      icon: "🏷️",
      label: "Category",
      value: destination.category,
    },
    destination.best_season && {
      icon: "📅",
      label: "Best Season",
      value: destination.best_season,
    },
    destination.climate && {
      icon: "🌤️",
      label: "Climate",
      value: destination.climate,
    },
    { icon: "📍", label: "Places", value: `${places.length} spots` },
    { icon: "🎯", label: "Activities", value: `${activities.length} to do` },
  ].filter(Boolean);

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,700;0,900;1,400&family=DM+Sans:wght@300;400;500;600&display=swap');
        :root {
          --sand:#F5EFE6; --sand-dark:#EAE0D5;
          --ink:#1C1917; --ink-soft:#78716C;
          --terra:#C4552A; --gold:#D4A853;
          --white:#FDFAF7; --bdr:#E7E5E4;
        }

        /* ── INFO GRID ── */
        .ov-info-grid { display:grid; grid-template-columns:repeat(3,1fr); gap:16px; margin-bottom:36px; }
        .ov-info-card { background:var(--white) !important; border:1px solid var(--bdr) !important; border-radius:18px !important; padding:22px 20px !important; display:flex !important; align-items:center; gap:14px; transition:all 0.25s; position:relative; overflow:hidden; }
        .ov-info-card::before { content:''; position:absolute; left:0; top:0; bottom:0; width:3px; background:var(--terra); opacity:0; transition:opacity 0.25s; border-radius:3px 0 0 3px; }
        .ov-info-card:hover { transform:translateY(-3px); box-shadow:0 12px 32px rgba(28,25,23,0.09) !important; border-color:var(--sand-dark) !important; }
        .ov-info-card:hover::before { opacity:1; }
        .ov-info-icon { width:46px; height:46px; border-radius:14px; background:var(--sand); display:flex; align-items:center; justify-content:center; font-size:20px; flex-shrink:0; }
        .ov-info-lbl { font-size:9px; font-weight:700; letter-spacing:2.5px; text-transform:uppercase; color:var(--ink-soft); margin-bottom:4px; font-family:'DM Sans',sans-serif; }
        .ov-info-val { font-family:'Playfair Display',serif; font-size:16px; font-weight:800; color:var(--ink); text-transform:capitalize; line-height:1.1; }

        /* ── ABOUT ── */
        .ov-about { background:var(--white) !important; border:1px solid var(--bdr) !important; border-radius:22px !important; padding:36px !important; margin-bottom:36px; position:relative; overflow:hidden; }
        .ov-about::after { content:'"'; position:absolute; right:24px; top:10px; font-family:'Playfair Display',serif; font-size:120px; font-weight:900; color:rgba(196,85,42,0.06); pointer-events:none; line-height:1; }
        .ov-about-eyebrow { font-size:9px; font-weight:700; letter-spacing:3px; text-transform:uppercase; color:var(--terra); margin-bottom:10px; display:flex; align-items:center; gap:8px; font-family:'DM Sans',sans-serif; }
        .ov-about-eyebrow::after { content:''; flex:0 0 32px; height:1px; background:var(--terra); }
        .ov-about-title { font-family:'Playfair Display',serif; font-size:26px; font-weight:800; color:var(--ink); margin-bottom:16px; line-height:1.15; }
        .ov-about-text { font-family:'DM Sans',sans-serif; font-size:15px; color:var(--ink-soft); line-height:1.85; font-weight:300; }

        /* ── BUDGET STRIP ── */
        .ov-budget-strip { background:linear-gradient(135deg,#2D1B0E 0%,#5C3520 100%); border-radius:20px; padding:28px 32px; margin-bottom:36px; display:flex; align-items:center; justify-content:space-between; flex-wrap:wrap; gap:20px; position:relative; overflow:hidden; }
        .ov-budget-strip::after { content:'₹'; position:absolute; right:24px; bottom:-20px; font-family:'Playfair Display',serif; font-size:120px; font-weight:900; color:rgba(212,168,83,0.07); pointer-events:none; line-height:1; }
        .ov-budget-items { display:flex; gap:32px; flex-wrap:wrap; }
        .ov-budget-item { text-align:center; }
        .ov-budget-lbl { font-size:9px; color:rgba(255,255,255,0.45); text-transform:uppercase; letter-spacing:2px; font-weight:600; margin-bottom:6px; font-family:'DM Sans',sans-serif; }
        .ov-budget-val { font-family:'Playfair Display',serif; font-size:20px; font-weight:800; color:#fff; line-height:1; }
        .ov-budget-divider { width:1px; height:40px; background:rgba(255,255,255,0.12); }
        .ov-budget-total-lbl { font-size:9px; color:rgba(255,255,255,0.45); text-transform:uppercase; letter-spacing:2px; font-weight:600; margin-bottom:6px; font-family:'DM Sans',sans-serif; }
        .ov-budget-total-val { font-family:'Playfair Display',serif; font-size:28px; font-weight:900; color:var(--gold); line-height:1; }

        /* ── TOP PLACES ── */
        .ov-section-hdr { display:flex; align-items:center; justify-content:space-between; margin-bottom:20px; }
        .ov-section-title { font-family:'Playfair Display',serif; font-size:24px; font-weight:800; color:var(--ink); }

        .ov-view-all { border-radius:50px !important; font-family:'DM Sans',sans-serif !important; font-size:12px !important; font-weight:700 !important; color:var(--terra) !important; background:transparent !important; border:none !important; height:auto !important; padding:6px 14px !important; transition:background 0.2s !important; }
        .ov-view-all:hover { background:rgba(196,85,42,0.08) !important; }

        .ov-places-grid { display:grid; grid-template-columns:repeat(3,1fr); gap:18px; }
        .ov-place-card { background:var(--white) !important; border:1px solid var(--bdr) !important; border-radius:18px !important; overflow:hidden; transition:all 0.3s; padding:0 !important; }
        .ov-place-card:hover { transform:translateY(-5px); box-shadow:0 16px 40px rgba(28,25,23,0.1) !important; }
        .ov-place-img { height:160px; overflow:hidden; background:linear-gradient(135deg,var(--sand),var(--sand-dark)); }
        .ov-place-img img { width:100%; height:100%; object-fit:cover; transition:opacity 0.3s; }
        .ov-place-card:hover .ov-place-img img { opacity:0.9; }
        .ov-place-no-img { width:100%; height:100%; display:flex; align-items:center; justify-content:center; font-size:40px; }
        .ov-place-body { padding:16px 18px !important; }
        .ov-place-name { font-family:'Playfair Display',serif; font-size:15px; font-weight:800; color:var(--ink); margin-bottom:6px; line-height:1.2; }
        .ov-place-desc { font-size:12px; color:var(--ink-soft); line-height:1.6; font-weight:300; font-family:'DM Sans',sans-serif; }

        @media(max-width:900px){
          .ov-info-grid { grid-template-columns:repeat(2,1fr); }
          .ov-places-grid { grid-template-columns:repeat(2,1fr); }
        }
        @media(max-width:600px){
          .ov-info-grid { grid-template-columns:repeat(2,1fr); }
          .ov-places-grid { grid-template-columns:repeat(2,1fr); }
          .ov-budget-strip { padding:22px 20px; }
          .ov-about { padding:24px 20px !important; }
        }
        @media(max-width:360px){
          .ov-places-grid { grid-template-columns:1fr; }
        }
      `}</style>

      {/* ── INFO GRID ── */}
      <div className="ov-info-grid">
        {infoItems.map((item) => (
          <Card key={item.label} className="ov-info-card">
            <div className="ov-info-icon">{item.icon}</div>
            <div>
              <div className="ov-info-lbl">{item.label}</div>
              <div className="ov-info-val">{item.value}</div>
            </div>
          </Card>
        ))}
      </div>

      {/* ── BUDGET STRIP ── */}
      {(destination.estimated_flight_cost ||
        destination.estimated_stay_cost ||
        destination.estimated_food_cost) && (
        <div className="ov-budget-strip">
          <div className="ov-budget-items">
            {[
              { label: "Flight", val: destination.estimated_flight_cost },
              { label: "Stay / night", val: destination.estimated_stay_cost },
              { label: "Food / day", val: destination.estimated_food_cost },
            ]
              .filter((i) => i.val)
              .map((item, i, arr) => (
                <React.Fragment key={item.label}>
                  <div className="ov-budget-item">
                    <div className="ov-budget-lbl">{item.label}</div>
                    <div className="ov-budget-val">
                      ₹{Number(item.val).toLocaleString()}
                    </div>
                  </div>
                  {i < arr.length - 1 && <div className="ov-budget-divider" />}
                </React.Fragment>
              ))}
          </div>
          <div style={{ position: "relative", zIndex: 1 }}>
            <div className="ov-budget-total-lbl">Base Estimate</div>
            <div className="ov-budget-total-val">
              ₹
              {Number(
                (destination.estimated_flight_cost || 0) +
                  (destination.estimated_stay_cost || 0) +
                  (destination.estimated_food_cost || 0),
              ).toLocaleString()}
            </div>
          </div>
        </div>
      )}

      {/* ── ABOUT ── */}
      {destination.description && (
        <Card className="ov-about">
          <div className="ov-about-eyebrow">About</div>
          <h2 className="ov-about-title">{destination.name}</h2>
          <p className="ov-about-text">{destination.description}</p>
        </Card>
      )}

      {/* ── TOP PLACES ── */}
      {places.length > 0 && (
        <div>
          <div className="ov-section-hdr">
            <h2 className="ov-section-title">Top Places</h2>
            <Button
              className="ov-view-all"
              onClick={() => setActiveTab("places")}
            >
              View all {places.length} →
            </Button>
          </div>
          <div className="ov-places-grid">
            {places.slice(0, 3).map((place) => (
              <Card key={place.id} className="ov-place-card">
                <div className="ov-place-img">
                  {place.image_url ? (
                    <img src={place.image_url} alt={place.name} />
                  ) : (
                    <div className="ov-place-no-img">📍</div>
                  )}
                </div>
                <CardContent className="ov-place-body">
                  <div className="ov-place-name">{place.name}</div>
                  {place.description && (
                    <div className="ov-place-desc">
                      {place.description.slice(0, 80)}
                      {place.description.length > 80 ? "..." : ""}
                    </div>
                  )}
                  {place.best_time_to_visit && (
                    <Badge
                      style={{
                        marginTop: "8px",
                        background: "var(--sand)",
                        color: "var(--terra)",
                        border: "1px solid var(--sand-dark)",
                        borderRadius: "50px",
                        fontSize: "10px",
                        fontWeight: 600,
                      }}
                    >
                      🕐 {place.best_time_to_visit}
                    </Badge>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}
    </>
  );
};

export default OverviewTab;
