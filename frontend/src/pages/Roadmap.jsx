import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../services/api.js';
import LoadingState from '../components/LoadingState.jsx';
import ErrorState from '../components/ErrorState.jsx';
import ProgressBar from '../components/ProgressBar.jsx';
import Badge from '../components/Badge.jsx';
import { 
  Milestone, 
  CheckCircle2, 
  Clock, 
  CircleDashed, 
  Calendar, 
  ArrowRight, 
  TrendingUp, 
  BookOpen,
  Sparkles
} from 'lucide-react';

export default function Roadmap() {
  const [profile, setProfile] = useState(null);
  const [roadmap, setRoadmap] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [loggingStepId, setLoggingStepId] = useState(null);
  const navigate = useNavigate();

  const loadRoadmap = async () => {
    try {
      setLoading(true);
      setError(null);

      // Load profile to obtain real user targetRole and skills
      const profileRes = await api.getProfile();
      const userProfile = profileRes.profile;
      setProfile(userProfile);

      const roadmapRes = await api.getRoadmap(
        userProfile?.targetRole || 'Full Stack Developer',
        userProfile?.skills || []
      );
      setRoadmap(roadmapRes);
    } catch (err) {
      setError(err.message || 'Unable to generate personalized roadmap.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadRoadmap();
  }, []);

  const handleMarkStepCompleted = async (step) => {
    try {
      setLoggingStepId(step.id);
      await api.logProgress({
       
        type: 'roadmap_step',
        item: step.title,
        category: 'Roadmap',
        notes: `Completed stage: ${step.title}`
      });

      // Reload roadmap data to reflect newly recorded stage
      await loadRoadmap();
    } catch (err) {
      alert(`Error recording roadmap progress: ${err.message}`);
    } finally {
      setLoggingStepId(null);
    }
  };

  if (loading) {
    return <LoadingState message="Generating structured milestone roadmap for your profile..." />;
  }

  if (error) {
    return <ErrorState message={error} onRetry={loadRoadmap} />;
  }

  return (
    <div className="roadmap-page">
      <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <div className="page-badge">
            <Milestone size={14} />
            <span>Learning Trajectory</span>
          </div>
          <h1 className="page-title">Personalized Roadmap</h1>
          <p className="page-subtitle">
            Progressive stage-by-stage learning path dynamically adapted to your skillset for <strong style={{ color: '#06b6d4' }}>{roadmap?.targetRole}</strong>.
          </p>
        </div>

        <button 
          className="btn btn-secondary btn-sm"
          onClick={() => navigate('/progress')}
        >
          <TrendingUp size={16} />
          <span>View Progress History</span>
        </button>
      </div>

      {/* Progress Summary Card */}
      <div className="card" style={{ marginBottom: '2.5rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem', marginBottom: '1.25rem' }}>
          <div>
            <div style={{ fontSize: '1.15rem', fontWeight: 700, color: '#f8fafc' }}>
              Overall Roadmap Completion: {roadmap?.overallProgress || 0}%
            </div>
            <div style={{ fontSize: '0.85rem', color: '#94a3b8', marginTop: '0.2rem' }}>
              {roadmap?.completedStages || 0} of {roadmap?.totalStages || 0} milestone stages fulfilled
            </div>
          </div>

          <button 
            className="btn btn-primary btn-sm"
            onClick={() => navigate('/learning')}
          >
            <BookOpen size={16} />
            <span>Recommended Learning Resources</span>
          </button>
        </div>

        <ProgressBar value={roadmap?.overallProgress || 0} color="indigo" />
      </div>

      {/* Roadmap Stages Timeline */}
      <div className="roadmap-timeline">
        {roadmap?.stages?.map((stage, idx) => {
          const isCompleted = stage.status === 'Completed';
          const isInProgress = stage.status === 'In Progress';
          const isNotStarted = stage.status === 'Not Started';

          return (
            <div 
              key={stage.id || idx} 
              className={`roadmap-step-card ${isCompleted ? 'completed' : isInProgress ? 'in-progress' : 'not-started'}`}
            >
              <div className="step-indicator">
                <div className={`step-number ${isCompleted ? 'completed' : isInProgress ? 'in-progress' : 'not-started'}`}>
                  {isCompleted ? <CheckCircle2 size={22} /> : idx + 1}
                </div>
              </div>

              <div className="step-content">
                <div className="step-header">
                  <div>
                    <h3 className="step-title">{stage.title}</h3>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginTop: '0.3rem' }}>
                      <span className="step-duration" style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                        <Calendar size={14} />
                        <span>Estimated: {stage.duration}</span>
                      </span>
                      {stage.progressPercentage !== undefined && (
                        <span style={{ fontSize: '0.82rem', color: '#a5b4fc', fontWeight: 600 }}>
                          {stage.progressPercentage}% Skill Match
                        </span>
                      )}
                    </div>
                  </div>

                  <div>
                    {isCompleted && <Badge variant="matching">Completed</Badge>}
                    {isInProgress && <Badge variant="amber">In Progress</Badge>}
                    {isNotStarted && <Badge variant="neutral">Not Started</Badge>}
                  </div>
                </div>

                <p className="step-desc">{stage.description}</p>

                <div style={{ marginTop: '1rem' }}>
                  <div style={{ fontSize: '0.8rem', fontWeight: 600, color: '#94a3b8', marginBottom: '0.5rem', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                    Required Stage Competencies:
                  </div>
                  <div className="step-skills-wrap">
                    {stage.skills?.map(skill => {
                      const userHasSkill = profile?.skills?.some(s => s.toLowerCase() === skill.toLowerCase());
                      return (
                        <span 
                          key={skill} 
                          className="skill-tag"
                          style={{
                            background: userHasSkill ? 'rgba(16, 185, 129, 0.12)' : 'rgba(255, 255, 255, 0.05)',
                            borderColor: userHasSkill ? 'rgba(16, 185, 129, 0.4)' : 'var(--card-border)',
                            color: userHasSkill ? '#34d399' : '#94a3b8'
                          }}
                        >
                          {userHasSkill && <CheckCircle2 size={13} />}
                          <span>{skill}</span>
                        </span>
                      );
                    })}
                  </div>
                </div>

                <div style={{ marginTop: '1.5rem', display: 'flex', justifyContent: 'flex-end' }}>
                  {!isCompleted ? (
                    <button 
                      className="btn btn-secondary btn-sm"
                      onClick={() => handleMarkStepCompleted(stage)}
                      disabled={loggingStepId === stage.id}
                    >
                      <CheckCircle2 size={16} />
                      <span>{loggingStepId === stage.id ? 'Recording...' : 'Mark Stage as Completed'}</span>
                    </button>
                  ) : (
                    <span style={{ fontSize: '0.82rem', color: '#34d399', display: 'flex', alignItems: 'center', gap: '0.4rem', fontWeight: 600 }}>
                      <CheckCircle2 size={16} />
                      <span>Stage Mastered</span>
                    </span>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
