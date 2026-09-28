import Profile from "../models/Profile.js";

import { ROLE_SKILLS } from "../services/skillsDatabase.js";

import {
  generateGeminiResponse,
  extractJsonFromText,
} from "../services/geminiService.js";

export const analyzeResume = async (req, res, next) => {
  try {
    // Get the logged-in user's ID from the JWT
    const userId = req.user._id.toString();

    const {
      targetRole = "Full Stack Developer",
      resumeText = "",
    } = req.body;

    if (!resumeText || resumeText.trim().length === 0) {
      return res.status(400).json({
        success: false,
        message: "Resume text is required for analysis.",
      });
    }

    const requiredSkills =
      ROLE_SKILLS[targetRole] ||
      ROLE_SKILLS["Full Stack Developer"];

    const lowerResume = resumeText.toLowerCase();

    // Check matching keywords
    const matchedKeywords = [];
    const missingKeywords = [];

    requiredSkills.forEach((skill) => {
      const escapedSkill = skill.replace(
        /[.*+?^${}()|[\]\\]/g,
        "\\$&"
      );

      const regex = new RegExp(
        `\\b${escapedSkill}\\b`,
        "i"
      );

      if (
        regex.test(resumeText) ||
        lowerResume.includes(skill.toLowerCase())
      ) {
        matchedKeywords.push(skill);
      } else {
        missingKeywords.push(skill);
      }
    });

    // Content quality indicators
    const hasMetrics =
      /\b(\d+%|\$\d+|\d+x|\d+ users|\d+ requests|\d+ ms)\b/i.test(
        resumeText
      );

    const hasActionVerbs =
      /\b(developed|engineered|architected|built|designed|optimized|implemented|deployed|refactored)\b/i.test(
        resumeText
      );

    const hasEducation =
      /\b(bachelor|degree|university|college|gpa|computer science|engineering)\b/i.test(
        resumeText
      );

    // Baseline ATS score calculation
    const keywordPct =
      requiredSkills.length > 0
        ? (matchedKeywords.length /
            requiredSkills.length) *
          60
        : 0;

    const metricBonus = hasMetrics ? 15 : 0;

    const actionVerbBonus = hasActionVerbs
      ? 15
      : 0;

    const educationBonus = hasEducation
      ? 10
      : 0;

    let atsScore = Math.min(
      100,
      Math.round(
        keywordPct +
          metricBonus +
          actionVerbBonus +
          educationBonus
      )
    );

    // Fallback suggestions
    const fallbackSuggestions = [];

    if (missingKeywords.length > 0) {
      fallbackSuggestions.push(
        `Incorporate key competencies such as ${missingKeywords
          .slice(0, 3)
          .join(", ")} into your project descriptions.`
      );
    }

    if (!hasMetrics) {
      fallbackSuggestions.push(
        'Quantify your project outcomes with measurable metrics (e.g., "Reduced API latency by 35%", "Handled 1,000+ simulated users").'
      );
    }

    if (!hasActionVerbs) {
      fallbackSuggestions.push(
        'Start bullet points with strong technical action verbs (e.g., "Architected", "Engineered", "Optimized").'
      );
    }

    fallbackSuggestions.push(
      "Ensure your technical stack section is placed near the top for quick recruiter scanning."
    );

    let finalSuggestions = fallbackSuggestions;
    let isAiGenerated = false;

    // Enhance with Gemini if available
    const prompt = `
You are CareerTwin's ATS Resume Reviewer.

Target Role: ${targetRole}

Resume Text:

"""
${resumeText.slice(0, 3000)}
"""

Matched Keywords: ${matchedKeywords.join(", ")}

Missing Keywords: ${missingKeywords.join(", ")}

Analyze the resume and return strictly valid JSON matching this schema:

{
  "atsScore": ${atsScore},
  "suggestions": [
    "Specific actionable tip 1",
    "Specific actionable tip 2",
    "Specific actionable tip 3"
  ]
}

Do not wrap with any other text.
Return ONLY the JSON object.
`;

    const geminiResult =
      await generateGeminiResponse(prompt);

    if (
      geminiResult.success &&
      geminiResult.text
    ) {
      const parsed = extractJsonFromText(
        geminiResult.text
      );

      if (
        parsed &&
        Array.isArray(parsed.suggestions)
      ) {
        finalSuggestions = parsed.suggestions;

        if (
          typeof parsed.atsScore === "number" &&
          parsed.atsScore >= 0 &&
          parsed.atsScore <= 100
        ) {
          atsScore = parsed.atsScore;
        }

        isAiGenerated = true;
      }
    }

    // Save ATS score to the logged-in user's profile
    await Profile.findOneAndUpdate(
      { userId },
      { atsScore },
      {
        new: true,
        upsert: true,
      }
    );

    res.json({
      success: true,
      targetRole,
      atsScore,
      matchedKeywords,
      missingKeywords,
      suggestions: finalSuggestions,
      hasMetrics,
      hasActionVerbs,
      isAiGenerated,
    });
  } catch (err) {
    next(err);
  }
};