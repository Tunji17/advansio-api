const mongoose = require('mongoose');
const { randomBytes, pbkdf2Sync } = require('crypto');
const { sign } = require('jsonwebtoken');
const config = require('../config');

const UserSchema = new mongoose.Schema({
  name: {
    type: String, lowercase: true, trim: true, required: 'Please provide your name'
  },
  email: { type: String, trim: true },
  hash: String,
  salt: String,
  blocked: { type: Boolean, default: false },
}, { timestamps: true });

UserSchema.index({
  name: 1,
  email: 1,
});

UserSchema.index({
  name: 'text',
  email: 'text',
});

UserSchema.methods.setPassword = function userPassword(password) {
  this.salt = randomBytes(16).toString('hex');
  this.hash = pbkdf2Sync(password, this.salt, 100, 64, 'sha512').toString('hex');
};

UserSchema.methods.verifyPassword = function verify(password) {
  const hash = pbkdf2Sync(password, this.salt, 100, 64, 'sha512').toString('hex');
  return this.hash === hash;
};

UserSchema.methods.generateToken = function token(accountNumber, time = '7d') {
  return sign(
    {
      _id: this._id,
      name: this.name,
      email: this.email,
      accountNumber,
    },
    config.secrect, {
      issuer: 'https://advansio-api',
      expiresIn: time,
    },
  );
};

module.exports = mongoose.model('User', UserSchema);
