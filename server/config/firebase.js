import admin from 'firebase-admin';
import dotenv from 'dotenv';
import { localDB } from './localDB.js';

dotenv.config();

let db;

try {
    if (process.env.FIREBASE_PRIVATE_KEY && process.env.FIREBASE_PROJECT_ID) {
        if (!admin.apps.length) {
            admin.initializeApp({
                credential: admin.credential.cert({
                    projectId: process.env.FIREBASE_PROJECT_ID,
                    clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
                    privateKey: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n'),
                }),
            });
            console.log('Firebase Connected');
        }
        db = admin.firestore();
    } else {
        throw new Error('Missing Firebase Keys');
    }
} catch (error) {
    console.warn('Firebase connection failed or keys missing. Using Local JSON DB.');
    db = localDB;
}

const connectDB = () => {
    // Legacy function, no-op as we init on load
};

export { admin, db, connectDB };
