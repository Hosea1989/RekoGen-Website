// Configuration template for RekoGen
// Copy this file to config.js and fill in your actual values
// IMPORTANT: config.js should be in .gitignore and never committed

const CONFIG = {
  // Email Configuration (Resend)
  RESEND_API_KEY: 'YOUR_NEW_API_KEY_HERE', // Replace with your new API key
  FROM_EMAIL: 'onboarding@resend.dev', // Use verified domain
  
  // Firebase Configuration
  // Get these values from Firebase Console -> Project Settings -> General -> Your apps -> SDK setup
  FIREBASE_API_KEY: 'YOUR_FIREBASE_API_KEY',
  FIREBASE_AUTH_DOMAIN: 'YOUR_PROJECT_ID.firebaseapp.com',
  FIREBASE_PROJECT_ID: 'YOUR_PROJECT_ID',
  FIREBASE_STORAGE_BUCKET: 'YOUR_PROJECT_ID.appspot.com',
  FIREBASE_MESSAGING_SENDER_ID: 'YOUR_SENDER_ID',
  FIREBASE_APP_ID: 'YOUR_APP_ID',
  
  // Environment
  ENVIRONMENT: 'development', // 'development' or 'production'
  
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
