import { db } from '../config/firebaseAdmin.js';

const recruitersCol = db.collection('recruiters');

export async function getRecruiter(recruiterId) {
  const doc = await recruitersCol.doc(recruiterId).get();
  return doc.exists ? { id: doc.id, ...doc.data() } : null;
}

export async function upsertRecruiter(recruiter) {
  await recruitersCol.doc(recruiter.recruiterId).set(recruiter, { merge: true });
  const doc = await recruitersCol.doc(recruiter.recruiterId).get();
  return { id: doc.id, ...doc.data() };
}
