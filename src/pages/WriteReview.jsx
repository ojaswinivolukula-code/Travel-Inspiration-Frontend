import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import ReviewsTab from "../components/destination/ReviewsTab";

const WriteReview = () => {
  const { destinationId } = useParams();
  const navigate = useNavigate();

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,700;0,900;1,400&family=DM+Sans:wght@300;400;500;600&display=swap');
        :root { --sand:#F5EFE6; --terra:#C4552A; --gold:#D4A853; --white:#FDFAF7; }
        .wr-page { min-height:100vh; background:var(--sand); padding:0 0 60px; font-family:'DM Sans',sans-serif; }
        .wr-topbar { background:linear-gradient(135deg,#2D1B0E,#5C3520); padding:20px 32px; display:flex; align-items:center; gap:16px; }
        .wr-topbar-title { font-family:'Playfair Display',serif; font-size:22px; font-weight:800; color:#fff; }
        .wr-topbar-title em { color:var(--gold); font-style:italic; }
        .wr-inner { max-width:820px; margin:40px auto 0; padding:0 24px; }
        .wr-back { border-radius:50px !important; font-family:'DM Sans',sans-serif !important; font-weight:600 !important; font-size:13px !important; height:auto !important; padding:8px 18px !important;
          background:rgba(255,255,255,0.12) !important; color:rgba(255,255,255,0.85) !important; border:1px solid rgba(255,255,255,0.2) !important; backdrop-filter:blur(8px); transition:all 0.2s !important; }
        .wr-back:hover { background:rgba(255,255,255,0.22) !important; color:#fff !important; transform:translateX(-2px) !important; }
      `}</style>

      <div className="wr-page">
        <div className="wr-topbar">
          <Button className="wr-back" onClick={() => navigate(-1)}>
            ← Back
          </Button>
          <span className="wr-topbar-title">
            Share Your <em>Experience</em>
          </span>
        </div>
        <div className="wr-inner">
          <ReviewsTab destinationId={destinationId} />
        </div>
      </div>
    </>
  );
};

export default WriteReview;
