import mongoose from 'mongoose';

const ProgressSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true,
    index: true
  },
  type: {
    type: String,
    enum: ['skill_learned', 'roadmap_step', 'assessment_completed', 'project_added'],
    required: true
  },
  item: {
    type: String,
    required: true
  },
  category: {
    type: String,
    default: 'General'
  },
  notes: {
    type: String,
    default: ''
  },
  loggedAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

export default mongoose.model('Progress', ProgressSchema);
