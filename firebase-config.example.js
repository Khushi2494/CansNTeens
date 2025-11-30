// Copy this file to `firebase-config.js` and fill in your project's values.
// This file is loaded by the HTML page. Do NOT commit real credentials to git.

// Example (replace with your own values from the Firebase console):
const firebaseConfig = {
  apiKey: "YOUR_FIREBASE_API_KEY",
  authDomain: "your-project-id.firebaseapp.com",
  projectId: "your-project-id",
  storageBucket: "your-project-id.appspot.com",
  messagingSenderId: "1234567890",
  appId: "1:1234567890:web:abcdef123456",
  // Optional: functions region used to construct callable URL in the client
  functionsRegion: "us-central1"
};

// Initialize Firebase (compat SDK is included by the HTML page)
if (typeof firebase !== 'undefined' && firebase && !firebase.apps?.length) {
  firebase.initializeApp(firebaseConfig);
}

// Export to window so client scripts can read projectId and region
window.firebaseConfig = firebaseConfig;

/*
Setup notes:
- Create a file `firebase-config.js` (NOT committed to source control) and paste your real values.
- The client uses `firebaseConfig.projectId` and `firebaseConfig.functionsRegion` to call the verification cloud function.
- To send emails you need to deploy the Cloud Functions included in `/functions` and set the environment variable
  `SENDGRID_API_KEY` and `SENDGRID_FROM` (sender email) before deploying.
*/
