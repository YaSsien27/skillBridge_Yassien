import { Router } from 'express';
import { createApplicationHandler, listApplicationsByJobHandler, updateApplicationStatusHandler } from '../controllers/applicationsController.js';

const router = Router();

router.post('/', createApplicationHandler);
router.get('/:jobId', listApplicationsByJobHandler);
router.patch('/:applicationId', updateApplicationStatusHandler);

export default router;
