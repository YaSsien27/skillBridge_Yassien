import { Router } from 'express';
import { createJobHandler, saveDraftHandler, listMyJobsHandler, getJobHandler, updateJobHandler } from '../controllers/jobsController.js';

const router = Router();

router.post('/', createJobHandler);
router.post('/draft', saveDraftHandler);
router.get('/my', listMyJobsHandler);
router.get('/:jobId', getJobHandler);
router.patch('/:jobId', updateJobHandler);

export default router;
