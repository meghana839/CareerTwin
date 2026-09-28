import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { api } from '../services/api.js';
import LoadingState from '../components/LoadingState.jsx';
import ErrorState from '../components/ErrorState.jsx';
import StatCard from '../components/StatCard.jsx';
import ProgressBar from '../components/ProgressBar.jsx';
import { 
  LayoutDashboard, 
  Target, 
  GitFork, 
  Milestone, 
  HelpCircle, 
  LineChart, 
  Sparkles, 
  FileText, 
  BookOpen, 
  Mic, 
  TrendingUp, 
  Award,
  ArrowRight,
  Layers,
  Clock,
  CheckCircle2
} from 'lucide-react';

export default function Dashboard() {
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const fetchSummary = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await api.getDashboardSummary();
      if (res.summary) {
        setSummary(res.summary);
      }
    } catch (err) {
      setError(err.message || 'Unable to retrieve dashboard summary.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSummary();
  }, []);

  if (loading) {
    return <LoadingState message="Aggregating your real-time career intelligence..." />;
  }

  if (error) {
    return <ErrorState message={error} onRetry={fetchSummary} />;
  }

  const quickLinks = [
    { title: 'Skill Gap Analysis', desc: 'Identify missing requirements against target role', icon: GitFork, to: '/skill-gap', color: '#6366f1' },
    { title: 'Personalized Roadmap', desc: 'View milestone stages & completion velocity', icon: Milestone, to: '/roadmap', color: '#8b5cf6' },
    { title: 'Technical Assessment', desc: 'Verify skills with real-time scored quiz questions', icon: HelpCircle, to: '/assessment', color: '#06b6d4' },
    { title: 'AI Career Analysis', desc: 'Market insights, salary ranges & strategic focus', icon: LineChart, to: '/career-analysis', color: '#10b981' },
    { title: 'What-If Simulation', desc: 'Simulate learning new skills to boost readiness', icon: Sparkles, to: '/what-if', color: '#f59e0b' },
    { title: 'Resume ATS Scanner', desc: 'Inspect resume text for keywords and suggestions', icon: FileText, to: '/resume', color: '#f43f5e' },
    { title: 'Learning Direction', desc: 'Curated projects & resources for your skill gaps', icon: BookOpen, to: '/learning', color: '#38bdf8' },
    { title: 'Mock Interview', desc: 'Practice role questions with AI grading & feedback', icon: Mic, to: '/mock-interview', color: '#ec4899' },
    { title: 'Career Progress Log', desc: 'Log acquired skills & milestones back to profile', icon: TrendingUp, to: '/progress', color: '#10b981' }
  ];

  return (
    <div className="dashboard-page">
      {/* Header Banner */}
      <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <div className="page-badge">
            <LayoutDashboard size={14} />
            <span>Central Control Hub</span>
          </div>
          <h1 className="page-title">Career Dashboard</h1>
          <p className="page-subtitle">
            Welcome back! Here is your synchronized career status targeting <strong style={{ color: '#06b6d4' }}>{summary?.targetRole || 'Full Stack Developer'}</strong>.
          </p>
        </div>

        <button 
          className="btn btn-secondary btn-sm"
          onClick={() => navigate('/profile')}
        >
          <span>Edit Career Profile</span>
          <ArrowRight size={14} />
        </button>
      </div>

      {/* Primary KPI Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.25rem', marginBottom: '2.5rem' }}>
        <StatCard 
          label="Job Readiness" 
          value={`${summary?.readinessScore || 0}%`} 
          subtext="Comprehensive weighted index"
          icon={Award}
          color="cyan"
        />
        <StatCard 
          label="Skill Gaps" 
          value={summary?.skillGapCount || 0} 
          subtext={`Out of ${summary?.totalRequiredSkills || 0} required skills`}
          icon={GitFork}
          color={summary?.skillGapCount > 0 ? "rose" : "emerald"}
        />
        <StatCard 
          label="Roadmap Progress" 
          value={`${summary?.roadmapProgress || 0}%`} 
          subtext={`${summary?.completedStages || 0} of ${summary?.totalStages || 0} stages completed`}
          icon={Milestone}
          color="indigo"
        />
        <StatCard 
          label="ATS Resume Score" 
          value={`${summary?.atsScore || 0}/100`} 
          subtext="Based on last parsed resume text"
          icon={FileText}
          color="amber"
        />
      </div>

      {/* Middle Row: Current Skills & Roadmap Health */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(420px, 1fr))', gap: '2rem', marginBottom: '2.5rem' }}>
        {/* Current Skills Summary */}
        <div className="card">
          <div className="card-header">
            <div className="card-title">
              <Layers size={20} color="#06b6d4" />
              <span>Verified Technical Skills</span>
            </div>
            <Link to="/profile" style={{ fontSize: '0.82rem', color: '#6366f1', fontWeight: 600 }}>Manage Skills →</Link>
          </div>

          <p style={{ fontSize: '0.88rem', color: '#94a3b8', marginBottom: '1.25rem' }}>
            You currently hold {summary?.currentSkills?.length || 0} skills in your verified profile.
          </p>

          {summary?.currentSkills && summary.currentSkills.length > 0 ? (
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
              {summary.currentSkills.map(skill => (
                <span key={skill} className="skill-tag">
                  {skill}
                </span>
              ))}
            </div>
          ) : (
            <div style={{ padding: '1.5rem', textAlign: 'center', background: 'rgba(255,255,255,0.02)', borderRadius: '10px', border: '1px dashed var(--card-border)', color: '#64748b' }}>
              No skills added to your profile yet. Click "Manage Skills" to get started!
            </div>
          )}
        </div>

        {/* Roadmap Trajectory */}
        <div className="card">
          <div className="card-header">
            <div className="card-title">
              <Milestone size={20} color="#6366f1" />
              <span>Roadmap Trajectory</span>
            </div>
            <Link to="/roadmap" style={{ fontSize: '0.82rem', color: '#6366f1', fontWeight: 600 }}>View Stages →</Link>
          </div>

          <p style={{ fontSize: '0.88rem', color: '#94a3b8', marginBottom: '1rem' }}>
            Current stage completion for <strong>{summary?.targetRole}</strong>.
          </p>

          <ProgressBar 
            value={summary?.roadmapProgress || 0} 
            label="Overall Learning Roadmap Completion" 
            color="indigo"
          />

          <div style={{ marginTop: '1.5rem', display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', color: '#94a3b8' }}>
            <span>Completed Stages: <strong style={{ color: '#fff' }}>{summary?.completedStages || 0}</strong></span>
            <span>Remaining Stages: <strong style={{ color: '#fff' }}>{Math.max(0, (summary?.totalStages || 0) - (summary?.completedStages || 0))}</strong></span>
          </div>
        </div>
      </div>

      {/* Quick Access Control Grid */}
      <div style={{ marginBottom: '3rem' }}>
        <h3 style={{ fontSize: '1.4rem', fontWeight: 700, marginBottom: '0.5rem' }}>Career Control Modules</h3>
        <p style={{ fontSize: '0.9rem', color: '#94a3b8', marginBottom: '1.25rem' }}>
          Explore dedicated tools tailored specifically to your target role and profile data.
        </p>

        <div className="quick-access-grid">
          {quickLinks.map((item, idx) => {
            const Icon = item.icon;
            return (
              <Link key={idx} to={item.to} className="quick-card">
                <div className="quick-icon-wrapper" style={{ color: item.color }}>
                  <Icon size={24} />
                </div>
                <div>
                  <div className="quick-title">{item.title}</div>
                  <div className="quick-desc">{item.desc}</div>
                </div>
              </Link>
            );
          })}
        </div>
      </div>

      {/* Recent Activity Log */}
      {summary?.recentActivity && summary.recentActivity.length > 0 && (
        <div className="card">
          <div className="card-header">
            <div className="card-title">
              <Clock size={20} color="#10b981" />
              <span>Recent Activity & Progress Updates</span>
            </div>
            <Link to="/progress" style={{ fontSize: '0.82rem', color: '#6366f1', fontWeight: 600 }}>All History →</Link>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {summary.recentActivity.map((act) => (
              <div key={act._id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0.75rem 1rem', background: 'rgba(255,255,255,0.02)', borderRadius: '8px', border: '1px solid var(--card-border)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <CheckCircle2 size={16} color="#10b981" />
                  <span style={{ fontSize: '0.9rem', fontWeight: 600 }}>{act.item}</span>
                  <span style={{ fontSize: '0.75rem', padding: '0.1rem 0.5rem', background: 'rgba(255,255,255,0.06)', borderRadius: '4px', color: '#94a3b8' }}>
                    {act.type.replace('_', ' ')}
                  </span>
                </div>
                <span style={{ fontSize: '0.78rem', color: '#64748b' }}>
                  {new Date(act.loggedAt).toLocaleDateString()}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
