// js/firebase.js
// Firebase v10+ (Modular, CDN)

/* ================================
   IMPORTS
================================ */
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import {
  getAuth,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";
import {
  getFirestore,
  doc,
  getDoc,
  setDoc,
  updateDoc,
  collection,
  addDoc,
  serverTimestamp
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

/* ================================
   FIREBASE CONFIG (CRAFTOS)
================================ */
const firebaseConfig = {
  apiKey: "AIzaSyAP5ryo1RiZn6wXHIaybFBfscRb_Q-FMeo",
  authDomain: "craftos-553f0.firebaseapp.com",
  projectId: "craftos-553f0",
  storageBucket: "craftos-553f0.firebasestorage.app",
  messagingSenderId: "1055638287490",
  appId: "1:1055638287490:web:673ba921571ee7a4e0f09b"
};

/* ================================
   INITIALIZE
================================ */
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

/* ================================
   AUTH FUNCTIONS
================================ */
async function login(email, password) {
  return signInWithEmailAndPassword(auth, email, password);
}

async function logout() {
  return signOut(auth);
}

function watchAuth(callback) {
  onAuthStateChanged(auth, callback);
}

/* ================================
   INVENTORY FUNCTIONS
================================ */
const INVENTORY_ID = "main";

async function loadInventory() {
  const ref = doc(db, "inventory", INVENTORY_ID);
  const snap = await getDoc(ref);

  if (snap.exists()) return snap.data();

  const defaultInventory = {
    paperStock: 0,
    ink: { c: 0, m: 0, y: 0, k: 0 }
  };

  await setDoc(ref, defaultInventory);
  return defaultInventory;
}

async function saveInventory(data) {
  const ref = doc(db, "inventory", INVENTORY_ID);
  await updateDoc(ref, data);
}

/* ================================
   JOB / RECEIPT FUNCTIONS
================================ */
async function saveJob(jobData) {
  await addDoc(collection(db, "jobs"), {
    ...jobData,
    createdAt: serverTimestamp()
  });
}

/* ================================
   EXPOSE TO WINDOW (IMPORTANT)
================================ */
window.firebaseAPI = {
  login,
  logout,
  watchAuth,
  loadInventory,
  saveInventory,
  saveJob
};