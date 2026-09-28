import React from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Sparkles, 
  ArrowRight, 
  UserCheck, 
  GitFork, 
  Milestone, 
  LineChart, 
  Cpu, 
  FileText, 
  Mic, 
  TrendingUp, 
  ShieldCheck, 
  Zap, 
  Target
} from 'lucide-react';

export default function Home() {
  const navigate = useNavigate();

  const features = [
    {
      title: 'Personal Career Profile',
      desc: 'Maintain your core competencies, track project repositories, and target specific modern technology roles.',
      icon: UserCheck,
      path: '/profile'
    },
    {
      title: 'Skill Gap Analysis',
      desc: 'Evaluate your current abilities against authoritative industry role baselines to uncover exact missing skills.',
      icon: GitFork,
      path: '/skill-gap'
    },
    {
      title: 'Personalized Roadmap',
      desc: 'Follow milestone-based, staged learning tracks that automatically calculate your completion velocity.',
      icon: Milestone,
      path: '/roadmap'
    },
    {
      title: 'AI Career Analysis',
      desc: 'Receive AI diagnostics on your profile combined with static verified market compensation and industry hiring trends.',
      icon: LineChart,
      path: '/career-analysis'
    },
    {
      title: 'What-If Simulation',
      desc: 'Simulate learning high-demand skills to quantify your immediate candidate score boost before spending months studying.',
      icon: Cpu,
      path: '/what-if'
    },
    {
      title: 'Resume ATS Analysis',
      desc: 'Scan your resume against target engineering requirements, detect missing keywords, and optimize for recruiter ATS filters.',
      icon: FileText,
      path: '/resume'
    },
    {
      title: 'Mock Technical Interviews',
      desc: 'Answer realistic role questions one-by-one with interactive AI scoring and constructive rubric feedback.',
      icon: Mic,
      path: '/mock-interview'
    },
    {
      title: 'Progress Tracking',
      desc: 'Log completed milestones and acquired skills that automatically synchronize back across your entire profile.',
      icon: TrendingUp,
      path: '/progress'
    }
  ];

  return (
    <div className="home-page">
      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-pill">
          <Sparkles size={16} />
          <span>Next-Generation Career Intelligence for Students</span>
        </div>

        <h1 className="hero-heading">
          Build the Career <br />
          <span className="hero-heading-gradient">You Want.</span>
        </h1>

        <p className="hero-supporting-text">
          CareerTwin empowers college students to understand their current capabilities, identify critical industry skill gaps, follow personalized learning roadmaps, and land top-tier technology roles.
        </p>

        <div className="hero-cta-group">
          <button 
            className="btn btn-primary btn-lg"
            onClick={() => navigate('/profile')}
          >
            <span>Get Started</span>
            <ArrowRight size={18} />
          </button>

          <button 
            className="btn btn-secondary btn-lg"
            onClick={() => navigate('/dashboard')}
          >
            Explore Dashboard
          </button>
        </div>

        {/* Visual Showcase Card */}
        <div style={{
          maxWidth: '920px',
          margin: '0 auto',
          padding: '2.5rem',
          background: 'rgba(16, 23, 41, 0.65)',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          borderRadius: '24px',
          boxShadow: '0 20px 50px rgba(0,0,0,0.6)',
          backdropFilter: 'blur(16px)'
        }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '2rem', textAlign: 'center' }}>
            <div>
              <div style={{ fontSize: '2.2rem', fontWeight: 800, color: '#6366f1' }}>100%</div>
              <div style={{ fontSize: '0.9rem', color: '#94a3b8' }}>Profile Synchronized Flow</div>
            </div>
            <div>
              <div style={{ fontSize: '2.2rem', fontWeight: 800, color: '#06b6d4' }}>5+ Roles</div>
              <div style={{ fontSize: '0.9rem', color: '#94a3b8' }}>Standard Tech Baselines</div>
            </div>
            <div>
              <div style={{ fontSize: '2.2rem', fontWeight: 800, color: '#10b981' }}>Real-Time</div>
              <div style={{ fontSize: '0.9rem', color: '#94a3b8' }}>AI Feedback & ATS Scoring</div>
            </div>
            <div>
              <div style={{ fontSize: '2.2rem', fontWeight: 800, color: '#f59e0b' }}>Zero Lock-in</div>
              <div style={{ fontSize: '0.9rem', color: '#94a3b8' }}>Persistent MongoDB Storage</div>
            </div>
          </div>
        </div>
      </section>

      {/* Feature Showcase Grid */}
      <section style={{ marginTop: '5rem' }}>
        <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
          <div className="page-badge">Comprehensive Ecosystem</div>
          <h2 style={{ fontSize: '2.2rem', fontWeight: 800 }}>Everything You Need To Accelerate Your Tech Career</h2>
          <p style={{ color: '#94a3b8', marginTop: '0.5rem' }}>Every module talks directly to your profile database for an interconnected journey.</p>
        </div>

        <div className="features-grid">
          {features.map((feature, idx) => {
            const Icon = feature.icon;
            return (
              <div 
                key={idx} 
                className="feature-card"
                onClick={() => navigate(feature.path)}
                style={{ cursor: 'pointer' }}
              >
                <div className="feature-icon-box">
                  <Icon size={24} />
                </div>
                <h3 className="feature-title">{feature.title}</h3>
                <p className="feature-desc">{feature.desc}</p>
                <div style={{ marginTop: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.4rem', color: '#6366f1', fontSize: '0.85rem', fontWeight: 600 }}>
                  <span>Launch Module</span>
                  <ArrowRight size={14} />
                </div>
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
}
