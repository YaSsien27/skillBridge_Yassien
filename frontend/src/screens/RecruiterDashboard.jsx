import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import { auth, db } from '../services/firebase';
import { collection, getDocs, query, where, orderBy, limit } from 'firebase/firestore';

function Card({ children }) {
  return <View style={styles.card}>{children}</View>;
}

export default function RecruiterDashboard() {
  const [summary, setSummary] = useState({ jobsPosted: 0, newApplicants: 0, shortlisted: 0 });
  const [recent, setRecent] = useState([]);
  const [suggested, setSuggested] = useState([]);

  useEffect(() => {
    const load = async () => {
      const user = auth.currentUser;
      if (!user) return;

      const jobsQ = query(collection(db, 'jobs'), where('recruiterId', '==', user.uid));
      const jobsSnap = await getDocs(jobsQ);
      const jobs = jobsSnap.docs.map(d => ({ id: d.id, ...d.data() }));

      const jobIds = jobs.map(j => j.id);
      let applicantsCount = 0;
      let shortlistedCount = 0;

      if (jobIds.length) {
        // naive fetch: in absence of 'in' limits, do multiple queries
        for (const jobId of jobIds.slice(0, 10)) {
          const appsQ = query(collection(db, 'applications'), where('jobId', '==', jobId));
          const appsSnap = await getDocs(appsQ);
          applicantsCount += appsSnap.size;
          shortlistedCount += appsSnap.docs.filter(d => d.data().status === 'shortlisted').length;
        }
        // recent
        const recentQ = query(collection(db, 'applications'), where('jobId', 'in', jobIds.slice(0,10)), orderBy('appliedAt', 'desc'), limit(10));
        try {
          const recentSnap = await getDocs(recentQ);
          setRecent(recentSnap.docs.map(d => ({ id: d.id, ...d.data() })));
        } catch {}
      }

      const allSkills = [...new Set(jobs.flatMap(j => j.skillsRequired || []))];
      let suggestedCandidates = [];
      if (allSkills.length) {
        for (const skill of allSkills.slice(0,10)) {
          const candQ = query(collection(db, 'candidates'), where('skills', 'array-contains', skill));
          const candSnap = await getDocs(candQ);
          suggestedCandidates.push(...candSnap.docs.map(d => ({ id: d.id, ...d.data() })));
        }
        const unique = new Map();
        suggestedCandidates.forEach(c => unique.set(c.id, c));
        suggestedCandidates = Array.from(unique.values()).slice(0, 10);
      }

      setSummary({ jobsPosted: jobs.length, newApplicants: applicantsCount, shortlisted: shortlistedCount });
      setSuggested(suggestedCandidates);
    };
    load();
  }, []);

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.heading}>Dashboard</Text>

      <View style={styles.row}>
        <Card><Text style={styles.cardNum}>{summary.newApplicants}</Text><Text style={styles.cardLabel}>New Applicants</Text></Card>
        <Card><Text style={styles.cardNum}>{summary.jobsPosted}</Text><Text style={styles.cardLabel}>Jobs Posted</Text></Card>
        <Card><Text style={styles.cardNum}>{summary.shortlisted}</Text><Text style={styles.cardLabel}>Shortlisted</Text></Card>
      </View>

      <Text style={styles.sectionTitle}>Recent Activity</Text>
      <Card>
        {recent.length === 0 ? (
          <Text style={{ color: '#6B7280' }}>No recent activity</Text>
        ) : recent.map(r => (
          <View key={r.id} style={styles.activityItem}>
            <Text style={styles.activityText}>Candidate {r.candidateId} {r.status} for Job {r.jobId}</Text>
          </View>
        ))}
      </Card>

      <Text style={styles.sectionTitle}>Suggested Candidates</Text>
      <Card>
        {suggested.length === 0 ? (
          <Text style={{ color: '#6B7280' }}>No suggestions yet</Text>
        ) : suggested.map(c => {
          const skills = c.skills || [];
          return (
            <View key={c.id} style={styles.candidateItem}>
              <View style={{ flex: 1 }}>
                <Text style={styles.candidateName}>{c.name || 'Candidate'}</Text>
                <Text style={styles.candidateSkills}>{skills.join(', ')}</Text>
              </View>
            </View>
          );
        })}
      </Card>

      <View style={{ height: 24 }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 16 },
  heading: { fontSize: 22, fontWeight: '700', marginBottom: 12 },
  row: { flexDirection: 'row', gap: 12, marginBottom: 16 },
  card: { flex: 1, backgroundColor: 'white', borderRadius: 12, padding: 14, shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 8, elevation: 2 },
  cardNum: { fontSize: 20, fontWeight: '800' },
  cardLabel: { color: '#6B7280', marginTop: 4 },
  sectionTitle: { fontSize: 18, fontWeight: '700', marginTop: 8, marginBottom: 8 },
  activityItem: { paddingVertical: 8, borderBottomWidth: 1, borderBottomColor: '#F3F4F6' },
  activityText: { color: '#111827' },
  candidateItem: { flexDirection: 'row', alignItems: 'center', paddingVertical: 10, borderBottomWidth: 1, borderBottomColor: '#F3F4F6' },
  candidateName: { fontWeight: '700', fontSize: 16 },
  candidateSkills: { color: '#6B7280', marginTop: 4 },
});
