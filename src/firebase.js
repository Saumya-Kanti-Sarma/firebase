import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth"; // to authenticate user
import { getStorage } from "firebase/storage"; // to store images in firebase

const firebaseConfig = {
  apiKey: "AIzaSyAzwmUG2zpRsIzHftwV3qtM5pahtirsPXI",
  authDomain: "news-48-f5d6c.firebaseapp.com",
  projectId: "news-48-f5d6c",
  storageBucket: "news-48-f5d6c.appspot.com",
  messagingSenderId: "727498321960",
  appId: "1:727498321960:web:e0727ad0c3e5c2a3b6451d",
  measurementId: "G-SGWBKB4DBC"
};

const app = initializeApp(firebaseConfig); // initializing app
const auth = getAuth(app); // initializing AUTH
const storage = getStorage(app); // initializing storage function

export { auth, storage }; // exporting auth and storage functions so it can be access anywhere..

