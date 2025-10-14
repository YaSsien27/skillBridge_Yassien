import { Router } from 'express';
import { dashboardHandler } from '../controllers/recruitersController.js';

const router = Router();

router.get('/dashboard', dashboardHandler);

export default router;
