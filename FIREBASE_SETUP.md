# Firebase Setup Guide for PAP (Prediction Accountability Platform)

## Overview
Your project now uses Firebase Realtime Database to store claims and claimants globally. All data will sync across devices and browsers.

## Step 1: Create a Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click **"Create a project"**
3. Enter your project name (e.g., "pap-database")
4. Choose your location
5. Click **"Create Project"** (wait for it to complete)

## Step 2: Set Up Realtime Database

1. In the Firebase Console, click **"Build"** in the left menu
2. Select **"Realtime Database"**
3. Click **"Create Database"**
4. Choose your location
5. Start in **"Test mode"** (for development)
   - ⚠️ **Important**: Change to "Production mode" before going live
6. Click **"Enable"**

## Step 3: Get Your Firebase Configuration

1. In Firebase Console, go to **Project Settings** (gear icon)
2. Click the **"General"** tab
3. Scroll down to find your web app configuration
4. If you don't have a web app yet:
   - Click on **"<>"** icon to create a new web app
   - Name it "PAP"
   - Click **"Register app"**
5. Copy your configuration values

### Your configuration should look like:
```javascript
{
  apiKey: "AIza...",
  authDomain: "your-project.firebaseapp.com",
  projectId: "your-project-id",
  storageBucket: "your-project.appspot.com",
  messagingSenderId: "123456789",
  appId: "1:123456789:web:abc123def456",
  databaseURL: "https://your-project.firebasedatabase.app"
}
```

## Step 4: Set Environment Variables

### Local Development:

1. Update `.env.local` with your Firebase values:

```env
API_KEY=YOUR_GEMINI_API_KEY_HERE

# Firebase Configuration
FIREBASE_API_KEY=AIza...
FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
FIREBASE_PROJECT_ID=your-project-id
FIREBASE_STORAGE_BUCKET=your-project.appspot.com
FIREBASE_MESSAGING_SENDER_ID=123456789
FIREBASE_APP_ID=1:123456789:web:abc123def456
FIREBASE_DATABASE_URL=https://your-project.firebasedatabase.app
```

2. Restart your dev server: `npm run dev`

### Vercel Deployment:

1. Go to your Vercel project dashboard
2. Click **"Settings"** → **"Environment Variables"**
3. Add each Firebase variable:
   - **FIREBASE_API_KEY** = `AIza...`
   - **FIREBASE_AUTH_DOMAIN** = `your-project.firebaseapp.com`
   - **FIREBASE_PROJECT_ID** = `your-project-id`
   - **FIREBASE_STORAGE_BUCKET** = `your-project.appspot.com`
   - **FIREBASE_MESSAGING_SENDER_ID** = `123456789`
   - **FIREBASE_APP_ID** = `1:123456789:web:abc123def456`
   - **FIREBASE_DATABASE_URL** = `https://your-project.firebasedatabase.app`
   - **API_KEY** = `YOUR_GEMINI_API_KEY_HERE`

4. Click **"Deploy"** to redeploy with new environment variables

## Step 5: Configure Firebase Security Rules (Optional but Recommended)

### For Public Access (Development):
Go to **Realtime Database** → **Rules** tab and replace with:

```json
{
  "rules": {
    "pap": {
      ".read": true,
      ".write": true
    }
  }
}
```

### For Production (Recommended):
Add authentication before using. For now, restrict to logged-in users:

```json
{
  "rules": {
    "pap": {
      ".read": "auth != null",
      ".write": "auth != null"
    }
  }
}
```

## Step 6: Test Locally

1. Start your dev server:
   ```bash
   npm run dev
   ```

2. Open http://localhost:3000/

3. Add a new claim

4. Open the [Firebase Console](https://console.firebase.google.com/) and go to **Realtime Database**

5. You should see the data appearing under `pap/claims/` and `pap/claimants/`

## Step 7: Deploy to Vercel

1. Commit your changes:
   ```bash
   git add .
   git commit -m "Add Firebase support for cloud data persistence"
   git push origin main
   ```

2. Vercel will auto-deploy

3. Test the live site: https://paproject.vercel.app/

4. Add a claim on your deployed site

5. Open another browser or device and visit the same URL

6. You should see all claims synced across devices! ✅

## Troubleshooting

### "Data not syncing to Firebase"
- Check that all `FIREBASE_*` environment variables are set correctly
- Check Firebase Console for error messages in **Realtime Database** → **Rules**
- Open browser DevTools Console (F12) and look for errors

### "Can't connect to Realtime Database"
- Make sure you created a Realtime Database (not Firestore)
- Check that `databaseURL` is correct in your Firebase config
- Verify your database is not in "Strict mode"

### "Missing API_KEY for Gemini"
- Make sure you set `API_KEY` in environment variables
- Get your key from [Google AI Studio](https://ai.google.dev/begin)

### "Still only seeing 3 demo claims"
- Clear browser cache (Ctrl+Shift+Delete)
- Check DevTools Console for errors
- Verify Firebase config in `.env.local` or Vercel settings

## Data Structure

Your data is stored at:
```
pap/
├── claims/
│   ├── 1
│   ├── 2
│   └── ...
└── claimants/
    ├── c1
    ├── c2
    └── ...
```

## Important Notes

- **Test Mode vs Production**: Test mode allows unrestricted access. Change to Production mode once you're ready to secure the app
- **Firestore vs Realtime DB**: We use Realtime Database (JSON), not Firestore (NoSQL)
- **Backup**: Your data is automatically backed up by Firebase
- **Real-time Sync**: Multiple users can edit simultaneously and changes sync instantly

## Next Steps

1. ✅ Set up Firebase project
2. ✅ Add environment variables
3. ✅ Deploy to Vercel
4. 🔄 Optionally add user authentication (Firebase Auth)
5. 🔄 Optionally add role-based access control

Happy coding! 🚀
