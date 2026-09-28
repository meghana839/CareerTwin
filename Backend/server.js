import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { connectDB } from './config/db.js';

// Route imports
import profileRoutes from './routes/profileRoutes.js';
import dashboardRoutes from './routes/dashboardRoutes.js';
import authRoutes from './routes/authRoutes.js';
import skillGapRoutes from './routes/skillGapRoutes.js';
import roadmapRoutes from './routes/roadmapRoutes.js';
import assessmentRoutes from './routes/assessmentRoutes.js';
import careerAnalysisRoutes from './routes/careerAnalysisRoutes.js';
import whatIfRoutes from './routes/whatIfRoutes.js';
import jobReadinessRoutes from './routes/jobReadinessRoutes.js';
import resumeRoutes from './routes/resumeRoutes.js';
import learningRoutes from './routes/learningRoutes.js';
import mockInterviewRoutes from './routes/mockInterviewRoutes.js';
import progressRoutes from './routes/progressRoutes.js';

import { errorHandler } from './middleware/errorHandler.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5001;

// Core Middleware
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());

// Health Check Endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'online',
    product: 'CareerTwin API',
    timestamp: new Date().toISOString()
  });
});

// Mount Feature API Routes
// Mount Feature API Routes
app.use('/api/auth', authRoutes);
app.use('/api/profile', profileRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/skill-gap', skillGapRoutes);
app.use('/api/roadmap', roadmapRoutes);
app.use('/api/assessment', assessmentRoutes);
app.use('/api/career-analysis', careerAnalysisRoutes);
app.use('/api/what-if', whatIfRoutes);
app.use('/api/job-readiness', jobReadinessRoutes);
app.use('/api/resume', resumeRoutes);
app.use('/api/learning', learningRoutes);
app.use('/api/mock-interview', mockInterviewRoutes);
app.use('/api/progress', progressRoutes);

// Error handling middleware
app.use(errorHandler);

// Connect Database & Start Server
const startServer = async () => {
  try {
    await connectDB();
    app.listen(PORT, () => {
      console.log(`[CareerTwin Server] Running on http://localhost:${PORT}`);
    });
  } catch (err) {
    console.error('[CareerTwin Server] Startup Error:', err.message);
    process.exit(1);
  }
};

startServer();
