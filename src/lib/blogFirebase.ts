import { initializeApp, FirebaseApp } from "firebase/app";
import { getFirestore, Firestore } from "firebase/firestore";

const blogFirebaseConfig = {
  apiKey: import.meta.env.VITE_BLOG_FIREBASE_API_KEY,
  projectId: import.meta.env.VITE_BLOG_FIREBASE_PROJECT_ID,
  appId: import.meta.env.VITE_BLOG_FIREBASE_APP_ID,
};

// Initialize Firebase for blog
const blogApp: FirebaseApp = initializeApp(blogFirebaseConfig, 'blog');
const blogDb: Firestore = getFirestore(blogApp);

export { blogApp, blogDb }; 