






import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
    apiKey: "AIzaSyChdZfvo8M_YSYwUvxGs0KioYQbIsCDVoA",
    authDomain: "mindful-8ba3e.firebaseapp.com",
    projectId: "mindful-8ba3e",
    storageBucket: "mindful-8ba3e.firebasestorage.app",
    messagingSenderId: "255172963572",
    appId: "1:255172963572:web:c82c9cd07f73c1f2bc02a1",
    measurementId: "G-21YH4XE3HR"
  };

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Export authentication
export const auth = getAuth(app);

// Default export
export default app;