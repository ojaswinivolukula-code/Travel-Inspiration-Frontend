import React, { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { useAuth } from "../context/AuthContext";
import axiosInstance from "../services/axiosInstance";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

// ── Share Button ───────────────────────────────────────────────────────────
const ShareButton = ({ postId }) => {
  const [open, setOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const [pos, setPos] = useState({ top: 0, left: 0, openUp: false });
  const btnRef = React.useRef(null);
  const shareUrl = `${window.location.origin}/post/${postId}`;
  const text = "Check out this travel inspiration!";

  const MENU_H = 290;
  const MENU_W = 180;

  const platforms = [
    {
      key: "whatsapp",
      label: "WhatsApp",
      icon: "💬",
      bg: "#25D366",
      shadow: "rgba(37,211,102,0.3)",
      color: "#fff",
    },
    {
      key: "instagram",
      label: "Instagram",
      icon: "📸",
      bg: "linear-gradient(135deg,#f09433,#dc2743,#bc1888)",
      shadow: "rgba(220,39,67,0.3)",
      color: "#fff",
    },
    {
      key: "twitter",
      label: "X (Twitter)",
      icon: "𝕏",
      bg: "#000",
      shadow: "rgba(0,0,0,0.2)",
      color: "#fff",
    },
    {
      key: "facebook",
      label: "Facebook",
      icon: "📘",
      bg: "#1877F2",
      shadow: "rgba(24,119,242,0.3)",
      color: "#fff",
    },
    {
      key: "copy_link",
      label: copied ? "Copied! ✓" : "Copy Link",
      icon: "🔗",
      bg: copied ? "#16a34a" : "var(--sand)",
      shadow: "rgba(0,0,0,0.06)",
      color: copied ? "#fff" : "var(--ink)",
    },
  ];

  const handleOpen = (e) => {
    e.stopPropagation();
    if (btnRef.current) {
      const r = btnRef.current.getBoundingClientRect();
      const openUp = window.innerHeight - r.bottom < MENU_H + 16;
      const top = openUp ? r.top - MENU_H - 8 : r.bottom + 8;
      const left = Math.min(r.left, window.innerWidth - MENU_W - 12);
      setPos({ top, left, openUp });
    }
    setOpen((v) => !v);
  };

  const handleShare = async (platform) => {
    const urls = {
      whatsapp: `https://wa.me/?text=${encodeURIComponent(text + " " + shareUrl)}`,
      instagram: `https://www.instagram.com/`,
      twitter: `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(shareUrl)}`,
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`,
    };
    if (platform === "copy_link") {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => {
        setCopied(false);
        setOpen(false);
      }, 1500);
      return;
    }
    try {
      await axiosInstance.post("/social-shares", { post_id: postId, platform });
    } catch {}
    window.open(urls[platform], "_blank");
    setOpen(false);
  };

  React.useEffect(() => {
    if (!open) return;
    const close = () => setOpen(false);
    window.addEventListener("scroll", close, true);
    return () => window.removeEventListener("scroll", close, true);
  }, [open]);

  return (
    <>
      <button ref={btnRef} className="action-pill" onClick={handleOpen}>
        🔗 Share
      </button>
      {open &&
        typeof document !== "undefined" &&
        createPortal(
          <>
            <div
              style={{ position: "fixed", inset: 0, zIndex: 9998 }}
              onClick={() => setOpen(false)}
            />
            <div
              style={{
                position: "fixed",
                top: pos.top,
                left: pos.left,
                width: MENU_W,
                zIndex: 9999,
                background: "#fff",
                border: "1px solid var(--sand-dark)",
                borderRadius: "16px",
                padding: "10px",
                boxShadow: "0 16px 48px rgba(28,25,23,0.18)",
                display: "flex",
                flexDirection: "column",
                gap: "6px",
                animation: "sharePopIn 0.18s ease both",
              }}
            >
              <div
                style={{
                  fontSize: "10px",
                  color: "var(--ink-soft)",
                  fontWeight: "700",
                  letterSpacing: "1.5px",
                  textTransform: "uppercase",
                  padding: "2px 6px 8px",
                  borderBottom: "1px solid var(--sand-dark)",
                  marginBottom: "2px",
                  fontFamily: "'DM Sans',sans-serif",
                }}
              >
                Share via
              </div>
              {platforms.map(({ key, label, icon, bg, shadow, color }) => (
                <button
                  key={key}
                  onClick={(e) => {
                    e.stopPropagation();
                    handleShare(key);
                  }}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "10px",
                    padding: "9px 12px",
                    border: "none",
                    borderRadius: "10px",
                    cursor: "pointer",
                    fontFamily: "'DM Sans',sans-serif",
                    fontSize: "13px",
                    fontWeight: "600",
                    background: bg,
                    color,
                    boxShadow: `0 3px 10px ${shadow}`,
                    transition: "transform 0.15s, box-shadow 0.15s",
                    width: "100%",
                    textAlign: "left",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = "translateY(-2px)";
                    e.currentTarget.style.boxShadow = `0 7px 18px ${shadow}`;
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = "translateY(0)";
                    e.currentTarget.style.boxShadow = `0 3px 10px ${shadow}`;
                  }}
                >
                  <span
                    style={{
                      fontSize: "16px",
                      width: "20px",
                      textAlign: "center",
                      lineHeight: 1,
                      flexShrink: 0,
                    }}
                  >
                    {icon}
                  </span>
                  {label}
                </button>
              ))}
            </div>
          </>,
          document.body,
        )}
    </>
  );
};

// ── Main Community Component ───────────────────────────────────────────────
const Community = () => {
  const { user } = useAuth();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCreate, setShowCreate] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [openComments, setOpenComments] = useState({});
  const [comments, setComments] = useState({});
  const [commentText, setCommentText] = useState({});
  const [likedPosts, setLikedPosts] = useState({});
  const [likeCounts, setLikeCounts] = useState({});
  const [following, setFollowing] = useState({});
  const [allUsers, setAllUsers] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("feed");
  const [form, setForm] = useState({
    title: "",
    content: "",
    image_url: "",
    visibility: "public",
  });

  const avatarColors = [
    "linear-gradient(135deg,#C8A96E,#E8907A)",
    "linear-gradient(135deg,#7CB9A8,#5A9E8E)",
    "linear-gradient(135deg,#B8A0D4,#9B7EC8)",
    "linear-gradient(135deg,#E8907A,#C8A96E)",
    "linear-gradient(135deg,#5A9E8E,#7CB9A8)",
  ];

  const fetchPosts = async () => {
    setLoading(true);
    try {
      const [postsRes, usersRes] = await Promise.all([
        axiosInstance.get("/posts"),
        axiosInstance.get("/users"),
      ]);
      const data = Array.isArray(postsRes.data) ? postsRes.data : [];
      setPosts(data);
      const counts = {};
      data.forEach((p) => {
        counts[p.id] = p.like_count || 0;
      });
      setLikeCounts(counts);
      const fetchedUsers = Array.isArray(usersRes.data) ? usersRes.data : [];
      setAllUsers(
        fetchedUsers.map((u) => ({
          ...u,
          postCount: data.filter((p) => p.user_id === u.id).length,
        })),
      );
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  const handleCreatePost = async () => {
    if (!form.content.trim()) return;
    setSubmitting(true);
    try {
      await axiosInstance.post("/posts", form);
      setForm({ title: "", content: "", image_url: "", visibility: "public" });
      setShowCreate(false);
      fetchPosts();
    } catch (err) {
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeletePost = async (postId) => {
    try {
      await axiosInstance.delete(`/posts/${postId}`);
      setPosts((prev) => prev.filter((p) => p.id !== postId));
    } catch (err) {
      console.error(err);
    }
  };

  const handleLike = async (postId) => {
    const isLiked = likedPosts[postId];
    setLikedPosts((prev) => ({ ...prev, [postId]: !isLiked }));
    setLikeCounts((prev) => ({
      ...prev,
      [postId]: (prev[postId] || 0) + (isLiked ? -1 : 1),
    }));
    try {
      if (isLiked)
        await axiosInstance.delete("/likes", { data: { post_id: postId } });
      else await axiosInstance.post("/likes", { post_id: postId });
    } catch {
      setLikedPosts((prev) => ({ ...prev, [postId]: isLiked }));
      setLikeCounts((prev) => ({
        ...prev,
        [postId]: (prev[postId] || 0) + (isLiked ? 1 : -1),
      }));
    }
  };

  const toggleComments = async (postId) => {
    const isOpen = openComments[postId];
    setOpenComments((prev) => ({ ...prev, [postId]: !isOpen }));
    if (!isOpen && !comments[postId]) {
      try {
        const res = await axiosInstance.get(`/comments/post/${postId}`);
        setComments((prev) => ({
          ...prev,
          [postId]: Array.isArray(res.data) ? res.data : [],
        }));
      } catch {
        setComments((prev) => ({ ...prev, [postId]: [] }));
      }
    }
  };

  const handleAddComment = async (postId) => {
    const text = commentText[postId]?.trim();
    if (!text) return;
    try {
      const res = await axiosInstance.post("/comments", {
        post_id: postId,
        comment: text,
      });
      const newComment = Array.isArray(res.data) ? res.data[0] : res.data;
      setComments((prev) => ({
        ...prev,
        [postId]: [...(prev[postId] || []), newComment],
      }));
      setCommentText((prev) => ({ ...prev, [postId]: "" }));
    } catch (err) {
      console.error(err);
    }
  };

  const handleFollow = async (targetUserId) => {
    const isFollowing = following[targetUserId];
    setFollowing((prev) => ({ ...prev, [targetUserId]: !isFollowing }));
    try {
      if (isFollowing)
        await axiosInstance.delete("/follows", {
          data: { following_id: targetUserId },
        });
      else await axiosInstance.post("/follows", { following_id: targetUserId });
    } catch {
      setFollowing((prev) => ({ ...prev, [targetUserId]: isFollowing }));
    }
  };

  const timeAgo = (date) => {
    const diff = (Date.now() - new Date(date)) / 1000;
    if (diff < 60) return "just now";
    if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
    if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
    return `${Math.floor(diff / 86400)}d ago`;
  };

  const getInitial = (name) => (name || "U")[0].toUpperCase();
  const filteredUsers = allUsers.filter((u) =>
    u.name?.toLowerCase().includes(searchQuery.toLowerCase()),
  );
  const followingCount = Object.values(following).filter(Boolean).length;

  const visClass = {
    public: "vis-public",
    followers: "vis-followers",
    private: "vis-private",
  };

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

        /* ── Layout ── */
        .cm-page { font-family: 'DM Sans', sans-serif; max-width: 760px; margin: 0 auto; padding: 0 0 60px; }

        /* ── Page Header ── */
        .cm-header { display: flex; align-items: center; justify-content: space-between; padding: 0 0 24px; flex-wrap: wrap; gap: 12px; }
        .cm-header-left {}
        .cm-title { font-family: 'Playfair Display', serif; font-size: 26px; font-weight: 700; color: var(--ink); margin: 0; }
        .cm-sub { font-size: 13px; color: var(--ink-soft); margin-top: 3px; font-weight: 400; }
        .cm-new-btn {
          background: var(--ink); color: var(--gold); border: none;
          font-family: 'DM Sans', sans-serif; font-size: 13px; font-weight: 600;
          padding: 10px 22px; border-radius: 10px; cursor: pointer;
          letter-spacing: 0.5px;
          transition: all 0.25s; white-space: nowrap;
        }
        .cm-new-btn:hover { background: var(--terracotta); color: #fff; box-shadow: 0 8px 24px rgba(196,85,42,0.3); transform: translateY(-1px); }

        /* ── Mobile Hamburger ── */
        .cm-hamburger { display: none; flex-direction: column; gap: 5px; background: var(--sand); border: 1px solid var(--border); border-radius: 10px; padding: 10px; cursor: pointer; }
        .cm-hamburger span { display: block; width: 18px; height: 1.5px; background: var(--ink); border-radius: 2px; transition: all 0.3s; }
        .cm-hamburger.open span:nth-child(1) { transform: translateY(6.5px) rotate(45deg); }
        .cm-hamburger.open span:nth-child(2) { opacity: 0; }
        .cm-hamburger.open span:nth-child(3) { transform: translateY(-6.5px) rotate(-45deg); }

        /* ── Mobile Tab Sheet ── */
        .cm-mobile-sheet-ov { display: none; position: fixed; inset: 0; background: rgba(28,25,23,0.45); z-index: 190; backdrop-filter: blur(4px); }
        .cm-mobile-sheet-ov.open { display: block; }
        .cm-mobile-sheet { position: fixed; top: 0; right: -100%; bottom: 0; width: min(280px,80vw); z-index: 195; background: var(--white); border-left: 1px solid var(--border); display: flex; flex-direction: column; transition: right 0.35s cubic-bezier(0.4,0,0.2,1); padding: 28px 20px; gap: 8px; }
        .cm-mobile-sheet.open { right: 0; }
        .cm-mobile-sheet-title { font-family: 'Playfair Display', serif; font-size: 18px; font-weight: 800; color: var(--ink); margin-bottom: 16px; }
        .cm-mobile-tab { font-family: 'DM Sans', sans-serif; font-size: 14px; font-weight: 500; color: var(--ink-soft); background: none; border: none; text-align: left; padding: 12px 14px; border-radius: 10px; cursor: pointer; transition: all 0.2s; }
        .cm-mobile-tab.active { background: var(--sand); color: var(--ink); font-weight: 600; }
        .cm-mobile-tab:hover { background: var(--sand); color: var(--ink); }

        /* ── Desktop Tabs ── */
        .cm-tabs-desktop { display: flex; gap: 4px; background: var(--white); border: 1px solid var(--border); border-radius: 14px; padding: 4px; margin-bottom: 28px; }
        .cm-tab-btn { flex: 1; padding: 10px 8px; border: none; border-radius: 10px; font-family: 'DM Sans', sans-serif; font-size: 13px; font-weight: 600; cursor: pointer; transition: all 0.2s; background: transparent; color: var(--ink-soft); white-space: nowrap; }
        .cm-tab-btn.active { background: var(--ink); color: var(--gold); font-weight: 700; }
        .cm-tab-btn:not(.active):hover { background: var(--sand); color: var(--ink); }

        /* ── Create Post Card ── */
        .create-card { background: var(--white); border: 1.5px solid var(--border); border-radius: 20px; padding: 24px; margin-bottom: 20px; animation: fadeUp 0.3s ease both; }
        .create-title { font-family: 'Playfair Display', serif; font-size: 20px; font-weight: 800; color: var(--ink); margin-bottom: 18px; }
        .create-row { display: flex; gap: 10px; align-items: center; flex-wrap: wrap; }
        .create-select { flex: 1; min-width: 140px; padding: 10px 14px; border: 1.5px solid var(--border); border-radius: 10px; font-size: 13px; font-family: 'DM Sans', sans-serif; background: var(--cream); color: var(--ink-soft); outline: none; cursor: pointer; }
        .create-select:focus { border-color: var(--gold); }

        /* ── Post Card ── */
        .post-card { background: var(--white); border: 1.5px solid var(--border); border-radius: 20px; margin-bottom: 16px; overflow: hidden; transition: box-shadow 0.3s, transform 0.3s; animation: fadeUp 0.4s ease both; }
        .post-card:hover { box-shadow: 0 12px 40px rgba(28,25,23,0.09); transform: translateY(-2px); }
        .post-header { display: flex; align-items: center; justify-content: space-between; padding: 16px 18px 0; gap: 10px; flex-wrap: wrap; }
        .post-author { display: flex; align-items: center; gap: 10px; flex: 1; min-width: 0; }
        .post-author-info .name { font-size: 14px; font-weight: 600; color: var(--ink); }
        .post-author-info .time { font-size: 11px; color: var(--ink-soft); margin-top: 2px; }
        .post-header-right { display: flex; align-items: center; gap: 8px; flex-shrink: 0; flex-wrap: wrap; }
        .post-vis { font-size: 10px; padding: 3px 9px; border-radius: 20px; letter-spacing: 1px; text-transform: uppercase; font-weight: 600; border: 1px solid; font-family: 'DM Sans', sans-serif; }
        .vis-public { background: #ecfdf5; color: #15803d; border-color: #bbf7d0; }
        .vis-followers { background: #eff6ff; color: #1d4ed8; border-color: #bfdbfe; }
        .vis-private { background: #fef9c3; color: #a16207; border-color: #fde68a; }

        .follow-btn { font-size: 11px; font-weight: 700; padding: 5px 12px; border-radius: 20px; border: 1.5px solid; cursor: pointer; font-family: 'DM Sans', sans-serif; transition: all 0.2s; white-space: nowrap; }
        .follow-btn.not-following { background: var(--ink); color: var(--gold); border-color: var(--ink); }
        .follow-btn.not-following:hover { background: var(--gold); color: var(--ink); border-color: var(--gold); }
        .follow-btn.is-following { background: transparent; color: var(--ink-soft); border-color: var(--border); }
        .follow-btn.is-following:hover { border-color: #ef4444; color: #ef4444; background: #fee2e2; }

        .post-body { padding: 14px 18px; }
        .post-title { font-family: 'Playfair Display', serif; font-size: 17px; font-weight: 800; color: var(--ink); margin-bottom: 7px; }
        .post-content { font-size: 14px; color: var(--ink-light); line-height: 1.75; white-space: pre-line; font-weight: 300; }
        .post-img { width: 100%; max-height: 320px; object-fit: cover; display: block; }

        .post-actions { display: flex; align-items: center; gap: 6px; padding: 10px 18px; border-top: 1px solid var(--sand-dark); flex-wrap: wrap; }
        .action-pill { display: flex; align-items: center; gap: 5px; padding: 6px 14px; border-radius: 20px; border: 1.5px solid var(--border); background: transparent; cursor: pointer; font-family: 'DM Sans', sans-serif; font-size: 12px; font-weight: 500; color: var(--ink-soft); transition: all 0.2s; }
        .action-pill:hover { border-color: var(--gold); color: var(--terracotta); background: #FDF8EF; }
        .action-pill.liked { background: #fee2e2; border-color: #fca5a5; color: #ef4444; }
        .del-btn { margin-left: auto; background: none; border: none; cursor: pointer; font-size: 11px; color: var(--ink-soft); padding: 4px 8px; border-radius: 6px; font-family: 'DM Sans', sans-serif; transition: all 0.2s; }
        .del-btn:hover { background: #fee2e2; color: #ef4444; }

        /* ── Comments ── */
        .comments-section { padding: 0 18px 14px; border-top: 1px solid var(--sand-dark); animation: fadeUp 0.2s ease both; }
        .comments-list { padding-top: 12px; display: flex; flex-direction: column; gap: 10px; margin-bottom: 12px; }
        .comment-item { display: flex; gap: 9px; }
        .comment-bubble { background: var(--cream); border-radius: 14px; padding: 8px 13px; flex: 1; }
        .comment-author { font-size: 11px; font-weight: 700; color: var(--ink); margin-bottom: 2px; }
        .comment-text { font-size: 13px; color: var(--ink-light); line-height: 1.5; }
        .comment-input-row { display: flex; gap: 8px; }

        /* ── People Grid ── */
        .people-stats { display: flex; gap: 12px; margin-bottom: 24px; flex-wrap: wrap; }
        .people-stat { background: var(--white); border: 1.5px solid var(--border); border-radius: 16px; padding: 18px 20px; flex: 1; min-width: 100px; text-align: center; transition: all 0.25s; }
        .people-stat:hover { transform: translateY(-3px); box-shadow: 0 8px 24px rgba(28,25,23,0.08); }
        .people-stat-val { font-family: 'Playfair Display', serif; font-size: 32px; font-weight: 900; color: var(--ink); }
        .people-stat-lbl { font-size: 11px; color: var(--ink-soft); text-transform: uppercase; letter-spacing: 1.5px; margin-top: 3px; }
        .people-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(180px, 1fr)); gap: 16px; }
        .person-card { background: var(--white); border: 1.5px solid var(--border); border-radius: 20px; padding: 24px 16px; text-align: center; transition: all 0.25s; }
        .person-card:hover { transform: translateY(-4px); box-shadow: 0 14px 36px rgba(28,25,23,0.1); }
        .person-card-name { font-family: 'Playfair Display', serif; font-size: 15px; font-weight: 800; color: var(--ink); margin-bottom: 4px; margin-top: 10px; }
        .person-card-posts { font-size: 12px; color: var(--ink-soft); margin-bottom: 14px; }
        .person-card-btn { width: 100%; padding: 9px; border-radius: 10px; border: 1.5px solid; font-family: 'DM Sans', sans-serif; font-size: 12px; font-weight: 700; cursor: pointer; transition: all 0.2s; }
        .person-card-btn.not-following { background: var(--ink); color: var(--gold); border-color: var(--ink); }
        .person-card-btn.not-following:hover { background: var(--gold); color: var(--ink); border-color: var(--gold); }
        .person-card-btn.is-following { background: #ecfdf5; color: #15803d; border-color: #bbf7d0; }
        .person-card-btn.is-following:hover { background: #fee2e2; color: #ef4444; border-color: #fca5a5; }

        /* ── Empty / Loading ── */
        .empty-state { text-align: center; padding: 60px 24px; border: 1px dashed var(--border); border-radius: 20px; background: rgba(255,255,255,0.6); }
        .empty-ico { font-size: 48px; margin-bottom: 12px; opacity: 0.5; }
        .empty-ttl { font-family: 'Playfair Display', serif; font-size: 22px; font-weight: 800; color: var(--ink); margin-bottom: 6px; }
        .empty-dsc { font-size: 13px; color: var(--ink-soft); font-weight: 300; }

        .loading-dots { display: flex; gap: 8px; justify-content: center; padding: 60px; }
        .ld { width: 8px; height: 8px; border-radius: 50%; background: var(--gold); animation: pulse 1.4s ease-in-out infinite; }
        .ld:nth-child(2) { animation-delay: 0.2s; }
        .ld:nth-child(3) { animation-delay: 0.4s; }

        @keyframes pulse { 0%,80%,100%{transform:scale(0.8);opacity:0.4} 40%{transform:scale(1.2);opacity:1} }
        @keyframes fadeUp { from{opacity:0;transform:translateY(14px)} to{opacity:1;transform:translateY(0)} }
        @keyframes sharePopIn { from{opacity:0;transform:translateY(6px) scale(0.97)} to{opacity:1;transform:translateY(0) scale(1)} }

        /* ── Responsive ── */
        @media (min-width: 641px) {
          .cm-hamburger { display: none !important; }
        }
        @media (max-width: 640px) {
          .cm-tabs-desktop { display: none; }
          .cm-hamburger { display: flex; }
          .cm-title { font-size: 26px; }
          .people-grid { grid-template-columns: repeat(2, 1fr); }
          .people-stats { gap: 8px; }
          .post-header { flex-direction: column; align-items: flex-start; }
          .post-header-right { width: 100%; justify-content: flex-start; }
          .cm-page { padding: 0 12px 60px; }
        }
      `}</style>

      <div className="cm-page">
        {/* ── Header ── */}
        <div className="cm-header">
          <div className="cm-header-left">
            <h1 className="cm-title">Community</h1>
            <p className="cm-sub">
              Connect with fellow travelers around the world
            </p>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            {activeTab === "feed" && (
              <button
                className="cm-new-btn"
                onClick={() => setShowCreate((v) => !v)}
              >
                {showCreate ? "✕ Cancel" : "+ New Post"}
              </button>
            )}
            {/* Hamburger — mobile only */}
            <button
              className={`cm-hamburger ${mobileMenuOpen ? "open" : ""}`}
              onClick={() => setMobileMenuOpen((v) => !v)}
              aria-label="Menu"
            >
              <span />
              <span />
              <span />
            </button>
          </div>
        </div>

        {/* ── Mobile Sheet ── */}
        <div
          className={`cm-mobile-sheet-ov ${mobileMenuOpen ? "open" : ""}`}
          onClick={() => setMobileMenuOpen(false)}
        />
        <div className={`cm-mobile-sheet ${mobileMenuOpen ? "open" : ""}`}>
          <div className="cm-mobile-sheet-title">Navigation</div>
          {[
            { key: "feed", label: "📰 Travel Feed" },
            { key: "people", label: "👥 Discover Travelers" },
            { key: "following", label: `✓ Following (${followingCount})` },
          ].map(({ key, label }) => (
            <button
              key={key}
              className={`cm-mobile-tab ${activeTab === key ? "active" : ""}`}
              onClick={() => {
                setActiveTab(key);
                setMobileMenuOpen(false);
              }}
            >
              {label}
            </button>
          ))}
        </div>

        {/* ── Desktop Tabs ── */}
        <div className="cm-tabs-desktop">
          {[
            { key: "feed", label: "📰 Travel Feed" },
            { key: "people", label: "👥 Discover Travelers" },
            { key: "following", label: `✓ Following (${followingCount})` },
          ].map(({ key, label }) => (
            <button
              key={key}
              className={`cm-tab-btn ${activeTab === key ? "active" : ""}`}
              onClick={() => setActiveTab(key)}
            >
              {label}
            </button>
          ))}
        </div>

        {/* ════════════ FEED TAB ════════════ */}
        {activeTab === "feed" && (
          <>
            {/* Create Post */}
            {showCreate && (
              <div className="create-card">
                <div className="create-title">Share your story ✦</div>
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "12px",
                  }}
                >
                  <Input
                    placeholder="Post title (optional)"
                    value={form.title}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, title: e.target.value }))
                    }
                    style={{
                      fontFamily: "'DM Sans',sans-serif",
                      background: "var(--cream)",
                      border: "1.5px solid var(--border)",
                    }}
                  />
                  <Textarea
                    placeholder="Share a travel tip, experience or memory..."
                    value={form.content}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, content: e.target.value }))
                    }
                    rows={4}
                    style={{
                      fontFamily: "'DM Sans',sans-serif",
                      background: "var(--cream)",
                      border: "1.5px solid var(--border)",
                      resize: "vertical",
                    }}
                  />
                  <Input
                    placeholder="Image URL (optional)"
                    value={form.image_url}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, image_url: e.target.value }))
                    }
                    style={{
                      fontFamily: "'DM Sans',sans-serif",
                      background: "var(--cream)",
                      border: "1.5px solid var(--border)",
                    }}
                  />
                  <div className="create-row">
                    <select
                      className="create-select"
                      value={form.visibility}
                      onChange={(e) =>
                        setForm((f) => ({ ...f, visibility: e.target.value }))
                      }
                    >
                      <option value="public">🌍 Public</option>
                      <option value="followers">👥 Followers only</option>
                      <option value="private">🔒 Private</option>
                    </select>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setShowCreate(false)}
                      style={{
                        fontFamily: "'DM Sans',sans-serif",
                        borderColor: "var(--border)",
                        color: "var(--ink-soft)",
                      }}
                    >
                      Cancel
                    </Button>
                    <button
                      onClick={handleCreatePost}
                      disabled={submitting || !form.content.trim()}
                      style={{
                        background:
                          submitting || !form.content.trim()
                            ? "var(--sand-dark)"
                            : "var(--terracotta)",
                        color:
                          submitting || !form.content.trim()
                            ? "var(--ink-soft)"
                            : "#fff",
                        border: "none",
                        borderRadius: "12px",
                        padding: "10px 22px",
                        fontFamily: "'DM Sans',sans-serif",
                        fontWeight: "700",
                        fontSize: "13px",
                        cursor:
                          submitting || !form.content.trim()
                            ? "not-allowed"
                            : "pointer",
                        boxShadow:
                          submitting || !form.content.trim()
                            ? "none"
                            : "0 4px 16px rgba(196,85,42,0.4)",
                        transition: "all 0.25s",
                        whiteSpace: "nowrap",
                        display: "flex",
                        alignItems: "center",
                        gap: "6px",
                      }}
                      onMouseEnter={(e) => {
                        if (!e.currentTarget.disabled) {
                          e.currentTarget.style.background =
                            "var(--terracotta-light)";
                          e.currentTarget.style.transform = "translateY(-2px)";
                          e.currentTarget.style.boxShadow =
                            "0 8px 24px rgba(196,85,42,0.5)";
                        }
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.background = "var(--terracotta)";
                        e.currentTarget.style.transform = "translateY(0)";
                        e.currentTarget.style.boxShadow =
                          "0 4px 16px rgba(196,85,42,0.4)";
                      }}
                    >
                      {submitting ? (
                        "Posting..."
                      ) : (
                        <>
                          <span>Post</span>
                          <span style={{ fontSize: "14px" }}>✦</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Posts */}
            {loading ? (
              <div className="loading-dots">
                <div className="ld" />
                <div className="ld" />
                <div className="ld" />
              </div>
            ) : posts.length === 0 ? (
              <div className="empty-state">
                <div className="empty-ico">✈️</div>
                <p className="empty-ttl">No posts yet</p>
                <p className="empty-dsc">
                  Be the first to share a travel story!
                </p>
              </div>
            ) : (
              posts.map((post, idx) => {
                const isOwner = post.user_id === user?.id;
                const authorName = post.profiles?.name || "Traveler";
                const isLiked = likedPosts[post.id] || false;
                const likeCount = likeCounts[post.id] || 0;
                const postComments = comments[post.id] || [];
                const isCommentsOpen = openComments[post.id] || false;
                const isFollowingUser = following[post.user_id] || false;

                return (
                  <div
                    key={post.id}
                    className="post-card"
                    style={{ animationDelay: `${idx * 0.05}s` }}
                  >
                    <div className="post-header">
                      <div className="post-author">
                        <Avatar
                          style={{
                            width: 38,
                            height: 38,
                            background: avatarColors[idx % avatarColors.length],
                            flexShrink: 0,
                          }}
                        >
                          <AvatarFallback
                            style={{
                              background:
                                avatarColors[idx % avatarColors.length],
                              color: "#fff",
                              fontFamily: "'Playfair Display',serif",
                              fontSize: "17px",
                              fontWeight: "700",
                            }}
                          >
                            {getInitial(authorName)}
                          </AvatarFallback>
                        </Avatar>
                        <div className="post-author-info">
                          <div className="name">{authorName}</div>
                          <div className="time">{timeAgo(post.created_at)}</div>
                        </div>
                      </div>
                      <div className="post-header-right">
                        {!isOwner && (
                          <button
                            className={`follow-btn ${isFollowingUser ? "is-following" : "not-following"}`}
                            onClick={() => handleFollow(post.user_id)}
                          >
                            {isFollowingUser ? "✓ Following" : "+ Follow"}
                          </button>
                        )}
                        <span
                          className={`post-vis ${visClass[post.visibility] || "vis-public"}`}
                        >
                          {post.visibility}
                        </span>
                      </div>
                    </div>

                    <div className="post-body">
                      {post.title && (
                        <div className="post-title">{post.title}</div>
                      )}
                      {post.content && (
                        <p className="post-content">{post.content}</p>
                      )}
                    </div>

                    {post.image_url && (
                      <img
                        src={post.image_url}
                        alt="post"
                        className="post-img"
                        onError={(e) => (e.target.style.display = "none")}
                      />
                    )}

                    <div className="post-actions">
                      <button
                        className={`action-pill ${isLiked ? "liked" : ""}`}
                        onClick={() => handleLike(post.id)}
                      >
                        {isLiked ? "❤️" : "🤍"} {likeCount > 0 ? likeCount : ""}{" "}
                        Like
                      </button>
                      <button
                        className="action-pill"
                        onClick={() => toggleComments(post.id)}
                      >
                        💬 {postComments.length > 0 ? postComments.length : ""}{" "}
                        Comment
                      </button>
                      <ShareButton postId={post.id} />
                      {isOwner && (
                        <button
                          className="del-btn"
                          onClick={() => handleDeletePost(post.id)}
                        >
                          🗑 Delete
                        </button>
                      )}
                    </div>

                    {isCommentsOpen && (
                      <div className="comments-section">
                        {postComments.length > 0 && (
                          <div className="comments-list">
                            {postComments.map((c, i) => (
                              <div key={c.id || i} className="comment-item">
                                <Avatar
                                  style={{
                                    width: 28,
                                    height: 28,
                                    flexShrink: 0,
                                  }}
                                >
                                  <AvatarFallback
                                    style={{
                                      background:
                                        "linear-gradient(135deg,#B8A0D4,#7CB9A8)",
                                      color: "#fff",
                                      fontSize: "11px",
                                      fontWeight: "700",
                                    }}
                                  >
                                    {getInitial(c.profiles?.name || "U")}
                                  </AvatarFallback>
                                </Avatar>
                                <div className="comment-bubble">
                                  <div className="comment-author">
                                    {c.profiles?.name || "Traveler"}
                                  </div>
                                  <div className="comment-text">
                                    {c.comment}
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                        <div className="comment-input-row">
                          <Input
                            placeholder="Write a comment..."
                            value={commentText[post.id] || ""}
                            onChange={(e) =>
                              setCommentText((prev) => ({
                                ...prev,
                                [post.id]: e.target.value,
                              }))
                            }
                            onKeyDown={(e) =>
                              e.key === "Enter" && handleAddComment(post.id)
                            }
                            style={{
                              borderRadius: "20px",
                              fontFamily: "'DM Sans',sans-serif",
                              fontSize: "13px",
                              background: "var(--cream)",
                              border: "1.5px solid var(--border)",
                            }}
                          />
                          <Button
                            onClick={() => handleAddComment(post.id)}
                            style={{
                              background: "var(--ink)",
                              color: "var(--gold)",
                              border: "none",
                              borderRadius: "20px",
                              fontFamily: "'DM Sans',sans-serif",
                              padding: "0 16px",
                            }}
                          >
                            ➤
                          </Button>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })
            )}
          </>
        )}

        {/* ════════════ DISCOVER PEOPLE TAB ════════════ */}
        {activeTab === "people" && (
          <div>
            <div className="people-stats">
              {[
                { val: allUsers.length, lbl: "Travelers" },
                { val: followingCount, lbl: "Following" },
                { val: posts.length, lbl: "Total Posts" },
              ].map(({ val, lbl }) => (
                <div key={lbl} className="people-stat">
                  <div className="people-stat-val">{val}</div>
                  <div className="people-stat-lbl">{lbl}</div>
                </div>
              ))}
            </div>

            <Input
              placeholder="🔍  Search travelers by name..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{
                marginBottom: "20px",
                fontFamily: "'DM Sans',sans-serif",
                background: "var(--white)",
                border: "1.5px solid var(--border)",
                borderRadius: "12px",
                padding: "12px 16px",
                height: "auto",
              }}
            />

            {loading ? (
              <div className="loading-dots">
                <div className="ld" />
                <div className="ld" />
                <div className="ld" />
              </div>
            ) : filteredUsers.length === 0 ? (
              <div className="empty-state">
                <div className="empty-ico">👥</div>
                <p className="empty-ttl">
                  {searchQuery
                    ? "No travelers found"
                    : "No other travelers yet"}
                </p>
                <p className="empty-dsc">
                  {searchQuery
                    ? "Try a different name"
                    : "Be the first to post and inspire others!"}
                </p>
              </div>
            ) : (
              <div className="people-grid">
                {filteredUsers.map((person, idx) => {
                  const isFollowingUser = following[person.id] || false;
                  return (
                    <div
                      key={person.id}
                      className="person-card"
                      style={{ animationDelay: `${idx * 0.04}s` }}
                    >
                      <Avatar
                        style={{ width: 64, height: 64, margin: "0 auto" }}
                      >
                        <AvatarFallback
                          style={{
                            background: avatarColors[idx % avatarColors.length],
                            color: "#fff",
                            fontFamily: "'Playfair Display',serif",
                            fontSize: "26px",
                            fontWeight: "700",
                            width: "100%",
                            height: "100%",
                          }}
                        >
                          {getInitial(person.name)}
                        </AvatarFallback>
                      </Avatar>
                      <div className="person-card-name">{person.name}</div>
                      <div className="person-card-posts">
                        ✈️ {person.postCount}{" "}
                        {person.postCount === 1 ? "post" : "posts"}
                      </div>
                      <button
                        className={`person-card-btn ${isFollowingUser ? "is-following" : "not-following"}`}
                        onClick={() => handleFollow(person.id)}
                      >
                        {isFollowingUser ? "✓ Following" : "+ Follow"}
                      </button>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* ════════════ FOLLOWING TAB ════════════ */}
        {activeTab === "following" && (
          <div>
            {followingCount === 0 ? (
              <div className="empty-state">
                <div className="empty-ico">👥</div>
                <p className="empty-ttl">Not following anyone yet</p>
                <p className="empty-dsc">
                  Go to "Discover Travelers" to find and follow other travelers
                </p>
                <button
                  className="cm-new-btn"
                  style={{ marginTop: "16px" }}
                  onClick={() => setActiveTab("people")}
                >
                  Discover Travelers →
                </button>
              </div>
            ) : (
              <div className="people-grid">
                {allUsers
                  .filter((u) => following[u.id])
                  .map((person, idx) => (
                    <div key={person.id} className="person-card">
                      <Avatar
                        style={{ width: 64, height: 64, margin: "0 auto" }}
                      >
                        <AvatarFallback
                          style={{
                            background: avatarColors[idx % avatarColors.length],
                            color: "#fff",
                            fontFamily: "'Playfair Display',serif",
                            fontSize: "26px",
                            fontWeight: "700",
                            width: "100%",
                            height: "100%",
                          }}
                        >
                          {getInitial(person.name)}
                        </AvatarFallback>
                      </Avatar>
                      <div className="person-card-name">{person.name}</div>
                      <div className="person-card-posts">
                        ✈️ {person.postCount}{" "}
                        {person.postCount === 1 ? "post" : "posts"}
                      </div>
                      <button
                        className="person-card-btn is-following"
                        onClick={() => handleFollow(person.id)}
                      >
                        ✓ Following
                      </button>
                    </div>
                  ))}
              </div>
            )}
          </div>
        )}
      </div>
    </>
  );
};

export default Community;
