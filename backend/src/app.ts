import express from 'express';
import cookieParser from 'cookie-parser';
import authRoutes from './routes/authRoutes';
import { errorHandler } from './middleware/errorHandler';

const app = express();

app.use(express.json());
app.use(cookieParser());

// Mount routes
app.use('/api/v1/auth', authRoutes);

// Error handler MUST be the last middleware
app.use(errorHandler);

export default app;
