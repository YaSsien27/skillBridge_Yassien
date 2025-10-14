import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, StyleSheet } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import * as ImagePicker from 'expo-image-picker';
import * as DocumentPicker from 'expo-document-picker';
import { auth, db, ts, uploadFileToStorage } from '../services/firebase';
import { addDoc, collection } from 'firebase/firestore';

const categories = ['Engineering', 'Design', 'Product', 'Marketing', 'Sales', 'Operations'];
const experienceLevels = ['Fresher', '1-3 Years', '3-5 Years', '5+ Years'];

export default function PostJobScreen({ navigation }) {
  const [jobTitle, setJobTitle] = useState('');
  const [location, setLocation] = useState('');
  const [category, setCategory] = useState(categories[0]);
  const [skillInput, setSkillInput] = useState('');
  const [skills, setSkills] = useState([]);
  const [experienceLevel, setExperienceLevel] = useState(experienceLevels[0]);
  const [description, setDescription] = useState('');
  const [uploadUri, setUploadUri] = useState(null);
  const [loading, setLoading] = useState(false);

  const addSkill = () => {
    const s = skillInput.trim();
    if (!s) return;
    if (skills.includes(s)) return;
    setSkills([...skills, s]);
    setSkillInput('');
  };

  const pickLogoOrDoc = async () => {
    const res = await DocumentPicker.getDocumentAsync({ type: ['image/*', 'application/pdf'] });
    if (res.assets && res.assets.length > 0) {
      setUploadUri(res.assets[0].uri);
    }
  };

  const onSave = async (status) => {
    try {
      setLoading(true);
      const user = auth.currentUser;
      if (!user) throw new Error('Not authenticated');

      let logoUrl = null;
      if (uploadUri) {
        const ext = uploadUri.split('.').pop();
        logoUrl = await uploadFileToStorage({
          uri: uploadUri,
          destinationPath: `jobs/${user.uid}/${Date.now()}.${ext}`,
        });
      }

      const payload = {
        recruiterId: user.uid,
        jobTitle,
        location,
        category,
        skillsRequired: skills,
        experienceLevel,
        description,
        logoUrl,
        status,
        createdAt: ts(),
      };

      await addDoc(collection(db, 'jobs'), payload);
      navigation.goBack();
    } catch (e) {
      console.warn(e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Post New Job</Text>

      <Text style={styles.label}>Job Title</Text>
      <TextInput style={styles.input} value={jobTitle} onChangeText={setJobTitle} placeholder="e.g. React Native Developer" />

      <Text style={styles.label}>Location</Text>
      <TextInput style={styles.input} value={location} onChangeText={setLocation} placeholder="e.g. Remote, Bangalore" />

      <Text style={styles.label}>Category</Text>
      <View style={styles.pickerBox}>
        <Picker selectedValue={category} onValueChange={setCategory}>
          {categories.map(c => <Picker.Item key={c} label={c} value={c} />)}
        </Picker>
      </View>

      <Text style={styles.label}>Skills Required</Text>
      <View style={{ flexDirection: 'row', gap: 8 }}>
        <TextInput style={[styles.input, { flex: 1 }]} value={skillInput} onChangeText={setSkillInput} placeholder="e.g. React, Node" />
        <TouchableOpacity style={styles.addBtn} onPress={addSkill}>
          <Text style={{ color: 'white', fontWeight: '600' }}>Add</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.tagsWrap}>
        {skills.map((s) => (
          <View key={s} style={styles.tag}>
            <Text style={styles.tagText}>{s}</Text>
            <TouchableOpacity onPress={() => setSkills(skills.filter(x => x !== s))}>
              <Text style={styles.remove}>×</Text>
            </TouchableOpacity>
          </View>
        ))}
      </View>

      <Text style={styles.label}>Experience</Text>
      <View style={styles.pickerBox}>
        <Picker selectedValue={experienceLevel} onValueChange={setExperienceLevel}>
          {experienceLevels.map(e => <Picker.Item key={e} label={e} value={e} />)}
        </Picker>
      </View>

      <Text style={styles.label}>Description</Text>
      <TextInput style={[styles.input, { height: 120, textAlignVertical: 'top' }]} value={description} onChangeText={setDescription} multiline placeholder="Role description..." />

      <TouchableOpacity style={styles.uploadBtn} onPress={pickLogoOrDoc}>
        <Text style={{ color: '#2F6FED', fontWeight: '600' }}>{uploadUri ? 'File Selected' : 'Upload Logo/Docs'}</Text>
      </TouchableOpacity>

      <View style={styles.btnRow}>
        <TouchableOpacity disabled={loading} style={[styles.outlineBtn]} onPress={() => onSave('draft')}>
          <Text style={[styles.btnText, { color: '#2F6FED' }]}>{loading ? 'Saving...' : 'Save Draft'}</Text>
        </TouchableOpacity>
        <TouchableOpacity disabled={loading} style={styles.primaryBtn} onPress={() => onSave('published')}>
          <Text style={[styles.btnText, { color: 'white' }]}>{loading ? 'Posting...' : 'Post Job'}</Text>
        </TouchableOpacity>
      </View>
      <View style={{ height: 24 }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 16 },
  title: { fontSize: 22, fontWeight: '700', marginBottom: 12 },
  label: { fontSize: 14, color: '#4B5563', marginTop: 12, marginBottom: 6 },
  input: { backgroundColor: 'white', borderRadius: 10, padding: 12, borderWidth: 1, borderColor: '#E5E7EB' },
  pickerBox: { backgroundColor: 'white', borderRadius: 10, borderWidth: 1, borderColor: '#E5E7EB' },
  addBtn: { backgroundColor: '#2F6FED', paddingHorizontal: 16, borderRadius: 10, justifyContent: 'center' },
  tagsWrap: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginTop: 8 },
  tag: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#EEF2FF', borderRadius: 20, paddingHorizontal: 10, paddingVertical: 6 },
  tagText: { color: '#1F2937', marginRight: 6 },
  remove: { color: '#9CA3AF', fontSize: 18, lineHeight: 18 },
  uploadBtn: { backgroundColor: '#EAF2FF', borderRadius: 10, padding: 12, alignItems: 'center', marginTop: 12, borderWidth: 1, borderColor: '#C7DBFF' },
  btnRow: { flexDirection: 'row', gap: 12, marginTop: 16 },
  outlineBtn: { flex: 1, borderWidth: 1, borderColor: '#2F6FED', borderRadius: 10, alignItems: 'center', padding: 14, backgroundColor: 'white' },
  primaryBtn: { flex: 1, backgroundColor: '#2F6FED', borderRadius: 10, alignItems: 'center', padding: 14 },
  btnText: { fontWeight: '700' },
});
