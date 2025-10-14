import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import { authMiddleware } from './middleware/auth.js';
import jobsRouter from './routers/jobsRouter.js';
import applicationsRouter from './routers/applicationsRouter.js';
import recruitersRouter from './routers/recruitersRouter.js';
import candidatesRouter from './routers/candidatesRouter.js';

const app = express();
app.use(cors());
app.use(express.json({ limit: '10mb' }));

app.get('/api/health', (req, res) => res.json({ ok: true }));

app.use('/api/jobs', authMiddleware, jobsRouter);
app.use('/api/applications', authMiddleware, applicationsRouter);
app.use('/api/recruiters', authMiddleware, recruitersRouter);
app.use('/api/candidates', authMiddleware, candidatesRouter);

app.use((err, req, res, next) => {
  console.error(err);
  res.status(err.status || 500).json({ message: err.message || 'Server error' });
});

const port = process.env.PORT || 4000;
app.listen(port, () => console.log(`API running on :${port}`));
