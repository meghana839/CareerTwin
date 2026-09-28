import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../services/api.js';
import LoadingState from '../components/LoadingState.jsx';
import ErrorState from '../components/ErrorState.jsx';
import StatCard from '../components/StatCard.jsx';
import Badge from '../components/Badge.jsx';
import { 
  TrendingUp, 
  Plus, 
  CheckCircle2, 
  Layers, 
  Milestone, 
  HelpCircle, 
  Clock, 
  Sparkles,
  Award,
  ArrowRight
} from 'lucide-react';

export default function Progress() {
  const [progressData, setProgressData] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [logging, setLogging] = useState(false);
  const [error, setError] = useState(null);
  const [successMsg, setSuccessMsg] = useState('');

  // Form states for manual log entry
  const [logType, setLogType] = useState('skill_learned');
  const [itemText, setItemText] = useState('');
  const [categoryText, setCategoryText] = useState('Skill');
  const [notesText, setNotesText] = useState('');

  const navigate = useNavigate();

  const loadProgress = async () => {
    try {
      setLoading(true);
      setError(null);

      // Load profile to verify current synchronized skills
      const profileRes = await api.getProfile();
      setProfile(profileRes.profile);

      // Load progress history
      const progRes = await api.getProgress();
      setProgressData(progRes);
    } catch (err) {
      setError(err.message || 'Unable to load career progress.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProgress();
  }, []);

  const handleLogProgress = async (e) => {
    e.preventDefault();
    if (!itemText.trim()) return;

    try {
      setLogging(true);
      setError(null);
      setSuccessMsg('');

      const res = await api.logProgress({
        type: logType,
        item: itemText.trim(),
        category: categoryText.trim() || 'General',
        notes: notesText.trim()
      });

      if (res.success) {
        setSuccessMsg(`"${itemText.trim()}" recorded! Profile skills and roadmaps are now updated.`);
        setItemText('');
        setNotesText('');
        setTimeout(() => setSuccessMsg(''), 4000);
        // Refresh progress and profile
        await loadProgress();
      }
    } catch (err) {
      setError(err.message || 'Failed to record progress entry.');
    } finally {
      setLogging(false);
    }
  };

  if (loading) {
    return <LoadingState message="Aggregating student progress milestones and skill events..." />;
  }

  if (error && !progressData) {
    return <ErrorState message={error} onRetry={loadProgress} />;
  }

  const { stats = {}, history = [] } = progressData || {};

  return (
    <div className="progress-page">
      <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <div className="page-badge">
            <TrendingUp size={14} />
            <span>Velocity & Milestones</span>
          </div>
          <h1 className="page-title">Career Progress Tracker</h1>
          <p className="page-subtitle">
            Log technical competencies and milestone accomplishments. Any logged skill automatically updates your profile in MongoDB.
          </p>
        </div>

        <button className="btn btn-secondary btn-sm" onClick={() => navigate('/dashboard')}>
          <span>View Dashboard</span>
          <ArrowRight size={14} />
        </button>
      </div>

      {successMsg && (
        <div style={{
          padding: '1rem 1.25rem',
          background: 'rgba(16, 185, 129, 0.15)',
          border: '1px solid rgba(16, 185, 129, 0.4)',
          borderRadius: '12px',
          color: '#34d399',
          display: 'flex',
          alignItems: 'center',
          gap: '0.75rem',
          marginBottom: '2rem'
        }}>
          <CheckCircle2 size={20} />
          <span style={{ fontSize: '0.92rem', fontWeight: 600 }}>{successMsg}</span>
        </div>
      )}

      {/* Progress Metrics Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.25rem', marginBottom: '2.5rem' }}>
        <StatCard 
          label="Profile Skills" 
          value={profile?.skills?.length || 0} 
          subtext="Synchronized in MongoDB"
          icon={Layers}
          color="cyan"
        />
        <StatCard 
          label="Roadmap Stages" 
          value={stats.roadmapStepsCompleted || 0} 
          subtext="Completed milestones"
          icon={Milestone}
          color="indigo"
        />
        <StatCard 
          label="Assessments Taken" 
          value={stats.assessmentsCompleted || 0} 
          subtext="Technical score benchmarks"
          icon={HelpCircle}
          color="emerald"
        />
        <StatCard 
          label="Total Activity Logs" 
          value={stats.totalLogs || 0} 
          subtext="Chronological event records"
          icon={Clock}
          color="amber"
        />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(420px, 1fr))', gap: '2rem' }}>
        {/* Form to Log Progress */}
        <div className="card">
          <div className="card-header">
            <div className="card-title">
              <Plus size={20} color="#6366f1" />
              <span>Record New Milestone</span>
            </div>
          </div>

          <form onSubmit={handleLogProgress}>
            <div className="form-group">
              <label className="form-label">Activity Type</label>
              <select 
                className="form-select"
                value={logType}
                onChange={(e) => {
                  setLogType(e.target.value);
                  setCategoryText(e.target.value === 'skill_learned' ? 'Skill' : 'Roadmap');
                }}
              >
                <option value="skill_learned">Skill Learned (Updates Profile Skills)</option>
                <option value="roadmap_step">Roadmap Stage Completed</option>
                <option value="project_added">Portfolio Project Milestone</option>
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">
                {logType === 'skill_learned' ? 'Skill Name (e.g. Docker, TypeScript, GraphQL)' : 'Milestone Title'}
              </label>
              <input 
                type="text" 
                className="form-input" 
                placeholder={logType === 'skill_learned' ? 'Enter skill name...' : 'Enter milestone description...'}
                value={itemText}
                onChange={(e) => setItemText(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Category</label>
              <input 
                type="text" 
                className="form-input" 
                placeholder="e.g. Backend, Frontend, DevOps, Database..."
                value={categoryText}
                onChange={(e) => setCategoryText(e.target.value)}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Notes (Optional)</label>
              <textarea 
                className="form-textarea"
                style={{ minHeight: '80px' }}
                placeholder="Additional notes about what you built or mastered..."
                value={notesText}
                onChange={(e) => setNotesText(e.target.value)}
              />
            </div>

            <button type="submit" className="btn btn-primary" disabled={logging}>
              <Plus size={16} />
              <span>{logging ? 'Recording & Syncing...' : 'Log Activity & Sync Profile'}</span>
            </button>
          </form>
        </div>

        {/* Current Synchronized Profile Skills Preview */}
        <div className="card">
          <div className="card-header">
            <div className="card-title">
              <CheckCircle2 size={20} color="#10b981" />
              <span>Current Synchronized Profile Skills</span>
            </div>
            <span style={{ fontSize: '0.85rem', color: '#94a3b8' }}>
              {profile?.skills?.length || 0} skills
            </span>
          </div>

          <p style={{ fontSize: '0.85rem', color: '#94a3b8', marginBottom: '1.25rem' }}>
            Whenever you log an acquired skill, it is immediately synchronized with your profile and shared across all CareerTwin features.
          </p>

          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', maxHeight: '300px', overflowY: 'auto' }}>
            {profile?.skills && profile.skills.length > 0 ? (
              profile.skills.map(s => (
                <span key={s} className="skill-tag" style={{ background: 'rgba(16, 185, 129, 0.12)', borderColor: 'rgba(16, 185, 129, 0.35)', color: '#34d399' }}>
                  <CheckCircle2 size={13} />
                  <span>{s}</span>
                </span>
              ))
            ) : (
              <div style={{ padding: '2rem', textAlign: 'center', color: '#64748b', width: '100%' }}>
                No skills recorded yet. Log your first skill to sync!
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Complete Historical Activity Log */}
      <div className="card" style={{ marginTop: '2.5rem' }}>
        <div className="card-header">
          <div className="card-title">
            <Clock size={20} color="#06b6d4" />
            <span>Progress History Timeline ({history.length})</span>
          </div>
        </div>

        {history.length === 0 ? (
          <div style={{ padding: '2rem', textAlign: 'center', color: '#94a3b8' }}>
            No progress entries recorded yet. Use the form above to record your first milestone!
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {history.map((item) => (
              <div key={item._id} style={{
                padding: '1rem 1.25rem',
                background: 'rgba(255,255,255,0.02)',
                borderRadius: '8px',
                border: '1px solid var(--card-border)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                flexWrap: 'wrap',
                gap: '1rem'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
                  <div style={{
                    width: 34,
                    height: 34,
                    borderRadius: '50%',
                    background: item.type === 'skill_learned' ? 'rgba(16, 185, 129, 0.15)' : 'rgba(99, 102, 241, 0.15)',
                    color: item.type === 'skill_learned' ? '#10b981' : '#6366f1',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}>
                    <CheckCircle2 size={18} />
                  </div>
                  <div>
                    <div style={{ fontSize: '0.95rem', fontWeight: 700, color: '#f8fafc' }}>{item.item}</div>
                    <div style={{ fontSize: '0.8rem', color: '#94a3b8', display: 'flex', gap: '0.5rem', marginTop: '0.2rem' }}>
                      <span style={{ textTransform: 'capitalize' }}>{item.type.replace('_', ' ')}</span>
                      {item.category && <span>• {item.category}</span>}
                      {item.notes && <span>• "{item.notes}"</span>}
                    </div>
                  </div>
                </div>

                <div style={{ fontSize: '0.8rem', color: '#64748b' }}>
                  {new Date(item.loggedAt).toLocaleString()}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
