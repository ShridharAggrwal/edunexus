const express = require('express');
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const cors = require('cors');
const morgan = require('morgan');
const cookieParser = require('cookie-parser');

// Routes
const authRoutes = require('./src/routes/auth.routes');
const courseRoutes = require('./src/routes/course.routes');
const lectureRoutes = require('./src/routes/lecture.routes');
const assignmentRoutes = require('./src/routes/assignment.routes');
const enrollmentRoutes = require('./src/routes/enrollment.routes');
const adminRoutes = require('./src/routes/admin.routes');
const chatRoutes = require('./src/routes/chat.routes');
const uploadRoutes = require('./src/routes/upload.routes');
const liveRoutes = require('./src/routes/live.routes');

// Middleware
const { notFound, errorHandler } = require('./src/middleware/error.middleware');

// Config
const { connectDB } = require('./src/config/db');
const { configureCloudinary } = require('./src/config/cloudinary');

dotenv.config();
configureCloudinary();

const app = express();

// Core middleware
const allowedOrigins = [
  'https://edunexus-lms.vercel.app',
  'http://localhost:5173'
];
app.use(cors({
  origin: allowedOrigins,
  credentials: true,
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(morgan('dev'));

// Healthcheck
app.get('/health', (_req, res) => {
  res.status(200).json({ status: 'ok', service: 'edunexus-api' });
});

// API routes
app.use('/api/auth', authRoutes);
app.use('/api/courses', courseRoutes);
app.use('/api/lectures', lectureRoutes);
app.use('/api/assignments', assignmentRoutes);
app.use('/api/enrollments', enrollmentRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/chat', chatRoutes);
app.use('/api/uploads', uploadRoutes);
app.use('/api/live', liveRoutes);

// 404 and error handlers
app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

async function start() {
  await connectDB(process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/edunexus');
  app.listen(PORT, () => {
    // eslint-disable-next-line no-console
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

start().catch((err) => {
  // eslint-disable-next-line no-console
  console.error('Failed to start server', err);
  process.exit(1);
});

module.exports = app;


