// Configuration template for RekoGen
// Copy this file to config.js and fill in your actual values
// IMPORTANT: config.js should be in .gitignore and never committed

const CONFIG = {
  // Email Configuration
  RESEND_API_KEY: 'YOUR_NEW_API_KEY_HERE', // Replace with your new API key
  FROM_EMAIL: 'onboarding@resend.dev', // Use verified domain
  
  // Supabase Configuration (if needed)
  SUPABASE_URL: 'YOUR_SUPABASE_URL',
  SUPABASE_ANON_KEY: 'YOUR_SUPABASE_ANON_KEY',
  
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
