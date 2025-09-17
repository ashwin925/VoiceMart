# Firebase Setup Guide for VoiceCart

## 1. Create Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click "Create a project"
3. Enter project name: `voicecart` (or your preferred name)
4. Enable Google Analytics (optional)
5. Click "Create project"

## 2. Enable Authentication

1. In Firebase Console, go to "Authentication" > "Sign-in method"
2. Enable "Google" sign-in provider
3. Add your domain to authorized domains if deploying

## 3. Create Firestore Database

1. Go to "Firestore Database" > "Create database"
2. Choose "Start in test mode" (we'll update rules later)
3. Select your preferred location
4. Click "Done"

## 4. Enable Storage

1. Go to "Storage" > "Get started"
2. Choose "Start in test mode"
3. Select same location as Firestore
4. Click "Done"

## 5. Get Firebase Configuration

1. Go to Project Settings (gear icon)
2. Scroll down to "Your apps"
3. Click "Web" icon to add web app
4. Register app with name "VoiceCart"
5. Copy the configuration object

## 6. Update Firebase Config

Replace the placeholder values in `src/lib/firebase.ts` with your actual config:

```typescript
const firebaseConfig = {
  apiKey: "AIzaSyCKvN8c3g3bvvfQqS5F7VuIb_LT2Piz37o",
  authDomain: "gen-lang-client-0185007753.firebaseapp.com",
  projectId: "gen-lang-client-0185007753",
  storageBucket: "gen-lang-client-0185007753.firebasestorage.app",
  messagingSenderId: "148466751338",
  appId: "1:148466751338:web:050d548c9eab57e8923713"
};
```

## 7. Deploy Security Rules

### Firestore Rules
1. In Firebase Console, go to "Firestore Database" > "Rules"
2. Replace the default rules with content from `firestore.rules`
3. Click "Publish"

### Storage Rules
1. Go to "Storage" > "Rules"
2. Replace the default rules with content from `storage.rules`
3. Click "Publish"

## 8. Set Admin Users

Update the admin emails in `src/services/firebase.ts`:

```typescript
const adminEmails = ['your-admin-email@gmail.com', 'another-admin@gmail.com'];
```

## 9. Optional: Firebase CLI Setup

For advanced features and deployment:

```bash
npm install -g firebase-tools
firebase login
firebase init
```

Select:
- Firestore
- Storage
- Hosting (for deployment)

## 10. Environment Variables (Optional)

For better security, you can use environment variables:

Create `.env.local`:
```
VITE_FIREBASE_API_KEY="AIzaSyCKvN8c3g3bvvfQqS5F7VuIb_LT2Piz37o"
VITE_FIREBASE_AUTH_DOMAIN="gen-lang-client-0185007753.firebaseapp.com"
VITE_FIREBASE_PROJECT_ID="gen-lang-client-0185007753"
VITE_FIREBASE_STORAGE_BUCKET="gen-lang-client-0185007753.firebasestorage.app"
VITE_FIREBASE_MESSAGING_SENDER_ID="148466751338"
VITE_FIREBASE_APP_ID="1:148466751338:web:050d548c9eab57e8923713"
```

Then update `firebase.ts` to use these variables:
```typescript
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID
};
```

## Testing

After setup, you should be able to:
- Sign in with Google
- View products and categories (once added via admin)
- Access admin dashboard (if your email is in admin list)

## Troubleshooting

- **Auth errors**: Check if Google sign-in is enabled and domain is authorized
- **Permission errors**: Verify Firestore rules are deployed correctly
- **Storage errors**: Check Storage rules and bucket configuration
- **Admin access**: Ensure your email is in the admin list and you've signed in at least once
