import { upsertCandidate } from '../modules/candidates.js';

export async function upsertCandidateHandler(req, res, next) {
  try {
    const candidate = await upsertCandidate({ candidateId: req.user.uid, ...req.body });
    res.json(candidate);
  } catch (e) { next(e); }
}
