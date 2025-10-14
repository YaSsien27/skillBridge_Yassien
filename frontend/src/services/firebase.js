import Constants from 'expo-constants';
import { initializeApp, getApps } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';
import { getFirestore, serverTimestamp } from 'firebase/firestore';
import { getStorage, ref as storageRef, uploadBytes, getDownloadURL } from 'firebase/storage';

const firebaseConfig = Constants?.expoConfig?.extra?.firebase || {};

let app;
if (!getApps().length) {
  app = initializeApp(firebaseConfig);
} else {
  app = getApps()[0];
}

export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
export const db = getFirestore(app);
export const storage = getStorage(app);
export const ts = serverTimestamp;

export async function uploadFileToStorage({ uri, destinationPath, contentType }) {
  if (!uri) return null;
  const response = await fetch(uri);
  const blob = await response.blob();
  const ref = storageRef(storage, destinationPath);
  await uploadBytes(ref, blob, contentType ? { contentType } : undefined);
  return await getDownloadURL(ref);
}
