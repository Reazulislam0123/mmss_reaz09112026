import * as admin from "firebase-admin";

const projectId = process.env.FIREBASE_ADMIN_PROJECT_ID || process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID;
const clientEmail = process.env.FIREBASE_ADMIN_CLIENT_EMAIL;
const privateKey = process.env.FIREBASE_ADMIN_PRIVATE_KEY
  ? process.env.FIREBASE_ADMIN_PRIVATE_KEY.replace(/\\n/g, "\n")
  : undefined;

if (!admin.apps.length) {
  if (projectId && clientEmail && privateKey) {
    try {
      admin.initializeApp({
        credential: admin.credential.cert({
          projectId,
          clientEmail,
          privateKey,
        }),
      });
    } catch (err) {
      console.warn("Firebase Admin Cert initialization warning:", err);
      admin.initializeApp({ projectId });
    }
  } else {
    // Development fallback without cert
    try {
      admin.initializeApp({
        projectId: projectId || "smart-mms-demo",
      });
    } catch (e) {
      // Ignore if already initialized
    }
  }
}

export const adminAuth = admin.apps.length ? admin.auth() : null;
export default admin;

