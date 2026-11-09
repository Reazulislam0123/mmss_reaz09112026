import { initializeApp, getApps, getApp, FirebaseApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, Auth } from "firebase/auth";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || "AIzaSyA8NoTyV_R0D7E6nJR0ZqHTTHnqFHfHt_s",
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || "mmsreaz.firebaseapp.com",
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || "mmsreaz",
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || "mmsreaz.firebasestorage.app",
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || "254162218267",
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID || "1:254162218267:web:b479454b2cb1f136fb37be",
};

let app: FirebaseApp;
let auth: Auth;
const googleProvider = new GoogleAuthProvider();

if (typeof window !== "undefined") {
  app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);
  auth = getAuth(app);
} else {
  // Server-side fallback for Next.js SSR
  app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);
  auth = getAuth(app);
}

export { app, auth, googleProvider };
export default app;
