import express from 'express';
import 'express-async-errors';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import rateLimit from 'express-rate-limit';
import path from 'path';
import { fileURLToPath } from 'url';
import { config } from './config/env.js';
import { errorHandler, notFound } from './middleware/errorHandler.js';

import authRoutes from './routes/auth.js';
import studentRoutes from './routes/student.js';
import opportunityRoutes from './routes/opportunity.js';
import applicationRoutes from './routes/application.js';
import employerRoutes from './routes/employer.js';
import notificationRoutes from './routes/notification.js';
import messageRoutes from './routes/message.js';
import savedRoutes from './routes/saved.js';
import adminRoutes from './routes/admin.js';
import featuresRoutes from './routes/features.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const app = express();
const allowedOrigins = config.CORS_ORIGIN.split(',').map((origin) => origin.trim());

app.use(helmet({ crossOriginResourcePolicy: { policy: 'cross-origin' } }));
app.use(cors({ origin: allowedOrigins, credentials: true }));
app.use(rateLimit({ windowMs: 15 * 60 * 1000, max: 300, standardHeaders: true, legacyHeaders: false }));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '10mb', extended: true }));
if (config.NODE_ENV === 'development') app.use(morgan('dev'));

app.get('/health', (req, res) => res.json({ status: 'ok', timestamp: new Date().toISOString() }));
app.use('/uploads', express.static(path.join(__dirname, '..', 'uploads')));

app.use('/api/auth', authRoutes);
app.use('/api/students', studentRoutes);
app.use('/api/opportunities', opportunityRoutes);
app.use('/api/applications', applicationRoutes);
app.use('/api/employers', employerRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/messages', messageRoutes);
app.use('/api/saved-opportunities', savedRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/features', featuresRoutes);

app.use(notFound);
app.use(errorHandler);

export default app;
