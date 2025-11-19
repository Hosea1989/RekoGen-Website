# Firebase Setup Guide for RekoGen Website

This guide will help you migrate from Supabase to Firebase for the RekoGen website.

## Prerequisites

- A Firebase account (free tier is sufficient to get started)
- Access to the Firebase Console: https://console.firebase.google.com/

## Step 1: Create a Firebase Project

1. Go to the [Firebase Console](https://console.firebase.google.com/)
2. Click **"Add project"** or select an existing project
3. Enter your project name (e.g., "RekoGen-Website")
4. Follow the setup wizard (you can disable Google Analytics if not needed)
5. Click **"Create project"**

## Step 2: Set Up Firestore Database

1. In your Firebase project, click on **"Build"** in the left sidebar
2. Select **"Firestore Database"**
3. Click **"Create database"**
4. Choose a starting mode:
   - **Production mode**: More secure, requires security rules (recommended for production)
   - **Test mode**: Open access, good for development (but remember to secure it later!)
5. Select a Cloud Firestore location (choose one closest to your users)
6. Click **"Enable"**

### Configure Security Rules

Once your database is created, you'll need to set up security rules. Click on the **"Rules"** tab and use these rules to start:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Waitlist collection - anyone can write (create only), no one can read
    match /waitlist/{document} {
      allow create: if request.auth == null 
        && request.resource.data.keys().hasAll(['email', 'platform'])
        && request.resource.data.email is string
        && request.resource.data.email.matches('.*@.*\\..*');
      allow read, update, delete: if false; // Only you can read via Firebase Console
    }
    
    // Feedback collection - anyone can write (create only), no one can read
    match /feedback/{document} {
      allow create: if request.auth == null 
        && request.resource.data.keys().hasAll(['email', 'name', 'message'])
        && request.resource.data.email is string
        && request.resource.data.email.matches('.*@.*\\..*');
      allow read, update, delete: if false; // Only you can read via Firebase Console
    }
  }
}
```

**Important**: These rules allow anyone to create documents but prevent reading. You'll access the data through the Firebase Console. For more secure setup, consider adding rate limiting or authentication.

## Step 3: Get Your Firebase Configuration

1. In the Firebase Console, click on the **gear icon** (⚙️) next to "Project Overview"
2. Select **"Project settings"**
3. Scroll down to **"Your apps"** section
4. If you haven't already, click **"Web"** (</> icon) to add a web app
5. Register your app with a nickname (e.g., "RekoGen Website")
6. You'll see your Firebase configuration object. It looks like this:

```javascript
const firebaseConfig = {
  apiKey: "AIza...",
  authDomain: "your-project.firebaseapp.com",
  projectId: "your-project",
  storageBucket: "your-project.appspot.com",
  messagingSenderId: "123456789",
  appId: "1:123456789:web:abc123"
};
```

## Step 4: Configure Your Website

1. **Copy the template config file:**
   ```bash
   cp js/config.template.js js/config.js
   ```

2. **Edit `js/config.js`** and fill in your Firebase credentials:
   ```javascript
   const CONFIG = {
     // Email Configuration (Resend)
     RESEND_API_KEY: 'your_resend_api_key',
     FROM_EMAIL: 'onboarding@yourdomain.com',
     
     // Firebase Configuration
     FIREBASE_API_KEY: 'AIza...',
     FIREBASE_AUTH_DOMAIN: 'your-project.firebaseapp.com',
     FIREBASE_PROJECT_ID: 'your-project',
     FIREBASE_STORAGE_BUCKET: 'your-project.appspot.com',
     FIREBASE_MESSAGING_SENDER_ID: '123456789',
     FIREBASE_APP_ID: '1:123456789:web:abc123',
     
     // Environment
     ENVIRONMENT: 'production',
     
     // Feature flags
     ENABLE_EMAILS: true,
     ENABLE_ANALYTICS: false
   };
   ```

3. **Make sure `js/config.js` is in your `.gitignore`:**
   ```
   js/config.js
   ```

## Step 5: Create Firestore Collections

The collections will be created automatically when the first document is added. You don't need to create them manually. However, if you want to create them in advance:

1. Go to **Firestore Database** in your Firebase Console
2. Click **"Start collection"**
3. Create two collections:
   - `waitlist` - for beta signups
   - `feedback` - for contact form submissions

### Expected Document Structure

**Waitlist Collection:**
```javascript
{
  name: "John Doe",
  email: "john@example.com",
  platform: "ios",
  experience: "regular",
  referrer: "social",
  notes: "Looking forward to trying it!",
  consent: true,
  page: "https://rekogen.app/waitlist.html",
  user_agent: "Mozilla/5.0...",
  created_at: Timestamp,
  updated_at: Timestamp
}
```

**Feedback Collection:**
```javascript
{
  name: "Jane Smith",
  email: "jane@example.com",
  message: "[BUG] Something isn't working",
  feedback_type: "bug",
  category: "contact",
  page: "https://rekogen.app/dev.html",
  user_agent: "Mozilla/5.0...",
  created_at: Timestamp,
  updated_at: Timestamp
}
```

## Step 6: Test Your Setup

1. Open your website in a browser
2. Try submitting the waitlist form on `waitlist.html`
3. Try submitting the contact form on `dev.html`
4. Check the browser console for any errors
5. Verify the data appears in your Firestore Database in the Firebase Console

## Step 7: Set Up Indexes (Optional but Recommended)

To improve query performance, especially if you plan to add admin features:

1. Go to **Firestore Database** → **Indexes** tab
2. Add a composite index for the `waitlist` collection:
   - Collection: `waitlist`
   - Fields: `email` (Ascending), `created_at` (Descending)
3. Add a composite index for the `feedback` collection:
   - Collection: `feedback`
   - Fields: `category` (Ascending), `created_at` (Descending)

## Viewing Your Data

To view submissions:

1. Go to the [Firebase Console](https://console.firebase.google.com/)
2. Select your project
3. Click **"Firestore Database"** in the left sidebar
4. Browse the `waitlist` and `feedback` collections

## Cost Considerations

Firebase offers a generous free tier:
- **Firestore Free Tier:**
  - 50,000 document reads/day
  - 20,000 document writes/day
  - 20,000 document deletes/day
  - 1 GiB storage

For a beta website, this should be more than sufficient. Monitor usage in the Firebase Console under **"Usage and billing"**.

## Troubleshooting

### "Permission Denied" Errors
- Check your Firestore security rules
- Make sure you're creating documents with all required fields
- Verify email format is valid

### "Firebase SDK not loaded" Error
- Check that the Firebase scripts are loading correctly in your HTML
- Open browser DevTools Network tab and verify the Firebase CDN files are loading
- Check for any CORS issues

### Duplicate Email Handling
- The code checks for duplicate emails before submission
- If you want more robust handling, add a unique index on the `email` field

### Data Not Appearing in Firestore
- Check the browser console for errors
- Verify your Firebase configuration is correct
- Make sure security rules allow writes
- Check that `js/config.js` exists and has valid credentials

## Migrating Existing Data from Supabase (Optional)

If you have existing data in Supabase that you want to migrate:

1. **Export from Supabase:**
   - Go to your Supabase project → SQL Editor
   - Run: `SELECT * FROM waitlist;` and `SELECT * FROM feedback;`
   - Export as CSV

2. **Import to Firestore:**
   - Use the Firebase Admin SDK with Node.js, or
   - Use a Firebase import tool like `firebase-import`
   - Alternatively, manually add important entries through the Firebase Console

## Security Best Practices

1. **Never commit `js/config.js`** - Keep it in `.gitignore`
2. **Use environment-specific configs** - Different configs for dev/staging/prod
3. **Monitor usage** - Set up billing alerts in Firebase Console
4. **Regular security rule audits** - Review and tighten rules as needed
5. **Enable App Check** (optional) - Protect against abuse with Firebase App Check

## Next Steps

- Set up Firebase Authentication if you need admin access
- Add Firebase Analytics to track user behavior
- Set up Cloud Functions for server-side operations (like sending emails on new submissions)
- Configure Firebase Hosting for your website deployment

## Support

If you encounter issues:
- Check [Firebase Documentation](https://firebase.google.com/docs/firestore)
- Visit [Firebase Support](https://firebase.google.com/support)
- Review the browser console for specific error messages

---

**Migration Complete! 🎉**

Your RekoGen website is now using Firebase instead of Supabase. No more paused projects!

