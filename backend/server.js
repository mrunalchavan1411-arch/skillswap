// server.js
// Yeh main entry file hai - sab kuch yahi se start hota hai

const express = require('express');
const cors = require('cors');
const path = require('path');
const http = require('http');
const { Server } = require('socket.io');
require('dotenv').config();

const db = require('./db/db');

// Route files import karte hain
const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/users');
const sessionRoutes = require('./routes/sessions');
const messageRoutes = require('./routes/messages');
const uploadRoutes = require('./routes/upload');

const app = express();
const server = http.createServer(app);

// Socket.io setup - real-time chat ke liye
const io = new Server(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST']
  }
});

// ========== MIDDLEWARE ==========
app.use(cors());
app.use(express.json());

// Static uploads folder - profile photos serve karne ke liye
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// ========== ROUTES ==========
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/sessions', sessionRoutes);
app.use('/api/messages', messageRoutes);
app.use('/api/upload', uploadRoutes);

// Health check route - test karne ke liye ki server chal raha hai
app.get('/api/health', (req, res) => {
  res.json({ success: true, message: 'Server theek se chal raha hai!', timestamp: new Date().toISOString() });
});

// ========== SOCKET.IO - REAL TIME CHAT ==========
// userId -> socketId mapping, taaki pata chale kis user ka konsa connection hai
const onlineUsers = new Map();

io.on('connection', (socket) => {
  console.log('Naya connection aaya:', socket.id);

  // Jab user app khole, wo apni userId register karega
  socket.on('register', (userId) => {
    onlineUsers.set(userId, socket.id);
    console.log(`User ${userId} online hua.`);
  });
  socket.on("send_message", (data) => {
  const newMessage = {
    id: Date.now().toString(),
    senderId: data.senderId,
    receiverId: data.receiverId,
    message: data.message,
    attachment: data.attachment || null,
    timestamp: new Date().toISOString(),
  };

  // Save in database
  db.get("messages").push(newMessage).write();

  // Send to receiver if online
  const receiverSocketId = onlineUsers.get(data.receiverId);

  if (receiverSocketId) {
    io.to(receiverSocketId).emit("receive_message", newMessage);
  }

  // Send back to sender also
  socket.emit("receive_message", newMessage);
});

  // Jab user message bheje
  socket.on('send_message', (data) => {
    const {
  senderId,
  senderName,
  receiverId,
  message,
  attachment
} = data;

    const newMessage = {
  id: Date.now().toString(),
  senderId,
  senderName,
  receiverId,
  message,
  attachment: attachment || null,
  timestamp: new Date().toISOString()
};

    // Database me save karo
    db.get('messages').push(newMessage).write();

    // Agar receiver online hai, to usko turant message bhej do
    const receiverSocketId = onlineUsers.get(receiverId);
    if (receiverSocketId) {
      io.to(receiverSocketId).emit('receive_message', newMessage);
    }

    // Sender ko bhi confirmation wapas bhejo (apne UI update karne ke liye)
    socket.emit('message_sent', newMessage);
  });

  // Jab user disconnect ho
  socket.on('disconnect', () => {
    // Map se us user ko hata do
    for (const [userId, socketId] of onlineUsers.entries()) {
      if (socketId === socket.id) {
        onlineUsers.delete(userId);
        console.log(`User ${userId} offline hua.`);
        break;
      }
    }
  });
});

// ========== SERVER START ==========
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`✅ Server successfully start ho gaya: http://localhost:${PORT}`);
});
