 
const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');

router.get('/', (req, res) => {
  res.render('login');
});

router.get('/signup', (req, res) => {
  res.render('signup');
});

router.get('/forgot-password', (req, res) => {
  res.render('forgot-password');
});

router.get('/reset-password/:token', (req, res) => {
  res.render('reset-password', { token: req.params.token });
});

router.get('/dashboard', auth, (req, res) => {
  res.send('Welcome to the dashboard!');
});

module.exports = router;