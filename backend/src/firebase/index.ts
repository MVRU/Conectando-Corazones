import admin from 'firebase-admin';
import { getStorage } from 'firebase-admin/storage';
import { getAuth } from 'firebase-admin/auth';

// import * as serviceAccount from '../../serviceAccountKey.json'; // TO-DO: corregir este import para las credenciales de Firebase

admin.initializeApp({
    // credential: admin.credential.cert(serviceAccount as admin.ServiceAccount),
    storageBucket: process.env.FIREBASE_BUCKET,
});

export const auth = getAuth();
export const storage = getStorage();
export default admin;