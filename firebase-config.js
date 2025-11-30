// IMPORTANT: This file contains placeholders only.
// Copy this file into your local environment and replace the values with
// the values from your Firebase console. Do NOT commit real credentials to git.

const firebaseConfig = {
  apiKey: "REPLACE_WITH_YOUR_API_KEY",
  authDomain: "REPLACE_WITH_YOUR_PROJECT.firebaseapp.com",
  projectId: "REPLACE_WITH_YOUR_PROJECT",
  storageBucket: "REPLACE_WITH_YOUR_PROJECT.appspot.com",
  messagingSenderId: "REPLACE_WITH_MESSAGING_SENDER_ID",
  appId: "REPLACE_WITH_YOUR_APP_ID",
  // Region where your functions are deployed. Keep in sync with your functions deploy region.
  functionsRegion: "us-central1"
};

if (typeof firebase !== 'undefined' && firebase && !firebase.apps?.length) {
  firebase.initializeApp(firebaseConfig);
}

window.firebaseConfig = firebaseConfig;

/* Quick steps:
1. Copy this file to `firebase-config.js` in the project root (this file is already added here as a placeholder).
2. Replace each value above with those from the Firebase console (Project settings).
3. Keep `functionsRegion` equal to the region you will deploy cloud functions to.

Security note: keep this file out of source control when it contains real API keys. Use environment-specific secrets for production.
*/
