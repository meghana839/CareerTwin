import { MOCK_INTERVIEW_QUESTIONS } from '../services/skillsDatabase.js';
import { generateGeminiResponse, extractJsonFromText } from '../services/geminiService.js';

export const getQuestions = async (req, res, next) => {
  try {
    const { targetRole = 'Full Stack Developer' } = req.body;
    const questions = MOCK_INTERVIEW_QUESTIONS[targetRole] || MOCK_INTERVIEW_QUESTIONS['Full Stack Developer'];

    res.json({
      success: true,
      targetRole,
      totalQuestions: questions.length,
      questions
    });
  } catch (err) {
    next(err);
  }
};

export const evaluateAnswer = async (req, res, next) => {
  try {
    const {
      question = '',
      answer = '',
      targetRole = 'Full Stack Developer'
    } = req.body;

    if (!answer || answer.trim().length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Answer text is required for evaluation.'
      });
    }

    const wordCount = answer.trim().split(/\s+/).length;

    // High quality intelligent heuristic fallback
    let fallbackScore = 65;
    if (wordCount > 60) fallbackScore += 15;
    else if (wordCount > 30) fallbackScore += 8;
    else fallbackScore -= 15;

    fallbackScore = Math.max(30, Math.min(95, fallbackScore));

    const fallbackEvaluation = {
      score: fallbackScore,
      feedback: `Your response covers key points of ${targetRole} development. ${
        wordCount < 40
          ? 'Consider adding more concrete examples from real projects you have built to elaborate on trade-offs.'
          : 'You articulated a comprehensive technical perspective with good structural organization.'
      }`,
      strengths: [
        'Directly addressed the prompt without unnecessary fluff.',
        'Demonstrates an understanding of the underlying engineering concepts.'
      ],
      improvements: [
        'Include specific metrics or real-world architectural tradeoffs (e.g. latency, scalability, security).',
        'Reference edge-case handling and how you would test the solution.'
      ]
    };

    let evaluation = fallbackEvaluation;
    let isAiEvaluated = false;

    // AI Evaluation with Gemini
    const prompt = `You are a Senior Engineering Hiring Manager conducting a technical interview for a ${targetRole} role.
Interview Question: "${question}"
Candidate Answer: "${answer}"

Evaluate the answer thoroughly. Return strictly valid JSON matching this schema:
{
  "score": number (integer between 0 and 100),
  "feedback": "string summarizing constructive review",
  "strengths": ["string", "string"],
  "improvements": ["string", "string"]
}
Do not include any explanation outside the JSON object.`;

    const geminiResult = await generateGeminiResponse(prompt);
    if (geminiResult.success && geminiResult.text) {
      const parsed = extractJsonFromText(geminiResult.text);
      if (parsed && typeof parsed.score === 'number' && parsed.feedback) {
        evaluation = {
          score: Math.max(0, Math.min(100, Math.round(parsed.score))),
          feedback: parsed.feedback,
          strengths: Array.isArray(parsed.strengths) ? parsed.strengths : fallbackEvaluation.strengths,
          improvements: Array.isArray(parsed.improvements) ? parsed.improvements : fallbackEvaluation.improvements
        };
        isAiEvaluated = true;
      }
    }

    res.json({
      success: true,
      targetRole,
      question,
      evaluation,
      isAiEvaluated
    });
  } catch (err) {
    next(err);
  }
};
