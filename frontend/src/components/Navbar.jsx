import React, { useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import {
  Compass,
  LayoutDashboard,
  GitFork,
  Milestone,
  HelpCircle,
  LineChart,
  Sparkles,
  User,
  TrendingUp,
  Menu,
  X,
  FileText,
  BookOpen,
  Award,
  Mic,
  LogIn,
  LogOut,
} from "lucide-react";

import { useAuth } from "../context/AuthContext.jsx";

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navigate = useNavigate();

  const { user, logout } = useAuth();

  const navLinks = [
    {
      to: "/dashboard",
      label: "Dashboard",
      icon: LayoutDashboard,
    },
    {
      to: "/skill-gap",
      label: "Skill Gap",
      icon: GitFork,
    },
    {
      to: "/roadmap",
      label: "Roadmap",
      icon: Milestone,
    },
    {
      to: "/assessment",
      label: "Assessment",
      icon: HelpCircle,
    },
    {
      to: "/career-analysis",
      label: "Career Analysis",
      icon: LineChart,
    },
    {
      to: "/what-if",
      label: "What-If",
      icon: Sparkles,
    },
    {
      to: "/profile",
      label: "Profile",
      icon: User,
    },
    {
      to: "/progress",
      label: "Progress",
      icon: TrendingUp,
    },
  ];

  const secondaryLinks = [
    {
      to: "/job-readiness",
      label: "Readiness",
      icon: Award,
    },
    {
      to: "/resume",
      label: "Resume",
      icon: FileText,
    },
    {
      to: "/learning",
      label: "Learning",
      icon: BookOpen,
    },
    {
      to: "/mock-interview",
      label: "Interview",
      icon: Mic,
    },
  ];

  const handleLogout = () => {
    logout();
    setMobileMenuOpen(false);
    navigate("/login");
  };

  return (
    <nav className="navbar">
      <div className="navbar-inner">

        {/* Brand Logo */}
        <Link
          to="/"
          className="nav-brand"
          onClick={() => setMobileMenuOpen(false)}
        >
          <div className="nav-logo-icon">
            <Compass size={22} color="#ffffff" />
          </div>

          <div className="nav-brand-text">
            Career<span>Twin</span>
          </div>
        </Link>

        {/* Desktop Navigation */}
        {user && (
          <ul className="nav-links">
            {navLinks.map((item) => {
              const Icon = item.icon;

              return (
                <li key={item.to}>
                  <NavLink
                    to={item.to}
                    className={({ isActive }) =>
                      `nav-link ${isActive ? "active" : ""}`
                    }
                  >
                    <Icon size={16} />
                    <span>{item.label}</span>
                  </NavLink>
                </li>
              );
            })}
          </ul>
        )}

        {/* Action Area */}
        <div className="nav-actions">

          {!user ? (
            <>
              <button
                className="btn btn-secondary btn-sm"
                onClick={() => navigate("/login")}
              >
                <LogIn size={16} />
                Sign In
              </button>

              <button
                className="btn btn-primary btn-sm"
                onClick={() => navigate("/register")}
              >
                Get Started
              </button>
            </>
          ) : (
            <>
              <span
                style={{
                  color: "#cbd5e1",
                  fontSize: "0.85rem",
                  marginRight: "0.5rem",
                }}
              >
                {user.name}
              </span>

              <button
                className="btn btn-secondary btn-sm"
                onClick={handleLogout}
              >
                <LogOut size={16} />
                Logout
              </button>
            </>
          )}

          {/* Mobile Toggle */}
          <button
            className="mobile-toggle-btn"
            onClick={() =>
              setMobileMenuOpen(!mobileMenuOpen)
            }
            aria-label="Toggle navigation"
          >
            {mobileMenuOpen ? (
              <X size={24} />
            ) : (
              <Menu size={24} />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="mobile-nav-menu open">

          {user ? (
            <>
              {navLinks.concat(secondaryLinks).map((item) => {
                const Icon = item.icon;

                return (
                  <NavLink
                    key={item.to}
                    to={item.to}
                    className={({ isActive }) =>
                      `nav-link ${isActive ? "active" : ""}`
                    }
                    onClick={() =>
                      setMobileMenuOpen(false)
                    }
                  >
                    <Icon size={18} />
                    <span>{item.label}</span>
                  </NavLink>
                );
              })}

              <div
                style={{
                  marginTop: "0.75rem",
                }}
              >
                <button
                  className="btn btn-secondary"
                  style={{
                    width: "100%",
                  }}
                  onClick={handleLogout}
                >
                  <LogOut size={18} />
                  Logout
                </button>
              </div>
            </>
          ) : (
            <>
              <button
                className="btn btn-secondary"
                style={{
                  width: "100%",
                  marginBottom: "0.75rem",
                }}
                onClick={() => {
                  setMobileMenuOpen(false);
                  navigate("/login");
                }}
              >
                <LogIn size={18} />
                Sign In
              </button>

              <button
                className="btn btn-primary"
                style={{
                  width: "100%",
                }}
                onClick={() => {
                  setMobileMenuOpen(false);
                  navigate("/register");
                }}
              >
                Get Started
              </button>
            </>
          )}

        </div>
      )}
    </nav>
  );
}