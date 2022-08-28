
import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import { getStorage } from "firebase/storage";
import 'firebase/compat/firestore';


  const firebaseApp =firebase.initializeApp({
    apiKey: "AIzaSyArrzqDqS66hlBBAYIvUuUXIzS9VqGmHD0",
    authDomain: "tinder-31751.firebaseapp.com",
    databaseURL: "https://tinder-31751-default-rtdb.firebaseio.com",
    projectId: "tinder-31751",
    storageBucket: "tinder-31751.appspot.com",
    messagingSenderId: "235715914045",
    appId: "1:235715914045:web:74180dd8f49882b5523d54",
    measurementId: "G-6MYBNHQKZ6"
  });
const db=firebaseApp.firestore();
const auth =firebase.auth();
const storage = getStorage(firebaseApp);

export{db,auth,storage}; 