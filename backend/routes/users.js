// routes/users.js
// Profile management aur matching logic yaha hai

const express = require('express');
const router = express.Router();
const db = require('../db/db');
const authMiddleware = require('../middleware/auth');

// ========== GET MY PROFILE ==========
// GET /api/users/me
router.get('/me', authMiddleware, (req, res) => {
  const user = db.get('users').find({ id: req.user.id }).value();
  if (!user) {
    return res.status(404).json({ success: false, message: 'User nahi mila.' });
  }
  const { password, ...userWithoutPassword } = user;
  res.json({ success: true, user: userWithoutPassword });
});

// ========== UPDATE PROFILE ==========
// PUT /api/users/me
router.put('/me', authMiddleware, (req, res) => {
  try {
    const { bio, location, skillsOffered, skillsWanted, availability } = req.body;

    const user = db.get('users').find({ id: req.user.id });

    if (!user.value()) {
      return res.status(404).json({ success: false, message: 'User nahi mila.' });
    }

    user.assign({
      bio: bio !== undefined ? bio : user.value().bio,
      location: location !== undefined ? location : user.value().location,
      skillsOffered: skillsOffered !== undefined ? skillsOffered : user.value().skillsOffered,
      skillsWanted: skillsWanted !== undefined ? skillsWanted : user.value().skillsWanted,
      availability: availability !== undefined ? availability : user.value().availability
    }).write();

    const updatedUser = db.get('users').find({ id: req.user.id }).value();
    const { password, ...userWithoutPassword } = updatedUser;

    res.json({ success: true, message: 'Profile update ho gaya!', user: userWithoutPassword });
  } catch (err) {
    console.error('Update profile error:', err);
    res.status(500).json({ success: false, message: 'Server error.' });
  }
});

// ========== GET ALL USERS (Explore Page) ==========
// GET /api/users/all
router.get('/all', authMiddleware, (req, res) => {
  const users = db.get('users').value()
    .filter(u => u.id !== req.user.id) // apna profile list me nahi dikhana
    .map(({ password, ...rest }) => rest); // password hata kar bhejna

  res.json({ success: true, users });
});

// ========== MATCHING LOGIC ==========
// GET /api/users/matches
// Yeh route current user ke liye saare possible matches dhundta hai
router.get('/matches', authMiddleware, (req, res) => {
  const currentUser = db.get('users').find({ id: req.user.id }).value();

  if (!currentUser) {
    return res.status(404).json({ success: false, message: 'User nahi mila.' });
  }

  const allUsers = db.get('users').value().filter(u => u.id !== currentUser.id);

  const matches = [];

  allUsers.forEach(otherUser => {
    // Check 1: Current user ki "offered" skills me se koi other user ki "wanted" list me hai?
    const iCanTeachThem = currentUser.skillsOffered.filter(skill =>
      otherUser.skillsWanted.some(w => w.toLowerCase() === skill.toLowerCase())
    );

    // Check 2: Other user ki "offered" skills me se koi current user ki "wanted" list me hai?
    const theyCanTeachMe = otherUser.skillsOffered.filter(skill =>
      currentUser.skillsWanted.some(w => w.toLowerCase() === skill.toLowerCase())
    );

    // Match score calculate karte hain - kitne skills match hue
    const matchScore = iCanTeachThem.length + theyCanTeachMe.length;

    if (matchScore > 0) {
      const { password, ...userInfo } = otherUser;
      matches.push({
        user: userInfo,
        iCanTeachThem,      // mai unhe kya sikha sakta hoon
        theyCanTeachMe,     // wo mujhe kya sikha sakte hain
        matchScore,          // jitna zyada score, utna better match
        isPerfectMatch: iCanTeachThem.length > 0 && theyCanTeachMe.length > 0 // dono taraf se match
      });
    }
  });

  // Best matches sabse upar - score ke hisaab se sort
  matches.sort((a, b) => b.matchScore - a.matchScore);

  res.json({ success: true, matches });
});

module.exports = router;
