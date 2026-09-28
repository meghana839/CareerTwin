import React, { useState, useEffect } from 'react';
import { api } from '../services/api.js';
import LoadingState from '../components/LoadingState.jsx';
import ErrorState from '../components/ErrorState.jsx';
import ProgressBar from '../components/ProgressBar.jsx';
import Badge from '../components/Badge.jsx';
import { 
  FileText, 
  Sparkles, 
  CheckCircle, 
  AlertTriangle, 
  Lightbulb, 
  UploadCloud, 
  CheckCircle2,
  FileCode
} from 'lucide-react';

const SAMPLE_RESUMES = {
  'Full Stack Developer': `Full Stack Developer with experience in building scalable web applications.
Technical Skills: JavaScript, React, HTML5, CSS3, Git, Node.js, Express, RESTful APIs, MongoDB.
Projects:
- Built a Collaborative Workspace application using React and Node.js with MongoDB, handling 1,500 active sessions and reducing query response times by 30%.
- Engineered an E-Commerce portal with Express REST API and automated continuous delivery.
Education:
Bachelor of Science in Computer Science, State University, GPA: 3.8/4.0.`,
  
  'Frontend Developer': `Frontend Software Engineer proficient in React, JavaScript, CSS, HTML, and modern web frameworks.
Projects:
- Architected responsive design system with React and Tailwind CSS, increasing Lighthouse accessibility score to 98%.
- Refactored legacy web app into modular components with Git version control.
Education: Bachelor in Computer Science.`
};

export default function Resume() {
  const [profile, setProfile] = useState(null);
  const [resumeText, setResumeText] = useState('');
  const [analysisResult, setAnalysisResult] = useState(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [loadingProfile, setLoadingProfile] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoadingProfile(true);
        const res = await api.getProfile();
        setProfile(res.profile);
      } catch (err) {
        console.error('Failed to load profile for resume analyzer:', err.message);
      } finally {
        setLoadingProfile(false);
      }
    };
    fetchProfile();
  }, []);

  const handleAnalyze = async () => {
    if (!resumeText.trim()) {
      alert('Please enter or paste your resume text before analyzing.');
      return;
    }

    try {
      setAnalyzing(true);
      setError(null);
      const res = await api.analyzeResume(
        profile?.targetRole || 'Full Stack Developer',
        resumeText,
      );
      setAnalysisResult(res);
    } catch (err) {
      setError(err.message || 'Unable to analyze resume at this time.');
    } finally {
      setAnalyzing(false);
    }
  };

  const handleLoadSample = () => {
    const sample = SAMPLE_RESUMES[profile?.targetRole] || SAMPLE_RESUMES['Full Stack Developer'];
    setResumeText(sample);
  };

  if (loadingProfile) {
    return <LoadingState message="Loading your resume workspace..." />;
  }

  return (
    <div className="resume-page">
      <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <div className="page-badge">
            <FileText size={14} />
            <span>Applicant Tracking System</span>
          </div>
          <h1 className="page-title">Resume ATS Scanner</h1>
          <p className="page-subtitle">
            Scan your resume against technical keywords and industry recruitment algorithms for <strong style={{ color: '#06b6d4' }}>{profile?.targetRole}</strong>.
          </p>
        </div>

        <button className="btn btn-secondary btn-sm" onClick={handleLoadSample}>
          <FileCode size={16} />
          <span>Load Sample Resume</span>
        </button>
      </div>

      {/* Input Section */}
      <div className="card" style={{ marginBottom: '2.5rem' }}>
        <div className="card-header">
          <div className="card-title">
            <UploadCloud size={20} color="#6366f1" />
            <span>Paste Resume Content</span>
          </div>
          <span style={{ fontSize: '0.82rem', color: '#94a3b8' }}>
            {resumeText.trim() ? `${resumeText.trim().split(/\s+/).length} words` : 'Empty'}
          </span>
        </div>

        <div className="form-group">
          <textarea 
            className="form-textarea"
            style={{ minHeight: '180px', fontSize: '0.9rem', lineHeight: 1.6 }}
            placeholder="Paste your plain resume text here (Skills, Experience, Education, Projects)..."
            value={resumeText}
            onChange={(e) => setResumeText(e.target.value)}
          />
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
          <span style={{ fontSize: '0.82rem', color: '#94a3b8' }}>
            We analyze keyword frequency, action verbs, measurable metrics, and technical density.
          </span>

          <button 
            className="btn btn-primary"
            onClick={handleAnalyze}
            disabled={analyzing || !resumeText.trim()}
            style={{ minWidth: '180px' }}
          >
            <Sparkles size={16} />
            <span>{analyzing ? 'Scanning Resume...' : 'Analyze Resume'}</span>
          </button>
        </div>
      </div>

      {error && <ErrorState message={error} onRetry={handleAnalyze} />}

      {/* Analysis Results */}
      {analysisResult && (
        <div style={{ marginTop: '2rem' }}>
          {/* ATS Score Header */}
          <div className="card" style={{
            padding: '2.5rem',
            marginBottom: '2rem',
            background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.1) 0%, rgba(6, 182, 212, 0.08) 100%)',
            border: '1px solid rgba(99, 102, 241, 0.4)'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1.5rem' }}>
              <div>
                <span style={{ fontSize: '0.82rem', fontWeight: 700, color: '#a5b4fc', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  ATS Match Score
                </span>
                <div style={{ fontSize: '3.6rem', fontWeight: 800, color: '#f8fafc', letterSpacing: '-0.03em', lineHeight: 1.1, marginTop: '0.2rem' }}>
                  {analysisResult.atsScore}/100
                </div>
                <p style={{ fontSize: '0.92rem', color: '#94a3b8', marginTop: '0.4rem' }}>
                  {analysisResult.atsScore >= 75
                    ? 'Excellent ATS Compatibility: Your resume effectively mirrors keyword targets and technical depth.'
                    : analysisResult.atsScore >= 50
                    ? 'Average ATS Pass Rate: Adding missing technical keywords will significantly increase recruiter visibility.'
                    : 'Low ATS Pass Probability: Important role keywords and quantifiable metrics are missing.'}
                </p>
              </div>

              {analysisResult.isAiGenerated && (
                <Badge variant="primary" icon={Sparkles}>
                  Enhanced by Gemini
                </Badge>
              )}
            </div>

            <div style={{ marginTop: '1.75rem' }}>
              <ProgressBar 
                value={analysisResult.atsScore} 
                color={analysisResult.atsScore >= 70 ? 'emerald' : analysisResult.atsScore >= 45 ? 'cyan' : 'amber'}
              />
            </div>
          </div>

          {/* Keywords Breakdown: Matched vs Missing */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '2rem', marginBottom: '2rem' }}>
            {/* Matched Keywords */}
            <div className="card">
              <div className="card-header">
                <div className="card-title">
                  <CheckCircle size={20} color="#10b981" />
                  <span>Matched Keywords ({analysisResult.matchedKeywords?.length || 0})</span>
                </div>
                <Badge variant="matching">Detected</Badge>
              </div>

              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginTop: '0.5rem' }}>
                {analysisResult.matchedKeywords?.length > 0 ? (
                  analysisResult.matchedKeywords.map(kw => (
                    <span key={kw} className="badge badge-matching" style={{ padding: '0.35rem 0.75rem', fontSize: '0.82rem' }}>
                      {kw}
                    </span>
                  ))
                ) : (
                  <span style={{ color: '#94a3b8', fontSize: '0.85rem' }}>No core role keywords detected.</span>
                )}
              </div>
            </div>

            {/* Missing Keywords */}
            <div className="card">
              <div className="card-header">
                <div className="card-title">
                  <AlertTriangle size={20} color="#f43f5e" />
                  <span>Missing Keywords ({analysisResult.missingKeywords?.length || 0})</span>
                </div>
                <Badge variant="missing">Actionable</Badge>
              </div>

              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginTop: '0.5rem' }}>
                {analysisResult.missingKeywords?.length > 0 ? (
                  analysisResult.missingKeywords.map(kw => (
                    <span key={kw} className="badge badge-missing" style={{ padding: '0.35rem 0.75rem', fontSize: '0.82rem' }}>
                      {kw}
                    </span>
                  ))
                ) : (
                  <span style={{ color: '#34d399', fontSize: '0.85rem' }}>No missing keywords! Complete coverage.</span>
                )}
              </div>
            </div>
          </div>

          {/* Actionable Suggestions */}
          {analysisResult.suggestions?.length > 0 && (
            <div className="card">
              <div className="card-header">
                <div className="card-title">
                  <Lightbulb size={20} color="#f59e0b" />
                  <span>Actionable Optimization Recommendations</span>
                </div>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                {analysisResult.suggestions.map((sug, idx) => (
                  <div key={idx} style={{
                    padding: '0.9rem 1.25rem',
                    background: 'rgba(255, 255, 255, 0.03)',
                    borderRadius: '8px',
                    border: '1px solid var(--card-border)',
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: '0.75rem',
                    fontSize: '0.92rem',
                    color: '#f8fafc',
                    lineHeight: 1.55
                  }}>
                    <CheckCircle2 size={18} color="#06b6d4" style={{ flexShrink: 0, marginTop: '2px' }} />
                    <span>{sug}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
