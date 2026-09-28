import { ROLE_SKILLS } from '../services/skillsDatabase.js';

export const analyzeSkillGap = async (req, res, next) => {
  try {
    const { targetRole = 'Full Stack Developer', userSkills = [] } = req.body;
    
    const requiredSkills = ROLE_SKILLS[targetRole] || ROLE_SKILLS['Full Stack Developer'];
    const normalizedUserSkills = new Set(userSkills.map(s => s.toLowerCase().trim()));

    const matchingSkills = [];
    const missingSkills = [];

    requiredSkills.forEach(reqSkill => {
      if (normalizedUserSkills.has(reqSkill.toLowerCase().trim())) {
        matchingSkills.push(reqSkill);
      } else {
        missingSkills.push(reqSkill);
      }
    });

    const matchPercentage = requiredSkills.length > 0
      ? Math.round((matchingSkills.length / requiredSkills.length) * 100)
      : 0;

    res.json({
      success: true,
      targetRole,
      requiredSkills,
      matchingSkills,
      missingSkills,
      matchPercentage
    });
  } catch (err) {
    next(err);
  }
};
