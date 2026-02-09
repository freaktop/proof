import admin from "firebase-admin";

function getPrivateKey() {
  const key = process.env.FIREBASE_PRIVATE_KEY!;
  return key.includes("\\n") ? key.replace(/\\n/g, "\n") : key;
}

export const adminApp =
  admin.apps.length > 0
    ? admin.app()
    : admin.initializeApp({
        credential: admin.credential.cert({
          projectId: process.env.FIREBASE_PROJECT_ID!,
          clientEmail: process.env.FIREBASE_CLIENT_EMAIL!,
          privateKey: getPrivateKey(),
        }),
        storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET!,
      });

export const adminAuth = admin.auth();
export const adminDB = admin.firestore();
export const adminStorageBucket = admin.storage().bucket();
