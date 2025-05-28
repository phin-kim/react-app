// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore"; // <-- add this line

const firebaseConfig = {
    apiKey: "AIzaSyC4_0L4czEQ8T3rmgO6HOe5UHqKcZxAAd4",
    authDomain: "finance-tracker-ec7cd.firebaseapp.com",
    projectId: "finance-tracker-ec7cd",
    storageBucket: "finance-tracker-ec7cd.appspot.com",
    messagingSenderId: "40625146495",
    appId: "1:40625146495:web:ce29a39b4a954ebbb4cd4a",
    measurementId: "G-ZW80H0REEZ"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
export default app;
export const db = getFirestore(app);