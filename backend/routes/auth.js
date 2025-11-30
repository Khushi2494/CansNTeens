const express = require('express');
const User = require('../models/User');
const { generateToken, generatePin } = require('../utils/auth');
const nodemailer = require('nodemailer');

const router = express.Router();

// Email transporter (configure with your email service)
let transporter = null;

if (process.env.EMAIL_USER && process.env.EMAIL_PASSWORD) {
  transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASSWORD,
    },
  });
} else {
  console.warn('⚠️  Email credentials not configured. Email sending will not work.');
  console.warn('⚠️  Configure EMAIL_USER and EMAIL_PASSWORD in .env file.');
}

// Request PIN (initiate verification)
router.post('/request-pin', async (req, res) => {
  try {
    const { email, name, rollNumber, dob } = req.body;

    if (!email || !name || !rollNumber) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    // Find or create user
    let user = await User.findOne({ email });
    if (!user) {
      user = new User({ email, name, rollNumber, dob });
    } else {
      user.name = name;
      user.dob = dob;
    }

    // Generate 6-digit PIN
    const pin = generatePin();
    const pinExpiry = new Date(Date.now() + 15 * 60 * 1000); // 15 minutes

    user.verificationPin = pin;
    user.pinExpiry = pinExpiry;
    await user.save();

    // Send email
    if (transporter) {
      await transporter.sendMail({
        to: email,
        subject: 'Your Cans & Teens Verification PIN',
        html: `
          <h2>Cans & Teens - Verification PIN</h2>
          <p>Hi ${name},</p>
          <p>Your verification PIN is: <strong>${pin}</strong></p>
          <p>This PIN will expire in 15 minutes.</p>
          <p>Use this PIN to complete your verification and start ordering!</p>
        `,
      });
      res.json({ message: 'PIN sent to email', email });
    } else {
      console.log(`📌 Test PIN for ${email}: ${pin}`);
      res.json({ message: 'PIN generated (email not configured)', email, testPin: pin });
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Verify PIN
router.post('/verify-pin', async (req, res) => {
  try {
    const { email, pin } = req.body;

    if (!email || !pin) {
      return res.status(400).json({ error: 'Missing email or PIN' });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Check PIN and expiry
    if (user.verificationPin !== pin) {
      return res.status(400).json({ error: 'Invalid PIN' });
    }

    if (new Date() > user.pinExpiry) {
      return res.status(400).json({ error: 'PIN expired' });
    }

    // Mark as verified
    user.verified = true;
    user.verificationPin = null;
    user.pinExpiry = null;
    await user.save();

    // Generate token
    const token = generateToken(user._id);

    res.json({ message: 'Verification successful', token, user: { id: user._id, email: user.email, name: user.name } });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
