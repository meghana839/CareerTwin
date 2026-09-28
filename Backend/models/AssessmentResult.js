import mongoose from 'mongoose';

const SkillPerformanceSchema = new mongoose.Schema({
  skill: { type: String, required: true },
  correct: { type: Number, default: 0 },
  total: { type: Number, default: 0 }
}, { _id: false });

const AssessmentResultSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true,
    index: true
  },
  targetRole: {
    type: String,
    required: true
  },
  score: {
    type: Number,
    required: true
  },
  totalQuestions: {
    type: Number,
    required: true
  },
  correctAnswers: {
    type: Number,
    required: true
  },
  skillBreakdown: [SkillPerformanceSchema],
  timestamp: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

export default mongoose.model('AssessmentResult', AssessmentResultSchema);
