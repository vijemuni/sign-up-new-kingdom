const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const { sendPasswordResetEmail } = require('../utils/email');
const { OAuth2Client } = require('google-auth-library');

const client = new OAuth2Client('235071139511-niq7c3q10ed53cus5gbbji0u63ghgput.apps.googleusercontent.com');

router.post('/signup', async (req, res) => {
  try {
    const { name, email, password } = req.body;
    let user = await User.findByEmail(email);
    if (user) {
      return res.status(400).json({ msg: 'User already exists' });
    }

    const userId = await User.create(name, email, password);
    const token = jwt.sign({ userId }, 'your_jwt_secret_here', { expiresIn: '1h' });
    res.json({ token, redirect: '/' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findByEmail(email);
    if (!user) {
      return res.status(400).json({ msg: 'Invalid credentials' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ msg: 'Invalid credentials' });
    }

    const token = jwt.sign({ userId: user.id }, 'your_jwt_secret_here', { expiresIn: '1h' });
    res.json({ token, redirect: 'https://www.google.com' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// ... (previous code remains the same)

router.post('/forgot-password', async (req, res) => {
    try {
      const { email } = req.body;
      const user = await User.findByEmail(email);
      if (!user) {
        return res.status(404).json({ msg: 'User not found' });
      }
  
      const resetCode = Math.random().toString(36).slice(-8);
      await User.storeResetCode(email, resetCode);
  
      await sendPasswordResetEmail(email, resetCode);
      res.json({ msg: 'Password reset code sent' });
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server error');
    }
  });
  
  router.post('/verify-reset-code', async (req, res) => {
    try {
      const { email, resetCode } = req.body;
      const user = await User.verifyResetCode(email, resetCode);
      if (!user) {
        return res.status(400).json({ msg: 'Invalid or expired reset code' });
      }
      res.json({ msg: 'Reset code verified' });
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server error');
    }
  });
  
  router.post('/reset-password', async (req, res) => {
    try {
      const { email, resetCode, newPassword } = req.body;
      const user = await User.verifyResetCode(email, resetCode);
      if (!user) {
        return res.status(400).json({ msg: 'Invalid or expired reset code' });
      }
  
      await User.updatePassword(user.id, newPassword);
      res.json({ msg: 'Password updated successfully' });
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server error');
    }
  });
  
  // ... (remaining code stays the same)

router.post('/google', async (req, res) => {
  try {
    const { token } = req.body;
    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: '235071139511-niq7c3q10ed53cus5gbbji0u63ghgput.apps.googleusercontent.com'
    });
    const { name, email } = ticket.getPayload();

    let user = await User.findByEmail(email);
    if (!user) {
      const userId = await User.create(name, email, Math.random().toString(36).slice(-8));
      user = { id: userId };
    }

    const jwtToken = jwt.sign({ userId: user.id }, 'your_jwt_secret_here', { expiresIn: '1h' });
    res.json({ token: jwtToken, redirect: 'https://www.google.com' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

module.exports = router;