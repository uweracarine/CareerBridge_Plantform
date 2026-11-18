import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import dotenv from 'dotenv';
import rateLimit from 'express-rate-limit';

// Load environment variables
dotenv.config();

// Create Express app
const app = express();
const PORT = process.env.PORT || 5000;

// Security Middleware
app.use(helmet());
app.use(cors({
  origin: process.env.CORS_ORIGIN?.split(',') || ['http://localhost:5173', 'http://localhost:3000'],
  credentials: true,
}));

// Rate Limiting
const limiter = rateLimit({
  windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS || 900000),
  max: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS || 100),
  message: 'Too many requests from this IP, please try again later.',
});

app.use('/api', limiter);

// Body Parser Middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '10mb', extended: true }));

// Logging Middleware
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  next();
});

// Health Check Endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// API Routes
app.use('/api/auth', (req, res) => {
  res.json({ message: 'Auth routes placeholder' });
});

app.use('/api/students', (req, res) => {
  res.json({ message: 'Student routes placeholder' });
});

app.use('/api/opportunities', (req, res) => {
  res.json({ message: 'Opportunity routes placeholder' });
});

app.use('/api/applications', (req, res) => {
  res.json({ message: 'Application routes placeholder' });
});

app.use('/api/employers', (req, res) => {
  res.json({ message: 'Employer routes placeholder' });
});

app.use('/api/admin', (req, res) => {
  res.json({ message: 'Admin routes placeholder' });
});

// 404 Handler
app.use((req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

// Error Handler
app.use((err, req, res, next) => {
  console.error(err);
  res.status(err.status || 500).json({
    message: err.message || 'Internal Server Error',
    error: process.env.NODE_ENV === 'development' ? err : {},
  });
});

// Start Server
app.listen(PORT, () => {
  console.log(`
╔════════════════════════════════════════╗
║         CareerBridge Server            ║
║      🚀 Server running on port ${PORT}      ║
║     Environment: ${process.env.NODE_ENV}                ║
╚════════════════════════════════════════╝
  `);
});

export default app;
