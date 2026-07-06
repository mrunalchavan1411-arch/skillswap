// routes/messages.js
// Chat messages ka REST API - history fetch karne ke liye
// Real-time delivery Socket.io (server.js me) se hoti hai

const express = require('express');
const router = express.Router();
const db = require('../db/db');
const authMiddleware = require('../middleware/auth');

// ========== GET CHAT HISTORY between two users ==========
// GET /api/messages/:partnerId
router.get('/:partnerId', authMiddleware, (req, res) => {
  const { partnerId } = req.params;
  const myId = req.user.id;

  const messages = db.get('messages').value().filter(m =>
    (m.senderId === myId && m.receiverId === partnerId) ||
    (m.senderId === partnerId && m.receiverId === myId)
  );

  // Time ke hisaab se sort - purane pehle, naye baad me
  messages.sort(
  (a, b) => new Date(a.createdAt || a.timestamp) - new Date(b.createdAt || b.timestamp)
);

  res.json({ success: true, messages });
});

// ========== GET ALL MY CONVERSATIONS (list of people I've chatted with) ==========
// GET /api/messages/conversations/list
router.get('/conversations/list', authMiddleware, (req, res) => {
  const myId = req.user.id;
  const allMessages = db.get('messages').value();

  const partnerIds = new Set();
  allMessages.forEach(m => {
    if (m.senderId === myId) partnerIds.add(m.receiverId);
    if (m.receiverId === myId) partnerIds.add(m.senderId);
  });

  const conversations = Array.from(partnerIds).map(pid => {
    const partner = db.get('users').find({ id: pid }).value();
    const lastMsg = allMessages
      .filter(m => (m.senderId === pid && m.receiverId === myId) || (m.senderId === myId && m.receiverId === pid))
      .sort(
  (a, b) => new Date(b.createdAt || b.timestamp) - new Date(a.createdAt || a.timestamp)
)[0];

    return {
      partnerId: pid,
      partnerName: partner ? partner.name : 'Unknown',
      lastMessage: lastMsg ? lastMsg.message : '',
      lastTimestamp: lastMsg ? (lastMsg.createdAt || lastMsg.timestamp) : ''
    };
  });

  res.json({ success: true, conversations });
});

module.exports = router;
