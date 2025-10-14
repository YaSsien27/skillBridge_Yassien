import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, FlatList, StyleSheet } from 'react-native';
import { auth, db } from '../services/firebase';
import { collection, getDocs, query, where, orderBy } from 'firebase/firestore';

export default function JobManagementScreen({ navigation }) {
  const [jobs, setJobs] = useState([]);

  useEffect(() => {
    const load = async () => {
      const user = auth.currentUser;
      if (!user) return;
      const q = query(collection(db, 'jobs'), where('recruiterId', '==', user.uid), orderBy('createdAt', 'desc'));
      const snap = await getDocs(q);
      setJobs(snap.docs.map(d => ({ id: d.id, ...d.data() })));
    };
    const unsub = navigation.addListener('focus', load);
    return unsub;
  }, [navigation]);

  const renderItem = ({ item }) => (
    <View style={styles.card}>
      <View style={{ flex: 1 }}>
        <Text style={styles.title}>{item.jobTitle}</Text>
        <Text style={styles.meta}>{item.location} • {item.category} • {item.experienceLevel}</Text>
      </View>
      <TouchableOpacity style={styles.statusBtn} onPress={() => navigation.navigate('PostJob') /* placeholder for future Applicant Details */}>
        <Text style={{ color: 'white', fontWeight: '700' }}>Check Status</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={{ flex: 1, padding: 16 }}>
      <TouchableOpacity style={styles.primaryBtn} onPress={() => navigation.navigate('PostJob')}>
        <Text style={{ color: 'white', fontWeight: '700' }}>+ Post Job</Text>
      </TouchableOpacity>
      <FlatList
        data={jobs}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        ItemSeparatorComponent={() => <View style={{ height: 12 }} />}
        contentContainerStyle={{ paddingVertical: 12 }}
        ListEmptyComponent={<Text style={{ color: '#6B7280', marginTop: 16 }}>No jobs yet</Text>}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  card: { flexDirection: 'row', alignItems: 'center', backgroundColor: 'white', borderRadius: 12, padding: 14, shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 8, elevation: 2 },
  title: { fontWeight: '700', fontSize: 16 },
  meta: { color: '#6B7280', marginTop: 4 },
  statusBtn: { backgroundColor: '#2F6FED', paddingVertical: 10, paddingHorizontal: 14, borderRadius: 10 },
  primaryBtn: { backgroundColor: '#2F6FED', padding: 14, borderRadius: 12, alignItems: 'center' },
});
