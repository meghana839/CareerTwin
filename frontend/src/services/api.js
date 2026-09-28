const API_BASE = "http://localhost:5001/api";

/**
 * Universal fetch wrapper.
 * Automatically attaches the logged-in user's JWT token.
 */
async function request(endpoint, options = {}) {
  const url = `${API_BASE}${endpoint}`;

  const token = localStorage.getItem("careertwin_token");

  const config = {
    ...options,

    headers: {
      "Content-Type": "application/json",

      ...(token
        ? {
            Authorization: `Bearer ${token}`,
          }
        : {}),

      ...options.headers,
    },
  };

  try {
    const res = await fetch(url, config);

    const data = await res.json();

    if (!res.ok) {
      throw new Error(
        data.message ||
          `Request failed with status ${res.status}`
      );
    }

    return data;
  } catch (err) {
    console.error(
      `API Error on [${options.method || "GET"} ${endpoint}]:`,
      err.message
    );

    throw err;
  }
}

export const api = {
  // =========================
  // Profile
  // =========================

  getProfile: () =>
    request("/profile/current"),

  saveProfile: (payload) =>
    request("/profile/save", {
      method: "POST",
      body: JSON.stringify(payload),
    }),

  // =========================
  // Dashboard
  // =========================

  getDashboardSummary: () =>
    request("/dashboard/summary/current"),

  // =========================
  // Skill Gap
  // =========================

  analyzeSkillGap: (targetRole, userSkills) =>
    request("/skill-gap/analyze", {
      method: "POST",
      body: JSON.stringify({
        targetRole,
        userSkills,
      }),
    }),

  // =========================
  // Roadmap
  // =========================

  getRoadmap: (targetRole, userSkills) =>
    request("/roadmap", {
      method: "POST",
      body: JSON.stringify({
        targetRole,
        userSkills,
      }),
    }),

  // =========================
  // Assessment
  // =========================

  getAssessmentQuestions: (
    targetRole,
    userSkills = []
  ) =>
    request("/assessment/questions", {
      method: "POST",
      body: JSON.stringify({
        targetRole,
        userSkills,
      }),
    }),

  submitAssessment: (payload) =>
    request("/assessment/submit", {
      method: "POST",
      body: JSON.stringify(payload),
    }),

  // =========================
  // Career Analysis
  // =========================

  generateCareerAnalysis: (
    targetRole,
    skills,
    experienceLevel = "Beginner"
  ) =>
    request("/career-analysis/generate", {
      method: "POST",
      body: JSON.stringify({
        targetRole,
        skills,
        experienceLevel,
      }),
    }),

  // =========================
  // What-If
  // =========================

  simulateWhatIf: (
    targetRole,
    currentSkills,
    newSkills
  ) =>
    request("/what-if/simulate", {
      method: "POST",
      body: JSON.stringify({
        targetRole,
        currentSkills,
        newSkills,
      }),
    }),

  // =========================
  // Job Readiness
  // =========================

  analyzeJobReadiness: (payload) =>
    request("/job-readiness/analyze", {
      method: "POST",
      body: JSON.stringify(payload),
    }),

  // =========================
  // Resume
  // =========================

  analyzeResume: (
    targetRole,
    resumeText
  ) =>
    request("/resume/analyze", {
      method: "POST",
      body: JSON.stringify({
        targetRole,
        resumeText,
      }),
    }),

  // =========================
  // Learning Recommendations
  // =========================

  getLearningRecommendations: (
    missingSkills,
    targetRole
  ) =>
    request("/learning/recommend", {
      method: "POST",
      body: JSON.stringify({
        missingSkills,
        targetRole,
      }),
    }),

  // =========================
  // Mock Interview
  // =========================

  getMockInterviewQuestions: (
    targetRole,
    userSkills = []
  ) =>
    request("/mock-interview/questions", {
      method: "POST",
      body: JSON.stringify({
        targetRole,
        userSkills,
      }),
    }),

  evaluateMockInterviewAnswer: (
    question,
    answer,
    targetRole
  ) =>
    request("/mock-interview/evaluate", {
      method: "POST",
      body: JSON.stringify({
        question,
        answer,
        targetRole,
      }),
    }),

  // =========================
  // Progress
  // =========================

  logProgress: (payload) =>
    request("/progress/log", {
      method: "POST",
      body: JSON.stringify(payload),
    }),

  getProgress: () =>
    request("/progress/current"),
};