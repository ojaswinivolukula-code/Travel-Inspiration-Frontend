import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const PlacesTab = ({ places, selectedPlaces, togglePlace }) => {
  if (!places || places.length === 0) {
    return (
      <>
        <style>{`@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,700;0,900;1,400&family=DM+Sans:wght@300;400;500;600&display=swap');`}</style>
        <div style={{ textAlign: "center", padding: "80px 20px" }}>
          <p style={{ fontSize: "52px", marginBottom: "16px" }}>📍</p>
          <p
            style={{
              fontFamily: "'Playfair Display',serif",
              fontSize: "22px",
              color: "#1C1917",
              fontWeight: "700",
              marginBottom: "8px",
            }}
          >
            No places yet
          </p>
          <p
            style={{
              fontFamily: "'DM Sans',sans-serif",
              color: "#78716C",
              fontSize: "14px",
            }}
          >
            Check back soon for top spots
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

        .pt-grid { display:grid; grid-template-columns:repeat(3,1fr); gap:22px; }

        .pt-card { border-radius:20px !important; overflow:hidden; border:1px solid var(--bdr) !important;
          background:var(--white) !important; transition:all 0.3s ease; padding:0 !important; }
        .pt-card:hover { transform:translateY(-6px); box-shadow:0 20px 50px rgba(28,25,23,0.12) !important; }
        .pt-card.selected { border:2px solid var(--terra) !important; box-shadow:0 0 0 4px rgba(196,85,42,0.1) !important; }

        .pt-img { height:180px; overflow:hidden; background:linear-gradient(135deg,var(--sand),var(--sand-dark)); position:relative; }
        .pt-img img { width:100%; height:100%; object-fit:cover; transition:opacity 0.3s; }
        .pt-card:hover .pt-img img { opacity:0.9; }
        .pt-img-empty { width:100%; height:100%; display:flex; align-items:center; justify-content:center; font-size:48px; }

        .pt-body { padding:18px 20px !important; }
        .pt-name { font-family:'Playfair Display',serif; font-size:18px; font-weight:800; color:var(--ink); margin-bottom:8px; line-height:1.2; }
        .pt-desc { font-family:'DM Sans',sans-serif; font-size:13px; color:var(--ink-soft); line-height:1.65; font-weight:300; margin-bottom:14px; }
        .pt-tags { display:flex; gap:6px; flex-wrap:wrap; margin-bottom:16px; }

        .pt-btn { width:100%; border-radius:12px !important; font-family:'DM Sans',sans-serif !important; font-weight:700 !important; font-size:13px !important; transition:all 0.2s !important; height:auto !important; padding:11px !important; }
        .pt-btn.idle { background:var(--ink) !important; color:#fff !important; border:none !important; }
        .pt-btn.idle:hover { background:var(--terra) !important; box-shadow:0 6px 20px rgba(196,85,42,0.35) !important; transform:translateY(-1px) !important; }
        .pt-btn.done { background:linear-gradient(135deg,var(--terra),#B34420) !important; color:#fff !important; border:none !important; }

        @media(max-width:640px){ .pt-grid{grid-template-columns:repeat(2,1fr);gap:14px;} .pt-img{height:140px;} }
        @media(max-width:380px){ .pt-grid{grid-template-columns:1fr;} }
      `}</style>

      <div className="pt-grid">
        {places.map((place) => {
          const isSelected = selectedPlaces.includes(place.id);
          return (
            <Card
              key={place.id}
              className={`pt-card ${isSelected ? "selected" : ""}`}
            >
              <div className="pt-img">
                {place.image_url ? (
                  <img src={place.image_url} alt={place.name} />
                ) : (
                  <div className="pt-img-empty">📍</div>
                )}
                {isSelected && (
                  <Badge
                    style={{
                      position: "absolute",
                      top: 12,
                      right: 12,
                      background: "var(--terra)",
                      color: "#fff",
                      borderRadius: "50px",
                      border: "none",
                      fontSize: "10px",
                      fontWeight: 700,
                      letterSpacing: "1.5px",
                    }}
                  >
                    ✓ Selected
                  </Badge>
                )}
              </div>
              <CardContent className="pt-body">
                <div className="pt-name">{place.name}</div>
                {place.description && (
                  <div className="pt-desc">
                    {place.description.slice(0, 100)}
                    {place.description.length > 100 ? "..." : ""}
                  </div>
                )}
                <div className="pt-tags">
                  {place.best_time_to_visit && (
                    <Badge
                      style={{
                        background: "var(--sand)",
                        color: "var(--terra)",
                        border: "1px solid var(--sand-dark)",
                        borderRadius: "50px",
                        fontSize: "11px",
                        fontWeight: 600,
                      }}
                    >
                      🕐 {place.best_time_to_visit}
                    </Badge>
                  )}
                  {place.entry_fee > 0 && (
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
                      ₹{place.entry_fee}
                    </Badge>
                  )}
                </div>
                <Button
                  className={`pt-btn ${isSelected ? "done" : "idle"}`}
                  onClick={() => togglePlace(place.id)}
                >
                  {isSelected ? "✓ Place Selected" : "Select Place"}
                </Button>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </>
  );
};

export default PlacesTab;
