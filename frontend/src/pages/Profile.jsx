import React, { useState, useEffect } from 'react';
import { api } from '../services/api.js';
import LoadingState from '../components/LoadingState.jsx';
import ErrorState from '../components/ErrorState.jsx';
import { 
  User, 
  Save, 
  Plus, 
  X, 
  FolderGit2, 
  Sparkles, 
  CheckCircle2, 
  Briefcase, 
  Layers,
  Award
} from 'lucide-react';

const AVAILABLE_ROLES = [
  'Full Stack Developer',
  'Frontend Developer',
  'Backend Developer',
  'Data Scientist',
  'DevOps Engineer'
];

export default function Profile() {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [successMsg, setSuccessMsg] = useState('');

  // Form states
  const [targetRole, setTargetRole] = useState('Full Stack Developer');
  const [skills, setSkills] = useState([]);
  const [newSkillInput, setNewSkillInput] = useState('');
  const [experienceYears, setExperienceYears] = useState(0);

  // Projects state
  const [projects, setProjects] = useState([]);
  const [newProjectTitle, setNewProjectTitle] = useState('');
  const [newProjectDesc, setNewProjectDesc] = useState('');
  const [newProjectTech, setNewProjectTech] = useState('');

  const fetchProfile = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await api.getProfile();
      if (res.profile) {
        setProfile(res.profile);
        setTargetRole(res.profile.targetRole || 'Full Stack Developer');
        setSkills(res.profile.skills || []);
        setExperienceYears(res.profile.experienceYears || 0);
        setProjects(res.profile.completedProjects || []);
      }
    } catch (err) {
      setError(err.message || 'Unable to load your profile. Please check if the backend server is running.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  const handleAddSkill = (skillToAdd) => {
    const val = (skillToAdd || newSkillInput).trim();
    if (!val) return;
    if (!skills.some(s => s.toLowerCase() === val.toLowerCase())) {
      setSkills([...skills, val]);
    }
    setNewSkillInput('');
  };

  const handleRemoveSkill = (skillToRemove) => {
    setSkills(skills.filter(s => s !== skillToRemove));
  };

  const handleAddProject = (e) => {
    e.preventDefault();
    if (!newProjectTitle.trim()) return;

    const techArray = newProjectTech
      .split(',')
      .map(t => t.trim())
      .filter(Boolean);

    setProjects([
      ...projects,
      {
        title: newProjectTitle.trim(),
        description: newProjectDesc.trim(),
        techStack: techArray
      }
    ]);

    setNewProjectTitle('');
    setNewProjectDesc('');
    setNewProjectTech('');
  };

  const handleRemoveProject = (indexToRemove) => {
    setProjects(projects.filter((_, idx) => idx !== indexToRemove));
  };

  const handleSaveProfile = async () => {
    try {
      setSaving(true);
      setSuccessMsg('');
      setError(null);

      const payload = {
        targetRole,
        skills,
        completedProjects: projects,
        experienceYears: Number(experienceYears) || 0
      };

      const res = await api.saveProfile(payload);
      if (res.success && res.profile) {
        setProfile(res.profile);
        setSuccessMsg('Your profile has been saved and synchronized with all career modules!');
        setTimeout(() => setSuccessMsg(''), 4500);
      }
    } catch (err) {
      setError(err.message || 'Failed to save profile.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <LoadingState message="Loading your career profile from database..." />;
  }

  if (error && !profile) {
    return <ErrorState message={error} onRetry={fetchProfile} />;
  }

  return (
    <div className="profile-page">
      <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <div className="page-badge">
            <User size={14} />
            <span>Profile Central</span>
          </div>
          <h1 className="page-title">Career Profile</h1>
          <p className="page-subtitle">
            Configure your target aspirations, manage verified technical skills, and document portfolio capstones.
          </p>
        </div>

        <button 
          className="btn btn-primary"
          onClick={handleSaveProfile}
          disabled={saving}
          style={{ minWidth: '150px' }}
        >
          <Save size={16} />
          <span>{saving ? 'Saving...' : 'Save Profile'}</span>
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

      {/* Profile Overview Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.25rem', marginBottom: '2.5rem' }}>
        <div className="card" style={{ padding: '1.25rem' }}>
          <div style={{ fontSize: '0.8rem', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Target Role</div>
          <div style={{ fontSize: '1.25rem', fontWeight: 700, marginTop: '0.25rem', color: '#6366f1' }}>{targetRole}</div>
        </div>
        <div className="card" style={{ padding: '1.25rem' }}>
          <div style={{ fontSize: '0.8rem', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Verified Skills</div>
          <div style={{ fontSize: '1.25rem', fontWeight: 700, marginTop: '0.25rem', color: '#06b6d4' }}>{skills.length} Technical Skills</div>
        </div>
        <div className="card" style={{ padding: '1.25rem' }}>
          <div style={{ fontSize: '0.8rem', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Portfolio Projects</div>
          <div style={{ fontSize: '1.25rem', fontWeight: 700, marginTop: '0.25rem', color: '#10b981' }}>{projects.length} Completed</div>
        </div>
        <div className="card" style={{ padding: '1.25rem' }}>
          <div style={{ fontSize: '0.8rem', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Job Readiness</div>
          <div style={{ fontSize: '1.25rem', fontWeight: 700, marginTop: '0.25rem', color: '#f59e0b' }}>{profile?.readinessScore || 0}%</div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(420px, 1fr))', gap: '2rem' }}>
        {/* Section 1: Role & Experience */}
        <div className="card">
          <div className="card-header">
            <div className="card-title">
              <Briefcase size={20} color="#6366f1" />
              <span>Career Ambition & Experience</span>
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Target Role</label>
            <span className="form-sublabel">The role against which all skill gaps and roadmaps will be benchmarked.</span>
            <select 
              className="form-select" 
              value={targetRole} 
              onChange={(e) => setTargetRole(e.target.value)}
            >
              {AVAILABLE_ROLES.map(role => (
                <option key={role} value={role}>{role}</option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label className="form-label">Years of Development Experience</label>
            <span className="form-sublabel">Include university course projects, internships, or open-source.</span>
            <input 
              type="number" 
              min="0" 
              max="15" 
              step="0.5"
              className="form-input"
              value={experienceYears}
              onChange={(e) => setExperienceYears(e.target.value)}
            />
          </div>

          <div style={{ marginTop: '1.5rem', padding: '1rem', background: 'rgba(255,255,255,0.03)', borderRadius: '10px', border: '1px solid var(--card-border)' }}>
            <div style={{ fontSize: '0.85rem', fontWeight: 600, color: '#a5b4fc', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Sparkles size={16} />
              <span>Pro Tip:</span>
            </div>
            <p style={{ fontSize: '0.82rem', color: '#94a3b8', marginTop: '0.35rem' }}>
              Changing your target role automatically recalibrates your Skill Gap Analysis, Assessments, and What-If simulations to match official industry standards.
            </p>
          </div>
        </div>

        {/* Section 2: Technical Skills */}
        <div className="card">
          <div className="card-header">
            <div className="card-title">
              <Layers size={20} color="#06b6d4" />
              <span>Current Skills & Stack</span>
            </div>
            <span style={{ fontSize: '0.85rem', color: '#94a3b8' }}>{skills.length} skills listed</span>
          </div>

          <div className="form-group">
            <label className="form-label">Add a Technical Skill</label>
            <div className="input-with-button">
              <input 
                type="text" 
                className="form-input"
                placeholder="e.g. React, Node.js, Python, Docker..."
                value={newSkillInput}
                onChange={(e) => setNewSkillInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleAddSkill();
                  }
                }}
              />
              <button 
                type="button" 
                className="btn btn-secondary"
                onClick={() => handleAddSkill()}
              >
                <Plus size={16} />
                <span>Add</span>
              </button>
            </div>
          </div>

          <div style={{ marginTop: '1rem' }}>
            <label className="form-label" style={{ marginBottom: '0.5rem', display: 'block' }}>Active Skills on Profile</label>
            {skills.length === 0 ? (
              <div style={{ padding: '1.5rem', textAlign: 'center', background: 'rgba(255,255,255,0.02)', borderRadius: '8px', border: '1px dashed var(--card-border)', color: '#64748b', fontSize: '0.88rem' }}>
                No skills added yet. Type a skill above to start building your technical profile.
              </div>
            ) : (
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', maxHeight: '200px', overflowY: 'auto', padding: '0.25rem' }}>
                {skills.map(skill => (
                  <span key={skill} className="skill-tag">
                    <span>{skill}</span>
                    <button 
                      type="button" 
                      className="skill-tag-remove"
                      onClick={() => handleRemoveSkill(skill)}
                      aria-label={`Remove ${skill}`}
                    >
                      <X size={14} />
                    </button>
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Section 3: Completed Projects */}
      <div className="card" style={{ marginTop: '2.5rem' }}>
        <div className="card-header">
          <div className="card-title">
            <FolderGit2 size={20} color="#10b981" />
            <span>Completed Portfolio Projects</span>
          </div>
          <span style={{ fontSize: '0.85rem', color: '#94a3b8' }}>{projects.length} project(s)</span>
        </div>

        {/* Existing Projects List */}
        <div style={{ marginBottom: '2rem' }}>
          {projects.length === 0 ? (
            <div style={{ padding: '2rem', textAlign: 'center', background: 'rgba(255,255,255,0.02)', borderRadius: '10px', border: '1px dashed var(--card-border)', color: '#94a3b8' }}>
              No portfolio projects recorded yet. Add your capstones or hackathon entries below to increase your Job Readiness score!
            </div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.25rem' }}>
              {projects.map((proj, idx) => (
                <div key={idx} style={{
                  padding: '1.25rem',
                  background: 'rgba(255,255,255,0.03)',
                  border: '1px solid var(--card-border)',
                  borderRadius: '12px',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between'
                }}>
                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                      <h4 style={{ fontSize: '1.05rem', fontWeight: 700, color: '#f8fafc' }}>{proj.title}</h4>
                      <button 
                        className="btn btn-sm btn-secondary" 
                        style={{ padding: '0.2rem 0.5rem', color: '#f43f5e' }}
                        onClick={() => handleRemoveProject(idx)}
                      >
                        <X size={14} />
                      </button>
                    </div>
                    {proj.description && (
                      <p style={{ fontSize: '0.85rem', color: '#94a3b8', marginTop: '0.5rem', lineHeight: 1.5 }}>
                        {proj.description}
                      </p>
                    )}
                  </div>
                  {proj.techStack && proj.techStack.length > 0 && (
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem', marginTop: '1rem' }}>
                      {proj.techStack.map(t => (
                        <span key={t} style={{ fontSize: '0.75rem', padding: '0.15rem 0.5rem', background: 'rgba(99,102,241,0.15)', color: '#a5b4fc', borderRadius: '4px' }}>
                          {t}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Add Project Form */}
        <div style={{ padding: '1.5rem', background: 'rgba(13, 18, 31, 0.6)', borderRadius: '12px', border: '1px solid var(--card-border)' }}>
          <h4 style={{ fontSize: '0.98rem', fontWeight: 700, marginBottom: '1rem', color: '#f8fafc' }}>Add a New Project</h4>
          <form onSubmit={handleAddProject}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1rem', marginBottom: '1rem' }}>
              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="form-label">Project Title *</label>
                <input 
                  type="text" 
                  className="form-input" 
                  placeholder="e.g. Distributed Task Queue" 
                  value={newProjectTitle}
                  onChange={(e) => setNewProjectTitle(e.target.value)}
                  required
                />
              </div>
              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="form-label">Tech Stack (comma separated)</label>
                <input 
                  type="text" 
                  className="form-input" 
                  placeholder="e.g. React, Node.js, Redis, Docker" 
                  value={newProjectTech}
                  onChange={(e) => setNewProjectTech(e.target.value)}
                />
              </div>
            </div>
            <div className="form-group">
              <label className="form-label">Brief Description</label>
              <textarea 
                className="form-textarea" 
                style={{ minHeight: '80px' }}
                placeholder="Key features built, challenges solved, or performance metrics achieved..."
                value={newProjectDesc}
                onChange={(e) => setNewProjectDesc(e.target.value)}
              />
            </div>
            <button type="submit" className="btn btn-secondary btn-sm">
              <Plus size={16} />
              <span>Add Project to Portfolio</span>
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
