# 🔥 Firebase Setup Guide

## Step 1: Create Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click "Create a project" or "Add project"
3. Enter a project name (e.g., "devprofilehub")
4. Choose whether to enable Google Analytics (optional)
5. Click "Create project"

## Step 2: Add Web App

1. In your Firebase project dashboard, click the web icon (</>) 
2. Register your app with a nickname (e.g., "DevProfile Hub Web")
3. Check "Also set up Firebase Hosting" if you want to deploy later
4. Click "Register app"

## Step 3: Copy Configuration

After registering, you'll see a config object like this:

```javascript
const firebaseConfig = {
  apiKey: "AIzaSyC...",
  authDomain: "your-project.firebaseapp.com",
  projectId: "your-project",
  storageBucket: "your-project.appspot.com",
  messagingSenderId: "123456789",
  appId: "1:123456789:web:abc123"
};
```

## Step 4: Update Environment Variables

Replace the values in `client/.env` with your actual Firebase config:

```env
REACT_APP_FIREBASE_API_KEY=AIzaSyC... (your actual API key)
REACT_APP_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
REACT_APP_FIREBASE_PROJECT_ID=your-project
REACT_APP_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
REACT_APP_FIREBASE_MESSAGING_SENDER_ID=123456789
REACT_APP_FIREBASE_APP_ID=1:123456789:web:abc123
```

## Step 5: Enable Authentication

1. In Firebase Console, go to "Authentication" in the left sidebar
2. Click "Get started"
3. Go to "Sign-in method" tab
4. Enable "Google" provider:
   - Click "Google"
   - Enable it
   - Add your support email
   - Save
5. Enable "Email/Password" provider:
   - Click "Email/Password"
   - Enable it
   - Save

## Step 6: Test the Setup

After updating the .env file, restart your development server:

```bash
cd /Users/kanikasunaria/Desktop/devprofilehub
npm run dev
```

Your login should now work! 🎉

## Troubleshooting

- **"Invalid API key" error**: Make sure you copied the entire API key correctly
- **Google login not working**: Ensure Google provider is enabled in Firebase Authentication
- **Email/password not working**: Make sure Email/Password provider is enabled
- **Environment variables not loading**: Restart your development server after updating .env 