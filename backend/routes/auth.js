// routes/auth.js
// Yeh file Signup aur Login ka pura logic handle karti hai

const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('../db/db');
require('dotenv').config();

// ========== SIGNUP ROUTE ==========
// POST /api/auth/signup
router.post('/signup', async (req, res) => {
  try {
    const { name, email, password, skillsOffered, skillsWanted } = req.body;

    // Validation - zaroori fields check karna
    if (!name || !email || !password) {
      return res.status(400).json({ success: false, message: 'Name, email aur password zaroori hain.' });
    }

    if (password.length < 6) {
      return res.status(400).json({ success: false, message: 'Password kam se kam 6 characters ka hona chahiye.' });
    }

    // Check karo email already exist to nahi karta
console.log("===== SIGNUP DEBUG =====");
console.log("Database users:");
console.log(db.get("users").value());


    const existingUser = db.get('users').find({ email: email.toLowerCase() }).value();
console.log("Existing User:", existingUser);

    if (existingUser) {
      return res.status(409).json({ success: false, message: 'Yeh email already registered hai.' });
    }

    // Password ko hash karna (security ke liye - kabhi plain text store nahi karte)
    const hashedPassword = await bcrypt.hash(password, 10);

    // Naya user object banate hain
    const newUser = {
      id: Date.now().toString(), // unique ID
      name,
      email: email.toLowerCase(),
      password: hashedPassword,
      skillsOffered: skillsOffered || [],   // jo skill sikha sakta hai
      skillsWanted: skillsWanted || [],     // jo skill sikhna chahta hai
      bio: '',
      location: '',
      availability: [],
      rating: 0,
      createdAt: new Date().toISOString()
    };

    // Database me save karna
    db.get('users').push(newUser).write();

    // JWT token generate karna (login ke liye)
    const token = jwt.sign(
      { id: newUser.id, email: newUser.email, name: newUser.name },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN }
    );

    // Password kabhi response me wapas nahi bhejna - security risk
    const { password: pwd, ...userWithoutPassword } = newUser;

    res.status(201).json({
      success: true,
      message: 'Account successfully ban gaya!',
      token,
      user: userWithoutPassword
    });

  } catch (err) {
    console.error('Signup error:', err);
    res.status(500).json({ success: false, message: 'Server me kuch gadbad hui. Try again.' });
  }
});

// ========== LOGIN ROUTE ==========
// POST /api/auth/login
router.post('/login', async (req, res) => {
  try {

    console.log("REQUEST BODY:", req.body);

    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Email aur password zaroori hain.' });
    }

    // User dhundo database me
    const user = db.get('users').find({ email: email.toLowerCase() }).value();

console.log("========== LOGIN DEBUG ==========");
console.log("Email received:", email);
console.log("Email after lowercase:", email.toLowerCase());
console.log("User found:", user);


    if (!user) {
      return res.status(401).json({ success: false, message: 'Email ya password galat hai.' });
    }

    // Password match karo (hashed password ke saath compare)
    const isPasswordValid = await bcrypt.compare(password, user.password);

    console.log("Password match:", isPasswordValid);
console.log("================================");

    if (!isPasswordValid) {
      return res.status(401).json({ success: false, message: 'Email ya password galat hai.' });
    }

    // Token generate karo
    const token = jwt.sign(
      { id: user.id, email: user.email, name: user.name },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN }
    );

    const { password: pwd, ...userWithoutPassword } = user;

    res.status(200).json({
      success: true,
      message: 'Login successful!',
      token,
      user: userWithoutPassword
    });

  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ success: false, message: 'Server me kuch gadbad hui. Try again.' });
  }
});

module.exports = router;
