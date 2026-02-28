import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const getActivityIcon = (type) => {
  const icons = {
    hiking: "🥾",
    festival: "🎉",
    food: "🍽️",
    tour: "🚌",
    water_sport: "🏄",
    wildlife: "🦁",
    adventure: "🧗",
    cultural: "🏛️",
  };
  return icons[type] || "🎯";
};

const ActivitiesTab = ({ activities, selectedActivities, toggleActivity }) => {
  if (!activities || activities.length === 0) {
    return (
      <>
        <style>{`@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,700;0,900;1,400&family=DM+Sans:wght@300;400;500;600&display=swap');`}</style>
        <div style={{ textAlign: "center", padding: "80px 20px" }}>
          <p style={{ fontSize: "52px", marginBottom: "16px" }}>🎯</p>
          <p
            style={{
              fontFamily: "'Playfair Display',serif",
              fontSize: "22px",
              color: "#1C1917",
              fontWeight: "700",
              marginBottom: "8px",
            }}
          >
            No activities yet
          </p>
          <p
            style={{
              fontFamily: "'DM Sans',sans-serif",
              color: "#78716C",
              fontSize: "14px",
            }}
          >
            Adventures are being planned
          </p>
        </div>
      </>
    );
  }

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,700;0,900;1,400&family=DM+Sans:wght@300;400;500;600&display=swap');
        :root { --sand:#F5EFE6; --sand-dark:#EAE0D5; --ink:#1C1917; --ink-soft:#78716C; --terra:#C4552A; --white:#FDFAF7; --bdr:#E7E5E4; }

        .at-grid{ display:grid;grid-template-columns:repeat(3,1fr);gap:22px; }

        .at-card { border-radius:20px !important; border:1px solid var(--bdr) !important; background:var(--white) !important;
          transition:all 0.3s ease; position:relative; overflow:hidden; }
        .at-card::before { content:''; position:absolute; left:0; top:0; bottom:0; width:3px; background:var(--terra); opacity:0; transition:opacity 0.3s; border-radius:3px 0 0 3px; }
        .at-card:hover { transform:translateY(-5px); box-shadow:0 18px 48px rgba(28,25,23,0.1) !important; }
        .at-card:hover::before, .at-card.selected::before { opacity:1; }
        .at-card.selected { border:2px solid var(--terra) !important; box-shadow:0 0 0 4px rgba(196,85,42,0.1) !important; }

        .at-body { padding:24px !important; }
        .at-icon-row { display:flex; align-items:center; gap:12px; margin-bottom:14px; }
        .at-icon { width:48px; height:48px; border-radius:14px; background:var(--sand); display:flex; align-items:center; justify-content:center; font-size:22px; flex-shrink:0; }
        .at-name { font-family:'Playfair Display',serif; font-size:18px; font-weight:800; color:var(--ink); margin-bottom:8px; line-height:1.2; }
        .at-desc { font-family:'DM Sans',sans-serif; font-size:13px; color:var(--ink-soft); line-height:1.65; font-weight:300; margin-bottom:14px; }
        .at-tags { display:flex; gap:6px; flex-wrap:wrap; margin-bottom:16px; }

        .at-btn { width:100%; border-radius:12px !important; font-family:'DM Sans',sans-serif !important; font-weight:700 !important; font-size:13px !important; height:auto !important; padding:11px !important; transition:all 0.2s !important; }
        .at-btn.idle { background:var(--ink) !important; color:#fff !important; border:none !important; }
        .at-btn.idle:hover { background:var(--terra) !important; box-shadow:0 6px 20px rgba(196,85,42,0.35) !important; transform:translateY(-1px) !important; }
        .at-btn.done { background:linear-gradient(135deg,var(--terra),#B34420) !important; color:#fff !important; border:none !important; }

        @media(max-width:640px){ .at-grid{grid-template-columns:1fr; gap:14px;} }
      `}</style>

      <div className="at-grid">
        {activities.map((activity) => {
          const isSelected = selectedActivities.includes(activity.id);
          return (
            <Card
              key={activity.id}
              className={`at-card ${isSelected ? "selected" : ""}`}
            >
              <CardContent className="at-body">
                <div className="at-icon-row">
                  <div className="at-icon">
                    {getActivityIcon(activity.type)}
                  </div>
                  {activity.type && (
                    <Badge
                      style={{
                        background: "rgba(196,85,42,0.1)",
                        color: "var(--terra)",
                        border: "none",
                        borderRadius: "50px",
                        fontSize: "10px",
                        fontWeight: 700,
                        letterSpacing: "1.5px",
                        textTransform: "uppercase",
                      }}
                    >
                      {activity.type.replace("_", " ")}
                    </Badge>
                  )}
                </div>
                <div className="at-name">{activity.name}</div>
                {activity.description && (
                  <div className="at-desc">{activity.description}</div>
                )}
                <div className="at-tags">
                  {activity.duration_hours && (
                    <Badge
                      style={{
                        background: "var(--sand)",
                        color: "var(--ink)",
                        border: "1px solid var(--sand-dark)",
                        borderRadius: "50px",
                        fontSize: "11px",
                        fontWeight: 600,
                      }}
                    >
                      ⏱ {activity.duration_hours} hrs
                    </Badge>
                  )}
                  {activity.estimated_cost > 0 && (
                    <Badge
                      style={{
                        background: "#ECFDF5",
                        color: "#065F46",
                        border: "1px solid #A7F3D0",
                        borderRadius: "50px",
                        fontSize: "11px",
                        fontWeight: 600,
                      }}
                    >
                      ₹{activity.estimated_cost}
                    </Badge>
                  )}
                  {activity.cost_type && (
                    <Badge
                      style={{
                        background: "#FEF3C7",
                        color: "#92400E",
                        border: "1px solid #FDE68A",
                        borderRadius: "50px",
                        fontSize: "11px",
                        fontWeight: 600,
                      }}
                    >
                      {activity.cost_type}
                    </Badge>
                  )}
                </div>
                <Button
                  className={`at-btn ${isSelected ? "done" : "idle"}`}
                  onClick={() => toggleActivity(activity.id)}
                >
                  {isSelected ? "✓ Activity Selected" : "Select Activity"}
                </Button>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </>
  );
};

export default ActivitiesTab;
