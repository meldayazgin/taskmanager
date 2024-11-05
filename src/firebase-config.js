import { initializeApp } from 'firebase/app';
import { getFirestore } from "firebase/firestore";
import { getAuth, GoogleAuthProvider } from 'firebase/auth';
import { getStorage } from "firebase/storage";
import { getDatabase } from 'firebase/database';

const firebaseConfig = {
  apiKey: "AIzaSyBOIUhAEU_y4c0UQiQDkCtycoi9xYfOjh4",
  authDomain: "fir-app-3f973.firebaseapp.com",
  projectId: "fir-app-3f973",
  storageBucket: "fir-app-3f973.appspot.com",
  messagingSenderId: "340455242671",
  appId: "1:340455242671:web:c410e513b56a56a8bc4d5a",
  measurementId: "G-78X282YQRV",
  databaseURL: "https://fir-app-3f973-default-rtdb.firebaseio.com/",
};


const app = initializeApp(firebaseConfig);
const rtdb = getDatabase(app);
const db = getFirestore(app);
const auth = getAuth(app);
const storage = getStorage(app);


export const googleProvider = new GoogleAuthProvider(); 
export { rtdb, app, db, auth, storage };