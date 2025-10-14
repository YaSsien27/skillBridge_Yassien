import { db } from '../config/firebaseAdmin.js';

const candidatesCol = db.collection('candidates');

export async function getCandidatesBySkills(skills = [], limit = 10) {
  const filter = (skills || []).filter(Boolean).slice(0, 10);
  if (filter.length === 0) return [];
  const snap = await candidatesCol.where('skills', 'array-contains-any', filter).limit(limit).get();
  return snap.docs.map(d => ({ id: d.id, ...d.data() }));
}

export async function upsertCandidate(candidate) {
  await candidatesCol.doc(candidate.candidateId).set(candidate, { merge: true });
  const doc = await candidatesCol.doc(candidate.candidateId).get();
  return { id: doc.id, ...doc.data() };
}
