import React, { useState, useEffect } from 'react';
import { api } from '../services/api.js';
import LoadingState from '../components/LoadingState.jsx';
import ErrorState from '../components/ErrorState.jsx';
import ProgressBar from '../components/ProgressBar.jsx';
import Badge from '../components/Badge.jsx';
import { 
  Mic, 
  Sparkles, 
  Send, 
  CheckCircle, 
  AlertCircle, 
  ChevronLeft, 
  ChevronRight, 
  RotateCcw,
  CheckCircle2,
  Award
} from 'lucide-react';

export default function MockInterview() {
  const [profile, setProfile] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [userAnswer, setUserAnswer] = useState('');
  const [evaluating, setEvaluating] = useState(false);
  const [evaluation, setEvaluation] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadInterview = async () => {
    try {
      setLoading(true);
      setError(null);
      setEvaluation(null);
      setUserAnswer('');

      const profileRes = await api.getProfile();
      const userProfile = profileRes.profile;
      setProfile(userProfile);

      const qRes = await api.getMockInterviewQuestions(
        userProfile?.targetRole || 'Full Stack Developer',
        userProfile?.skills || []
      );
      setQuestions(qRes.questions || []);
    } catch (err) {
      setError(err.message || 'Unable to load interview questions.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadInterview();
  }, []);

  const handleEvaluate = async () => {
    if (!userAnswer.trim()) {
      alert('Please type your answer before submitting for evaluation.');
      return;
    }

    try {
      setEvaluating(true);
      setError(null);

      const currentQ = questions[currentIdx];
      const res = await api.evaluateMockInterviewAnswer(
        currentQ,
        userAnswer,
        profile?.targetRole || 'Full Stack Developer'
      );

      if (res.evaluation) {
        setEvaluation({
          ...res.evaluation,
          isAiEvaluated: res.isAiEvaluated
        });
      }
    } catch (err) {
      setError(err.message || 'Unable to evaluate answer.');
    } finally {
      setEvaluating(false);
    }
  };

  const handleNextQuestion = () => {
    if (currentIdx < questions.length - 1) {
      setCurrentIdx(currentIdx + 1);
      setUserAnswer('');
      setEvaluation(null);
    }
  };

  const handlePrevQuestion = () => {
    if (currentIdx > 0) {
      setCurrentIdx(currentIdx - 1);
      setUserAnswer('');
      setEvaluation(null);
    }
  };

  if (loading) {
    return <LoadingState message="Setting up mock interview session with role-specific questions..." />;
  }

  if (error && !evaluation) {
    return <ErrorState message={error} onRetry={loadInterview} />;
  }

  const currentQ = questions[currentIdx];

  return (
    <div className="mock-interview-page">
      <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <div className="page-badge">
            <Mic size={14} />
            <span>Technical Simulation</span>
          </div>
          <h1 className="page-title">Mock Technical Interview</h1>
          <p className="page-subtitle">
            Simulate realistic technical hiring questions for <strong style={{ color: '#06b6d4' }}>{profile?.targetRole}</strong> with instant AI rubric evaluation.
          </p>
        </div>

        <div style={{ fontSize: '0.88rem', color: '#94a3b8', background: 'rgba(255,255,255,0.05)', padding: '0.5rem 1rem', borderRadius: '8px', border: '1px solid var(--card-border)' }}>
          Question <strong style={{ color: '#fff' }}>{currentIdx + 1}</strong> of <strong style={{ color: '#fff' }}>{questions.length}</strong>
        </div>
      </div>

      <div style={{ maxWidth: '880px', margin: '0 auto' }}>
        {/* Question Prompt Card */}
        <div className="card" style={{ marginBottom: '2rem', border: '1px solid rgba(99, 102, 241, 0.4)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
            <Badge variant="primary">System Design & Core Principles</Badge>
            <span style={{ fontSize: '0.8rem', color: '#94a3b8' }}>Interviewer Prompt</span>
          </div>

          <h3 style={{ fontSize: '1.35rem', fontWeight: 700, color: '#f8fafc', lineHeight: 1.5 }}>
            "{currentQ}"
          </h3>
        </div>

        {/* Answer Input */}
        <div className="card" style={{ marginBottom: '2rem' }}>
          <div className="card-header">
            <div className="card-title">
              <Mic size={20} color="#06b6d4" />
              <span>Your Technical Answer</span>
            </div>
            <span style={{ fontSize: '0.82rem', color: '#94a3b8' }}>
              {userAnswer.trim() ? `${userAnswer.trim().split(/\s+/).length} words` : '0 words'}
            </span>
          </div>

          <div className="form-group">
            <textarea 
              className="form-textarea"
              style={{ minHeight: '160px', fontSize: '0.95rem', lineHeight: 1.6 }}
              placeholder="Structure your answer clearly: Explain your thought process, architecture trade-offs, edge cases, and concrete technology choices..."
              value={userAnswer}
              onChange={(e) => setUserAnswer(e.target.value)}
              disabled={evaluating}
            />
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <button 
                className="btn btn-secondary btn-sm"
                onClick={handlePrevQuestion}
                disabled={currentIdx === 0 || evaluating}
              >
                <ChevronLeft size={16} />
                <span>Prev Question</span>
              </button>
              <button 
                className="btn btn-secondary btn-sm"
                onClick={handleNextQuestion}
                disabled={currentIdx === questions.length - 1 || evaluating}
              >
                <span>Next Question</span>
                <ChevronRight size={16} />
              </button>
            </div>

            <button 
              className="btn btn-primary"
              onClick={handleEvaluate}
              disabled={evaluating || !userAnswer.trim()}
              style={{ minWidth: '180px' }}
            >
              <Sparkles size={16} />
              <span>{evaluating ? 'Evaluating Answer...' : 'Submit Answer'}</span>
            </button>
          </div>
        </div>

        {/* Evaluation Result */}
        {evaluation && (
          <div className="card" style={{
            padding: '2.5rem',
            background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.08) 0%, rgba(139, 92, 246, 0.05) 100%)',
            border: '1px solid rgba(99, 102, 241, 0.4)',
            marginBottom: '3rem'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1.5rem', marginBottom: '1.5rem' }}>
              <div>
                <span style={{ fontSize: '0.8rem', fontWeight: 700, color: '#a5b4fc', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  Evaluated Technical Score
                </span>
                <div style={{ fontSize: '3rem', fontWeight: 800, color: '#f8fafc', letterSpacing: '-0.02em', lineHeight: 1.1, marginTop: '0.2rem' }}>
                  {evaluation.score}/100
                </div>
              </div>

              {evaluation.isAiEvaluated ? (
                <Badge variant="primary" icon={Sparkles}>
                  Evaluated by Google Gemini
                </Badge>
              ) : (
                <Badge variant="neutral">
                  CareerTwin Heuristic Evaluator
                </Badge>
              )}
            </div>

            <ProgressBar value={evaluation.score} color={evaluation.score >= 70 ? 'emerald' : evaluation.score >= 50 ? 'cyan' : 'amber'} />

            {/* Qualitative Feedback */}
            <div style={{ marginTop: '1.75rem', padding: '1.25rem', background: 'rgba(13, 18, 31, 0.75)', borderRadius: '10px', border: '1px solid var(--card-border)' }}>
              <div style={{ fontSize: '0.82rem', fontWeight: 700, color: '#06b6d4', textTransform: 'uppercase', marginBottom: '0.4rem' }}>
                Interviewer Assessment:
              </div>
              <p style={{ fontSize: '0.95rem', color: '#f8fafc', lineHeight: 1.6 }}>
                {evaluation.feedback}
              </p>
            </div>

            {/* Strengths & Improvements */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.5rem', marginTop: '1.5rem' }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: '#10b981', fontWeight: 700, fontSize: '0.9rem', marginBottom: '0.6rem' }}>
                  <CheckCircle size={16} />
                  <span>Key Answer Strengths</span>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  {evaluation.strengths?.map((str, idx) => (
                    <div key={idx} style={{ padding: '0.6rem 0.9rem', background: 'rgba(16, 185, 129, 0.08)', borderRadius: '6px', fontSize: '0.85rem', color: '#f8fafc', border: '1px solid rgba(16, 185, 129, 0.2)' }}>
                      {str}
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: '#f59e0b', fontWeight: 700, fontSize: '0.9rem', marginBottom: '0.6rem' }}>
                  <AlertCircle size={16} />
                  <span>Refinement Directives</span>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  {evaluation.improvements?.map((imp, idx) => (
                    <div key={idx} style={{ padding: '0.6rem 0.9rem', background: 'rgba(245, 158, 11, 0.08)', borderRadius: '6px', fontSize: '0.85rem', color: '#f8fafc', border: '1px solid rgba(245, 158, 11, 0.2)' }}>
                      {imp}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
