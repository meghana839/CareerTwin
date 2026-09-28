import { ROLE_ROADMAPS } from '../services/skillsDatabase.js';

export const getRoadmap = async (req, res, next) => {
  try {
    const { targetRole = 'Full Stack Developer', userSkills = [] } = req.body;
    const stages = ROLE_ROADMAPS[targetRole] || ROLE_ROADMAPS['Full Stack Developer'];

    const normalizedUserSkills = new Set(userSkills.map(s => s.toLowerCase().trim()));

    const calculatedRoadmap = stages.map(stage => {
      const totalStageSkills = stage.skills.length;
      const matchedStageSkills = stage.skills.filter(s =>
        normalizedUserSkills.has(s.toLowerCase().trim())
      );

      let status = 'Not Started';
      if (matchedStageSkills.length === totalStageSkills && totalStageSkills > 0) {
        status = 'Completed';
      } else if (matchedStageSkills.length > 0) {
        status = 'In Progress';
      }

      const progressPercentage = totalStageSkills > 0
        ? Math.round((matchedStageSkills.length / totalStageSkills) * 100)
        : 0;

      return {
        ...stage,
        status,
        matchedSkills: matchedStageSkills,
        progressPercentage
      };
    });

    const completedStages = calculatedRoadmap.filter(s => s.status === 'Completed').length;
    const overallProgress = calculatedRoadmap.length > 0
      ? Math.round((completedStages / calculatedRoadmap.length) * 100)
      : 0;

    res.json({
      success: true,
      targetRole,
      stages: calculatedRoadmap,
      overallProgress,
      completedStages,
      totalStages: calculatedRoadmap.length
    });
  } catch (err) {
    next(err);
  }
};
