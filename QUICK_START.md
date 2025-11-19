# 🚀 Quick Start - Firebase Setup

## TL;DR - Get Running in 10 Minutes

### Step 1: Firebase Console (5 min)
1. Go to [console.firebase.google.com](https://console.firebase.google.com)
2. Create new project → "RekoGen-Website"
3. Build → Firestore Database → Create Database → Start in Test Mode
4. Click ⚙️ → Project Settings → Scroll down → Add Web App
5. Copy the `firebaseConfig` object

### Step 2: Update Config (2 min)
```bash
cd /Users/damienhosea/Desktop/RekoGen-Website
cp js/config.template.js js/config.js
```

Edit `js/config.js` and paste your Firebase config:
```javascript
const CONFIG = {
  // Your existing Resend config...
  RESEND_API_KEY: 're_....',
  FROM_EMAIL: 'onboarding@resend.dev',
  
  // Paste these from Firebase Console
  FIREBASE_API_KEY: 'AIza....',
  FIREBASE_AUTH_DOMAIN: 'your-project.firebaseapp.com',
  FIREBASE_PROJECT_ID: 'your-project',
  FIREBASE_STORAGE_BUCKET: 'your-project.appspot.com',
  FIREBASE_MESSAGING_SENDER_ID: '123456789',
  FIREBASE_APP_ID: '1:123456789:web:abc123',
  
  ENVIRONMENT: 'production',
  ENABLE_EMAILS: true,
  ENABLE_ANALYTICS: false
};
```

### Step 3: Security Rules (2 min)
In Firebase Console → Firestore → Rules tab, paste:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /waitlist/{document} {
      allow create: if request.auth == null 
        && request.resource.data.keys().hasAll(['email', 'platform'])
        && request.resource.data.email is string
        && request.resource.data.email.matches('.*@.*\\..*');
      allow read, update, delete: if false;
    }
    
    match /feedback/{document} {
      allow create: if request.auth == null 
        && request.resource.data.keys().hasAll(['email', 'name', 'message'])
        && request.resource.data.email is string
        && request.resource.data.email.matches('.*@.*\\..*');
      allow read, update, delete: if false;
    }
  }
}
```

Click **Publish**.

### Step 4: Test (1 min)
1. Open `waitlist.html` in browser
2. Submit a test email
3. Check Firebase Console → Firestore Database → You should see data!

### Step 5: Deploy
```bash
# Make sure config.js is NOT committed
git status  # config.js should NOT appear

# Commit and push the migration
git add .
git commit -m "Migrate from Supabase to Firebase"
git push

# Deploy however you normally deploy
```

## Done! 🎉

Your website now uses Firebase. No more Supabase pausing issues!

## View Your Data

Firebase Console → Your Project → Firestore Database → Collections

You'll see:
- `waitlist` - Beta signups
- `feedback` - Contact form submissions

## Need Help?

- Full guide: `FIREBASE_SETUP.md`
- What changed: `MIGRATION_SUMMARY.md`
- General setup: `SETUP.md`

## Common Issues

**"Permission denied"**
- Check security rules are published
- Verify all required fields are present

**"Firebase SDK not loaded"**
- Check internet connection
- Verify Firebase CDN URLs are correct

**Can't see data in Firestore**
- Check browser console for errors
- Verify `config.js` exists and has correct values
- Make sure you clicked "Publish" on security rules

---

Need the detailed guide? Read `FIREBASE_SETUP.md`

