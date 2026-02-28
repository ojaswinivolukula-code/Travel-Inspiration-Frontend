import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const DestinationCard = ({ destination, onSelect }) => {
  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,700;0,900;1,400&family=DM+Sans:wght@300;400;500;600&display=swap');
        :root { --sand:#F5EFE6; --sand-dark:#EAE0D5; --ink:#1C1917; --ink-light:#44403C; --ink-soft:#78716C; --terra:#C4552A; --terra-light:#E8724A; --white:#FDFAF7; --bdr:#E7E5E4; }

        .dc-card { background:var(--sand) !important; border-radius:22px !important; border:1px solid var(--sand-dark) !important;
          overflow:hidden; cursor:pointer; transition:all 0.3s ease; position:relative; padding:0 !important; }
        .dc-card:hover { transform:translateY(-6px); box-shadow:0 20px 52px rgba(28,25,23,0.13) !important; background:var(--white) !important; }

        .dc-img { height:180px; overflow:hidden; background:linear-gradient(135deg,var(--sand),var(--sand-dark)); }
        .dc-img img { width:100%; height:100%; object-fit:cover; transition:opacity 0.3s; }
        .dc-card:hover .dc-img img { opacity:0.9; }

        .dc-body { padding:20px 22px 20px !important; }
        .dc-country-row { display:flex; align-items:center; justify-content:space-between; margin-bottom:6px; }
        .dc-name { font-family:'Playfair Display',serif; font-size:24px; font-weight:900; color:var(--ink); margin-bottom:8px; margin-top:8px; line-height:1.15; }
        .dc-desc { font-family:'DM Sans',sans-serif; font-size:13px; color:var(--ink-soft); line-height:1.65; font-weight:300; margin-bottom:18px; }
        .dc-arrow { width:32px; height:32px; border-radius:50%; background:var(--ink); color:#fff; display:flex; align-items:center; justify-content:center; font-size:13px; opacity:0; transition:opacity 0.2s, transform 0.2s; }
        .dc-card:hover .dc-arrow { opacity:1; transform:translateX(3px); }

        .dc-btn { width:100% !important; border-radius:12px !important; font-family:'DM Sans',sans-serif !important; font-weight:700 !important; font-size:13px !important; height:auto !important; padding:12px !important;
          background:var(--ink) !important; color:#fff !important; border:none !important; transition:all 0.2s !important; }
        .dc-btn:hover { background:var(--terra) !important; box-shadow:0 6px 20px rgba(196,85,42,0.35) !important; transform:translateY(-1px) !important; }
      `}</style>

      <Card className="dc-card" onClick={() => onSelect(destination)}>
        <div className="dc-img">
          {destination.image_url && (
            <img src={destination.image_url} alt={destination.name} />
          )}
        </div>
        <CardContent className="dc-body">
          <div className="dc-country-row">
            <Badge
              style={{
                background: "var(--terra)",
                color: "#fff",
                borderRadius: "50px",
                border: "none",
                fontSize: "10px",
                fontWeight: 700,
                letterSpacing: "2px",
                textTransform: "uppercase",
              }}
            >
              {destination.country}
            </Badge>
            <span className="dc-arrow">→</span>
          </div>
          <div className="dc-name">{destination.name}</div>
          {destination.description && (
            <div className="dc-desc">
              {destination.description.slice(0, 100)}
              {destination.description.length > 100 ? "..." : ""}
            </div>
          )}
          <Button
            className="dc-btn"
            onClick={(e) => {
              e.stopPropagation();
              onSelect(destination);
            }}
          >
            Explore Destination →
          </Button>
        </CardContent>
      </Card>
    </>
  );
};

export default DestinationCard;
