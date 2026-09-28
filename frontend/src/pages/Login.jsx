import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Sparkles, ArrowRight, LogIn } from "lucide-react";
import { useAuth } from "../context/AuthContext";

export default function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();

    setError("");
    setLoading(true);

    try {
      const response = await fetch(
        "http://localhost:5001/api/auth/login",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email,
            password,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Login failed.");
      }

      // Save token and user in AuthContext
      login(data.token, data.user);

      // Go to dashboard after successful login
      navigate("/dashboard");
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        minHeight: "75vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "3rem 1rem",
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: "460px",
          background: "rgba(16, 23, 41, 0.75)",
          border: "1px solid rgba(255, 255, 255, 0.1)",
          borderRadius: "24px",
          padding: "2.5rem",
          boxShadow: "0 20px 50px rgba(0,0,0,0.6)",
          backdropFilter: "blur(16px)",
        }}
      >
        {/* Header */}
        <div style={{ textAlign: "center", marginBottom: "2rem" }}>
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "0.5rem",
              color: "#a5b4fc",
              fontSize: "0.85rem",
              fontWeight: 600,
              marginBottom: "1rem",
            }}
          >
            <Sparkles size={16} />
            CareerTwin
          </div>

          <h1
            style={{
              fontSize: "2rem",
              fontWeight: 800,
              marginBottom: "0.5rem",
            }}
          >
            Welcome Back
          </h1>

          <p style={{ color: "#94a3b8" }}>
            Sign in to continue your career journey.
          </p>
        </div>

        {/* Error */}
        {error && (
          <div
            style={{
              background: "rgba(239, 68, 68, 0.12)",
              border: "1px solid rgba(239, 68, 68, 0.3)",
              color: "#fca5a5",
              padding: "0.85rem 1rem",
              borderRadius: "10px",
              marginBottom: "1.25rem",
              fontSize: "0.9rem",
            }}
          >
            {error}
          </div>
        )}

        {/* Login Form */}
        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: "1.25rem" }}>
            <label
              style={{
                display: "block",
                marginBottom: "0.5rem",
                color: "#cbd5e1",
                fontSize: "0.9rem",
                fontWeight: 600,
              }}
            >
              Email
            </label>

            <input
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder="Enter your email"
              required
              style={{
                width: "100%",
                padding: "0.85rem 1rem",
                borderRadius: "10px",
                border: "1px solid rgba(255,255,255,0.12)",
                background: "rgba(255,255,255,0.05)",
                color: "white",
                outline: "none",
                boxSizing: "border-box",
              }}
            />
          </div>

          <div style={{ marginBottom: "1.5rem" }}>
            <label
              style={{
                display: "block",
                marginBottom: "0.5rem",
                color: "#cbd5e1",
                fontSize: "0.9rem",
                fontWeight: 600,
              }}
            >
              Password
            </label>

            <input
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              placeholder="Enter your password"
              required
              style={{
                width: "100%",
                padding: "0.85rem 1rem",
                borderRadius: "10px",
                border: "1px solid rgba(255,255,255,0.12)",
                background: "rgba(255,255,255,0.05)",
                color: "white",
                outline: "none",
                boxSizing: "border-box",
              }}
            />
          </div>

          <button
            type="submit"
            className="btn btn-primary btn-lg"
            disabled={loading}
            style={{
              width: "100%",
              justifyContent: "center",
              opacity: loading ? 0.7 : 1,
            }}
          >
            <LogIn size={18} />

            <span>
              {loading ? "Signing In..." : "Sign In"}
            </span>

            {!loading && <ArrowRight size={18} />}
          </button>
        </form>

        {/* Register Link */}
        <div
          style={{
            textAlign: "center",
            marginTop: "1.5rem",
            color: "#94a3b8",
            fontSize: "0.9rem",
          }}
        >
          Don't have an account?{" "}
          <Link
            to="/register"
            style={{
              color: "#818cf8",
              fontWeight: 600,
              textDecoration: "none",
            }}
          >
            Create one
          </Link>
        </div>
      </div>
    </div>
  );
}