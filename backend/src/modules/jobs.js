import { db } from '../config/firebaseAdmin.js';
import admin from '../config/firebaseAdmin.js';

const jobsCol = db.collection('jobs');
const recruitersCol = db.collection('recruiters');

export async function createJob({ recruiterId, job }) {
  const doc = {
    recruiterId,
    jobTitle: job.jobTitle || '',
    location: job.location || '',
    category: job.category || '',
    skillsRequired: Array.isArray(job.skillsRequired) ? job.skillsRequired : [],
    experienceLevel: job.experienceLevel || 'Fresher',
    description: job.description || '',
    logoUrl: job.logoUrl || null,
    status: job.status || 'draft',
    createdAt: admin.firestore.FieldValue.serverTimestamp(),
  };
  const ref = await jobsCol.add(doc);
  await recruitersCol.doc(recruiterId).set({
    recruiterId,
    postedJobs: admin.firestore.FieldValue.arrayUnion(ref.id)
  }, { merge: true });
  return { id: ref.id, ...doc };
}

export async function listJobsByRecruiter(recruiterId) {
  const snap = await jobsCol.where('recruiterId', '==', recruiterId).orderBy('createdAt', 'desc').get();
  return snap.docs.map(d => ({ id: d.id, ...d.data() }));
}

export async function updateJob(jobId, updates) {
  await jobsCol.doc(jobId).set(updates, { merge: true });
  const doc = await jobsCol.doc(jobId).get();
  return { id: jobId, ...doc.data() };
}

export async function getJob(jobId) {
  const doc = await jobsCol.doc(jobId).get();
  if (!doc.exists) return null;
  return { id: doc.id, ...doc.data() };
}
