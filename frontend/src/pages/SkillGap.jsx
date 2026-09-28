import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../services/api.js';
import LoadingState from '../components/LoadingState.jsx';
import ErrorState from '../components/ErrorState.jsx';
import ProgressBar from '../components/ProgressBar.jsx';
import Badge from '../components/Badge.jsx';
import { 
  GitFork, 
  CheckCircle, 
  AlertTriangle, 
  Sparkles, 
  BookOpen, 
  ArrowRight,
  TrendingUp,
  Target
} from 'lucide-react';

export default function SkillGap() {
  const [profile, setProfile] = useState(null);
  const [analysis, setAnalysis] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const loadData = async () => {
    try {
      setLoading(true);
      setError(null);

      // 1. Fetch user's profile first
      const profileRes = await api.getProfile();
      const userProfile = profileRes.profile;
      setProfile(userProfile);

      // 2. Perform skill gap analysis using profile's target role and actual skills
      const gapRes = await api.analyzeSkillGap(
        userProfile?.targetRole || 'Full Stack Developer',
        userProfile?.skills || []
      );
      setAnalysis(gapRes);
    } catch (err) {
      setError(err.message || 'Unable to perform skill gap analysis.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  if (loading) {
    return <LoadingState message="Analyzing your skills against official role requirements..." />;
  }

  if (error) {
    return <ErrorState message={error} onRetry={loadData} />;
  }

  return (
    <div className="skill-gap-page">
      <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <div className="page-badge">
            <GitFork size={14} />
            <span>Gap Diagnostics</span>
          </div>
          <h1 className="page-title">Skill Gap Analysis</h1>
          <p className="page-subtitle">
            Authoritative comparison between your verified skillset and target industry standards for <strong style={{ color: '#06b6d4' }}>{analysis?.targetRole}</strong>.
          </p>
        </div>

        <button 
          className="btn btn-secondary btn-sm"
          onClick={() => navigate('/profile')}
        >
          Update Profile Skills
        </button>
      </div>

      {/* Hero Overview Card */}
      <div className="card" style={{ marginBottom: '2.5rem', background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.08) 0%, rgba(6, 182, 212, 0.05) 100%)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1.5rem' }}>
          <div>
            <span style={{ fontSize: '0.85rem', fontWeight: 600, color: '#a5b4fc', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Overall Alignment</span>
            <div style={{ fontSize: '2.6rem', fontWeight: 800, color: '#f8fafc', letterSpacing: '-0.02em', marginTop: '0.2rem' }}>
              {analysis?.matchPercentage || 0}% <span style={{ fontSize: '1rem', color: '#94a3b8', fontWeight: 500 }}>Competency Match</span>
            </div>
            <p style={{ fontSize: '0.9rem', color: '#94a3b8', marginTop: '0.25rem' }}>
              You possess <strong>{analysis?.matchingSkills?.length || 0}</strong> of the <strong>{analysis?.requiredSkills?.length || 0}</strong> required competencies.
            </p>
          </div>

          <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
            <button 
              className="btn btn-primary btn-sm"
              onClick={() => navigate('/what-if')}
            >
              <Sparkles size={16} />
              <span>Simulate Closing Gaps</span>
            </button>
            <button 
              className="btn btn-secondary btn-sm"
              onClick={() => navigate('/learning')}
            >
              <BookOpen size={16} />
              <span>Recommended Learning</span>
            </button>
          </div>
        </div>

        <div style={{ marginTop: '1.75rem' }}>
          <ProgressBar 
            value={analysis?.matchPercentage || 0} 
            color={analysis?.matchPercentage > 65 ? 'emerald' : analysis?.matchPercentage > 35 ? 'cyan' : 'amber'}
          />
        </div>
      </div>

      {/* Two Column Grid: Matching vs Missing Skills */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(420px, 1fr))', gap: '2rem' }}>
        {/* Matching Skills */}
        <div className="card">
          <div className="card-header">
            <div className="card-title">
              <CheckCircle size={20} color="#10b981" />
              <span>Matching Skills ({analysis?.matchingSkills?.length || 0})</span>
            </div>
            <Badge variant="matching">Verified</Badge>
          </div>

          <p style={{ fontSize: '0.88rem', color: '#94a3b8', marginBottom: '1.25rem' }}>
            Skills already documented in your career profile that satisfy {analysis?.targetRole} industry requirements.
          </p>

          {analysis?.matchingSkills && analysis.matchingSkills.length > 0 ? (
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.6rem' }}>
              {analysis.matchingSkills.map(skill => (
                <div key={skill} style={{
                  padding: '0.5rem 0.9rem',
                  background: 'rgba(16, 185, 129, 0.12)',
                  border: '1px solid rgba(16, 185, 129, 0.3)',
                  borderRadius: '8px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  color: '#34d399',
                  fontSize: '0.9rem',
                  fontWeight: 600
                }}>
                  <CheckCircle size={15} />
                  <span>{skill}</span>
                </div>
              ))}
            </div>
          ) : (
            <div style={{ padding: '2rem', textAlign: 'center', background: 'rgba(255,255,255,0.02)', borderRadius: '10px', border: '1px dashed var(--card-border)', color: '#64748b' }}>
              No matching skills found for {analysis?.targetRole} yet. Add your current skills in your Profile.
            </div>
          )}
        </div>

        {/* Missing Skills */}
        <div className="card">
          <div className="card-header">
            <div className="card-title">
              <AlertTriangle size={20} color="#f43f5e" />
              <span>Missing Skill Gaps ({analysis?.missingSkills?.length || 0})</span>
            </div>
            <Badge variant="missing">Action Required</Badge>
          </div>

          <p style={{ fontSize: '0.88rem', color: '#94a3b8', marginBottom: '1.25rem' }}>
            Competencies you need to acquire to become a fully qualified {analysis?.targetRole}.
          </p>

          {analysis?.missingSkills && analysis.missingSkills.length > 0 ? (
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.6rem' }}>
              {analysis.missingSkills.map(skill => (
                <div key={skill} style={{
                  padding: '0.5rem 0.9rem',
                  background: 'rgba(244, 63, 94, 0.12)',
                  border: '1px solid rgba(244, 63, 94, 0.3)',
                  borderRadius: '8px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  color: '#fb7185',
                  fontSize: '0.9rem',
                  fontWeight: 600
                }}>
                  <AlertTriangle size={15} />
                  <span>{skill}</span>
                </div>
              ))}
            </div>
          ) : (
            <div style={{ padding: '2rem', textAlign: 'center', background: 'rgba(16, 185, 129, 0.05)', borderRadius: '10px', border: '1px solid rgba(16, 185, 129, 0.3)', color: '#34d399' }}>
              🎉 Incredible! You have zero missing skill gaps for {analysis?.targetRole}. Your foundation is complete!
            </div>
          )}
        </div>
      </div>

      {/* Target Role Full Requirement Catalog */}
      <div className="card" style={{ marginTop: '2.5rem' }}>
        <div className="card-header">
          <div className="card-title">
            <Target size={20} color="#6366f1" />
            <span>Complete Industry Requirement Baseline: {analysis?.targetRole}</span>
          </div>
        </div>

        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem', marginTop: '0.5rem' }}>
          {analysis?.requiredSkills?.map(skill => {
            const isMatched = analysis?.matchingSkills?.includes(skill);
            return (
              <div key={skill} style={{
                padding: '0.6rem 1rem',
                borderRadius: '8px',
                background: isMatched ? 'rgba(16, 185, 129, 0.1)' : 'rgba(255, 255, 255, 0.04)',
                border: isMatched ? '1px solid rgba(16, 185, 129, 0.35)' : '1px solid var(--card-border)',
                color: isMatched ? '#34d399' : '#94a3b8',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                fontSize: '0.9rem',
                fontWeight: 500
              }}>
                {isMatched ? <CheckCircle size={15} /> : <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#64748b' }} />}
                <span>{skill}</span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
