import { ROLE_MARKET_DATA, ROLE_SKILLS } from '../services/skillsDatabase.js';
import { generateGeminiResponse, extractJsonFromText } from '../services/geminiService.js';

export const generateCareerAnalysis = async (req, res, next) => {
  try {
    const {
      targetRole = 'Full Stack Developer',
      skills = [],
      experienceLevel = 'Beginner'
    } = req.body;

    // 1. Static reference market data
    const marketData = ROLE_MARKET_DATA[targetRole] || ROLE_MARKET_DATA['Full Stack Developer'];
    const requiredSkills = ROLE_SKILLS[targetRole] || ROLE_SKILLS['Full Stack Developer'];
    const matchingSkills = skills.filter(s =>
      requiredSkills.some(rs => rs.toLowerCase().trim() === s.toLowerCase().trim())
    );
    const missingSkills = requiredSkills.filter(rs =>
      !skills.some(s => s.toLowerCase().trim() === rs.toLowerCase().trim())
    );

    // 2. Default high-quality structured analysis for fallback or offline state
    const fallbackAnalysis = {
      keyStrengths: matchingSkills.length > 0
        ? matchingSkills.map(s => `Solid foundation in ${s}, providing immediate capability for entry-level tasks.`)
        : [`Eagerness to embark on modern ${targetRole} specialization with a clean slate.`],
      growthAreas: missingSkills.length > 0
        ? missingSkills.slice(0, 4).map(s => `Acquire practical depth in ${s} to align with industry expectations.`)
        : ['Explore advanced architecture patterns, distributed caching, and cloud deployments.'],
      executiveSummary: `For a ${experienceLevel} student targeting ${targetRole}, your current profile possesses ${matchingSkills.length} of ${requiredSkills.length} core competencies. Prioritizing ${missingSkills.slice(0, 3).join(', ') || 'production architecture'} will yield the steepest increase in candidate competitiveness.`
    };

    let aiAnalysis = fallbackAnalysis;
    let isAiGenerated = false;

    // 3. Attempt Gemini generation if prompt is requested
    const prompt = `You are CareerTwin, an expert technical career advisor for college students.
Analyze this student profile:
- Target Role: ${targetRole}
- Current Skills: ${skills.length > 0 ? skills.join(', ') : 'None listed yet'}
- Experience Level: ${experienceLevel}
- Role Standard Skills: ${requiredSkills.join(', ')}

Provide an honest, empowering, data-driven analysis in strictly valid JSON format matching this schema:
{
  "keyStrengths": ["string", "string"],
  "growthAreas": ["string", "string"],
  "executiveSummary": "string"
}
Do not wrap with anything other than valid JSON.`;

    const geminiResult = await generateGeminiResponse(prompt);

    if (geminiResult.success && geminiResult.text) {
      const parsed = extractJsonFromText(geminiResult.text);
      if (parsed && Array.isArray(parsed.keyStrengths) && Array.isArray(parsed.growthAreas) && parsed.executiveSummary) {
        aiAnalysis = parsed;
        isAiGenerated = true;
      }
    }

    res.json({
      success: true,
      targetRole,
      skills,
      experienceLevel,
      // Personalized AI Diagnostic
      aiDiagnostic: {
        isAiGenerated,
        source: isAiGenerated ? 'Google Gemini AI (gemini-3.8-flash)' : 'CareerTwin Intelligence Rules Engine',
        keyStrengths: aiAnalysis.keyStrengths,
        growthAreas: aiAnalysis.growthAreas,
        executiveSummary: aiAnalysis.executiveSummary
      },
      // Static verified market data (strictly separated from AI generation)
      marketInformation: {
        isStaticReference: true,
        marketDemand: marketData.marketDemand,
        expectedSalaryRange: marketData.expectedSalaryRange,
        industryGrowth: marketData.industryGrowth,
        topIndustries: marketData.topIndustries,
        summaryTrends: marketData.summaryTrends
      }
    });
  } catch (err) {
    next(err);
  }
};
