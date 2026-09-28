import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../services/api.js';
import LoadingState from '../components/LoadingState.jsx';
import ErrorState from '../components/ErrorState.jsx';
import ProgressBar from '../components/ProgressBar.jsx';
import Badge from '../components/Badge.jsx';
import { 
  Sparkles, 
  ArrowRight, 
  Plus, 
  X, 
  Zap, 
  CheckCircle, 
  AlertTriangle,
  RotateCcw,
  CheckCircle2,
  TrendingUp
} from 'lucide-react';

export default function WhatIf() {
  const [profile, setProfile] = useState(null);
  const [simulatedSkills, setSimulatedSkills] = useState([]);
  const [skillInput, setSkillInput] = useState('');
  const [simulationResult, setSimulationResult] = useState(null);
  const [loading, setLoading] = useState(true);
  const [simulating, setSimulating] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const loadProfileAndBaseline = async () => {
    try {
      setLoading(true);
      setError(null);
const profileRes = await api.getProfile();
      const userProfile = profileRes.profile;
      setProfile(userProfile);

      // Perform initial simulation with empty new skills to establish baseline
      const simRes = await api.simulateWhatIf(
        userProfile?.targetRole || 'Full Stack Developer',
        userProfile?.skills || [],
        []
      );
      setSimulationResult(simRes);
    } catch (err) {
      setError(err.message || 'Unable to initialize What-If simulator.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProfileAndBaseline();
  }, []);

  const runSimulation = async (updatedNewSkills) => {
    try {
      setSimulating(true);
      const res = await api.simulateWhatIf(
        profile?.targetRole || 'Full Stack Developer',
        profile?.skills || [],
        updatedNewSkills
      );
      setSimulationResult(res);
    } catch (err) {
      console.error('Simulation error:', err.message);
    } finally {
      setSimulating(false);
    }
  };

  const handleAddSkill = (skillName) => {
    const val = (skillName || skillInput).trim();
    if (!val) return;
    if (!simulatedSkills.some(s => s.toLowerCase() === val.toLowerCase())) {
      const nextSkills = [...simulatedSkills, val];
      setSimulatedSkills(nextSkills);
      runSimulation(nextSkills);
    }
    setSkillInput('');
  };

  const handleRemoveSkill = (skillToRemove) => {
    const nextSkills = simulatedSkills.filter(s => s !== skillToRemove);
    setSimulatedSkills(nextSkills);
    runSimulation(nextSkills);
  };

  const handleResetSimulation = () => {
    setSimulatedSkills([]);
    runSimulation([]);
  };

  if (loading) {
    return <LoadingState message="Loading simulation environment and role models..." />;
  }

  if (error) {
    return <ErrorState message={error} onRetry={loadProfileAndBaseline} />;
  }

  // Pre-calculated missing skills for easy 1-click addition
  const missingSuggestions = simulationResult?.remainingMissingSkills || [];

  return (
    <div className="what-if-page">
      <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <div className="page-badge">
            <Sparkles size={14} />
            <span>Predictive Career Sandbox</span>
          </div>
          <h1 className="page-title">What-If Career Simulation</h1>
          <p className="page-subtitle">
            Test hypotheses: What happens to your candidate competitiveness when you learn additional skills for <strong style={{ color: '#06b6d4' }}>{profile?.targetRole}</strong>?
          </p>
        </div>

        {simulatedSkills.length > 0 && (
          <button className="btn btn-secondary btn-sm" onClick={handleResetSimulation}>
            <RotateCcw size={14} />
            <span>Reset Simulation</span>
          </button>
        )}
      </div>

      {/* Hero Visual Comparison: Before vs After */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
        gap: '2rem',
        marginBottom: '2.5rem'
      }}>
        {/* Baseline Card */}
        <div className="card" style={{ background: 'rgba(16, 23, 41, 0.85)', border: '1px solid var(--card-border)' }}>
          <div style={{ fontSize: '0.8rem', fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            Current Reality
          </div>
          <div style={{ fontSize: '1.4rem', fontWeight: 800, color: '#f8fafc', margin: '0.4rem 0' }}>
            Current Profile Baseline
          </div>
          <div style={{ fontSize: '3rem', fontWeight: 800, color: '#6366f1', letterSpacing: '-0.03em' }}>
            {simulationResult?.baselineScore || 0}%
          </div>
          <p style={{ fontSize: '0.85rem', color: '#94a3b8', marginBottom: '1rem' }}>
            Based on {profile?.skills?.length || 0} skills currently saved in your profile.
          </p>
          <ProgressBar value={simulationResult?.baselineScore || 0} color="indigo" />
        </div>

        {/* Simulated Boost Card */}
        <div className="card" style={{
          background: 'linear-gradient(135deg, rgba(6, 182, 212, 0.12) 0%, rgba(99, 102, 241, 0.15) 100%)',
          border: '1px solid rgba(6, 182, 212, 0.4)',
          boxShadow: '0 0 30px rgba(6, 182, 212, 0.15)'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '0.8rem', fontWeight: 700, color: '#38bdf8', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Simulated Projection
            </span>
            {simulationResult?.scoreBoost > 0 && (
              <span style={{
                background: 'rgba(16, 185, 129, 0.2)',
                color: '#34d399',
                padding: '0.2rem 0.6rem',
                borderRadius: '9999px',
                fontSize: '0.78rem',
                fontWeight: 700,
                display: 'flex',
                alignItems: 'center',
                gap: '0.3rem'
              }}>
                <Zap size={12} />
                +{simulationResult.scoreBoost}% BOOST
              </span>
            )}
          </div>

          <div style={{ fontSize: '1.4rem', fontWeight: 800, color: '#f8fafc', margin: '0.4rem 0' }}>
            After Learning Selected Skills
          </div>
          <div style={{ fontSize: '3rem', fontWeight: 800, color: '#06b6d4', letterSpacing: '-0.03em' }}>
            {simulationResult?.simulatedScore || 0}%
          </div>
          <p style={{ fontSize: '0.85rem', color: '#94a3b8', marginBottom: '1rem' }}>
            Combined with {simulatedSkills.length} hypothetical new competencies.
          </p>
          <ProgressBar value={simulationResult?.simulatedScore || 0} color="cyan" />
        </div>
      </div>

      {/* Interactive Skill Sandbox Controls */}
      <div className="card" style={{ marginBottom: '2.5rem' }}>
        <div className="card-header">
          <div className="card-title">
            <Plus size={20} color="#06b6d4" />
            <span>Simulate Additional Skills</span>
          </div>
          <span style={{ fontSize: '0.85rem', color: '#94a3b8' }}>
            {simulatedSkills.length} hypothetical skill(s) active
          </span>
        </div>

        {/* Input box */}
        <div className="input-with-button" style={{ marginBottom: '1.5rem' }}>
          <input 
            type="text" 
            className="form-input" 
            placeholder="Type any technology (e.g. Node.js, Express, Docker, PostgreSQL)..."
            value={skillInput}
            onChange={(e) => setSkillInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault();
                handleAddSkill();
              }
            }}
          />
          <button className="btn btn-primary" onClick={() => handleAddSkill()}>
            <Plus size={16} />
            <span>Add to Sandbox</span>
          </button>
        </div>

        {/* One-Click Missing Suggestions */}
        {missingSuggestions.length > 0 && (
          <div style={{ marginBottom: '1.5rem', padding: '1rem', background: 'rgba(255,255,255,0.02)', borderRadius: '10px', border: '1px solid var(--card-border)' }}>
            <div style={{ fontSize: '0.82rem', fontWeight: 600, color: '#94a3b8', marginBottom: '0.6rem' }}>
              RECOMMENDED TO TEST FOR {profile?.targetRole.toUpperCase()}:
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
              {missingSuggestions.map(skill => (
                <button
                  key={skill}
                  className="btn btn-secondary btn-sm"
                  style={{ fontSize: '0.8rem', padding: '0.3rem 0.75rem' }}
                  onClick={() => handleAddSkill(skill)}
                >
                  <Plus size={12} />
                  <span>{skill}</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Active Simulated Skills Pills */}
        <div>
          <div style={{ fontSize: '0.88rem', fontWeight: 600, color: '#f8fafc', marginBottom: '0.6rem' }}>
            Hypothetical Skills Under Evaluation:
          </div>
          {simulatedSkills.length === 0 ? (
            <div style={{ padding: '1.5rem', textAlign: 'center', background: 'rgba(255,255,255,0.02)', borderRadius: '8px', border: '1px dashed var(--card-border)', color: '#64748b', fontSize: '0.88rem' }}>
              No hypothetical skills selected yet. Click any suggested skill above or enter custom skills to see your match score elevate in real time.
            </div>
          ) : (
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.6rem' }}>
              {simulatedSkills.map(skill => (
                <span 
                  key={skill} 
                  className="skill-tag"
                  style={{
                    background: 'rgba(6, 182, 212, 0.15)',
                    borderColor: 'rgba(6, 182, 212, 0.4)',
                    color: '#38bdf8'
                  }}
                >
                  <Sparkles size={14} />
                  <span>{skill}</span>
                  <button 
                    type="button" 
                    className="skill-tag-remove"
                    onClick={() => handleRemoveSkill(skill)}
                  >
                    <X size={14} />
                  </button>
                </span>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Remaining Missing Skills After Simulation */}
      <div className="card">
        <div className="card-header">
          <div className="card-title">
            <CheckCircle2 size={20} color="#10b981" />
            <span>Remaining Skill Gaps After Simulation</span>
          </div>
          <span style={{ fontSize: '0.85rem', color: '#94a3b8' }}>
            {simulationResult?.remainingMissingSkills?.length || 0} remaining
          </span>
        </div>

        {simulationResult?.remainingMissingSkills && simulationResult.remainingMissingSkills.length > 0 ? (
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.6rem' }}>
            {simulationResult.remainingMissingSkills.map(skill => (
              <span key={skill} className="badge badge-amber" style={{ padding: '0.4rem 0.8rem', fontSize: '0.85rem' }}>
                {skill}
              </span>
            ))}
          </div>
        ) : (
          <div style={{ padding: '1.5rem', background: 'rgba(16, 185, 129, 0.08)', borderRadius: '8px', color: '#34d399', textAlign: 'center', fontWeight: 600 }}>
            🎉 Perfect Score! By acquiring all selected skills, you will completely satisfy every requirement for {profile?.targetRole}!
          </div>
        )}
      </div>
    </div>
  );
}
