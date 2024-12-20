import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider, signInWithPopup, signOut } from 'firebase/auth';

const firebaseConfig = {
  apiKey: "AIzaSyAxZ8ju_nZwqfN1YO_CFR69YcUqVtia8VY",
  authDomain: "bracu-study-portal.firebaseapp.com",
  projectId: "bracu-study-portal",
  storageBucket: "bracu-study-portal.appspot.com",
  messagingSenderId: "411308506060",
  appId: "1:411308506060:web:b660dafc0a4069e8303b69"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();

export { auth, provider, signInWithPopup, signOut };

  