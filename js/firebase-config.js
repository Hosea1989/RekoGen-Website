// Firebase Configuration
// This file initializes Firebase and provides helper functions for Firestore operations

// Firebase configuration object
// Copy this from your Firebase Console -> Project Settings -> General -> Your apps -> SDK setup and configuration
const firebaseConfig = {
  apiKey: window.CONFIG?.FIREBASE_API_KEY || "YOUR_FIREBASE_API_KEY",
  authDomain: window.CONFIG?.FIREBASE_AUTH_DOMAIN || "YOUR_PROJECT_ID.firebaseapp.com",
  projectId: window.CONFIG?.FIREBASE_PROJECT_ID || "YOUR_PROJECT_ID",
  storageBucket: window.CONFIG?.FIREBASE_STORAGE_BUCKET || "YOUR_PROJECT_ID.appspot.com",
  messagingSenderId: window.CONFIG?.FIREBASE_MESSAGING_SENDER_ID || "YOUR_SENDER_ID",
  appId: window.CONFIG?.FIREBASE_APP_ID || "YOUR_APP_ID"
};

// Initialize Firebase
let app, db;

function initializeFirebase() {
  try {
    if (typeof firebase === 'undefined') {
      throw new Error('Firebase SDK not loaded');
    }

    // Initialize Firebase
    app = firebase.initializeApp(firebaseConfig);
    db = firebase.firestore();

    console.log('Firebase initialized successfully');
    return { app, db };
  } catch (error) {
    console.error('Firebase initialization error:', error);
    throw error;
  }
}

// Helper function to add a document to a collection
async function addDocument(collectionName, data) {
  try {
    if (!db) {
      const initialized = initializeFirebase();
      db = initialized.db;
    }

    const docRef = await db.collection(collectionName).add({
      ...data,
      created_at: firebase.firestore.FieldValue.serverTimestamp(),
      updated_at: firebase.firestore.FieldValue.serverTimestamp()
    });

    console.log('Document written with ID: ', docRef.id);
    return { success: true, id: docRef.id, data: { id: docRef.id, ...data } };
  } catch (error) {
    console.error('Error adding document: ', error);
    
    // Provide helpful error messages
    if (error.code === 'permission-denied') {
      return { success: false, error: 'Permission denied. Please check Firestore security rules.' };
    } else if (error.code === 'unavailable') {
      return { success: false, error: 'Firebase service unavailable. Please try again later.' };
    }
    
    return { success: false, error: error.message };
  }
}

// Helper function to check for duplicate emails in a collection
async function checkDuplicateEmail(collectionName, email) {
  try {
    if (!db) {
      const initialized = initializeFirebase();
      db = initialized.db;
    }

    const querySnapshot = await db.collection(collectionName)
      .where('email', '==', email)
      .limit(1)
      .get();

    return !querySnapshot.empty;
  } catch (error) {
    console.error('Error checking duplicate email: ', error);
    return false;
  }
}

// Export functions
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { initializeFirebase, addDocument, checkDuplicateEmail };
} else {
  window.FirebaseHelper = { initializeFirebase, addDocument, checkDuplicateEmail };
}

