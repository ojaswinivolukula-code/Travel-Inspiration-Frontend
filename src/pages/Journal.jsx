import { useState, useEffect, useRef, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../services/axiosInstance";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";


const MAX_IMAGES  = 5;
const MAX_SIZE_MB = 5;

const fileToBase64 = (file) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload  = () => resolve(reader.result);
    reader.onerror = () => reject(new Error("Failed to read file"));
    reader.readAsDataURL(file);
  });

// ─── Toast ────────────────────────────────────────────────────────────────────
const Toast = ({ toasts, removeToast }) => (
  <div style={{ position:"fixed", bottom:"24px", right:"24px", zIndex:9999, display:"flex", flexDirection:"column", gap:"10px", pointerEvents:"none" }}>
    {toasts.map(t => (
      <div key={t.id} style={{ background: t.type === "error" ? "#dc2626" : t.type === "warn" ? "#f59e0b" : "#16a34a", color:"white", padding:"12px 18px", borderRadius:"12px", fontSize:"14px", fontWeight:"600", boxShadow:"0 4px 16px rgba(0,0,0,0.18)", display:"flex", alignItems:"center", gap:"10px", animation:"slideIn .25s ease", pointerEvents:"auto", maxWidth:"320px", fontFamily:"'DM Sans',sans-serif" }}>
        <span style={{ fontSize:"18px" }}>{t.type === "error" ? "❌" : t.type === "warn" ? "⚠️" : "✅"}</span>
        <span style={{ flex:1 }}>{t.message}</span>
        <button onClick={() => removeToast(t.id)} style={{ background:"none", border:"none", color:"white", cursor:"pointer", fontSize:"16px", opacity:0.8 }}>✕</button>
      </div>
    ))}
    <style>{`@keyframes slideIn { from { opacity:0; transform:translateX(30px); } to { opacity:1; transform:translateX(0); } }`}</style>
  </div>
);

// ─── Share Modal ──────────────────────────────────────────────────────────────
const ShareModal = ({ entry, onClose, onShared }) => {
  const [sharing, setSharing]       = useState(false);
  const [visibility, setVisibility] = useState("public");

  const content = [entry.description || "", entry.destination_id ? "📍 Destination linked" : ""].filter(Boolean).join("\n\n") || "Check out my travel journal entry!";

  const handleShare = async () => {
    setSharing(true);
    try {
      await axiosInstance.post("/posts", { title: entry.title, content, image_url: entry.image_url || (entry.image_urls?.[0] ?? ""), journal_id: entry.id, visibility });
      onShared(); onClose();
    } catch (err) { console.error(err); }
    finally { setSharing(false); }
  };

  const visOpts = [{ val:"public", label:"🌍 Public" }, { val:"followers", label:"👥 Followers" }, { val:"private", label:"🔒 Private" }];

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent style={{ maxWidth:"480px", borderRadius:"22px", fontFamily:"'DM Sans',sans-serif" }}>
        <DialogHeader>
          <DialogTitle style={{ fontFamily:"'Playfair Display',serif", fontSize:"20px", fontWeight:"800", color:"#1C1917" }}>🌍 Share to Community</DialogTitle>
          <DialogDescription style={{ color:"#78716C", fontSize:"14px" }}>Choose your audience and share your journey.</DialogDescription>
        </DialogHeader>

        {/* Preview */}
        <div style={{ background:"var(--sand,#F5EFE6)", borderRadius:"12px", padding:"16px", marginBottom:"18px", border:"1px solid var(--bdr,#E7E5E4)" }}>
          <div style={{ display:"flex", gap:"12px", alignItems:"flex-start" }}>
            {(entry.image_url || entry.image_urls?.[0]) && (
              <img src={entry.image_url || entry.image_urls[0]} alt="" style={{ width:"64px", height:"64px", borderRadius:"10px", objectFit:"cover", flexShrink:0 }} />
            )}
            <div>
              <div style={{ fontSize:"15px", fontWeight:"700", color:"#1C1917", marginBottom:"4px" }}>{entry.title}</div>
              <div style={{ fontSize:"12px", color:"#78716C", lineHeight:"1.5" }}>{content.slice(0,100)}{content.length > 100 ? "..." : ""}</div>
            </div>
          </div>
        </div>

        <div style={{ marginBottom:"20px" }}>
          <label style={{ display:"block", fontSize:"10px", fontWeight:"700", color:"#78716C", textTransform:"uppercase", letterSpacing:"2px", marginBottom:"10px" }}>Who can see this?</label>
          <div style={{ display:"flex", gap:"8px" }}>
            {visOpts.map(opt => (
              <button key={opt.val} onClick={() => setVisibility(opt.val)} style={{ flex:1, padding:"9px 6px", borderRadius:"10px", border:"1.5px solid", borderColor: visibility === opt.val ? "#C4552A" : "#E7E5E4", background: visibility === opt.val ? "rgba(196,85,42,0.07)" : "#fff", color: visibility === opt.val ? "#C4552A" : "#78716C", fontSize:"12px", fontWeight:"600", cursor:"pointer", fontFamily:"'DM Sans',sans-serif", transition:"all 0.2s" }}>
                {opt.label}
              </button>
            ))}
          </div>
        </div>

        <div style={{ display:"flex", gap:"12px" }}>
          <Button onClick={onClose} style={{ flex:1, borderRadius:"50px", fontFamily:"'DM Sans',sans-serif", fontWeight:"600", background:"var(--sand,#F5EFE6)", color:"#78716C", border:"1px solid #E7E5E4", height:"auto", padding:"12px" }}>Cancel</Button>
          <Button onClick={handleShare} disabled={sharing} style={{ flex:2, borderRadius:"50px", fontFamily:"'DM Sans',sans-serif", fontWeight:"700", background:"linear-gradient(135deg,#2D1B0E,#C4552A)", color:"white", border:"none", height:"auto", padding:"12px", opacity: sharing ? 0.7 : 1 }}>
            {sharing ? "Sharing..." : "🚀 Share Now"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

// ─── Main ─────────────────────────────────────────────────────────────────────
const Journal = () => {
  const navigate = useNavigate();
  const [entries, setEntries]             = useState([]);
  const [loading, setLoading]             = useState(true);
  const [fetchError, setFetchError]       = useState("");
  const [isCreating, setIsCreating]       = useState(false);
  const [editingId, setEditingId]         = useState(null);
  const [saving, setSaving]               = useState(false);
  const [images, setImages]               = useState([]);
  const [formData, setFormData]           = useState({ title:"", description:"", destination_id:"" });
  const [destinations, setDestinations]   = useState([]);
  const [toasts, setToasts]               = useState([]);
  const [confirmDelete, setConfirmDelete] = useState(null);
  const [shareEntry, setShareEntry]       = useState(null);
  const fileInputRef                      = useRef(null);
  const formRef                           = useRef(null);
  const toastIdRef                        = useRef(0);

  const removeToast = useCallback((id) => setToasts(prev => prev.filter(t => t.id !== id)), []);
  const addToast    = useCallback((message, type = "success") => {
    const id = ++toastIdRef.current;
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => removeToast(id), 3500);
  }, [removeToast]);

  useEffect(() => { fetchJournals(); fetchDestinations(); }, []);

  const fetchJournals = async () => {
    setLoading(true); setFetchError("");
    try {
      const res = await axiosInstance.get("/journals");
      setEntries(Array.isArray(res.data) ? res.data : res.data.journals || []);
    } catch (err) {
      setFetchError(err.response?.status === 401 ? "Session expired. Please log in again." : err.response?.data?.error || err.message || "Failed to load journals.");
    } finally { setLoading(false); }
  };

  const fetchDestinations = async () => {
    try { const res = await axiosInstance.get("/destinations"); setDestinations(Array.isArray(res.data) ? res.data : []); }
    catch (err) { console.error(err); }
  };

  const handleInputChange = (e) => { const { name, value } = e.target; setFormData(prev => ({ ...prev, [name]: value })); };

  const addImages = async (files) => {
    const remaining = MAX_IMAGES - images.length;
    if (remaining <= 0) { addToast(`Max ${MAX_IMAGES} photos allowed.`, "warn"); return; }
    const toAdd = Array.from(files).slice(0, remaining);
    const results = [];
    for (const file of toAdd) {
      if (!file.type.startsWith("image/")) { addToast(`"${file.name}" is not an image.`, "warn"); continue; }
      if (file.size > MAX_SIZE_MB * 1024 * 1024) { addToast(`"${file.name}" exceeds ${MAX_SIZE_MB}MB.`, "warn"); continue; }
      try { const preview = await fileToBase64(file); results.push({ preview, file, existing: false }); }
      catch { addToast(`Failed to read "${file.name}".`, "error"); }
    }
    setImages(prev => [...prev, ...results]);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const removeImage = (i) => setImages(prev => prev.filter((_, idx) => idx !== i));
  const moveImage   = (from, to) => setImages(prev => { const arr = [...prev]; const [item] = arr.splice(from, 1); arr.splice(to, 0, item); return arr; });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title.trim()) { addToast("Title is required!", "warn"); return; }
    setSaving(true);
    try {
      const imageUrls  = images.map(img => img.preview);
      const submitData = { title: formData.title.trim(), description: formData.description.trim() || "", ...(formData.destination_id?.trim() && { destination_id: formData.destination_id }), ...(imageUrls.length > 0 && { image_url: imageUrls[0], image_urls: imageUrls }) };
      if (editingId) { await axiosInstance.put(`/journals/${editingId}`, submitData); addToast("Journal updated! ✈️"); }
      else           { await axiosInstance.post("/journals", submitData);              addToast("Journal created! 📔"); }
      resetForm(); await fetchJournals();
    } catch (err) { addToast(err.response?.data?.error || err.message || "Failed to save", "error"); }
    finally { setSaving(false); }
  };

  const handleEdit = (entry) => {
    setEditingId(entry.id);
    setFormData({ title: entry.title, description: entry.description || "", destination_id: entry.destination_id || "" });
    const imgs = entry.image_urls?.length ? entry.image_urls.map(url => ({ preview: url, file: null, existing: true })) : entry.image_url ? [{ preview: entry.image_url, file: null, existing: true }] : [];
    setImages(imgs); setIsCreating(true);
    setTimeout(() => formRef.current?.scrollIntoView({ behavior:"smooth" }), 50);
  };

  const handleDeleteConfirm = async () => {
    const id = confirmDelete; setConfirmDelete(null);
    try { await axiosInstance.delete(`/journals/${id}`); await fetchJournals(); addToast("Entry deleted."); }
    catch (err) { addToast(err.response?.data?.error || "Failed to delete", "error"); }
  };

  const resetForm = () => {
    setIsCreating(false); setEditingId(null);
    setFormData({ title:"", description:"", destination_id:"" }); setImages([]);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  if (loading) return (
    <div style={{ minHeight:"100vh", display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", background:"var(--sand,#F5EFE6)", gap:"16px" }}>
      <div style={{ width:"40px", height:"40px", border:"3px solid #E7E5E4", borderTop:`3px solid #C4552A`, borderRadius:"50%", animation:"spin .8s linear infinite" }} />
      <p style={{ color:"#78716C", fontSize:"15px", fontFamily:"'DM Sans',sans-serif" }}>Loading your journals...</p>
      <style>{`@keyframes spin { to { transform:rotate(360deg); } }`}</style>
    </div>
  );

  if (fetchError) return (
    <div style={{ minHeight:"100vh", display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", background:"var(--sand,#F5EFE6)", gap:"16px", fontFamily:"'DM Sans',sans-serif" }}>
      <p style={{ fontSize:"48px" }}>⚠️</p>
      <p style={{ fontFamily:"'Playfair Display',serif", fontSize:"20px", fontWeight:"800", color:"#1C1917" }}>Failed to load journals</p>
      <p style={{ fontSize:"14px", color:"#78716C", maxWidth:"320px", textAlign:"center" }}>{fetchError}</p>
      <div style={{ display:"flex", gap:"12px", marginTop:"8px" }}>
        <Button onClick={fetchJournals} style={{ borderRadius:"50px", background:"linear-gradient(135deg,#2D1B0E,#C4552A)", color:"white", border:"none", fontFamily:"'DM Sans',sans-serif", fontWeight:"700", height:"auto", padding:"10px 24px" }}>Try Again</Button>
        <Button onClick={() => navigate(-1)} style={{ borderRadius:"50px", background:"var(--sand,#F5EFE6)", color:"#78716C", border:"1px solid #E7E5E4", fontFamily:"'DM Sans',sans-serif", fontWeight:"600", height:"auto", padding:"10px 24px" }}>← Go Back</Button>
      </div>
    </div>
  );

  return (
    <div style={{ minHeight:"100vh", background:"var(--sand,#F5EFE6)" }}>
      <Toast toasts={toasts} removeToast={removeToast} />
      {shareEntry && <ShareModal entry={shareEntry} onClose={() => setShareEntry(null)} onShared={() => addToast("Shared to Community! 🌍")} />}

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,700;0,900;1,400&family=DM+Sans:wght@300;400;500;600&display=swap');
        :root { --sand:#F5EFE6; --sand-dark:#EAE0D5; --ink:#1C1917; --ink-soft:#78716C; --terra:#C4552A; --gold:#D4A853; --white:#FDFAF7; --bdr:#E7E5E4; }
        @keyframes spin { to { transform:rotate(360deg); } }

        .j-page { max-width:1020px; margin:0 auto; padding:0 20px 60px; font-family:'DM Sans',sans-serif; }

        /* topbar */
        .j-topbar { background:linear-gradient(135deg,#2D1B0E,#5C3520); margin:-1px -1px 0; padding:20px 28px; display:flex; align-items:center; gap:16px; flex-wrap:wrap; border-radius:0; }
        .j-topbar-title { font-family:'Playfair Display',serif; font-size:24px; font-weight:900; color:#fff; flex:1; }
        .j-topbar-title em { color:var(--gold); font-style:italic; }
        .j-back-btn { border-radius:50px !important; font-family:'DM Sans',sans-serif !important; font-weight:600 !important; font-size:13px !important; height:auto !important; padding:8px 18px !important; background:rgba(255,255,255,0.12) !important; color:rgba(255,255,255,0.85) !important; border:1px solid rgba(255,255,255,0.2) !important; transition:all 0.2s !important; }
        .j-back-btn:hover { background:rgba(255,255,255,0.22) !important; color:#fff !important; transform:translateX(-2px) !important; }
        .j-new-btn { border-radius:50px !important; font-family:'DM Sans',sans-serif !important; font-weight:700 !important; font-size:13px !important; height:auto !important; padding:8px 22px !important; background:var(--terra) !important; color:#fff !important; border:none !important; box-shadow:0 4px 14px rgba(196,85,42,0.35) !important; transition:all 0.2s !important; }
        .j-new-btn:hover { background:#E8724A !important; transform:translateY(-1px) !important; box-shadow:0 6px 20px rgba(196,85,42,0.45) !important; }

        /* inner */
        .j-inner { padding-top:36px; }

        /* form card */
        .j-form-card { background:var(--white); border:1px solid var(--bdr); border-radius:22px; padding:28px; margin-bottom:32px; }
        .j-form-title { font-family:'Playfair Display',serif; font-size:20px; font-weight:800; color:var(--ink); margin-bottom:22px; }
        .j-field { margin-bottom:18px; }
        .j-label { display:block; font-size:10px; font-weight:700; letter-spacing:2px; text-transform:uppercase; color:var(--ink-soft); margin-bottom:7px; }
        .j-input,.j-select,.j-textarea { width:100%; padding:11px 15px; border:1.5px solid var(--bdr); border-radius:10px; font-family:'DM Sans',sans-serif; font-size:14px; color:var(--ink); outline:none; transition:all 0.2s; box-sizing:border-box; background:var(--sand); }
        .j-input:focus,.j-select:focus,.j-textarea:focus { border-color:var(--terra); background:var(--white); box-shadow:0 0 0 3px rgba(196,85,42,0.1); }
        .j-textarea { resize:vertical; min-height:110px; }

        /* image upload */
        .j-img-label-row { display:flex; align-items:center; gap:8px; margin-bottom:7px; }
        .j-img-badge { font-size:10px; background:rgba(196,85,42,0.1); color:var(--terra); padding:2px 8px; border-radius:50px; font-weight:700; font-family:'DM Sans',sans-serif; border:1px solid rgba(196,85,42,0.2); }
        .j-drop-zone { border:2px dashed var(--bdr); border-radius:14px; padding:28px; text-align:center; cursor:pointer; transition:all 0.2s; background:var(--sand); position:relative; }
        .j-drop-zone:hover,.j-drop-zone.drag-over { border-color:var(--terra); background:rgba(196,85,42,0.04); }
        .j-drop-zone input[type="file"] { position:absolute; inset:0; opacity:0; cursor:pointer; width:100%; height:100%; }
        .j-img-grid { display:grid; grid-template-columns:repeat(auto-fill,minmax(130px,1fr)); gap:10px; margin-bottom:10px; }
        .j-thumb { position:relative; border-radius:12px; overflow:hidden; aspect-ratio:1; background:var(--sand); box-shadow:0 2px 6px rgba(0,0,0,0.08); transition:transform 0.15s; }
        .j-thumb:hover { transform:scale(1.02); }
        .j-thumb img { width:100%; height:100%; object-fit:cover; display:block; }
        .j-cover-badge { position:absolute; top:6px; left:6px; background:var(--terra); color:white; font-size:9px; font-weight:800; padding:2px 7px; border-radius:4px; font-family:'DM Sans',sans-serif; letter-spacing:0.5px; }
        .j-thumb-x { position:absolute; top:6px; right:6px; background:rgba(0,0,0,0.5); color:white; border:none; border-radius:50%; width:22px; height:22px; font-size:11px; cursor:pointer; display:flex; align-items:center; justify-content:center; }
        .j-thumb-x:hover { background:rgba(196,85,42,0.85); }
        .j-thumb-arrows { position:absolute; bottom:5px; left:0; right:0; display:flex; justify-content:center; gap:4px; }
        .j-arrow { background:rgba(0,0,0,0.45); color:white; border:none; border-radius:4px; width:20px; height:20px; font-size:10px; cursor:pointer; display:flex; align-items:center; justify-content:center; }
        .j-arrow:hover { background:rgba(0,0,0,0.75); }
        .j-arrow:disabled { opacity:.3; cursor:default; }
        .j-add-more { display:inline-flex; align-items:center; gap:6px; background:var(--sand); border:1.5px dashed var(--bdr); color:var(--ink-soft); border-radius:10px; padding:7px 14px; font-size:12px; font-weight:600; cursor:pointer; position:relative; overflow:hidden; font-family:'DM Sans',sans-serif; }
        .j-add-more:hover { background:var(--sand-dark); }
        .j-add-more input[type="file"] { position:absolute; inset:0; opacity:0; cursor:pointer; }

        .j-form-btns { display:flex; gap:12px; margin-top:22px; }
        .j-save-btn { flex:1; border-radius:50px !important; font-family:'DM Sans',sans-serif !important; font-weight:700 !important; font-size:14px !important; height:auto !important; padding:12px !important; background:linear-gradient(135deg,#2D1B0E,#5C3520) !important; color:#fff !important; border:none !important; transition:all 0.2s !important; box-shadow:0 4px 14px rgba(28,25,23,0.25) !important; }
        .j-save-btn:not(:disabled):hover { transform:translateY(-1px) !important; box-shadow:0 6px 20px rgba(28,25,23,0.35) !important; background:linear-gradient(135deg,#3D2010,var(--terra)) !important; }
        .j-save-btn:disabled { opacity:0.6 !important; cursor:not-allowed !important; }
        .j-cancel-btn { border-radius:50px !important; font-family:'DM Sans',sans-serif !important; font-weight:600 !important; padding:12px 24px !important; height:auto !important; background:var(--sand) !important; color:var(--ink-soft) !important; border:1px solid var(--bdr) !important; }
        .j-cancel-btn:hover { background:var(--sand-dark) !important; }

        /* entry grid */
        .j-grid { display:grid; grid-template-columns:repeat(auto-fill,minmax(300px,1fr)); gap:20px; }
        .j-card { background:var(--white) !important; border-radius:20px !important; overflow:hidden; border:1px solid var(--bdr) !important; transition:all 0.25s ease; padding:0 !important; }
        .j-card:hover { transform:translateY(-5px); box-shadow:0 16px 44px rgba(28,25,23,0.1) !important; }
        .j-card-img { width:100%; height:190px; position:relative; overflow:hidden; }
        .j-card-img img { width:100%; height:100%; object-fit:cover; display:block; }
        .j-card-placeholder { width:100%; height:190px; background:linear-gradient(135deg,var(--sand),var(--sand-dark)); display:flex; align-items:center; justify-content:center; font-size:44px; }
        .j-photo-count { position:absolute; bottom:8px; right:8px; background:rgba(28,25,23,0.6); color:white; font-size:11px; font-weight:700; padding:3px 8px; border-radius:50px; font-family:'DM Sans',sans-serif; }
        .j-card-body { padding:16px 18px; }
        .j-card-title { font-family:'Playfair Display',serif; font-size:17px; font-weight:800; color:var(--ink); margin-bottom:5px; }
        .j-card-desc { font-family:'DM Sans',sans-serif; font-size:12px; color:var(--ink-soft); line-height:1.55; margin-bottom:8px; font-weight:300; }
        .j-card-date { font-family:'DM Sans',sans-serif; font-size:11px; color:var(--ink-soft); margin-bottom:14px; }
        .j-card-actions { display:flex; gap:8px; flex-wrap:wrap; }
        .j-card-btn { flex:1; border-radius:10px !important; font-family:'DM Sans',sans-serif !important; font-size:12px !important; font-weight:600 !important; height:auto !important; padding:8px !important; min-width:60px !important; transition:all 0.2s !important; }
        .j-edit { background:var(--sand) !important; color:var(--terra) !important; border:1px solid var(--sand-dark) !important; }
        .j-edit:hover { background:var(--sand-dark) !important; }
        .j-del { background:#FEE2E2 !important; color:#DC2626 !important; border:none !important; }
        .j-del:hover { background:#FECACA !important; }
        .j-share { background:linear-gradient(135deg,#2D1B0E,#5C3520) !important; color:var(--gold) !important; border:none !important; }
        .j-share:hover { opacity:0.88 !important; transform:translateY(-1px) !important; }

        .j-empty { text-align:center; padding:80px 20px; }
        .j-empty-title { font-family:'Playfair Display',serif; font-size:22px; font-weight:800; color:var(--ink); margin-bottom:8px; }
        .j-empty-sub { font-family:'DM Sans',sans-serif; font-size:14px; color:var(--ink-soft); }
      `}</style>

      {/* ── Top Bar ── */}
      <div className="j-topbar">
        <Button className="j-back-btn" onClick={() => navigate(-1)}>← Back</Button>
        <h1 className="j-topbar-title">📔 My Travel <em>Journal</em></h1>
        <Button className="j-new-btn" onClick={() => isCreating ? resetForm() : setIsCreating(true)}>
          {isCreating ? "✕ Cancel" : "+ New Entry"}
        </Button>
      </div>

      <div className="j-page">
        <div className="j-inner">

          {/* ── Create / Edit Form ── */}
          {isCreating && (
            <form ref={formRef} onSubmit={handleSubmit} className="j-form-card">
              <p className="j-form-title">{editingId ? "✏️ Edit Entry" : "📝 New Journal Entry"}</p>
              <div className="j-field">
                <label className="j-label">Title *</label>
                <input type="text" name="title" value={formData.title} onChange={handleInputChange} placeholder="Give your entry a title..." className="j-input" required />
              </div>
              <div className="j-field">
                <label className="j-label">Description</label>
                <textarea name="description" value={formData.description} onChange={handleInputChange} placeholder="Share your experience..." className="j-textarea" />
              </div>
              <div className="j-field">
                <label className="j-label">Destination</label>
                <select name="destination_id" value={formData.destination_id} onChange={handleInputChange} className="j-select">
                  <option value="">Select a destination (optional)</option>
                  {destinations.map(d => <option key={d.id} value={d.id}>{d.name}</option>)}
                </select>
              </div>
              <div className="j-field">
                <div className="j-img-label-row">
                  <span className="j-label" style={{ margin:0 }}>Cover Photos</span>
                  <span className="j-img-badge">{images.length}/{MAX_IMAGES}</span>
                </div>
                {images.length > 0 ? (
                  <>
                    <div className="j-img-grid">
                      {images.map((img, i) => (
                        <div key={i} className="j-thumb">
                          <img src={img.preview} alt={`Photo ${i + 1}`} />
                          {i === 0 && <span className="j-cover-badge">COVER</span>}
                          <button type="button" className="j-thumb-x" onClick={() => removeImage(i)}>✕</button>
                          <div className="j-thumb-arrows">
                            <button type="button" className="j-arrow" onClick={() => moveImage(i, i-1)} disabled={i === 0}>◀</button>
                            <button type="button" className="j-arrow" onClick={() => moveImage(i, i+1)} disabled={i === images.length-1}>▶</button>
                          </div>
                        </div>
                      ))}
                    </div>
                    {images.length < MAX_IMAGES && (
                      <button type="button" className="j-add-more">
                        📎 Add More Photos
                        <input type="file" accept="image/*" multiple onChange={e => addImages(e.target.files)} />
                      </button>
                    )}
                  </>
                ) : (
                  <div className="j-drop-zone"
                    onDragOver={e => { e.preventDefault(); e.currentTarget.classList.add("drag-over"); }}
                    onDragLeave={e => e.currentTarget.classList.remove("drag-over")}
                    onDrop={e => { e.preventDefault(); e.currentTarget.classList.remove("drag-over"); addImages(e.dataTransfer.files); }}>
                    <input ref={fileInputRef} type="file" accept="image/*" multiple onChange={e => addImages(e.target.files)} />
                    <p style={{ fontSize:"30px", marginBottom:"8px" }}>📸</p>
                    <p style={{ fontSize:"13px", color:"#78716C", marginBottom:"4px", fontFamily:"'DM Sans',sans-serif" }}><strong>Click to upload</strong> or drag & drop</p>
                    <p style={{ fontSize:"11px", color:"#A8A29E", fontFamily:"'DM Sans',sans-serif" }}>Up to {MAX_IMAGES} photos · JPG, PNG, WebP · Max {MAX_SIZE_MB}MB each</p>
                  </div>
                )}
              </div>
              <div className="j-form-btns">
                <Button type="submit" className="j-save-btn" disabled={saving}>{saving ? "Saving..." : editingId ? "Update Entry" : "Save Entry →"}</Button>
                <Button type="button" className="j-cancel-btn" onClick={resetForm}>Cancel</Button>
              </div>
            </form>
          )}

          {/* ── Entries ── */}
          {entries.length === 0 ? (
            <div className="j-empty">
              <p style={{ fontSize:"52px", marginBottom:"16px" }}>📔</p>
              <p className="j-empty-title">No journal entries yet</p>
              <p className="j-empty-sub">Click "+ New Entry" to write your first one!</p>
            </div>
          ) : (
            <div className="j-grid">
              {entries.map(entry => {
                const allImgs = entry.image_urls?.length ? entry.image_urls : entry.image_url ? [entry.image_url] : [];
                return (
                  <Card key={entry.id} className="j-card">
                    {allImgs.length > 0 ? (
                      <div className="j-card-img">
                        <img src={allImgs[0]} alt={entry.title} />
                        {allImgs.length > 1 && <span className="j-photo-count">📷 {allImgs.length}</span>}
                      </div>
                    ) : (
                      <div className="j-card-placeholder">📸</div>
                    )}
                    <CardContent className="j-card-body">
                      <h3 className="j-card-title">{entry.title}</h3>
                      {entry.description && <p className="j-card-desc">{entry.description.length > 90 ? entry.description.slice(0,90)+"..." : entry.description}</p>}
                      <p className="j-card-date">📅 {new Date(entry.created_at).toLocaleDateString("en-IN", { year:"numeric", month:"short", day:"numeric" })}</p>
                      <div className="j-card-actions">
                        <Button className="j-card-btn j-edit" onClick={() => handleEdit(entry)}>✏️ Edit</Button>
                        <Button className="j-card-btn j-share" onClick={() => setShareEntry(entry)}>🌍 Share</Button>
                        <Button className="j-card-btn j-del" onClick={() => setConfirmDelete(entry.id)}>🗑️ Delete</Button>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* ── Delete Confirm Dialog ── */}
      <Dialog open={!!confirmDelete} onOpenChange={() => setConfirmDelete(null)}>
        <DialogContent style={{ maxWidth:"360px", borderRadius:"22px", border:"1px solid #E7E5E4", fontFamily:"'DM Sans',sans-serif" }}>
          <DialogHeader>
            <div style={{ fontSize:"44px", textAlign:"center", marginBottom:"10px" }}>🗑️</div>
            <DialogTitle style={{ fontFamily:"'Playfair Display',serif", fontSize:"20px", fontWeight:"800", color:"#1C1917", textAlign:"center" }}>Delete this entry?</DialogTitle>
            <DialogDescription style={{ textAlign:"center", color:"#78716C", fontSize:"14px" }}>This action cannot be undone.</DialogDescription>
          </DialogHeader>
          <div style={{ display:"flex", gap:"12px", justifyContent:"center", marginTop:"8px" }}>
            <Button onClick={() => setConfirmDelete(null)} style={{ borderRadius:"50px", background:"var(--sand,#F5EFE6)", color:"#78716C", border:"1px solid #E7E5E4", fontFamily:"'DM Sans',sans-serif", fontWeight:"600", height:"auto", padding:"11px 22px" }}>Cancel</Button>
            <Button onClick={handleDeleteConfirm} style={{ borderRadius:"50px", background:"linear-gradient(135deg,#C4552A,#B34420)", color:"white", border:"none", fontFamily:"'DM Sans',sans-serif", fontWeight:"700", height:"auto", padding:"11px 22px", boxShadow:"0 4px 14px rgba(196,85,42,0.35)" }}>Delete</Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Journal;