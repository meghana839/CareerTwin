import React, { useState, useEffect } from 'react';
import { api } from '../services/api.js';
import LoadingState from '../components/LoadingState.jsx';
import ErrorState from '../components/ErrorState.jsx';
import Badge from '../components/Badge.jsx';
import { 
  LineChart, 
  Sparkles, 
  DollarSign, 
  TrendingUp, 
  Building2, 
  Flame, 
  CheckCircle, 
  AlertCircle, 
  Layers,
  Cpu
} from 'lucide-react';

export default function CareerAnalysis() {
  const [profile, setProfile] = useState(null);
  const [analysisData, setAnalysisData] = useState(null);
  const [experienceLevel, setExperienceLevel] = useState('Beginner');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchAnalysis = async (level = experienceLevel) => {
    try {
      setLoading(true);
      setError(null);

      // Load profile to retrieve actual targetRole and verified skills
      const profileRes = await api.getProfile();
      const userProfile = profileRes.profile;
      setProfile(userProfile);

      const res = await api.generateCareerAnalysis(
        userProfile?.targetRole || 'Full Stack Developer',
        userProfile?.skills || [],
        level
      );
      setAnalysisData(res);
    } catch (err) {
      setError(err.message || 'Unable to retrieve career analysis.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnalysis();
  }, []);

  const handleLevelChange = (newLevel) => {
    setExperienceLevel(newLevel);
    fetchAnalysis(newLevel);
  };

  if (loading) {
    return <LoadingState message="Analyzing role dynamics, market indicators, and student competencies..." />;
  }

  if (error) {
    return <ErrorState message={error} onRetry={() => fetchAnalysis()} />;
  }

  const { aiDiagnostic, marketInformation } = analysisData || {};

  return (
    <div className="career-analysis-page">
      <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <div className="page-badge">
            <LineChart size={14} />
            <span>Market & AI Diagnostics</span>
          </div>
          <h1 className="page-title">Career Intelligence Analysis</h1>
          <p className="page-subtitle">
            Strategic breakdown of industry demand, compensation benchmarks, and personalized AI-generated guidance for <strong style={{ color: '#06b6d4' }}>{analysisData?.targetRole}</strong>.
          </p>
        </div>

        {/* Experience Level Selector */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: 'rgba(255,255,255,0.04)', padding: '0.4rem 0.6rem', borderRadius: '10px', border: '1px solid var(--card-border)' }}>
          <span style={{ fontSize: '0.8rem', color: '#94a3b8', marginRight: '0.25rem' }}>Experience Tier:</span>
          {['Beginner', 'Intermediate', 'Advanced'].map(tier => (
            <button
              key={tier}
              className={`btn btn-sm ${experienceLevel === tier ? 'btn-primary' : 'btn-secondary'}`}
              style={{ padding: '0.3rem 0.75rem', fontSize: '0.8rem' }}
              onClick={() => handleLevelChange(tier)}
            >
              {tier}
            </button>
          ))}
        </div>
      </div>

      {/* Static / Verified Market Benchmarks (Strictly Separated) */}
      <div style={{ marginBottom: '2.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
          <Building2 size={18} color="#06b6d4" />
          <h3 style={{ fontSize: '1.2rem', fontWeight: 700 }}>Verified Industry Market Data</h3>
          <Badge variant="neutral">Official Market Reference</Badge>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.25rem' }}>
          <div className="card" style={{ padding: '1.25rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#f59e0b', fontSize: '0.82rem', fontWeight: 600 }}>
              <Flame size={16} />
              <span>MARKET DEMAND</span>
            </div>
            <div style={{ fontSize: '1.6rem', fontWeight: 800, marginTop: '0.4rem', color: '#f8fafc' }}>
              {marketInformation?.marketDemand || 'Very High'}
            </div>
            <div style={{ fontSize: '0.78rem', color: '#94a3b8', marginTop: '0.2rem' }}>Based on Q3 technology job postings</div>
          </div>

          <div className="card" style={{ padding: '1.25rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#10b981', fontSize: '0.82rem', fontWeight: 600 }}>
              <DollarSign size={16} />
              <span>EXPECTED SALARY</span>
            </div>
            <div style={{ fontSize: '1.6rem', fontWeight: 800, marginTop: '0.4rem', color: '#f8fafc' }}>
              {marketInformation?.expectedSalaryRange || '$75,000 - $135,000'}
            </div>
            <div style={{ fontSize: '0.78rem', color: '#94a3b8', marginTop: '0.2rem' }}>Entry to mid-level baseline</div>
          </div>

          <div className="card" style={{ padding: '1.25rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#6366f1', fontSize: '0.82rem', fontWeight: 600 }}>
              <TrendingUp size={16} />
              <span>PROJECTED GROWTH</span>
            </div>
            <div style={{ fontSize: '1.6rem', fontWeight: 800, marginTop: '0.4rem', color: '#f8fafc' }}>
              {marketInformation?.industryGrowth || '+22%'}
            </div>
            <div style={{ fontSize: '0.78rem', color: '#94a3b8', marginTop: '0.2rem' }}>5-year occupational outlook</div>
          </div>
        </div>

        {/* Top Hiring Sectors */}
        <div className="card" style={{ marginTop: '1.25rem', padding: '1.25rem' }}>
          <div style={{ fontSize: '0.85rem', fontWeight: 600, color: '#94a3b8', marginBottom: '0.75rem' }}>
            TOP HIRING INDUSTRIES:
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.6rem' }}>
            {marketInformation?.topIndustries?.map(ind => (
              <span key={ind} style={{
                padding: '0.35rem 0.8rem',
                background: 'rgba(255,255,255,0.05)',
                border: '1px solid var(--card-border)',
                borderRadius: '6px',
                fontSize: '0.85rem',
                color: '#f8fafc'
              }}>
                {ind}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* AI Diagnostic Section */}
      <div className="card" style={{ border: '1px solid rgba(99, 102, 241, 0.4)', background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.08) 0%, rgba(139, 92, 246, 0.04) 100%)' }}>
        <div className="card-header">
          <div className="card-title">
            <Sparkles size={20} color="#8b5cf6" />
            <span>AI Career Diagnostic</span>
          </div>
          <Badge variant="primary">{aiDiagnostic?.source || 'Gemini AI Model'}</Badge>
        </div>

        {/* Executive Summary */}
        <div style={{
          padding: '1.5rem',
          background: 'rgba(13, 18, 31, 0.75)',
          borderRadius: '12px',
          border: '1px solid var(--card-border)',
          marginBottom: '2rem'
        }}>
          <div style={{ fontSize: '0.82rem', fontWeight: 700, color: '#a5b4fc', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.5rem' }}>
            Executive Synthesis:
          </div>
          <p style={{ fontSize: '1.05rem', color: '#f8fafc', lineHeight: 1.65 }}>
            "{aiDiagnostic?.executiveSummary}"
          </p>
        </div>

        {/* Key Strengths & Focus Areas */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '2rem' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem', color: '#10b981', fontWeight: 700 }}>
              <CheckCircle size={18} />
              <span>Key Profile Strengths</span>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {aiDiagnostic?.keyStrengths?.map((str, idx) => (
                <div key={idx} style={{
                  padding: '0.85rem 1rem',
                  background: 'rgba(16, 185, 129, 0.08)',
                  border: '1px solid rgba(16, 185, 129, 0.25)',
                  borderRadius: '8px',
                  fontSize: '0.9rem',
                  color: '#f8fafc',
                  lineHeight: 1.5
                }}>
                  {str}
                </div>
              ))}
            </div>
          </div>

          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem', color: '#f59e0b', fontWeight: 700 }}>
              <AlertCircle size={18} />
              <span>Key Strategic Growth Areas</span>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {aiDiagnostic?.growthAreas?.map((ga, idx) => (
                <div key={idx} style={{
                  padding: '0.85rem 1rem',
                  background: 'rgba(245, 158, 11, 0.08)',
                  border: '1px solid rgba(245, 158, 11, 0.25)',
                  borderRadius: '8px',
                  fontSize: '0.9rem',
                  color: '#f8fafc',
                  lineHeight: 1.5
                }}>
                  {ga}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
