const functions = require('firebase-functions');
const admin = require('firebase-admin');
const sgMail = require('@sendgrid/mail');
const bcrypt = require('bcryptjs');

admin.initializeApp();

// Read SendGrid config from `functions.config()` (recommended) with a process.env fallback.
// Set via: `firebase functions:config:set sendgrid.key="KEY" sendgrid.from="no-reply@domain"`
const functionsConfig = functions.config ? functions.config().sendgrid : null;
const SENDGRID_API_KEY = functionsConfig?.key || process.env.SENDGRID_API_KEY || null;
const SENDGRID_FROM = functionsConfig?.from || process.env.SENDGRID_FROM || 'no-reply@yourdomain.com';

if (SENDGRID_API_KEY) {
  sgMail.setApiKey(SENDGRID_API_KEY);
} else {
  console.warn('SendGrid API key not configured. Set with `firebase functions:config:set sendgrid.key="YOUR_KEY" sendgrid.from="SENDER_EMAIL"`');
}

// When a verification request is created, generate a PIN, hash it and send email via SendGrid
exports.onVerificationRequest = functions.firestore
  .document('verificationRequests/{requestId}')
  .onCreate(async (snap, context) => {
    const data = snap.data();
    if (!data) return null;
    const requestRef = snap.ref;

    try {
      const pin = Math.floor(100000 + Math.random() * 900000).toString(); // 6-digit PIN
      const salt = bcrypt.genSaltSync(10);
      const pinHash = bcrypt.hashSync(pin, salt);

      await requestRef.update({ pinHash, status: 'pin_sent', sentAt: admin.firestore.FieldValue.serverTimestamp() });

      if (!SENDGRID_API_KEY) {
        console.warn('Skipping email send: SENDGRID_API_KEY not configured. PIN:', pin);
        return null;
      }

      const msg = {
        to: data.email,
        from: SENDGRID_FROM,
        subject: 'Cans & Teens — Verification PIN',
        text: `Hello ${data.name || ''},\n\nYour verification PIN is: ${pin}\nIt expires in 15 minutes.\n\nIf you didn't request this, ignore this message.`,
        html: `<p>Hello ${data.name || ''},</p><p>Your verification PIN is: <strong>${pin}</strong></p><p>It expires in 15 minutes.</p>`
      };

      await sgMail.send(msg);
      return null;
    } catch (err) {
      console.error('Error in onVerificationRequest:', err);
      await requestRef.update({ status: 'error', errorMessage: err.message });
      return null;
    }
  });

// HTTP endpoint to verify PIN. Expects JSON { requestId, pin }
exports.verifyPin = functions.https.onRequest(async (req, res) => {
  if (req.method !== 'POST') {
    return res.status(405).send({ error: 'Method not allowed' });
  }

  const { requestId, pin } = req.body || {};
  if (!requestId || !pin) return res.status(400).send({ error: 'requestId and pin are required' });

  try {
    const docRef = admin.firestore().collection('verificationRequests').doc(requestId);
    const doc = await docRef.get();
    if (!doc.exists) return res.status(404).send({ error: 'Request not found' });

    const data = doc.data();
    if (!data.pinHash) return res.status(400).send({ error: 'PIN not yet generated' });

    const sentAt = data.sentAt?.toDate ? data.sentAt.toDate() : null;
    const now = new Date();
    if (sentAt && now - sentAt > 15 * 60 * 1000) {
      await docRef.update({ status: 'expired' });
      return res.status(410).send({ error: 'PIN expired' });
    }

    const match = bcrypt.compareSync(pin.toString(), data.pinHash);
    if (!match) return res.status(401).send({ error: 'Invalid PIN' });

    // Mark verified and create a verifiedStudents record
    await docRef.update({ status: 'verified', verifiedAt: admin.firestore.FieldValue.serverTimestamp() });
    const verified = {
      name: data.name || null,
      email: data.email,
      roll: data.roll || null,
      dob: data.dob || null,
      requestId,
      verifiedAt: admin.firestore.FieldValue.serverTimestamp()
    };

    const userRef = await admin.firestore().collection('verifiedStudents').add(verified);

    return res.send({ success: true, userId: userRef.id });
  } catch (err) {
    console.error('verifyPin error:', err);
    return res.status(500).send({ error: 'Internal server error' });
  }
});
