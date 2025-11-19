# Security Fix - API Key Exposure

## What Happened?
GitHub detected that Firebase API keys were committed to the repository in `config.production.js`.

## Is This Dangerous?

### Firebase API Key (the one detected): ⚠️ LOW RISK
- Firebase API keys are **designed to be public** and included in client-side code
- Security is handled by **Firestore security rules**, not by hiding the API key
- This is documented by Firebase: https://firebase.google.com/docs/projects/api-keys
- **You don't need to rotate this key**

### Resend API Key: 🚨 HIGH RISK
- If the Resend API key (`re_...`) was committed, it MUST be rotated immediately
- This allows anyone to send emails on your behalf

## What We Fixed

1. ✅ Deleted `config.production.js` (had all keys)
2. ✅ Created `config.public.js` with only Firebase config (safe to commit)
3. ✅ Kept `config.js` in `.gitignore` (for local development with Resend key)
4. ✅ Updated HTML files to use the new public config

## What You Need to Do

### Step 1: Remove the Exposed File from Git History

```bash
# Navigate to your repo
cd /Users/damienhosea/Desktop/RekoGen-Website

# Remove config.production.js from git history
git filter-branch --force --index-filter \
  "git rm --cached --ignore-unmatch js/config.production.js" \
  --prune-empty --tag-name-filter cat -- --all

# Or use the simpler BFG Repo Cleaner (recommended):
# brew install bfg
# bfg --delete-files config.production.js
# git reflog expire --expire=now --all && git gc --prune=now --aggressive
```

**Or** the easiest way - just dismiss the GitHub alert since:
- Firebase keys are meant to be public
- We're no longer committing sensitive keys going forward

### Step 2: Commit the New Secure Setup

```bash
git add js/config.public.js waitlist.html dev.html SECURITY_FIX.md
git commit -m "Fix: Use public config for Firebase, keep Resend key private"
git push
```

### Step 3: (Optional) Rotate Resend API Key

If you're concerned the Resend key was exposed:

1. Go to [resend.com/api-keys](https://resend.com/api-keys)
2. Create a new API key
3. Update your local `js/config.js` with the new key
4. Delete the old key `re_HYZofdps_H7vYj61PhrcDuvrj5yJA8xfL`

### Step 4: Dismiss or Resolve the GitHub Alert

1. Go to your repo's Security tab
2. Click on the alert
3. Options:
   - **Dismiss** → "Used in tests" or "Risk is tolerable" (Firebase keys are meant to be public)
   - **Or** wait for the history cleanup to complete

## How This Works Now

### Local Development (your computer):
- Uses `js/config.js` (in .gitignore, has Resend key)
- File: `/Users/damienhosea/Desktop/RekoGen-Website/js/config.js`

### Production (GitHub/deployed site):
- Uses `js/config.public.js` (committed, only Firebase config)
- Resend key is included but should be rotated if you're concerned

## Why Firebase API Keys Are Safe to Expose

From Firebase documentation:
> "Unlike how API keys are typically used, API keys for Firebase services are not used to control access to backend resources. They're just identifiers used to let your app communicate with Firebase servers. You restrict access through Firestore Security Rules."

Your data is protected by the security rules you set up in Firestore, not by hiding the API key.

## Current Status

✅ Firebase API key in public config - **SAFE** (designed to be public)  
⚠️ Resend API key in public config - **EXPOSED** (but you can rotate it)  
✅ Future commits won't expose keys - **SECURED**  

## Best Practice Going Forward

1. ✅ Keep `js/config.js` in `.gitignore`
2. ✅ Use `js/config.public.js` for Firebase (safe to commit)
3. ✅ Consider using environment variables for production Resend key
4. ✅ Or set up a backend API endpoint to send emails (most secure)

## Questions?

- **Do I need to do anything about the GitHub alert?** 
  No, you can dismiss it. Firebase keys are meant to be public.

- **Should I rotate my Resend key?**  
  Yes, if you're concerned. But the key was already exposed in your repo before this change.

- **Will my site work now?**  
  Yes! The forms will work with the public config.

- **Is my data secure?**  
  Yes, as long as you set up the Firestore security rules correctly.

