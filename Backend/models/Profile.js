import mongoose from 'mongoose';

const ProjectSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, default: '' },
  techStack: [{ type: String }]
}, { _id: false });

const ProfileSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true,
    unique: true,
    index: true
  },
  targetRole: {
    type: String,
    default: 'Full Stack Developer',
    trim: true
  },
  skills: [{
    type: String,
    trim: true
  }],
  completedProjects: [ProjectSchema],
  atsScore: {
    type: Number,
    default: 0
  },
  readinessScore: {
    type: Number,
    default: 0
  },
  savedRoadmaps: [{
    type: mongoose.Schema.Types.Mixed
  }],
  experienceYears: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true
});

export default mongoose.model('Profile', ProfileSchema);
