import AssessmentResult from "../models/AssessmentResult.js";
import Profile from "../models/Profile.js";
import Progress from "../models/Progress.js";
import { ASSESSMENT_QUESTIONS } from "../services/skillsDatabase.js";

export const getQuestions = async (req, res, next) => {
  try {
    const {
      targetRole = "Full Stack Developer",
    } = req.body;

    const questions =
      ASSESSMENT_QUESTIONS[targetRole] ||
      ASSESSMENT_QUESTIONS["Full Stack Developer"];

    // Do not send correct answers to the frontend
    const sanitizedQuestions = questions.map(
      (q) => ({
        id: q.id,
        question: q.question,
        options: q.options,
        skill: q.skill,
        difficulty: q.difficulty,
      })
    );

    res.json({
      success: true,
      targetRole,
      totalQuestions:
        sanitizedQuestions.length,
      questions: sanitizedQuestions,
    });
  } catch (err) {
    next(err);
  }
};

export const submitAssessment = async (
  req,
  res,
  next
) => {
  try {
    // Get the ID from the authenticated JWT
    const userId = req.user._id.toString();

    const {
      targetRole = "Full Stack Developer",
      presentedQuestionIds = [],
      userAnswers = {},
    } = req.body;

    const allQuestions =
      ASSESSMENT_QUESTIONS[targetRole] ||
      ASSESSMENT_QUESTIONS[
        "Full Stack Developer"
      ];

    const questionsMap = new Map(
      allQuestions.map((q) => [q.id, q])
    );

    // Evaluate ONLY the questions presented
    let correctCount = 0;
    const skillMap = {};

    presentedQuestionIds.forEach((id) => {
      const question = questionsMap.get(id);

      if (!question) return;

      const userChoice = userAnswers[id];

      const isCorrect =
        userChoice !== undefined &&
        Number(userChoice) ===
          question.correctAnswer;

      if (isCorrect) {
        correctCount++;
      }

      if (!skillMap[question.skill]) {
        skillMap[question.skill] = {
          skill: question.skill,
          correct: 0,
          total: 0,
        };
      }

      skillMap[question.skill].total++;

      if (isCorrect) {
        skillMap[question.skill].correct++;
      }
    });

    const totalQuestions =
      presentedQuestionIds.length || 1;

    const percentageScore = Math.round(
      (correctCount / totalQuestions) * 100
    );

    const skillBreakdown =
      Object.values(skillMap);

    // Save assessment result
    const result =
      await AssessmentResult.create({
        userId,
        targetRole,
        score: percentageScore,
        totalQuestions,
        correctAnswers: correctCount,
        skillBreakdown,
      });

    // Log assessment progress
    await Progress.create({
      userId,
      type: "assessment_completed",
      item: `${targetRole} Assessment`,
      category: "Assessment",
      notes: `Scored ${percentageScore}% (${correctCount}/${totalQuestions})`,
    });

    // Update user's profile readiness
    const profile =
      await Profile.findOne({ userId });

    if (profile) {
      const skillScore =
        profile.skills.length > 0
          ? Math.min(
              100,
              profile.skills.length * 12
            )
          : 0;

      const projScore = Math.min(
        100,
        (profile.completedProjects
          ?.length || 0) * 25
      );

      const expScore = Math.min(
        100,
        (profile.experienceYears || 0) * 33
      );

      profile.readinessScore = Math.round(
        skillScore * 0.4 +
          projScore * 0.25 +
          percentageScore * 0.25 +
          expScore * 0.1
      );

      await profile.save();
    }

    res.json({
      success: true,
      message:
        "Assessment evaluated and recorded successfully",

      result: {
        id: result._id,
        score: percentageScore,
        correctAnswers: correctCount,
        totalQuestions,
        skillBreakdown,
      },
    });
  } catch (err) {
    next(err);
  }
};