javascript
// routes/auth.js
// Signup, Login aur Google Login routes

const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const https = require('https');
const db = require('../db/db');
require('dotenv').config();

// ==========================================
// HELPER: JWT TOKEN GENERATE KARNA
// ==========================================
function generateToken(user) {
  return jwt.sign(
    {
      id: user.id,
      email: user.email,
      name: user.name
    },
    process.env.JWT_SECRET,
    {
      expiresIn: process.env.JWT_EXPIRES_IN || '7d'
    }
  );
}

// ==========================================
// SIGNUP ROUTE
// POST /api/auth/signup
// ==========================================
router.post('/signup', async (req, res) => {
  try {
    const {
      name,
      email,
      password,
      skillsOffered,
      skillsWanted
    } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Name, email aur password zaroori hain.'
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        message: 'Password kam se kam 6 characters ka hona chahiye.'
      });
    }

    const normalizedEmail = email.trim().toLowerCase();

    const existingUser = db
      .get('users')
      .find({ email: normalizedEmail })
      .value();

    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: 'Yeh email already registered hai.'
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = {
      id: Date.now().toString(),
      name: name.trim(),
      email: normalizedEmail,
      password: hashedPassword,
      skillsOffered: skillsOffered || [],
      skillsWanted: skillsWanted || [],
      bio: '',
      location: '',
      availability: [],
      rating: 0,
      createdAt: new Date().toISOString()
    };

    db.get('users').push(newUser).write();

    const token = generateToken(newUser);

    const { password: pwd, ...userWithoutPassword } = newUser;

    return res.status(201).json({
      success: true,
      message: 'Account successfully ban gaya!',
      token,
      user: userWithoutPassword
    });

  } catch (err) {
    console.error('Signup error:', err);

    return res.status(500).json({
      success: false,
      message: 'Server me kuch gadbad hui. Try again.'
    });
  }
});

// ==========================================
// NORMAL LOGIN ROUTE
// POST /api/auth/login
// ==========================================
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Email aur password zaroori hain.'
      });
    }

    const normalizedEmail = email.trim().toLowerCase();

    const user = db
      .get('users')
      .find({ email: normalizedEmail })
      .value();

    if (!user || !user.password) {
      return res.status(401).json({
        success: false,
        message: 'Email ya password galat hai.'
      });
    }

    const isPasswordValid = await bcrypt.compare(
      password,
      user.password
    );

    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: 'Email ya password galat hai.'
      });
    }

    const token = generateToken(user);

    const { password: pwd, ...userWithoutPassword } = user;

    return res.status(200).json({
      success: true,
      message: 'Login successful!',
      token,
      user: userWithoutPassword
    });

  } catch (err) {
    console.error('Login error:', err);

    return res.status(500).json({
      success: false,
      message: 'Server me kuch gadbad hui. Try again.'
    });
  }
});

// ==========================================
// GOOGLE ID TOKEN VERIFICATION HELPER
// ==========================================
function verifyGoogleCredential(credential) {
  return new Promise((resolve, reject) => {
    const url =
      'https://oauth2.googleapis.com/tokeninfo?id_token=' +
      encodeURIComponent(credential);

    const request = https.get(url, (response) => {
      let data = '';

      response.on('data', (chunk) => {
        data += chunk;
      });

      response.on('end', () => {
        let googleUser;

        try {
          googleUser = JSON.parse(data);
        } catch (err) {
          return reject(new Error('Invalid response from Google'));
        }

        if (response.statusCode !== 200) {
          return reject(new Error('Google credential verification failed'));
        }

        resolve(googleUser);
      });
    });

    request.setTimeout(10000, () => {
      request.destroy(new Error('Google verification timed out'));
    });

    request.on('error', reject);
  });
}

// ==========================================
// GOOGLE LOGIN ROUTE
// POST /api/auth/google
// ==========================================
router.post('/google', async (req, res) => {
  try {
    const { credential } = req.body || {};
    const clientId = process.env.GOOGLE_CLIENT_ID;

    if (!clientId) {
      console.error('GOOGLE_CLIENT_ID is missing in backend environment');

      return res.status(500).json({
        success: false,
        message: 'Google Login configuration missing on server.'
      });
    }

    if (!credential || typeof credential !== 'string') {
      return res.status(400).json({
        success: false,
        message: 'Google credential is required.'
      });
    }

    const googleUser = await verifyGoogleCredential(credential);

    const validIssuers = [
      'accounts.google.com',
      'https://accounts.google.com'
    ];

    if (
      googleUser.aud !== clientId ||
      !validIssuers.includes(googleUser.iss) ||
      googleUser.email_verified !== 'true' ||
      !googleUser.email ||
      !googleUser.sub ||
      Number(googleUser.exp) <= Math.floor(Date.now() / 1000)
    ) {
      return res.status(401).json({
        success: false,
        message: 'Google account verification failed.'
      });
    }

    const normalizedEmail = googleUser.email.trim().toLowerCase();

    let user = db
      .get('users')
      .find({ email: normalizedEmail })
      .value();

    if (!user) {
      user = {
        id: Date.now().toString(),
        name: googleUser.name || normalizedEmail.split('@')[0],
        email: normalizedEmail,
        googleId: googleUser.sub,
        skillsOffered: [],
        skillsWanted: [],
        bio: '',
        location: '',
        availability: [],
        rating: 0,
        createdAt: new Date().toISOString()
      };

      db.get('users').push(user).write();

    } else if (!user.googleId) {
      // Link a verified Google identity to the existing email account.
      // Existing password is preserved.
      db.get('users')
        .find({ id: user.id })
        .assign({ googleId: googleUser.sub })
        .write();

      user = db
        .get('users')
        .find({ id: user.id })
        .value();
    }

    const token = generateToken(user);

    const { password: pwd, ...userWithoutPassword } = user;

    return res.status(200).json({
      success: true,
      message: 'Google Login successful!',
      token,
      user: userWithoutPassword
    });

  } catch (err) {
    console.error('Google Login error:', err.message);

    return res.status(401).json({
      success: false,
      message: 'Google Login verification failed. Please try again.'
    });
  }
});

// ==========================================
// EXPORT ROUTER
// ==========================================
module.exports = router;
```
