import Profile from "../models/Profile.js";

export const getProfile = async (req, res, next) => {
  try {
    // Get the logged-in user's ID from the JWT
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
        savedRoadmaps: [],
        experienceYears: 0,
      });
    }

    res.json({
      success: true,
      profile,
    });
  } catch (err) {
    next(err);
  }
};

export const saveProfile = async (req, res, next) => {
  try {
    // IMPORTANT:
    // Never trust a userId sent from the frontend.
    // Use the ID from the authenticated JWT instead.
    const userId = req.user._id.toString();

    const {
      targetRole = "Full Stack Developer",
      skills = [],
      completedProjects = [],
      experienceYears = 0,
    } = req.body;

    // Clean and deduplicate skills
    const cleanedSkills = Array.from(
      new Set(
        skills
          .map((s) => String(s).trim())
          .filter(Boolean)
      )
    );

    // Ensure completedProjects are objects with title
    const formattedProjects = completedProjects.map((p) => {
      if (typeof p === "string") {
        return {
          title: p,
          description: "",
          techStack: [],
        };
      }

      return {
        title: p.title || "Untitled Project",
        description: p.description || "",
        techStack: Array.isArray(p.techStack)
          ? p.techStack
          : [],
      };
    });

    const profile = await Profile.findOneAndUpdate(
      { userId },
      {
        targetRole,
        skills: cleanedSkills,
        completedProjects: formattedProjects,
        experienceYears:
          Number(experienceYears) || 0,
      },
      {
        new: true,
        upsert: true,
        setDefaultsOnInsert: true,
      }
    );

    res.json({
      success: true,
      message: "Profile saved successfully",
      profile,
    });
  } catch (err) {
    next(err);
  }
};