import express from 'express';
import morgan from 'morgan';
import cookieParser from 'cookie-parser';
import authRouter from './routes/auth.routes.js';
import tasksRouter from './routes/tasks.routes.js';
const app = express();

// Adds a logger to the app
app.use(morgan('dev'));
app.use(express.json());
app.use(cookieParser());
app.use('/api', authRouter);
app.use('/api', tasksRouter);

export default app;
