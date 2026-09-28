import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../services/api.js';
import LoadingState from '../components/LoadingState.jsx';
import ErrorState from '../components/ErrorState.jsx';
import ProgressBar from '../components/ProgressBar.jsx';
import Badge from '../components/Badge.jsx';
import { 
  Award, 
  Layers, 
  FolderGit2, 
  HelpCircle, 
  Briefcase, 
  ArrowRight,
  TrendingUp,
  CheckCircle,
  Lightbulb
} from 'lucide-react';

export default function JobReadiness() {
  const [profile, setProfile] = useState(null);
  const [readinessData, setReadinessData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const loadReadiness = async () => {
    try {
      setLoading(true);
      setError(null);

      // Load profile
      const profileRes = await api.getProfile();
      const userProfile = profileRes.profile;
      setProfile(userProfile);

      const res = await api.analyzeJobReadiness({
        targetRole: userProfile?.targetRole || 'Full Stack Developer',
        userSkills: userProfile?.skills || [],
        projectsCount: userProfile?.completedProjects?.length || 0,
        experienceYears: userProfile?.experienceYears || 0
      });
      setReadinessData(res);
    } catch (err) {
      setError(err.message || 'Unable to analyze job readiness.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadReadiness();
  }, []);

  if (loading) {
    return <LoadingState message="Calculating multi-variable job readiness index..." />;
  }

  if (error) {
    return <ErrorState message={error} onRetry={loadReadiness} />;
  }

  const { readinessScore = 0, components = {}, recommendations = [] } = readinessData || {};

  return (
    <div className="job-readiness-page">
      <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <div className="page-badge">
            <Award size={14} />
            <span>Readiness Index</span>
          </div>
          <h1 className="page-title">Job Readiness Diagnostic</h1>
          <p className="page-subtitle">
            Holistic readiness index for <strong style={{ color: '#06b6d4' }}>{readinessData?.targetRole}</strong> synthesized across skills, projects, assessment performance, and experience.
          </p>
        </div>

        <button 
          className="btn btn-primary btn-sm"
          onClick={() => navigate('/assessment')}
        >
          <HelpCircle size={16} />
          <span>Verify with Assessment</span>
        </button>
      </div>

      {/* Hero Readiness Gauge Card */}
      <div className="card" style={{
        padding: '2.5rem',
        marginBottom: '2.5rem',
        background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.08) 0%, rgba(99, 102, 241, 0.08) 100%)',
        border: '1px solid rgba(16, 185, 129, 0.3)'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '2rem' }}>
          <div>
            <span style={{ fontSize: '0.85rem', fontWeight: 700, color: '#34d399', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Consolidated Score (Normalized 0–100)
            </span>
            <div style={{ fontSize: '3.6rem', fontWeight: 800, color: '#f8fafc', letterSpacing: '-0.03em', lineHeight: 1.1, marginTop: '0.25rem' }}>
              {readinessScore}%
            </div>
            <p style={{ fontSize: '0.95rem', color: '#94a3b8', marginTop: '0.5rem', maxWidth: '500px' }}>
              {readinessScore >= 80 
                ? 'High Candidate Competitiveness: Your combined credentials meet industry expectations for entry-level and junior roles.'
                : readinessScore >= 50
                ? 'Moderate Readiness: Solid core fundamentals, but targeted portfolio capstones and test scores will accelerate hiring potential.'
                : 'Developing Profile: Focus on building practical projects and completing roadmap milestones.'
              }
            </p>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', minWidth: '240px' }}>
            <button className="btn btn-secondary" onClick={() => navigate('/profile')}>
              Update Portfolio & Skills
            </button>
            <button className="btn btn-primary" onClick={() => navigate('/resume')}>
              Inspect Resume ATS Match
            </button>
          </div>
        </div>

        <div style={{ marginTop: '2rem' }}>
          <ProgressBar 
            value={readinessScore} 
            color={readinessScore >= 70 ? 'emerald' : readinessScore >= 45 ? 'cyan' : 'amber'}
          />
        </div>
      </div>

      {/* Component Breakdown Cards (Each strictly normalized to 0-100%) */}
      <h3 style={{ fontSize: '1.3rem', fontWeight: 700, marginBottom: '1rem' }}>
        Readiness Score Composition (Normalized Factors)
      </h3>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1.5rem', marginBottom: '2.5rem' }}>
        {/* Component 1: Skills */}
        <div className="card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#6366f1', fontWeight: 700 }}>
              <Layers size={18} />
              <span>Skill Coverage</span>
            </div>
            <Badge variant="primary">{components.skillScore?.weight} Weight</Badge>
          </div>
          <div style={{ fontSize: '2rem', fontWeight: 800, color: '#f8fafc' }}>
            {components.skillScore?.value}%
          </div>
          <p style={{ fontSize: '0.82rem', color: '#94a3b8', margin: '0.5rem 0 1rem 0' }}>
            {components.skillScore?.description}
          </p>
          <ProgressBar value={components.skillScore?.value || 0} color="indigo" />
        </div>

        {/* Component 2: Projects */}
        <div className="card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#10b981', fontWeight: 700 }}>
              <FolderGit2 size={18} />
              <span>Portfolio Capstones</span>
            </div>
            <Badge variant="matching">{components.projectScore?.weight} Weight</Badge>
          </div>
          <div style={{ fontSize: '2rem', fontWeight: 800, color: '#f8fafc' }}>
            {components.projectScore?.value}%
          </div>
          <p style={{ fontSize: '0.82rem', color: '#94a3b8', margin: '0.5rem 0 1rem 0' }}>
            {components.projectScore?.description}
          </p>
          <ProgressBar value={components.projectScore?.value || 0} color="emerald" />
        </div>

        {/* Component 3: Assessment */}
        <div className="card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#06b6d4', fontWeight: 700 }}>
              <HelpCircle size={18} />
              <span>Technical Benchmark</span>
            </div>
            <Badge variant="neutral">{components.assessmentScore?.weight} Weight</Badge>
          </div>
          <div style={{ fontSize: '2rem', fontWeight: 800, color: '#f8fafc' }}>
            {components.assessmentScore?.value}%
          </div>
          <p style={{ fontSize: '0.82rem', color: '#94a3b8', margin: '0.5rem 0 1rem 0' }}>
            {components.assessmentScore?.description}
          </p>
          <ProgressBar value={components.assessmentScore?.value || 0} color="cyan" />
        </div>

        {/* Component 4: Experience */}
        <div className="card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#f59e0b', fontWeight: 700 }}>
              <Briefcase size={18} />
              <span>Experience Tier</span>
            </div>
            <Badge variant="amber">{components.experienceScore?.weight} Weight</Badge>
          </div>
          <div style={{ fontSize: '2rem', fontWeight: 800, color: '#f8fafc' }}>
            {components.experienceScore?.value}%
          </div>
          <p style={{ fontSize: '0.82rem', color: '#94a3b8', margin: '0.5rem 0 1rem 0' }}>
            {components.experienceScore?.description}
          </p>
          <ProgressBar value={components.experienceScore?.value || 0} color="amber" />
        </div>
      </div>

      {/* Strategic Improvement Directives */}
      {recommendations.length > 0 && (
        <div className="card">
          <div className="card-header">
            <div className="card-title">
              <Lightbulb size={20} color="#f59e0b" />
              <span>Tactical Directives to Elevate Readiness</span>
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {recommendations.map((rec, idx) => (
              <div key={idx} style={{
                padding: '0.9rem 1.2rem',
                background: 'rgba(255,255,255,0.03)',
                borderRadius: '8px',
                border: '1px solid var(--card-border)',
                display: 'flex',
                alignItems: 'center',
                gap: '0.75rem',
                fontSize: '0.92rem',
                color: '#f8fafc'
              }}>
                <CheckCircle size={18} color="#06b6d4" />
                <span>{rec}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
