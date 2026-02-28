import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";

const Register = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const [infoMessage, setInfoMessage] = useState("");

  useEffect(() => {
    if (location.state?.info) setInfoMessage(location.state.info);
    if (location.state?.email)
      setFormData((prev) => ({ ...prev, email: location.state.email }));
  }, [location.state]);

  const { name, email, password } = formData;
  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await axios.post("http://localhost:5000/api/auth/register", {
        name,
        email,
        password,
      });
      navigate("/login", {
        state: { success: "Account created successfully! Please login." },
      });
    } catch (error) {
      alert(error.response?.data?.message || "Registration Failed ❌");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,700;0,900;1,400&family=DM+Sans:wght@300;400;500;600&display=swap');
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

        .reg-page { min-height: 100vh; display: flex; font-family: 'DM Sans', sans-serif; }

        .reg-left {
          width: 45%;
          background: linear-gradient(160deg, #2D1B0E 0%, #5C3520 50%, #C4552A 100%);
          display: flex; flex-direction: column; align-items: center; justify-content: center;
          padding: 60px 48px; position: relative; overflow: hidden;
        }
        .reg-left::before {
          content: ''; position: absolute; width: 400px; height: 400px; border-radius: 50%;
          background: radial-gradient(circle, rgba(212,168,83,0.18) 0%, transparent 70%);
          top: 50%; left: 50%; transform: translate(-50%, -50%);
        }
        .reg-left-content { position: relative; z-index: 1; text-align: center; }
        .reg-brand { font-family: 'Playfair Display', serif; font-size: 36px; font-weight: 900; color: #D4A853; letter-spacing: 2px; margin-bottom: 8px; }
        .reg-brand-sub { font-size: 11px; color: rgba(212,168,83,0.5); letter-spacing: 4px; text-transform: uppercase; margin-bottom: 48px; }
        .reg-left-title { font-family: 'Playfair Display', serif; font-size: 32px; font-weight: 700; color: #fff; line-height: 1.2; margin-bottom: 16px; }
        .reg-left-title em { color: #D4A853; font-style: italic; }
        .reg-left-desc { font-size: 15px; color: rgba(255,255,255,0.6); line-height: 1.7; max-width: 300px; margin: 0 auto; }
        .reg-perks { margin-top: 40px; display: flex; flex-direction: column; gap: 14px; text-align: left; }
        .reg-perk { display: flex; align-items: center; gap: 12px; color: rgba(255,255,255,0.8); font-size: 14px; }
        .reg-perk-icon { width: 32px; height: 32px; border-radius: 8px; background: rgba(212,168,83,0.15); display: flex; align-items: center; justify-content: center; font-size: 16px; flex-shrink: 0; }

        .reg-right { flex: 1; background: #FDFAF7; display: flex; align-items: center; justify-content: center; padding: 48px 40px; }
        .reg-form-wrap { width: 100%; max-width: 400px; }
        .reg-form-title { font-family: 'Playfair Display', serif; font-size: 30px; font-weight: 800; color: #1C1917; margin-bottom: 6px; }
        .reg-form-sub { font-size: 14px; color: #78716C; margin-bottom: 32px; }

        .reg-alert { border-radius: 10px; padding: 12px 16px; font-size: 13px; margin-bottom: 20px; display: flex; align-items: flex-start; gap: 10px; animation: fadeIn .3s ease; background: #fefce8; border: 1px solid #fde68a; color: #92400e; }
        @keyframes fadeIn { from { opacity:0; transform:translateY(-6px); } to { opacity:1; transform:translateY(0); } }
        @keyframes spin    { to { transform: rotate(360deg); } }

        /* shadcn Input override */
        .tx-input {
          width: 100%; padding: 13px 16px !important;
          border: 1.5px solid #E7E5E4 !important;
          border-radius: 10px !important; font-size: 14px !important;
          font-family: 'DM Sans', sans-serif !important;
          color: #1C1917 !important; background: #fff !important;
          height: auto !important; transition: all 0.2s !important;
        }
        .tx-input:focus { border-color: #C4552A !important; box-shadow: 0 0 0 3px rgba(196,85,42,0.08) !important; outline: none !important; }
        .tx-input::placeholder { color: #A8A29E !important; }

        .tx-label { display: block; font-size: 11px !important; font-weight: 600 !important; letter-spacing: 1.5px !important; text-transform: uppercase !important; color: #78716C !important; margin-bottom: 8px !important; }

        /* shadcn Button override */
        .tx-btn-dark {
          width: 100% !important; padding: 14px !important; height: auto !important;
          background: #1C1917 !important; color: #D4A853 !important;
          border: none !important; border-radius: 10px !important;
          font-family: 'DM Sans', sans-serif !important; font-weight: 600 !important;
          font-size: 14px !important; letter-spacing: 1px !important;
          cursor: pointer !important; transition: all 0.25s !important; margin-top: 8px !important;
        }
        .tx-btn-dark:hover:not(:disabled) { background: #C4552A !important; color: #fff !important; box-shadow: 0 8px 24px rgba(196,85,42,0.3) !important; transform: translateY(-1px) !important; }
        .tx-btn-dark:disabled { opacity: 0.6 !important; cursor: not-allowed !important; }

        .spin-ico { width: 14px; height: 14px; border: 2px solid rgba(212,168,83,0.3); border-top-color: #D4A853; border-radius: 50%; animation: spin .7s linear infinite; }

        .reg-footer { margin-top: 24px; text-align: center; font-size: 14px; color: #78716C; }
        .reg-footer a { color: #C4552A; text-decoration: none; font-weight: 600; }
        .reg-footer a:hover { text-decoration: underline; }

        .field { margin-bottom: 20px; }

        @media (max-width: 768px) {
          .reg-page { flex-direction: column; }
          .reg-left { width: 100%; padding: 40px 24px; min-height: auto; }
          .reg-left-title { font-size: 24px; }
          .reg-perks { display: none; }
          .reg-right { padding: 40px 24px; }
        }
      `}</style>

      <div className="reg-page">
        {/* LEFT */}
        <div className="reg-left">
          <div className="reg-left-content">
            <div className="reg-brand">TravelX</div>
            <div className="reg-brand-sub">Explore the world</div>
            <h2 className="reg-left-title">
              Your Journey
              <br />
              Starts <em>Here</em>
            </h2>
            <p className="reg-left-desc">
              Join travelers who plan smarter and explore more with TravelX.
            </p>
            <div className="reg-perks">
              {[
                { icon: "🗺️", text: "Plan multi-destination trips" },
                { icon: "💰", text: "Estimate your travel budget" },
                { icon: "📖", text: "Keep a personal travel journal" },
                { icon: "👥", text: "Connect with fellow travelers" },
              ].map((p) => (
                <div key={p.text} className="reg-perk">
                  <div className="reg-perk-icon">{p.icon}</div>
                  <span>{p.text}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* RIGHT */}
        <div className="reg-right">
          <div className="reg-form-wrap">
            <h1 className="reg-form-title">Create account</h1>
            <p className="reg-form-sub">Fill in your details to get started</p>

            {infoMessage && (
              <div className="reg-alert">
                <span>ℹ️</span>
                <span>{infoMessage}</span>
              </div>
            )}

            <form onSubmit={handleSubmit}>
              <div className="field">
                <Label className="tx-label" htmlFor="name">
                  Full Name
                </Label>
                <Input
                  id="name"
                  type="text"
                  name="name"
                  placeholder="Your full name"
                  value={name}
                  onChange={handleChange}
                  className="tx-input"
                  required
                />
              </div>
              <div className="field">
                <Label className="tx-label" htmlFor="email">
                  Email Address
                </Label>
                <Input
                  id="email"
                  type="email"
                  name="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={handleChange}
                  className="tx-input"
                  required
                />
              </div>
              <div className="field">
                <Label className="tx-label" htmlFor="password">
                  Password
                </Label>
                <Input
                  id="password"
                  type="password"
                  name="password"
                  placeholder="Create a strong password"
                  value={password}
                  onChange={handleChange}
                  className="tx-input"
                  required
                />
              </div>
              <Button type="submit" disabled={loading} className="tx-btn-dark">
                {loading ? (
                  <>
                    <div className="spin-ico" /> Creating account...
                  </>
                ) : (
                  "Create Account →"
                )}
              </Button>
            </form>

            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "12px",
                margin: "24px 0",
              }}
            >
              <Separator style={{ flex: 1 }} />
              <span style={{ fontSize: "12px", color: "#A8A29E" }}>or</span>
              <Separator style={{ flex: 1 }} />
            </div>

            <div className="reg-footer">
              Already have an account? <Link to="/login">Login here</Link>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Register;
