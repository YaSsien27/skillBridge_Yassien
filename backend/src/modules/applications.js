import { db } from '../config/firebaseAdmin.js';
import admin from '../config/firebaseAdmin.js';

const appsCol = db.collection('applications');

export async function createApplication({ jobId, candidateId, status = 'applied' }) {
  const doc = {
    jobId,
    candidateId,
    status,
    appliedAt: admin.firestore.FieldValue.serverTimestamp()
  };
  const ref = await appsCol.add(doc);
  return { id: ref.id, ...doc };
}

export async function listApplicationsByJob(jobId) {
  const snap = await appsCol.where('jobId', '==', jobId).orderBy('appliedAt', 'desc').get();
  return snap.docs.map(d => ({ id: d.id, ...d.data() }));
}

export async function updateApplicationStatus(applicationId, status) {
  await appsCol.doc(applicationId).set({ status }, { merge: true });
  const doc = await appsCol.doc(applicationId).get();
  return { id: doc.id, ...doc.data() };
}

export async function countApplicationsByStatus(jobIds, status) {
  if (!jobIds || jobIds.length === 0) return 0;
  const chunks = [];
  for (let i = 0; i < jobIds.length; i += 10) chunks.push(jobIds.slice(i, i + 10));
  let total = 0;
  for (const chunk of chunks) {
    const snap = await appsCol.where('jobId', 'in', chunk).where('status', '==', status).get();
    total += snap.size;
  }
  return total;
}
