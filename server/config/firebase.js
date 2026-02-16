import admin from 'firebase-admin';
import dotenv from 'dotenv';

dotenv.config();

const connectDB = () => {
    try {
        // Check if firebase is already initialized
        if (!admin.apps.length) {
            admin.initializeApp({
                credential: admin.credential.cert({
                    projectId: process.env.FIREBASE_PROJECT_ID,
                    clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
                    // Handle private key newlines
                    privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
                }),
            });
            console.log('Firebase Admin Initialized');
        }
    } catch (error) {
        console.error('Firebase Admin Initialization Error:', error);
        // process.exit(1); // Don't crash if config is missing, just log
    }
};

const db = admin.firestore();
export { admin, db, connectDB };
