import { Router } from 'express';
import { upsertCandidateHandler } from '../controllers/candidatesController.js';

const router = Router();

router.post('/', upsertCandidateHandler);

export default router;
