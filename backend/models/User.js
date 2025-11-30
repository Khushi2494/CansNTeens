const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  email: { type: String, unique: true, required: true, lowercase: true },
  name: { type: String, required: true },
  rollNumber: { type: String, unique: true, required: true },
  dob: { type: Date },
  phone: { type: String },
  password: { type: String }, // optional for email-based auth
  verified: { type: Boolean, default: false },
  verificationPin: { type: String }, // temporary PIN
  pinExpiry: { type: Date },
  role: { type: String, enum: ['student', 'admin', 'staff'], default: 'student' },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

// Hash password before saving
userSchema.pre('save', async function (next) {
  if (!this.isModified('password') || !this.password) return next();
  try {
    this.password = await bcrypt.hash(this.password, 10);
    next();
  } catch (err) {
    next(err);
  }
});

// Compare password method
userSchema.methods.comparePassword = async function (plainPassword) {
  return await bcrypt.compare(plainPassword, this.password);
};

module.exports = mongoose.model('User', userSchema);
