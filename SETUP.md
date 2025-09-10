# RekoGen Setup Instructions

## 🔐 Security Setup

### 1. API Key Security
Your API keys are now stored securely and won't be committed to git.

### 2. Configuration Setup
1. **Copy the template**: `cp js/config.template.js js/config.js`
2. **Edit config.js**: Replace placeholder values with your actual API keys
3. **Never commit config.js**: It's already in .gitignore

### 3. Required API Keys

#### Resend Email Service
1. Go to [resend.com/dashboard](https://resend.com/dashboard)
2. Create a new API key (revoke the old one that was exposed)
3. Add the new key to `js/config.js`:
   ```javascript
   RESEND_API_KEY: 're_your_new_api_key_here'
   ```

#### Domain Verification (Optional)
To use your own domain instead of Resend's verified domain:
1. Add your domain in Resend dashboard
2. Follow DNS setup instructions
3. Update `FROM_EMAIL` in config.js:
   ```javascript
   FROM_EMAIL: 'hello@rekogen.app'
   ```

### 4. Testing
After setup, test your email functionality:
1. Deploy your website
2. Use the email verification tools:
   - `email_verification.html` - Full email testing
   - `debug_email.html` - Debug email issues
   - `simple_test.html` - Simple email test

### 5. Production Deployment
For production, consider:
- Using environment variables
- Server-side email sending
- Domain verification for better deliverability

## 🚨 Important Security Notes
- ✅ `config.js` is in .gitignore
- ✅ API keys are no longer hardcoded
- ✅ Template file shows required structure
- ❌ Never commit real API keys to git
- ❌ Never share your config.js file
