import React from 'react';
import { Link } from 'react-router-dom';
import { Compass, Sparkles } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer-inner">
        <div className="footer-brand">
          <div className="nav-logo-icon" style={{ width: 28, height: 28 }}>
            <Compass size={16} color="#ffffff" />
          </div>
          <span style={{ fontSize: '1.1rem', fontWeight: 800 }}>Career<span style={{ color: '#06b6d4' }}>Twin</span></span>
          <span style={{ fontSize: '0.82rem', color: '#64748b', marginLeft: '0.5rem' }}>
            AI-Powered Career Development for College Students
          </span>
        </div>

        <div style={{ display: 'flex', gap: '1.5rem', flexWrap: 'wrap' }}>
          <Link to="/dashboard" style={{ fontSize: '0.85rem', color: '#94a3b8' }}>Dashboard</Link>
          <Link to="/skill-gap" style={{ fontSize: '0.85rem', color: '#94a3b8' }}>Skill Gap</Link>
          <Link to="/roadmap" style={{ fontSize: '0.85rem', color: '#94a3b8' }}>Roadmap</Link>
          <Link to="/assessment" style={{ fontSize: '0.85rem', color: '#94a3b8' }}>Assessment</Link>
          <Link to="/resume" style={{ fontSize: '0.85rem', color: '#94a3b8' }}>Resume</Link>
          <Link to="/mock-interview" style={{ fontSize: '0.85rem', color: '#94a3b8' }}>Interview</Link>
        </div>

        <div className="footer-copy">
          © {new Date().getFullYear()} CareerTwin Platform. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
