import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";

const Login = () => {
  const { login, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [formData, setFormData] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  useEffect(() => {
    if (location.state?.success) setSuccessMessage(location.state.success);
  }, [location.state]);

  const handleChange = (e) => {
    setError("");
    setSuccessMessage("");
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccessMessage("");
    setLoading(true);
    try {
      const loggedInUser = await login(formData);
      window.location.href =
        loggedInUser.role === "admin" ? "/admin" : "/dashboard";
    } catch (err) {
      const status = err.response?.status;
      const message =
        err.response?.data?.message ||
        err.message ||
        "Invalid email or password.";
      if (status === 404) {
        navigate("/register", {
          state: {
            info: "No account found with this email. Please register first.",
            email: formData.email,
          },
        });
        return;
      }
      setError(message);
      setLoading(false);
    }
  };

  if (authLoading) {
    return (
      <div
        style={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#FDFAF7",
        }}
      >
        <div style={{ textAlign: "center" }}>
          <div
            style={{
              width: "36px",
              height: "36px",
              border: "3px solid #E7E5E4",
              borderTop: "3px solid #C4552A",
              borderRadius: "50%",
              animation: "spin 0.8s linear infinite",
              margin: "0 auto 12px",
            }}
          />
          <p
            style={{
              color: "#78716C",
              fontFamily: "DM Sans, sans-serif",
              fontSize: "14px",
            }}
          >
            Loading...
          </p>
        </div>
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,700;0,900;1,400&family=DM+Sans:wght@300;400;500;600&display=swap');
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

        .login-page { min-height: 100vh; display: flex; font-family: 'DM Sans', sans-serif; }

        .login-left {
          width: 45%;
          background: linear-gradient(160deg, #2D1B0E 0%, #5C3520 50%, #C4552A 100%);
          display: flex; flex-direction: column; align-items: center; justify-content: center;
          padding: 60px 48px; position: relative; overflow: hidden;
        }
        .login-left::before {
          content: ''; position: absolute; width: 400px; height: 400px; border-radius: 50%;
          background: radial-gradient(circle, rgba(212,168,83,0.18) 0%, transparent 70%);
          top: 50%; left: 50%; transform: translate(-50%, -50%);
        }
        .login-left-content { position: relative; z-index: 1; text-align: center; }
        .login-brand { font-family: 'Playfair Display', serif; font-size: 36px; font-weight: 900; color: #D4A853; letter-spacing: 2px; margin-bottom: 8px; }
        .login-brand-sub { font-size: 11px; color: rgba(212,168,83,0.5); letter-spacing: 4px; text-transform: uppercase; margin-bottom: 48px; }
        .login-left-title { font-family: 'Playfair Display', serif; font-size: 32px; font-weight: 700; color: #fff; line-height: 1.2; margin-bottom: 16px; }
        .login-left-title em { color: #D4A853; font-style: italic; }
        .login-left-desc { font-size: 15px; color: rgba(255,255,255,0.6); line-height: 1.7; max-width: 300px; margin: 0 auto; }
        .login-destinations { margin-top: 40px; display: flex; flex-wrap: wrap; gap: 10px; justify-content: center; }
        .login-dest-pill { background: rgba(255,255,255,0.1); border: 1px solid rgba(255,255,255,0.15); color: rgba(255,255,255,0.8); padding: 7px 16px; border-radius: 50px; font-size: 13px; backdrop-filter: blur(4px); }

        .login-right { flex: 1; background: #FDFAF7; display: flex; align-items: center; justify-content: center; padding: 48px 40px; }
        .login-form-wrap { width: 100%; max-width: 400px; }
        .login-form-title { font-family: 'Playfair Display', serif; font-size: 30px; font-weight: 800; color: #1C1917; margin-bottom: 6px; }
        .login-form-sub { font-size: 14px; color: #78716C; margin-bottom: 32px; }

        .login-alert { border-radius: 10px; padding: 12px 16px; font-size: 13px; margin-bottom: 20px; display: flex; align-items: flex-start; gap: 10px; animation: fadeIn .3s ease; }
        .login-alert.error   { background: #fef2f2; border: 1px solid #fecaca; color: #b91c1c; }
        .login-alert.success { background: #f0fdf4; border: 1px solid #bbf7d0; color: #15803d; }
        @keyframes fadeIn { from { opacity:0; transform:translateY(-6px); } to { opacity:1; transform:translateY(0); } }
        @keyframes spin    { to { transform: rotate(360deg); } }

        /* Override shadcn Input to match original design */
        .tx-input {
          width: 100%; padding: 13px 16px !important;
          border: 1.5px solid #E7E5E4 !important;
          border-radius: 10px !important; font-size: 14px !important;
          font-family: 'DM Sans', sans-serif !important;
          color: #1C1917 !important; background: #fff !important;
          height: auto !important; transition: all 0.2s !important;
        }
        .tx-input:focus { border-color: #C4552A !important; box-shadow: 0 0 0 3px rgba(196,85,42,0.08) !important; outline: none !important; }
        .tx-input.err { border-color: #fca5a5 !important; background: #fff5f5 !important; }
        .tx-input::placeholder { color: #A8A29E !important; }

        .tx-label { display: block; font-size: 11px !important; font-weight: 600 !important; letter-spacing: 1.5px !important; text-transform: uppercase !important; color: #78716C !important; margin-bottom: 8px !important; }

        /* Override shadcn Button */
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

        .login-footer { margin-top: 24px; text-align: center; font-size: 14px; color: #78716C; }
        .login-footer a { color: #C4552A; text-decoration: none; font-weight: 600; }
        .login-footer a:hover { text-decoration: underline; }

        .field { margin-bottom: 20px; }

        @media (max-width: 768px) {
          .login-page { flex-direction: column; }
          .login-left { width: 100%; padding: 40px 24px; min-height: auto; }
          .login-left-title { font-size: 24px; }
          .login-destinations { display: none; }
          .login-right { padding: 40px 24px; }
        }
      `}</style>

      <div className="login-page">
        {/* LEFT */}
        <div className="login-left">
          <div className="login-left-content">
            <div className="login-brand">TravelX</div>
            <div className="login-brand-sub">Explore the world</div>
            <h2 className="login-left-title">
              Welcome <em>Back,</em>
              <br />
              Traveler
            </h2>
            <p className="login-left-desc">
              Pick up where you left off. Your next adventure is waiting.
            </p>
            <div className="login-destinations">
              {[
                "🏖️ Goa",
                "🏰 Jaipur",
                "🌺 Bali",
                "🏙️ Tokyo",
                "🏔️ Switzerland",
                "🗼 Paris",
              ].map((d) => (
                <span key={d} className="login-dest-pill">
                  {d}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* RIGHT */}
        <div className="login-right">
          <div className="login-form-wrap">
            <h1 className="login-form-title">Login</h1>
            <p className="login-form-sub">
              Welcome back! Enter your details to continue
            </p>

            {successMessage && (
              <div className="login-alert success">
                <span>✅</span>
                <span>{successMessage}</span>
              </div>
            )}
            {error && (
              <div className="login-alert error">
                <span>⚠️</span>
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={handleSubmit}>
              <div className="field">
                <Label className="tx-label" htmlFor="email">
                  Email Address
                </Label>
                <Input
                  id="email"
                  type="email"
                  name="email"
                  placeholder="you@example.com"
                  value={formData.email}
                  onChange={handleChange}
                  className={`tx-input${error ? " err" : ""}`}
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
                  placeholder="Enter your password"
                  value={formData.password}
                  onChange={handleChange}
                  className={`tx-input${error ? " err" : ""}`}
                  required
                />
              </div>
              <Button type="submit" disabled={loading} className="tx-btn-dark">
                {loading ? (
                  <>
                    <div className="spin-ico" /> Logging in...
                  </>
                ) : (
                  "Login →"
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

            <div className="login-footer">
              Don't have an account? <Link to="/register">Create one</Link>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Login;
