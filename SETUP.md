Setup & Deployment
==================

This document explains how to configure and deploy the verification Cloud Function and set up the client config.

1) Prepare `firebase-config.js`
 - Copy `firebase-config.example.js` or `firebase-config.js` (placeholder) and fill the values from your Firebase console.
 - Keep this file out of source control when it contains real API keys.

2) Configure SendGrid for outgoing emails
 - Sign up for SendGrid and obtain an API key.
 - Choose a sender email (verify it in SendGrid).

3) Set Functions configuration (recommended)
 - Install Firebase CLI and login:

```bash
npm install -g firebase-tools
firebase login
```

 - Initialize functions if you haven't already (run in repo root):

```bash
firebase init functions
```

 - Set SendGrid config (from repo root):

```bash
firebase functions:config:set sendgrid.key="YOUR_SENDGRID_API_KEY" sendgrid.from="no-reply@yourdomain.com"
```

This stores the SendGrid key in the functions runtime secure config. The Cloud Function reads it with `functions.config().sendgrid.key`.

4) Deploy Cloud Functions
 - Install dependencies and deploy from the `functions` folder:

```bash
cd functions
npm install
cd ..
firebase deploy --only functions
```

5) Hosting / Client
 - Make sure `firebase-config.js` (the one you filled) is available to the client when serving the HTML.
 - The client uses `window.firebaseConfig.projectId` and `functionsRegion` to call the `verifyPin` endpoint.

6) Testing the flow
 - Open the web page, the verification modal appears.
 - Fill in student details and request a PIN.
 - The function (trigger) will generate a PIN and email it via SendGrid.
 - Enter the PIN in the modal and submit. On success the `verifiedStudents` collection will contain the user and the client stores a local marker.

Security / Production notes
 - Use Firestore security rules to protect `verificationRequests` and `verifiedStudents`.
 - Consider using callable functions (`functions.https.onCall`) and Firebase Authentication for stronger flow.
 - Do NOT commit real API keys to the repo. Use environment or secrets management.
