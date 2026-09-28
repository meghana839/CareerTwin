import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../services/api.js';
import LoadingState from '../components/LoadingState.jsx';
import ErrorState from '../components/ErrorState.jsx';
import Badge from '../components/Badge.jsx';
import { 
  BookOpen, 
  Sparkles, 
  Lightbulb, 
  FolderGit2, 
  Compass, 
  CheckCircle2, 
  ArrowRight,
  TrendingUp,
  Layers
} from 'lucide-react';

export default function Learning() {
  const [profile, setProfile] = useState(null);
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [loggingSkill, setLoggingSkill] = useState(null);
  const [acquiredSkills, setAcquiredSkills] = useState([]);
  const navigate = useNavigate();

  const loadLearningData = async () => {
    try {
      setLoading(true);
      setError(null);

      // 1. Fetch user profile
      const profileRes = await api.getProfile();
      const userProfile = profileRes.profile;
      setProfile(userProfile);
      setAcquiredSkills(userProfile?.skills || []);

      // 2. Perform skill gap to identify missing skills
      const gapRes = await api.analyzeSkillGap(
        userProfile?.targetRole || 'Full Stack Developer',
        userProfile?.skills || []
      );

      // 3. Request tailored learning recommendations for missing skills
      const recRes = await api.getLearningRecommendations(
        gapRes.missingSkills,
        userProfile?.targetRole || 'Full Stack Developer'
      );

      setRecommendations(recRes.recommendations || []);
    } catch (err) {
      setError(err.message || 'Unable to retrieve learning recommendations.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadLearningData();
  }, []);

  const handleMarkLearned = async (skill) => {
    try {
      setLoggingSkill(skill);
      // Log progress which automatically updates profile skills in MongoDB
      await api.logProgress({
        type: 'skill_learned',
        item: skill,
        category: 'Skill',
        notes: `Acquired ${skill} from recommended learning catalog.`
      });

      setAcquiredSkills([...acquiredSkills, skill]);
      // Remove from recommendations or mark as learned
      setRecommendations(prev => prev.filter(r => r.skill !== skill));
    } catch (err) {
      alert(`Failed to log progress: ${err.message}`);
    } finally {
      setLoggingSkill(null);
    }
  };

  if (loading) {
    return <LoadingState message="Curating personalized projects and learning roadmaps for your gaps..." />;
  }

  if (error) {
    return <ErrorState message={error} onRetry={loadLearningData} />;
  }

  return (
    <div className="learning-page">
      <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <div className="page-badge">
            <BookOpen size={14} />
            <span>Curated Curriculum</span>
          </div>
          <h1 className="page-title">Personalized Learning</h1>
          <p className="page-subtitle">
            Action-oriented guides, project blueprints, and foundational topics targeting your exact skill gaps for <strong style={{ color: '#06b6d4' }}>{profile?.targetRole}</strong>.
          </p>
        </div>

        <button className="btn btn-secondary btn-sm" onClick={() => navigate('/progress')}>
          <TrendingUp size={16} />
          <span>View Logged Progress</span>
        </button>
      </div>

      {recommendations.length === 0 ? (
        <div className="card" style={{ textAlign: 'center', padding: '3.5rem 2rem' }}>
          <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🎉</div>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#f8fafc', marginBottom: '0.5rem' }}>
            Zero Skill Gaps Detected!
          </h2>
          <p style={{ color: '#94a3b8', maxWidth: '520px', margin: '0 auto 1.5rem auto' }}>
            You have already acquired all standard competencies required for {profile?.targetRole}. Consider taking an assessment or practicing mock interviews to sharpen your skills!
          </p>
          <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem' }}>
            <button className="btn btn-primary" onClick={() => navigate('/mock-interview')}>
              Practice Mock Interview
            </button>
            <button className="btn btn-secondary" onClick={() => navigate('/assessment')}>
              Take Technical Assessment
            </button>
          </div>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
          {recommendations.map((rec) => (
            <div key={rec.skill} className="card" style={{ border: '1px solid var(--card-border)' }}>
              {/* Header */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem', borderBottom: '1px solid var(--card-border)', paddingBottom: '1rem', marginBottom: '1.25rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <div style={{
                    width: 44,
                    height: 44,
                    borderRadius: 12,
                    background: 'rgba(99, 102, 241, 0.15)',
                    color: '#6366f1',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}>
                    <Layers size={22} />
                  </div>
                  <div>
                    <h3 style={{ fontSize: '1.35rem', fontWeight: 800, color: '#f8fafc' }}>{rec.skill}</h3>
                    <span style={{ fontSize: '0.8rem', color: '#94a3b8' }}>Targeted Skill Gap Recommendation</span>
                  </div>
                </div>

                <button
                  className="btn btn-primary btn-sm"
                  onClick={() => handleMarkLearned(rec.skill)}
                  disabled={loggingSkill === rec.skill}
                >
                  <CheckCircle2 size={16} />
                  <span>{loggingSkill === rec.skill ? 'Recording...' : 'Mark as Learned & Sync'}</span>
                </button>
              </div>

              {/* Body Details */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.5rem' }}>
                {/* Why It Matters */}
                <div style={{ background: 'rgba(255,255,255,0.02)', padding: '1.25rem', borderRadius: '10px', border: '1px solid var(--card-border)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: '#06b6d4', fontSize: '0.85rem', fontWeight: 700, marginBottom: '0.5rem' }}>
                    <Lightbulb size={16} />
                    <span>WHY IT MATTERS</span>
                  </div>
                  <p style={{ fontSize: '0.9rem', color: '#f8fafc', lineHeight: 1.6 }}>
                    {rec.whyItMatters}
                  </p>
                </div>

                {/* What to Learn */}
                <div style={{ background: 'rgba(255,255,255,0.02)', padding: '1.25rem', borderRadius: '10px', border: '1px solid var(--card-border)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: '#a5b4fc', fontSize: '0.85rem', fontWeight: 700, marginBottom: '0.5rem' }}>
                    <Compass size={16} />
                    <span>WHAT TO FOCUS ON</span>
                  </div>
                  <p style={{ fontSize: '0.9rem', color: '#f8fafc', lineHeight: 1.6 }}>
                    {rec.whatToLearn}
                  </p>
                </div>
              </div>

              {/* Suggested Project Capstone */}
              <div style={{
                marginTop: '1.5rem',
                padding: '1.25rem',
                background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.08) 0%, rgba(6, 182, 212, 0.05) 100%)',
                border: '1px solid rgba(16, 185, 129, 0.25)',
                borderRadius: '10px'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: '#34d399', fontSize: '0.85rem', fontWeight: 700, marginBottom: '0.4rem' }}>
                  <FolderGit2 size={16} />
                  <span>RECOMMENDED PORTFOLIO PROJECT</span>
                </div>
                <p style={{ fontSize: '0.95rem', fontWeight: 600, color: '#f8fafc', marginBottom: '0.35rem' }}>
                  {rec.suggestedProject}
                </p>
                <p style={{ fontSize: '0.85rem', color: '#94a3b8' }}>
                  <strong>Learning Direction:</strong> {rec.suggestedLearningDirection}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
