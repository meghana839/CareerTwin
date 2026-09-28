import Progress from "../models/Progress.js";
import Profile from "../models/Profile.js";

export const logProgress = async (
  req,
  res,
  next
) => {
  try {
    // Get the logged-in user's ID from the JWT
    const userId = req.user._id.toString();

    const {
      type = "skill_learned",
      item = "",
      category = "Skill",
      notes = "",
    } = req.body;

    if (!item || item.trim() === "") {
      return res.status(400).json({
        success: false,
        message: "Progress item is required.",
      });
    }

    const trimmedItem = item.trim();

    // 1. Create Progress record
    const progressEntry = await Progress.create({
      userId,
      type,
      item: trimmedItem,
      category,
      notes,
    });

    // 2. Synchronize with the user's profile
    let profile = await Profile.findOne({
      userId,
    });

    if (!profile) {
      profile = await Profile.create({
        userId,
        targetRole: "Full Stack Developer",
        skills: [],
      });
    }

    let profileUpdated = false;

    if (type === "skill_learned") {
      const existingNormalized =
        profile.skills.map((skill) =>
          skill.toLowerCase().trim()
        );

      if (
        !existingNormalized.includes(
          trimmedItem.toLowerCase()
        )
      ) {
        profile.skills.push(trimmedItem);
        profileUpdated = true;
      }
    } else if (type === "roadmap_step") {
      if (!Array.isArray(profile.savedRoadmaps)) {
        profile.savedRoadmaps = [];
      }

      profile.savedRoadmaps.push({
        step: trimmedItem,
        completedAt: new Date(),
      });

      profileUpdated = true;
    }

    if (profileUpdated) {
      await profile.save();
    }

    res.json({
      success: true,
      message:
        "Progress logged and profile synchronized successfully",
      entry: progressEntry,
      currentSkills: profile.skills,
    });
  } catch (err) {
    next(err);
  }
};

export const getProgress = async (
  req,
  res,
  next
) => {
  try {
    // Get the logged-in user's ID from the JWT
    const userId = req.user._id.toString();

    const profile = await Profile.findOne({
      userId,
    });

    const logs = await Progress.find({
      userId,
    }).sort({ loggedAt: -1 });

    const skillsLearned = logs
      .filter(
        (log) => log.type === "skill_learned"
      )
      .map((log) => log.item);

    const uniqueSkillsLearned = Array.from(
      new Set(skillsLearned)
    );

    const roadmapStepsCompleted = logs.filter(
      (log) => log.type === "roadmap_step"
    ).length;

    const assessmentsCompleted = logs.filter(
      (log) =>
        log.type === "assessment_completed"
    ).length;

    res.json({
      success: true,
      userId,
      targetRole:
        profile?.targetRole ||
        "Full Stack Developer",

      currentSkills: profile?.skills || [],

      stats: {
        totalLogs: logs.length,
        skillsLearnedCount:
          uniqueSkillsLearned.length,
        roadmapStepsCompleted,
        assessmentsCompleted,
      },

      history: logs,
    });
  } catch (err) {
    next(err);
  }
};