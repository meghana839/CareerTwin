import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../services/api.js';
import LoadingState from '../components/LoadingState.jsx';
import ErrorState from '../components/ErrorState.jsx';
import ProgressBar from '../components/ProgressBar.jsx';
import Badge from '../components/Badge.jsx';
import { 
  HelpCircle, 
  ChevronLeft, 
  ChevronRight, 
  CheckCircle2, 
  Award, 
  RotateCcw, 
  Target,
  ArrowRight
} from 'lucide-react';

export default function Assessment() {
  const [profile, setProfile] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [userAnswers, setUserAnswers] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const loadAssessment = async () => {
    try {
      setLoading(true);
      setError(null);
      setResult(null);
      setUserAnswers({});
      setCurrentIdx(0);

      // Load profile to target the user's role
      const profileRes = await api.getProfile();
      const userProfile = profileRes.profile;
      setProfile(userProfile);

      const questionsRes = await api.getAssessmentQuestions(
        userProfile?.targetRole || 'Full Stack Developer',
        userProfile?.skills || []
      );
      setQuestions(questionsRes.questions || []);
    } catch (err) {
      setError(err.message || 'Unable to load assessment questions.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAssessment();
  }, []);

  const handleSelectOption = (questionId, optionIndex) => {
    setUserAnswers({
      ...userAnswers,
      [questionId]: optionIndex
    });
  };

  const handleSubmit = async () => {
    try {
      setSubmitting(true);
      setError(null);

      const presentedQuestionIds = questions.map(q => q.id);

      const res = await api.submitAssessment({
        targetRole: profile?.targetRole || 'Full Stack Developer',
        presentedQuestionIds,
        userAnswers
      });

      if (res.result) {
        setResult(res.result);
      }
    } catch (err) {
      setError(err.message || 'Failed to evaluate assessment.');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return <LoadingState message="Generating domain questions for your target role..." />;
  }

  if (error && !result) {
    return <ErrorState message={error} onRetry={loadAssessment} />;
  }

  // Result View
  if (result) {
    return (
      <div className="assessment-page">
        <div className="page-header" style={{ textAlign: 'center' }}>
          <div className="page-badge">
            <Award size={14} />
            <span>Official Evaluation</span>
          </div>
          <h1 className="page-title">Assessment Results</h1>
          <p className="page-subtitle" style={{ margin: '0.5rem auto' }}>
            Benchmark evaluation completed for <strong style={{ color: '#06b6d4' }}>{profile?.targetRole}</strong>.
          </p>
        </div>

        {/* Score Overview Card */}
        <div className="card" style={{ maxWidth: '780px', margin: '0 auto 2.5rem auto', textAlign: 'center', padding: '3rem 2rem' }}>
          <div style={{
            width: '120px',
            height: '120px',
            borderRadius: '50%',
            background: result.score >= 70 ? 'rgba(16, 185, 129, 0.15)' : 'rgba(99, 102, 241, 0.15)',
            border: `3px solid ${result.score >= 70 ? '#10b981' : '#6366f1'}`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 1.5rem auto',
            fontSize: '2.5rem',
            fontWeight: 800,
            color: '#f8fafc'
          }}>
            {result.score}%
          </div>

          <h2 style={{ fontSize: '1.6rem', fontWeight: 800, marginBottom: '0.5rem' }}>
            {result.score >= 80 ? 'Outstanding Mastery!' : result.score >= 60 ? 'Competent Foundation' : 'Growth Opportunities Identified'}
          </h2>

          <p style={{ color: '#94a3b8', fontSize: '0.95rem', maxWidth: '540px', margin: '0 auto 2rem auto' }}>
            You answered <strong>{result.correctAnswers}</strong> out of <strong>{result.totalQuestions}</strong> questions correctly. Your verified Job Readiness score has been updated in your profile.
          </p>

          {/* Skill Breakdown */}
          {result.skillBreakdown && result.skillBreakdown.length > 0 && (
            <div style={{ textAlign: 'left', marginTop: '2rem', borderTop: '1px solid var(--card-border)', paddingTop: '1.5rem' }}>
              <h4 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '1rem', color: '#f8fafc' }}>
                Skill-by-Skill Performance Breakdown:
              </h4>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem' }}>
                {result.skillBreakdown.map((sb) => {
                  const pct = Math.round((sb.correct / (sb.total || 1)) * 100);
                  return (
                    <div key={sb.skill} style={{ padding: '0.85rem 1rem', background: 'rgba(255,255,255,0.03)', borderRadius: '8px', border: '1px solid var(--card-border)' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.88rem', fontWeight: 600 }}>
                        <span>{sb.skill}</span>
                        <span style={{ color: pct >= 66 ? '#34d399' : '#fb7185' }}>{pct}%</span>
                      </div>
                      <div style={{ fontSize: '0.78rem', color: '#94a3b8', marginTop: '0.2rem' }}>
                        {sb.correct} / {sb.total} correct
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', marginTop: '2.5rem', flexWrap: 'wrap' }}>
            <button className="btn btn-secondary" onClick={loadAssessment}>
              <RotateCcw size={16} />
              <span>Retake Assessment</span>
            </button>
            <button className="btn btn-primary" onClick={() => navigate('/job-readiness')}>
              <span>Check Job Readiness</span>
              <ArrowRight size={16} />
            </button>
          </div>
        </div>
      </div>
    );
  }

  const currentQ = questions[currentIdx];
  const isAnswered = currentQ && userAnswers[currentQ.id] !== undefined;
  const answeredCount = Object.keys(userAnswers).length;
  const totalCount = questions.length;

  return (
    <div className="assessment-page">
      <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <div className="page-badge">
            <HelpCircle size={14} />
            <span>Interactive Assessment</span>
          </div>
          <h1 className="page-title">Technical Assessment</h1>
          <p className="page-subtitle">
            Role competency assessment for <strong style={{ color: '#06b6d4' }}>{profile?.targetRole}</strong>. Answer one question at a time.
          </p>
        </div>

        <div style={{ fontSize: '0.88rem', color: '#94a3b8', background: 'rgba(255,255,255,0.05)', padding: '0.5rem 1rem', borderRadius: '8px', border: '1px solid var(--card-border)' }}>
          Question <strong style={{ color: '#fff' }}>{currentIdx + 1}</strong> of <strong style={{ color: '#fff' }}>{totalCount}</strong>
        </div>
      </div>

      <div className="quiz-container">
        {/* Progress header */}
        <div className="quiz-progress-bar">
          <span style={{ fontSize: '0.85rem', color: '#94a3b8' }}>
            Answered: {answeredCount}/{totalCount}
          </span>
          <span style={{ fontSize: '0.85rem', color: '#a5b4fc', fontWeight: 600 }}>
            {Math.round((answeredCount / (totalCount || 1)) * 100)}% Complete
          </span>
        </div>
        <ProgressBar value={answeredCount} max={totalCount} color="cyan" />

        {currentQ && (
          <div className="question-card" style={{ marginTop: '1.5rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
              <Badge variant="primary">{currentQ.skill}</Badge>
              <span style={{ fontSize: '0.78rem', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                Difficulty: {currentQ.difficulty}
              </span>
            </div>

            <h3 className="question-text">{currentQ.question}</h3>

            <div className="options-list">
              {currentQ.options.map((opt, optIdx) => {
                const isSelected = userAnswers[currentQ.id] === optIdx;
                return (
                  <div
                    key={optIdx}
                    className={`option-item ${isSelected ? 'selected' : ''}`}
                    onClick={() => handleSelectOption(currentQ.id, optIdx)}
                  >
                    <div className="option-radio">
                      {isSelected && <div className="option-radio-dot" />}
                    </div>
                    <span style={{ fontSize: '0.95rem' }}>{opt}</span>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Navigation Buttons */}
        <div className="quiz-nav-actions">
          <button
            className="btn btn-secondary btn-sm"
            onClick={() => setCurrentIdx(Math.max(0, currentIdx - 1))}
            disabled={currentIdx === 0}
          >
            <ChevronLeft size={16} />
            <span>Previous</span>
          </button>

          {currentIdx < totalCount - 1 ? (
            <button
              className="btn btn-secondary btn-sm"
              onClick={() => setCurrentIdx(currentIdx + 1)}
            >
              <span>Next</span>
              <ChevronRight size={16} />
            </button>
          ) : (
            <button
              className="btn btn-primary btn-sm"
              onClick={handleSubmit}
              disabled={submitting || answeredCount === 0}
            >
              <CheckCircle2 size={16} />
              <span>{submitting ? 'Submitting...' : 'Submit Assessment'}</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
