import { createApplication, listApplicationsByJob, updateApplicationStatus } from '../modules/applications.js';

export async function createApplicationHandler(req, res, next) {
  try {
    const app = await createApplication({ jobId: req.body.jobId, candidateId: req.user.uid, status: 'applied' });
    res.status(201).json(app);
  } catch (e) { next(e); }
}

export async function listApplicationsByJobHandler(req, res, next) {
  try {
    const applications = await listApplicationsByJob(req.params.jobId);
    res.json(applications);
  } catch (e) { next(e); }
}

export async function updateApplicationStatusHandler(req, res, next) {
  try {
    const updated = await updateApplicationStatus(req.params.applicationId, req.body.status);
    res.json(updated);
  } catch (e) { next(e); }
}
