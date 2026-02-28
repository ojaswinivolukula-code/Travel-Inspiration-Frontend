import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const CulinaryTab = ({ culinary, selectedCulinary, toggleCulinary }) => {
  if (!culinary || culinary.length === 0) {
    return (
      <>
        <style>{`@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,700;0,900;1,400&family=DM+Sans:wght@300;400;500;600&display=swap');`}</style>
        <div style={{ textAlign: "center", padding: "80px 20px" }}>
          <p style={{ fontSize: "52px", marginBottom: "16px" }}>🍽️</p>
          <p
            style={{
              fontFamily: "'Playfair Display',serif",
              fontSize: "22px",
              color: "#1C1917",
              fontWeight: "700",
              marginBottom: "8px",
            }}
          >
            No culinary items yet
          </p>
          <p
            style={{
              fontFamily: "'DM Sans',sans-serif",
              color: "#78716C",
              fontSize: "14px",
            }}
          >
            Local flavours coming soon
          </p>
        </div>
      </>
    );
  }

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,700;0,900;1,400&family=DM+Sans:wght@300;400;500;600&display=swap');
        :root { --sand:#F5EFE6; --sand-dark:#EAE0D5; --ink:#1C1917; --ink-soft:#78716C; --terra:#C4552A; --gold:#D4A853; --white:#FDFAF7; --bdr:#E7E5E4; }

        .ct-grid { display:grid; grid-template-columns:repeat(3,1fr);gap:22px; }

        .ct-card { border-radius:20px !important; overflow:hidden; border:1px solid var(--bdr) !important; background:var(--white) !important; transition:all 0.3s ease; padding:0 !important; }
        .ct-card:hover { transform:translateY(-6px); box-shadow:0 20px 50px rgba(28,25,23,0.12) !important; }
        .ct-card.selected { border:2px solid var(--terra) !important; box-shadow:0 0 0 4px rgba(196,85,42,0.1) !important; }

        .ct-img { height:160px; overflow:hidden; background:linear-gradient(135deg,#FEF3C7,#FDE68A); position:relative; }
        .ct-img img { width:100%; height:100%; object-fit:cover; transition:opacity 0.3s; }
        .ct-card:hover .ct-img img { opacity:0.9; }
        .ct-img-empty { width:100%; height:100%; display:flex; align-items:center; justify-content:center; font-size:48px; }

        .ct-body { padding:18px 20px !important; }
        .ct-name { font-family:'Playfair Display',serif; font-size:18px; font-weight:800; color:var(--ink); margin-bottom:8px; line-height:1.2; }
        .ct-desc { font-family:'DM Sans',sans-serif; font-size:13px; color:var(--ink-soft); line-height:1.65; font-weight:300; margin-bottom:14px; }

        .ct-btn { width:100%; border-radius:12px !important; font-family:'DM Sans',sans-serif !important; font-weight:700 !important; font-size:13px !important; height:auto !important; padding:11px !important; transition:all 0.2s !important; }
        .ct-btn.idle { background:var(--ink) !important; color:#fff !important; border:none !important; }
        .ct-btn.idle:hover { background:var(--terra) !important; box-shadow:0 6px 20px rgba(196,85,42,0.35) !important; transform:translateY(-1px) !important; }
        .ct-btn.done { background:linear-gradient(135deg,var(--terra),#B34420) !important; color:#fff !important; border:none !important; }

        @media(max-width:640px){ .ct-grid{grid-template-columns:repeat(2,1fr);gap:14px;} .ct-img{height:130px;} }
        @media(max-width:380px){ .ct-grid{grid-template-columns:1fr;} }
      `}</style>

      <div className="ct-grid">
        {culinary.map((item) => {
          const isSelected = selectedCulinary.includes(item.id);
          return (
            <Card
              key={item.id}
              className={`ct-card ${isSelected ? "selected" : ""}`}
            >
              <div className="ct-img">
                {item.image_url ? (
                  <img src={item.image_url} alt={item.dish_name} />
                ) : (
                  <div className="ct-img-empty">🍽️</div>
                )}
                {isSelected && (
                  <Badge
                    style={{
                      position: "absolute",
                      top: 10,
                      right: 10,
                      background: "var(--terra)",
                      color: "#fff",
                      borderRadius: "50px",
                      border: "none",
                      fontSize: "10px",
                      fontWeight: 700,
                      letterSpacing: "1.5px",
                    }}
                  >
                    ✓ Added
                  </Badge>
                )}
              </div>
              <CardContent className="ct-body">
                <div className="ct-name">{item.dish_name}</div>
                {item.description && (
                  <div className="ct-desc">{item.description}</div>
                )}
                <div style={{ marginBottom: "16px" }}>
                  {item.avg_price ? (
                    <Badge
                      style={{
                        background: "rgba(196,85,42,0.08)",
                        color: "var(--terra)",
                        border: "1px solid rgba(196,85,42,0.2)",
                        borderRadius: "50px",
                        fontSize: "13px",
                        fontWeight: 700,
                        padding: "5px 12px",
                      }}
                    >
                      ₹{item.avg_price} avg
                    </Badge>
                  ) : (
                    <Badge
                      style={{
                        background: "var(--sand)",
                        color: "var(--ink-soft)",
                        border: "1px solid var(--sand-dark)",
                        borderRadius: "50px",
                        fontSize: "12px",
                        fontWeight: 500,
                        padding: "5px 12px",
                      }}
                    >
                      Price varies
                    </Badge>
                  )}
                </div>
                <Button
                  className={`ct-btn ${isSelected ? "done" : "idle"}`}
                  onClick={() => toggleCulinary(item.id)}
                >
                  {isSelected ? "✓ On Your List" : "Try This Dish"}
                </Button>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </>
  );
};

export default CulinaryTab;
