import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

import Navbar from "./components/Navbar.jsx";
import Footer from "./components/Footer.jsx";
import ProtectedRoute from "./components/ProtectedRoute.jsx";
import { AuthProvider } from "./context/AuthContext.jsx";

// Pages
import Home from "./pages/Home.jsx";
import Login from "./pages/Login.jsx";
import Register from "./pages/Register.jsx";

import Profile from "./pages/Profile.jsx";
import Dashboard from "./pages/Dashboard.jsx";
import SkillGap from "./pages/SkillGap.jsx";
import Roadmap from "./pages/Roadmap.jsx";
import Assessment from "./pages/Assessment.jsx";
import CareerAnalysis from "./pages/CareerAnalysis.jsx";
import WhatIf from "./pages/WhatIf.jsx";
import JobReadiness from "./pages/JobReadiness.jsx";
import Resume from "./pages/Resume.jsx";
import Learning from "./pages/Learning.jsx";
import MockInterview from "./pages/MockInterview.jsx";
import Progress from "./pages/Progress.jsx";

import "./App.css";

export default function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="app-container">
          <Navbar />

          <main className="main-content">
            <Routes>

              {/* =========================
                  PUBLIC ROUTES
              ========================== */}

              <Route path="/" element={<Home />} />

              <Route path="/login" element={<Login />} />

              <Route path="/register" element={<Register />} />


              {/* =========================
                  PROTECTED ROUTES
              ========================== */}

              <Route element={<ProtectedRoute />}>

                <Route
                  path="/profile"
                  element={<Profile />}
                />

                <Route
                  path="/dashboard"
                  element={<Dashboard />}
                />

                <Route
                  path="/skill-gap"
                  element={<SkillGap />}
                />

                <Route
                  path="/roadmap"
                  element={<Roadmap />}
                />

                <Route
                  path="/assessment"
                  element={<Assessment />}
                />

                <Route
                  path="/career-analysis"
                  element={<CareerAnalysis />}
                />

                <Route
                  path="/what-if"
                  element={<WhatIf />}
                />

                <Route
                  path="/readiness"
                  element={<JobReadiness />}
                />

                <Route
                  path="/job-readiness"
                  element={<JobReadiness />}
                />

                <Route
                  path="/resume"
                  element={<Resume />}
                />

                <Route
                  path="/learning"
                  element={<Learning />}
                />

                <Route
                  path="/mock-interview"
                  element={<MockInterview />}
                />

                <Route
                  path="/progress"
                  element={<Progress />}
                />

              </Route>


              {/* =========================
                  FALLBACK
              ========================== */}

              <Route
                path="*"
                element={<Navigate to="/" replace />}
              />

            </Routes>
          </main>

          <Footer />
        </div>
      </Router>
    </AuthProvider>
  );
}