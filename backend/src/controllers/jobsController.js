import { createJob, listJobsByRecruiter, updateJob, getJob } from '../modules/jobs.js';

export async function createJobHandler(req, res, next) {
  try {
    const recruiterId = req.user.uid;
    const result = await createJob({ recruiterId, job: req.body });
    res.status(201).json(result);
  } catch (e) { next(e); }
}

export async function saveDraftHandler(req, res, next) {
  try {
    const recruiterId = req.user.uid;
    const result = await createJob({ recruiterId, job: { ...req.body, status: 'draft' } });
    res.status(201).json(result);
  } catch (e) { next(e); }
}

export async function listMyJobsHandler(req, res, next) {
  try {
    const recruiterId = req.user.uid;
    const jobs = await listJobsByRecruiter(recruiterId);
    res.json(jobs);
  } catch (e) { next(e); }
}

export async function getJobHandler(req, res, next) {
  try {
    const job = await getJob(req.params.jobId);
    if (!job) return res.status(404).json({ message: 'Job not found' });
    res.json(job);
  } catch (e) { next(e); }
}

export async function updateJobHandler(req, res, next) {
  try {
    const updated = await updateJob(req.params.jobId, req.body);
    res.json(updated);
  } catch (e) { next(e); }
}
