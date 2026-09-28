import Profile from "../models/Profile.js";
import AssessmentResult from "../models/AssessmentResult.js";
import { ROLE_SKILLS } from "../services/skillsDatabase.js";

export const analyzeJobReadiness = async (
  req,
  res,
  next
) => {
  try {
    // Get the logged-in user's ID from the JWT
    const userId = req.user._id.toString();

    const {
      targetRole = "Full Stack Developer",
    } = req.body;

    // Get the user's actual profile from MongoDB
    let profile = await Profile.findOne({
      userId,
    });

    if (!profile) {
      profile = await Profile.create({
        userId,
        targetRole,
        skills: [],
        completedProjects: [],
        experienceYears: 0,
        atsScore: 0,
        readinessScore: 0,
      });
    }

    // Use the role from the request if provided,
    // otherwise use the user's saved role.
    const finalTargetRole =
      targetRole ||
      profile.targetRole ||
      "Full Stack Developer";

    const userSkills = profile.skills || [];

    const projectsCount =
      profile.completedProjects?.length || 0;

    const experienceYears =
      profile.experienceYears || 0;

    const requiredSkills =
      ROLE_SKILLS[finalTargetRole] ||
      ROLE_SKILLS["Full Stack Developer"];

    const normalizedUserSkills = new Set(
      userSkills.map((skill) =>
        String(skill).toLowerCase().trim()
      )
    );

    const matchedCount =
      requiredSkills.filter((skill) =>
        normalizedUserSkills.has(
          skill.toLowerCase().trim()
        )
      ).length;

    // Component 1: Skill Score — 40%
    const skillScore =
      requiredSkills.length > 0
        ? Math.round(
            (matchedCount /
              requiredSkills.length) *
              100
          )
        : 0;

    // Component 2: Project Score — 25%
    const projectScore = Math.min(
      100,
      Math.round((projectsCount / 4) * 100)
    );

    // Component 3: Experience Score — 10%
    const experienceScore = Math.min(
      100,
      Math.round((experienceYears / 2) * 100)
    );

    // Component 4: Assessment Score — 25%
    let assessmentScore = 0;

    const latestAssessment =
      await AssessmentResult.findOne({
        userId,
        targetRole: finalTargetRole,
      }).sort({ createdAt: -1 });

    if (latestAssessment) {
      assessmentScore =
        latestAssessment.score;
    } else {
      // Baseline estimate when no assessment exists
      assessmentScore = Math.round(
        skillScore * 0.7
      );
    }

    // Overall weighted readiness score
    const readinessScore = Math.round(
      skillScore * 0.4 +
        projectScore * 0.25 +
        assessmentScore * 0.25 +
        experienceScore * 0.1
    );

    // Save readiness score to this user's profile
    profile.targetRole = finalTargetRole;
    profile.readinessScore = readinessScore;

    await profile.save();

    // Generate recommendations
    const recommendations = [];

    if (skillScore < 60) {
      recommendations.push(
        `Skill match is at ${skillScore}%. Prioritize closing gaps in key ${finalTargetRole} technologies.`
      );
    }

    if (projectScore < 50) {
      recommendations.push(
        "Build at least 2 full-stack, deployed capstone projects with public Git repositories."
      );
    }

    if (!latestAssessment) {
      recommendations.push(
        "Complete the technical assessment to objectively benchmark your domain knowledge."
      );
    }

    if (readinessScore >= 75) {
      recommendations.push(
        "Your profile is highly competitive! Begin targeting internships and junior positions."
      );
    }

    res.json({
      success: true,
      targetRole: finalTargetRole,
      readinessScore,

      components: {
        skillScore: {
          value: skillScore,
          weight: "40%",
          description: `Matched ${matchedCount} of ${requiredSkills.length} core competencies`,
        },

        projectScore: {
          value: projectScore,
          weight: "25%",
          description: `${projectsCount} completed portfolio projects (target: 4)`,
        },

        assessmentScore: {
          value: assessmentScore,
          weight: "25%",
          description: latestAssessment
            ? "Verified technical test score"
            : "Estimated baseline (take assessment to verify)",
        },

        experienceScore: {
          value: experienceScore,
          weight: "10%",
          description: `${experienceYears} years of internship or development experience`,
        },
      },

      recommendations,
    });
  } catch (err) {
    next(err);
  }
};