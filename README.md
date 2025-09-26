# Fetch Rewards MVP – Squads & Leagues

This repository contains a React Native (Expo) MVP for Fetch Rewards that showcases the new **Squads** and **Leagues** experiences. The app is written in TypeScript, styled with NativeWind, and backed by Firebase Authentication and Firestore. Use it to explore receipt-sharing, collaborative goals, and weekly league leaderboards on both iOS and Android via Expo Go.

## ✨ Features
- Email/password authentication backed by Firebase Auth with automatic Firestore profile creation.
- **Squads**: create or join teams, share invite links, split receipt points, manage a shared shopping list, and track progress toward group goals with a playful mascot.
- **Receipt simulator**: quickly award random points and split them across squad members.
- **Weekly challenges** and duel callouts to encourage friendly competition within squads.
- **Leagues**: weekly leaderboards, streak multipliers, promotion highlights, and seasonal countdown messaging.
- Firestore seeding script that creates demo users, squads, and leagues for richer testing data.

## 🧱 Project Structure
```
.
├── App.tsx
├── app.config.ts
├── seed.js
├── src/
│   ├── components/
│   ├── hooks/
│   ├── navigation/
│   ├── screens/
│   ├── services/
│   ├── types/
│   └── utils/
└── tailwind.config.js
```

## 🛠️ Prerequisites
1. **Node.js** (LTS recommended). Install from [nodejs.org](https://nodejs.org/).
2. **Expo CLI** – install globally:
   ```bash
   npm install -g expo-cli
   ```
3. **Firebase project** with:
   - Web app configuration (API key, project ID, etc.).
   - Firestore and Authentication enabled.
4. (Optional for seeding) **Firebase service account JSON** with read/write access to Firestore.

## ⚙️ Setup
1. Clone the repository and install dependencies:
   ```bash
   git clone <repo-url>
   cd fetch-rewards-mvp
   npm install
   ```
2. Create a `.env` file in the project root and populate it with your Firebase keys:
   ```env
   FIREBASE_API_KEY=your-api-key
   FIREBASE_AUTH_DOMAIN=your-app.firebaseapp.com
   FIREBASE_PROJECT_ID=your-project-id
   FIREBASE_STORAGE_BUCKET=your-app.appspot.com
   FIREBASE_MESSAGING_SENDER_ID=...
   FIREBASE_APP_ID=...
   FIREBASE_MEASUREMENT_ID=...
   # Optional for seeding
   FIREBASE_SERVICE_ACCOUNT_PATH=path/to/serviceAccount.json
   ```
   > On Windows, paths can be absolute (`C:\\path\\to\\serviceAccount.json`) or relative to the project directory.

## 🧪 Seeding Firestore Data
Populate your Firestore project with 200 demo users, multiple squads, and league groups.

1. Ensure your service account file is accessible and referenced via `FIREBASE_SERVICE_ACCOUNT_PATH` (or set the `GOOGLE_APPLICATION_CREDENTIALS` environment variable).
2. Run the seeding script:
   ```bash
   npm run seed
   ```
   The script prints progress as it creates user documents, squads, and league groupings.

## 📱 Running the App
1. Start the Expo development server:
   ```bash
   npm start
   ```
2. Press `i` or `a` to open iOS or Android simulators, or scan the QR code using **Expo Go** on your mobile device.
3. Register a new account directly in the app or sign in with seeded credentials that you manually add to Firebase Authentication.

## 🧭 Navigation Overview
- **Auth Stack**: Login and registration screens.
- **Main Tabs**:
  - **Home**: receipt scanning simulator, squad goal snapshot, weekly highlights.
  - **Squad**: squad management, mascot, shopping list, weekly challenges.
  - **League**: weekly leaderboard, promotion summary, reward breakdowns.
  - **Profile**: personal stats, streak tracker, logout.

## ✅ Notes
- All Firebase interactions rely on the configuration exposed via `app.config.ts`. Ensure your `.env` values are present **before** launching the app.
- The seed script creates Firestore documents only; to log in as a seeded user, manually create matching credentials in Firebase Authentication or register through the app and then update the Firestore profile.
- NativeWind powers the `className` styling on React Native components. Tailwind tokens can be extended via `tailwind.config.js`.
- Default Expo icon and splash assets are used so the repository stays binary-free for easier pull requests.

Enjoy exploring the Fetch Rewards Squads & Leagues MVP! 💥
