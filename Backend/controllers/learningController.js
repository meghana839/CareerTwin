import { LEARNING_CATALOG, ROLE_SKILLS } from '../services/skillsDatabase.js';

export const getLearningRecommendations = async (req, res, next) => {
  try {
    const { missingSkills = [], targetRole = 'Full Stack Developer' } = req.body;

    // If no missing skills passed, pick from the target role's missing set
    const skillsToLookUp = missingSkills.length > 0
      ? missingSkills
      : (ROLE_SKILLS[targetRole] || ROLE_SKILLS['Full Stack Developer']).slice(0, 4);

    const recommendations = skillsToLookUp.map(skill => {
      const catalogEntry = LEARNING_CATALOG[skill] || {
        whyItMatters: `${skill} is a critical requirement in modern ${targetRole} workflows.`,
        whatToLearn: `Core principles, standard API conventions, unit testing, and production deployment best practices for ${skill}.`,
        suggestedProject: `Build an end-to-end hands-on project integrating ${skill} with automated tests and clear documentation.`,
        suggestedLearningDirection: `Review official documentation, complete code exercises, and build a portfolio-ready demonstration.`
      };

      return {
        skill,
        whyItMatters: catalogEntry.whyItMatters,
        whatToLearn: catalogEntry.whatToLearn,
        suggestedProject: catalogEntry.suggestedProject,
        suggestedLearningDirection: catalogEntry.suggestedLearningDirection
      };
    });

    res.json({
      success: true,
      targetRole,
      totalRecommendations: recommendations.length,
      recommendations
    });
  } catch (err) {
    next(err);
  }
};
