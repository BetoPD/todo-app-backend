import express from 'express';
import morgan from 'morgan';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import authRouter from './routes/auth.routes.js';
import tasksRouter from './routes/tasks.routes.js';
import { validateJSON } from './middlewares/validateJSON.js';

const app = express();

app.use(
  cors({
    origin: 'http://localhost:3000',
    credentials: true,
  })
);

// Adds a logger to the app
app.use(morgan('dev'));
app.use(express.json());
// Error-handling middleware for JSON syntax errors
app.use(validateJSON);

app.use(cookieParser());
app.use('/api', authRouter);
app.use('/api', tasksRouter);

export default app;
