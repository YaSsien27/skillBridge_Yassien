import { listJobsByRecruiter } from '../modules/jobs.js';
import { countApplicationsByStatus } from '../modules/applications.js';
import { getCandidatesBySkills } from '../modules/candidates.js';

export async function dashboardHandler(req, res, next) {
  try {
    const recruiterId = req.user.uid;
    const jobs = await listJobsByRecruiter(recruiterId);
    const jobIds = jobs.map(j => j.id);

    const jobsPosted = jobs.length;
    const newApplicants = await countApplicationsByStatus(jobIds, 'applied');
    const shortlisted = await countApplicationsByStatus(jobIds, 'shortlisted');

    // Recent activity: last 10 applications across jobs (simplified)
    // For brevity, we're not implementing cross-collection sort here via Admin SDK; clients can fetch as needed.
    const recentActivity = [];

    // Suggested candidates based on union of skills
    const allSkills = [...new Set(jobs.flatMap(j => j.skillsRequired || []))];
    const suggested = await getCandidatesBySkills(allSkills.slice(0, 10), 10);
    const suggestions = suggested.map(c => {
      const overlap = (c.skills || []).filter(s => allSkills.includes(s)).length;
      const pct = allSkills.length ? Math.round((overlap / allSkills.length) * 100) : 0;
      return { candidateId: c.id, name: c.name, skills: c.skills || [], matchPercent: pct };
    });

    res.json({ jobsPosted, newApplicants, shortlisted, recentActivity, suggestedCandidates: suggestions });
  } catch (e) { next(e); }
}
