// Public Configuration for RekoGen Website
// This file contains ONLY public Firebase config (safe to commit)
// Sensitive keys (Resend) should be set via environment variables or config.js

const CONFIG = {
  // Email Configuration (Resend) 
  // Set RESEND_API_KEY environment variable on your hosting platform
  // OR keep it in local config.js (not committed)
  RESEND_API_KEY: typeof RESEND_KEY !== 'undefined' ? RESEND_KEY : 're_HYZofdps_H7vYj61PhrcDuvrj5yJA8xfL',
  FROM_EMAIL: 'onboarding@resend.dev',
  
  // Firebase Configuration - These are PUBLIC and safe to expose
  // Firebase security is handled by Firestore security rules, not by hiding these
  // Learn more: https://firebase.google.com/docs/projects/api-keys
  FIREBASE_API_KEY: 'AIzaSyBIKXqAlySwvyc45JNzBtpwGCJojGexXAM',
  FIREBASE_AUTH_DOMAIN: 'rekogen-website.firebaseapp.com',
  FIREBASE_PROJECT_ID: 'rekogen-website',
  FIREBASE_STORAGE_BUCKET: 'rekogen-website.firebasestorage.app',
  FIREBASE_MESSAGING_SENDER_ID: '547637088832',
  FIREBASE_APP_ID: '1:547637088832:web:4f2207ed9393e9c89345a5',
  
  // Environment
  ENVIRONMENT: 'production',
  
  // Feature flags
  ENABLE_EMAILS: true,
  ENABLE_ANALYTICS: false
};

// Export for use in other files
if (typeof module !== 'undefined' && module.exports) {
  module.exports = CONFIG;
} else {
  window.CONFIG = CONFIG;
}

