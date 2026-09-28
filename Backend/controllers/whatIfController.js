import { ROLE_SKILLS } from '../services/skillsDatabase.js';

export const simulateWhatIf = async (req, res, next) => {
  try {
    const {
      targetRole = 'Full Stack Developer',
      currentSkills = [],
      newSkills = []
    } = req.body;

    const requiredSkills = ROLE_SKILLS[targetRole] || ROLE_SKILLS['Full Stack Developer'];
    const totalRequired = requiredSkills.length || 1;

    // Normalize current skills
    const currentNorm = new Set(currentSkills.map(s => s.toLowerCase().trim()));
    const baselineMatching = requiredSkills.filter(s => currentNorm.has(s.toLowerCase().trim()));
    const baselineScore = Math.round((baselineMatching.length / totalRequired) * 100);

    // Normalize combined skills (current + simulated new)
    const combinedNorm = new Set([
      ...currentSkills.map(s => s.toLowerCase().trim()),
      ...newSkills.map(s => s.toLowerCase().trim())
    ]);

    const simulatedMatching = requiredSkills.filter(s => combinedNorm.has(s.toLowerCase().trim()));
    const remainingMissingSkills = requiredSkills.filter(s => !combinedNorm.has(s.toLowerCase().trim()));
    const simulatedScore = Math.round((simulatedMatching.length / totalRequired) * 100);
    const scoreBoost = Math.max(0, simulatedScore - baselineScore);

    // Identify which newly added skills actually contributed to the target role
    const contributingSkills = newSkills.filter(s =>
      requiredSkills.some(rs => rs.toLowerCase().trim() === s.toLowerCase().trim()) &&
      !currentNorm.has(s.toLowerCase().trim())
    );

    res.json({
      success: true,
      targetRole,
      baselineScore,
      simulatedScore,
      scoreBoost,
      currentSkills,
      newSkills,
      contributingSkills,
      simulatedMatchingSkills: simulatedMatching,
      remainingMissingSkills
    });
  } catch (err) {
    next(err);
  }
};
