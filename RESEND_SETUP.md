# Resend Email Setup Guide

## 🚀 Quick Setup

### 1. Create Resend Account
- Go to [resend.com](https://resend.com)
- Sign up for free account (10,000 emails/month)
- Verify your email

### 2. Add Your Domain
1. In Resend dashboard → **Domains**
2. Click **Add Domain**
3. Add: `rekogen.app`
4. Follow DNS setup instructions

### 3. Get API Key
1. Go to **API Keys** in dashboard
2. Click **Create API Key**
3. Name: "RekoGen Website"
4. Copy the key (starts with `re_`)

### 4. Update Website
1. Open `js/main.js`
2. Find line with `RESEND_API_KEY`
3. Replace `re_YOUR_API_KEY_HERE` with your actual key

## 📧 Email Features

### ✅ Waitlist Welcome Emails
- Sent automatically when someone joins waitlist
- Professional welcome message with app features
- Includes unsubscribe link

### ✅ Contact Form Notifications
- Sent to you when someone contacts you
- Includes all form details (name, email, feedback type, message)
- Direct reply button to respond quickly

## 🔧 Configuration

### Current Settings:
```javascript
const RESEND_API_KEY = 're_YOUR_API_KEY_HERE'; // ← Replace this
const FROM_EMAIL = 'hello@rekogen.app'; // Your verified domain
```

### Email Templates:
- **Welcome Email**: Sent to waitlist subscribers
- **Notification Email**: Sent to you for contact form submissions

## 🛡️ Security Notes
- API key is visible in client-side code (normal for Resend)
- Consider using environment variables for production
- Resend has built-in rate limiting and spam protection

## 📊 Monitoring
- Check Resend dashboard for delivery status
- Monitor email analytics and bounce rates
- Set up webhooks for advanced tracking (optional)

## 🆘 Troubleshooting
- **Emails not sending**: Check API key and domain verification
- **Spam folder**: Ensure proper DNS records are set
- **Rate limits**: Free tier allows 10,000 emails/month

## 🎯 Next Steps
1. Replace API key in `js/main.js`
2. Test waitlist form submission
3. Test contact form submission
4. Monitor email delivery in Resend dashboard
