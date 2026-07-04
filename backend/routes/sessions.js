// routes/sessions.js
// Session booking aur scheduling ka logic

const express = require('express');
const router = express.Router();
const db = require('../db/db');
const authMiddleware = require('../middleware/auth');

// ========== CREATE SESSION (Book a session) ==========
// POST /api/sessions
router.post('/', authMiddleware, (req, res) => {
  try {
    const { partnerId, skill, date, time, mode } = req.body;

    if (!partnerId || !skill || !date || !time) {
      return res.status(400).json({ success: false, message: 'Saari details bharo - partner, skill, date, time.' });
    }

    const partner = db.get('users').find({ id: partnerId }).value();
    if (!partner) {
      return res.status(404).json({ success: false, message: 'Partner user nahi mila.' });
    }

    const newSession = {
      id: Date.now().toString(),
      userId: req.user.id,
      userName: req.user.name,
      partnerId,
      partnerName: partner.name,
      skill,
      date,
      time,
      mode: mode || 'online',
      status: 'pending',
      createdAt: new Date().toISOString()
    };

    db.get('sessions').push(newSession).write();

    res.status(201).json({ success: true, message: 'Session book ho gaya!', session: newSession });
  } catch (err) {
    console.error('Create session error:', err);
    res.status(500).json({ success: false, message: 'Server error.' });
  }
});

// ========== GET MY SESSIONS ==========
// GET /api/sessions/my
router.get('/my', authMiddleware, (req, res) => {
  const sessions = db.get('sessions').value().filter(
    s => s.userId === req.user.id || s.partnerId === req.user.id
  );
  sessions.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

  res.json({ success: true, sessions });
});

// ========== UPDATE SESSION STATUS ==========
// PUT /api/sessions/:id/status
router.put('/:id/status', authMiddleware, (req, res) => {
  try {
    const { status } = req.body;
    const validStatuses = ['pending', 'confirmed', 'completed', 'cancelled'];

    if (!validStatuses.includes(status)) {
      return res.status(400).json({ success: false, message: 'Invalid status.' });
    }

    const session = db.get('sessions').find({ id: req.params.id });

    if (!session.value()) {
      return res.status(404).json({ success: false, message: 'Session nahi mila.' });
    }

    session.assign({ status }).write();

    res.json({ success: true, message: 'Session status update ho gaya.', session: session.value() });
  } catch (err) {
    console.error('Update session error:', err);
    res.status(500).json({ success: false, message: 'Server error.' });
  }
});

// ========== DELETE SESSION ==========
// DELETE /api/sessions/:id
router.delete('/:id', authMiddleware, (req, res) => {
  db.get('sessions').remove({ id: req.params.id }).write();
  res.json({ success: true, message: 'Session cancel ho gaya.' });
});

module.exports = router;
