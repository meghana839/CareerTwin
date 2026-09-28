import Profile from "../models/Profile.js";
import AssessmentResult from "../models/AssessmentResult.js";
import Progress from "../models/Progress.js";
import {
  ROLE_SKILLS,
  ROLE_ROADMAPS,
} from "../services/skillsDatabase.js";

export const getDashboardSummary = async (req, res, next) => {
  try {
    // Get the logged-in user's ID from the verified JWT
    const userId = req.user._id.toString();

    let profile = await Profile.findOne({ userId });

    if (!profile) {
      profile = await Profile.create({
        userId,
        targetRole: "Full Stack Developer",
        skills: [],
        completedProjects: [],
        atsScore: 0,
        readinessScore: 0,
      });
    }

    const targetRole =
      profile.targetRole || "Full Stack Developer";

    const currentSkills = profile.skills || [];

    const requiredSkills =
      ROLE_SKILLS[targetRole] ||
      ROLE_SKILLS["Full Stack Developer"];

    const normalizedUserSkills = new Set(
      currentSkills.map((s) =>
        s.toLowerCase().trim()
      )
    );

    const matchingCount = requiredSkills.filter(
      (s) =>
        normalizedUserSkills.has(
          s.toLowerCase().trim()
        )
    ).length;

    const skillGapCount = Math.max(
      0,
      requiredSkills.length - matchingCount
    );

    // Calculate roadmap progress
    const stages =
      ROLE_ROADMAPS[targetRole] ||
      ROLE_ROADMAPS["Full Stack Developer"];

    let completedStages = 0;

    stages.forEach((stage) => {
      const allMatched = stage.skills.every((skill) =>
        normalizedUserSkills.has(
          skill.toLowerCase().trim()
        )
      );

      if (allMatched && stage.skills.length > 0) {
        completedStages++;
      }
    });

    const roadmapProgress =
      stages.length > 0
        ? Math.round(
            (completedStages / stages.length) * 100
          )
        : 0;

    // Latest assessment
    const latestAssessment =
      await AssessmentResult.findOne({
        userId,
      }).sort({ createdAt: -1 });

    // Recent progress logs
    const recentLogs = await Progress.find({
      userId,
    })
      .sort({ loggedAt: -1 })
      .limit(5);

    // Overall readiness calculation
    // Skills: 40%
    // Projects: 25%
    // Assessment: 25%
    // Experience: 10%

    const skillPct =
      requiredSkills.length > 0
        ? Math.round(
            (matchingCount /
              requiredSkills.length) *
              100
          )
        : 0;

    const projCount =
      profile.completedProjects?.length || 0;

    const projPct = Math.min(
      100,
      projCount * 25
    );

    const assessPct = latestAssessment
      ? latestAssessment.score
      : 0;

    const expPct = Math.min(
      100,
      (profile.experienceYears || 0) * 33
    );

    const calculatedReadiness = Math.round(
      skillPct * 0.4 +
        projPct * 0.25 +
        assessPct * 0.25 +
        expPct * 0.1
    );

    // Update readiness score if needed
    if (
      profile.readinessScore !==
      calculatedReadiness
    ) {
      profile.readinessScore =
        calculatedReadiness;

      await profile.save();
    }

    res.json({
      success: true,
      summary: {
        userId: profile.userId,
        targetRole,
        currentSkills,
        readinessScore:
          profile.readinessScore,
        atsScore: profile.atsScore || 0,
        skillGapCount,
        matchingSkillCount: matchingCount,
        totalRequiredSkills:
          requiredSkills.length,
        roadmapProgress,
        completedStages,
        totalStages: stages.length,
        completedProjectsCount: projCount,

        latestAssessment: latestAssessment
          ? {
              score: latestAssessment.score,
              correctAnswers:
                latestAssessment.correctAnswers,
              totalQuestions:
                latestAssessment.totalQuestions,
              date: latestAssessment.createdAt,
            }
          : null,

        recentActivity: recentLogs,
      },
    });
  } catch (err) {
    next(err);
  }
};