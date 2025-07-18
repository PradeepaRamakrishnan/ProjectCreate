import { initializeApp } from "firebase/app";

import { getMessaging } from "firebase/messaging";

//Firebase Config values imported from .env file
const firebaseConfig = {
  apiKey: "AIzaSyCpWJHXpa-ryA8txZlyoo5NFxUkIkv29Bw",
  authDomain: "bio-graph-app.firebaseapp.com",
  projectId: "bio-graph-app",
  storageBucket: "bio-graph-app.firebasestorage.app",
  messagingSenderId: "518061505597",
  appId: "1:518061505597:web:c59d87c6e992af6ee67e54",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Messaging service
export const messaging = getMessaging(app);
