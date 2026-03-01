import { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Textarea } from "@/components/ui/textarea";

const ReviewsTab = ({ destinationId }) => {
  const [reviews, setReviews] = useState([]);
  const [rating, setRating] = useState(0);
  const [hoveredRating, setHoveredRating] = useState(0);
  const [comment, setComment] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [editingReview, setEditingReview] = useState(null);
  const [currentUserId, setCurrentUserId] = useState(null);
  const [error, setError] = useState("");
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [reviewToDelete, setReviewToDelete] = useState(null);

  useEffect(() => {
    const fetchCurrentUser = async () => {
      try {
        const token = localStorage.getItem("token");
        if (token) {
          const res = await fetch("https://travel-inspiration-backend.onrender.com/api/auth/me", {
            headers: { Authorization: `Bearer ${token}` },
          });
          const data = await res.json();
          setCurrentUserId(data.user?.id || data.id);
        }
      } catch (err) {
        console.error(err);
      }
    };
    fetchCurrentUser();
  }, []);

  useEffect(() => {
    const fetchReviews = async () => {
      const token = localStorage.getItem("token");
      const res = await fetch(
        `https://travel-inspiration-backend.onrender.com/api/reviews/destination/${destinationId}`,
        { headers: { Authorization: `Bearer ${token}` } },
      );
      const data = await res.json();
      setReviews(Array.isArray(data) ? data : data.reviews || []);
    };
    fetchReviews();
  }, [destinationId, submitted]);

  useEffect(() => {
    if (currentUserId && reviews.length > 0) {
      const userReview = reviews.find((r) => r.user_id === currentUserId);
      if (userReview && !editingReview) {
        setEditingReview(userReview);
        setRating(userReview.rating);
        setComment(userReview.comment || "");
      }
    }
  }, [currentUserId, reviews]);

  const handleSubmit = async () => {
    if (!rating) {
      setError("Please select a star rating!");
      return;
    }
    setSubmitting(true);
    setError("");
    try {
      const token = localStorage.getItem("token");
      if (editingReview) {
        const res = await fetch(
          `https://travel-inspiration-backend.onrender.com/api/reviews/${editingReview.id}`,
          {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({ rating, comment: comment.trim() || null }),
          },
        );
        if (!res.ok) throw new Error("Failed to update review");
        setEditingReview(null);
      } else {
        const res = await fetch("https://travel-inspiration-backend.onrender.com/api/reviews", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            destination_id: destinationId,
            rating,
            comment: comment.trim() || null,
          }),
        });
        if (!res.ok) throw new Error("Failed to submit review");
      }
      setRating(0);
      setComment("");
      setSubmitted((p) => !p);
    } catch (err) {
      setError("Error: " + err.message);
    } finally {
      setSubmitting(false);
    }
  };

  const handleEdit = (review) => {
    setEditingReview(review);
    setRating(review.rating);
    setComment(review.comment || "");
    setError("");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDeleteClick = (id) => {
    setReviewToDelete(id);
    setDeleteDialogOpen(true);
  };
  const handleDeleteConfirm = async () => {
    setDeleteDialogOpen(false);
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(
        `https://travel-inspiration-backend.onrender.com/api/reviews/${reviewToDelete}`,
        { method: "DELETE", headers: { Authorization: `Bearer ${token}` } },
      );
      if (!res.ok) throw new Error("Failed to delete");
      setSubmitted((p) => !p);
    } catch (err) {
      setError("Error deleting: " + err.message);
    } finally {
      setReviewToDelete(null);
    }
  };
  const handleCancelEdit = () => {
    setEditingReview(null);
    setRating(0);
    setComment("");
    setError("");
  };

  const avgRating = reviews.length
    ? (reviews.reduce((s, r) => s + r.rating, 0) / reviews.length).toFixed(1)
    : null;
  const ratingLabel = (avg) =>
    avg >= 4.5
      ? "Excellent"
      : avg >= 3.5
        ? "Very Good"
        : avg >= 2.5
          ? "Good"
          : "Mixed";

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,700;0,900;1,400&family=DM+Sans:wght@300;400;500;600&display=swap');
        :root { --sand:#F5EFE6; --sand-dark:#EAE0D5; --ink:#1C1917; --ink-light:#44403C; --ink-soft:#78716C; --terra:#C4552A; --gold:#D4A853; --white:#FDFAF7; --bdr:#E7E5E4; }

        /* heading */
        .rv-heading { font-family:'Playfair Display',serif; font-size:34px; font-weight:900; color:var(--ink); margin-bottom:28px; line-height:1.1; }
        .rv-heading em { color:var(--terra); font-style:italic; }

        /* avg block */
        .rv-avg { display:flex; align-items:center; gap:20px; background:linear-gradient(135deg,#2D1B0E,#5C3520); border-radius:20px; padding:24px 28px; margin-bottom:32px; flex-wrap:wrap; }
        .rv-avg-num { font-family:'Playfair Display',serif; font-size:60px; font-weight:900; color:var(--gold); line-height:1; }
        .rv-avg-count { font-family:'DM Sans',sans-serif; font-size:13px; color:rgba(255,255,255,0.5); margin-top:6px; }

        /* form */
        .rv-form { background:var(--white); border:1px solid var(--bdr); border-radius:22px; padding:30px; margin-bottom:36px; }
        .rv-form-title { font-family:'Playfair Display',serif; font-size:22px; font-weight:800; color:var(--ink); margin-bottom:22px; }
        .rv-label { font-family:'DM Sans',sans-serif; font-size:10px; font-weight:700; letter-spacing:2.5px; text-transform:uppercase; color:var(--ink-soft); margin-bottom:10px; display:block; }
        .rv-stars { display:flex; gap:4px; margin-bottom:22px; }
        .rv-star { font-size:34px; background:none; border:none; cursor:pointer; padding:2px; transition:transform 0.15s; line-height:1; }
        .rv-star:hover { transform:scale(1.3); }
        .rv-error { font-family:'DM Sans',sans-serif; font-size:12px; color:var(--terra); background:rgba(196,85,42,0.07); border:1px solid rgba(196,85,42,0.2); padding:8px 14px; border-radius:8px; margin-bottom:14px; }

        /* shadcn Textarea override */
        .rv-textarea { background:var(--sand) !important; border:1.5px solid var(--bdr) !important; border-radius:14px !important; font-family:'DM Sans',sans-serif !important; font-size:14px !important; color:var(--ink) !important; line-height:1.65 !important; min-height:110px !important; resize:vertical; }
        .rv-textarea:focus { border-color:var(--terra) !important; background:var(--white) !important; box-shadow:0 0 0 3px rgba(196,85,42,0.1) !important; outline:none !important; }

        .rv-form-btns { display:flex; gap:12px; margin-top:18px; }
        .rv-submit { flex:2; border-radius:50px !important; font-family:'DM Sans',sans-serif !important; font-weight:700 !important; font-size:14px !important; height:auto !important; padding:12px 28px !important;
          background:linear-gradient(135deg,#2D1B0E,#5C3520) !important; color:#fff !important; border:none !important; box-shadow:0 4px 16px rgba(28,25,23,0.3) !important; transition:all 0.2s !important; }
        .rv-submit:hover:not(:disabled) { transform:translateY(-2px) !important; box-shadow:0 8px 28px rgba(28,25,23,0.4) !important; background:linear-gradient(135deg,#3D2010,var(--terra)) !important; }
        .rv-submit:disabled { opacity:0.6 !important; cursor:not-allowed !important; }
        .rv-cancel { flex:1; border-radius:50px !important; font-family:'DM Sans',sans-serif !important; font-weight:600 !important; font-size:14px !important; height:auto !important; padding:12px 24px !important;
          background:var(--sand) !important; color:var(--ink-soft) !important; border:1px solid var(--bdr) !important; transition:all 0.2s !important; }
        .rv-cancel:hover { background:var(--sand-dark) !important; }

        /* review cards */
        .rv-list {   display:grid; grid-template-columns:repeat(3,1fr); gap:22px; }
        .rv-card { background:var(--white); border:1px solid var(--bdr); border-radius:20px; padding:24px; transition:all 0.25s ease; }
        .rv-card:hover { transform:translateY(-3px); box-shadow:0 12px 36px rgba(28,25,23,0.08); }
        .rv-card-top { display:flex; justify-content:space-between; align-items:flex-start; margin-bottom:14px; }
        .rv-avatar-row { display:flex; align-items:center; gap:12px; }
        .rv-reviewer { font-family:'DM Sans',sans-serif; font-size:14px; font-weight:600; color:var(--ink); }
        .rv-date { font-family:'DM Sans',sans-serif; font-size:11px; color:var(--ink-soft); margin-top:3px; }
        .rv-action-row { display:flex; gap:4px; margin-left:8px; }
        .rv-action-btn { background:none !important; border:none !important; cursor:pointer; font-size:16px; padding:6px 8px !important; border-radius:8px !important; transition:background 0.2s, transform 0.15s !important; height:auto !important; }
        .rv-action-btn:hover { transform:scale(1.2) !important; }
        .rv-action-btn.edit:hover { background:var(--sand) !important; }
        .rv-action-btn.del:hover { background:#FEE2E2 !important; }
        .rv-comment { font-family:'DM Sans',sans-serif; font-size:15px; color:var(--ink-light); line-height:1.75; padding-top:14px; border-top:1px solid var(--bdr); }
        .rv-quote { color:var(--terra); font-size:20px; }

        /* empty */
        .rv-empty { text-align:center; padding:80px 20px; }
        .rv-empty-title { font-family:'Playfair Display',serif; font-size:22px; font-weight:800; color:var(--ink); margin-bottom:8px; }
        .rv-empty-sub { font-family:'DM Sans',sans-serif; font-size:14px; color:var(--ink-soft); }

        /* delete dialog */
        .del-confirm { border-radius:50px !important; font-family:'DM Sans',sans-serif !important; font-weight:700 !important; font-size:14px !important; height:auto !important; padding:11px 22px !important;
          background:linear-gradient(135deg,var(--terra),#B34420) !important; color:#fff !important; border:none !important; box-shadow:0 4px 14px rgba(196,85,42,0.35) !important; }
        .del-confirm:hover { opacity:0.88 !important; transform:translateY(-1px) !important; }
        .del-cancel { border-radius:50px !important; font-family:'DM Sans',sans-serif !important; font-weight:600 !important; font-size:14px !important; height:auto !important; padding:11px 22px !important;
          background:var(--sand) !important; color:var(--ink-soft) !important; border:1px solid var(--bdr) !important; }
        .del-cancel:hover { background:var(--sand-dark) !important; }
      `}</style>

      <h2 className="rv-heading">
        Traveler <em>Reviews</em>
      </h2>

      {/* ── Avg Rating ── */}
      {avgRating && (
        <div className="rv-avg">
          <div>
            <div className="rv-avg-num">{avgRating}</div>
            <div style={{ display: "flex", gap: "3px", marginTop: "6px" }}>
              {[1, 2, 3, 4, 5].map((s) => (
                <span key={s} style={{ fontSize: "18px" }}>
                  {s <= Math.round(avgRating) ? "⭐" : "☆"}
                </span>
              ))}
            </div>
            <div className="rv-avg-count">
              {reviews.length} review{reviews.length !== 1 ? "s" : ""}
            </div>
          </div>
          <Badge
            style={{
              marginLeft: "auto",
              background: "rgba(212,168,83,0.18)",
              color: "var(--gold)",
              border: "1px solid rgba(212,168,83,0.35)",
              borderRadius: "50px",
              fontSize: "12px",
              fontWeight: 700,
              padding: "6px 16px",
            }}
          >
            {ratingLabel(parseFloat(avgRating))}
          </Badge>
        </div>
      )}

      {/* ── Form ── */}
      <div className="rv-form">
        <div className="rv-form-title">
          {editingReview ? "✏️ Update Your Review" : "✍️ Write a Review"}
        </div>
        <label className="rv-label">Your Rating</label>
        <div className="rv-stars" onMouseLeave={() => setHoveredRating(0)}>
          {[1, 2, 3, 4, 5].map((s) => (
            <button
              key={s}
              className="rv-star"
              onClick={() => {
                setRating(s);
                setError("");
              }}
              onMouseEnter={() => setHoveredRating(s)}
            >
              {(hoveredRating || rating) >= s ? "⭐" : "☆"}
            </button>
          ))}
        </div>
        {error && <div className="rv-error">⚠ {error}</div>}
        <label className="rv-label">Your Experience</label>
        <Textarea
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          placeholder="Share your experience with this destination..."
          className="rv-textarea"
        />
        <div className="rv-form-btns">
          <Button
            className="rv-submit"
            onClick={handleSubmit}
            disabled={submitting}
          >
            {submitting
              ? "Saving..."
              : editingReview
                ? "Update Review"
                : "Submit Review →"}
          </Button>
          {editingReview && (
            <Button className="rv-cancel" onClick={handleCancelEdit}>
              Cancel
            </Button>
          )}
        </div>
      </div>

      {/* ── List ── */}
      {reviews.length === 0 ? (
        <div className="rv-empty">
          <div style={{ fontSize: "52px", marginBottom: "16px" }}>⭐</div>
          <div className="rv-empty-title">No reviews yet</div>
          <div className="rv-empty-sub">
            Be the first to share your experience!
          </div>
        </div>
      ) : (
        <div className="rv-list">
          {reviews.map((r) => (
            <div key={r.id} className="rv-card">
              <div className="rv-card-top">
                <div className="rv-avatar-row">
                  <Avatar>
                    <AvatarFallback
                      style={{
                        background:
                          "linear-gradient(135deg,var(--terra),#B34420)",
                        color: "#fff",
                        fontFamily: "'Playfair Display',serif",
                        fontWeight: 700,
                        fontSize: "16px",
                      }}
                    >
                      T
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <div className="rv-reviewer">Traveler</div>
                    <div className="rv-date">
                      {new Date(r.created_at).toLocaleDateString("en-IN", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      })}
                    </div>
                  </div>
                </div>
                <div style={{ display: "flex", alignItems: "center" }}>
                  <div
                    style={{
                      display: "flex",
                      gap: "2px",
                      background: "rgba(212,168,83,0.12)",
                      border: "1px solid rgba(212,168,83,0.3)",
                      padding: "5px 12px",
                      borderRadius: "50px",
                    }}
                  >
                    {[1, 2, 3, 4, 5].map((s) => (
                      <span key={s} style={{ fontSize: "13px" }}>
                        {s <= r.rating ? "⭐" : "☆"}
                      </span>
                    ))}
                  </div>
                  {currentUserId && r.user_id === currentUserId && (
                    <div className="rv-action-row">
                      <Button
                        className="rv-action-btn edit"
                        onClick={() => handleEdit(r)}
                        title="Edit"
                      >
                        ✏️
                      </Button>
                      <Button
                        className="rv-action-btn del"
                        onClick={() => handleDeleteClick(r.id)}
                        title="Delete"
                      >
                        🗑️
                      </Button>
                    </div>
                  )}
                </div>
              </div>
              <div className="rv-comment">
                {r.comment ? (
                  <>
                    <span className="rv-quote">"</span>
                    {r.comment}
                    <span className="rv-quote">"</span>
                  </>
                ) : (
                  <span
                    style={{
                      color: "var(--ink-soft)",
                      fontStyle: "italic",
                      fontSize: "13px",
                    }}
                  >
                    No comment provided.
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ── Delete Dialog ── */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent
          style={{
            maxWidth: "380px",
            borderRadius: "22px",
            border: "1px solid var(--bdr)",
          }}
        >
          <DialogHeader>
            <div
              style={{
                fontSize: "44px",
                textAlign: "center",
                marginBottom: "10px",
              }}
            >
              🗑️
            </div>
            <DialogTitle
              style={{
                fontFamily: "'Playfair Display',serif",
                fontSize: "20px",
                fontWeight: "800",
                color: "#1C1917",
                textAlign: "center",
              }}
            >
              Delete Review?
            </DialogTitle>
            <DialogDescription
              style={{
                fontFamily: "'DM Sans',sans-serif",
                fontSize: "14px",
                color: "#78716C",
                textAlign: "center",
              }}
            >
              This action cannot be undone. Your review will be permanently
              removed.
            </DialogDescription>
          </DialogHeader>
          <div
            style={{
              display: "flex",
              gap: "12px",
              justifyContent: "center",
              marginTop: "12px",
            }}
          >
            <Button
              className="del-cancel"
              onClick={() => setDeleteDialogOpen(false)}
            >
              Keep it
            </Button>
            <Button className="del-confirm" onClick={handleDeleteConfirm}>
              Yes, Delete
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default ReviewsTab;
