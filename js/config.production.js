// Production Configuration for RekoGen Website
// This file CAN be committed - it uses environment variables or hardcoded values for production

const CONFIG = {
  // Email Configuration (Resend)
  RESEND_API_KEY: 're_HYZofdps_H7vYj61PhrcDuvrj5yJA8xfL',
  FROM_EMAIL: 'onboarding@resend.dev',
  
  // Firebase Configuration - rekogen-website project
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

