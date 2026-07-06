// routes/upload.js
// Profile photo upload - multer se file save, path database me store

const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const db = require('../db/db');
const authMiddleware = require('../middleware/auth');

// uploads folder ensure karte hain
const uploadsDir = path.join(__dirname, '..', 'uploads');
if (!fs.existsSync(uploadsDir)) fs.mkdirSync(uploadsDir, { recursive: true });

// Multer storage config - unique filename, only images allowed
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadsDir),
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    cb(null, `avatar_${req.user.id}_${Date.now()}${ext}`);
  },
});

const fileFilter = (req, file, cb) => {
  const allowed = ['.jpg', '.jpeg', '.png', '.webp', '.gif'];
  const ext = path.extname(file.originalname).toLowerCase();
  if (allowed.includes(ext)) cb(null, true);
  else cb(new Error('Sirf image files allowed hain (jpg, png, webp).'), false);
};

const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 4 * 1024 * 1024 }, // 4MB max
});

const chatUpload = multer({
  storage: multer.diskStorage({
    destination: (req, file, cb) => cb(null, uploadsDir),
    filename: (req, file, cb) => {
      const ext = path.extname(file.originalname);
      cb(null, `chat_${Date.now()}${ext}`);
    }
  }),
  limits: {
    fileSize: 10 * 1024 * 1024
  }
});

// POST /api/upload/avatar
router.post('/avatar', authMiddleware, upload.single('avatar'), (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'Koi file nahi mili.' });
    }

    // Purani avatar file delete karna (disk space save ke liye)
    const existingUser = db.get('users').find({ id: req.user.id }).value();
    if (existingUser?.avatar) {
      const oldPath = path.join(uploadsDir, path.basename(existingUser.avatar));
      if (fs.existsSync(oldPath)) {
        try { fs.unlinkSync(oldPath); } catch (e) { /* ignore */ }
      }
    }

    // Path DB me save karte hain
   const avatarPath = `/uploads/${req.file.filename}`;

db.get("users")
  .find({ id: req.user.id })
  .assign({
    avatar: avatarPath
  })
  .write();

const updatedUser = db.get("users")
  .find({ id: req.user.id })
  .value();

console.log("Updated User:", updatedUser);

if (!updatedUser) {
  console.log("User not found. req.user =", req.user);
  console.log("All users =", db.get("users").value());

  return res.status(404).json({
    success: false,
    message: "User not found"
  });
}

if (!updatedUser) {
  return res.status(404).json({
    success: false,
    message: "User not found"
  });
}

const { password, ...userWithoutPassword } = updatedUser;

res.json({
  success: true,
  avatarPath,
  user: userWithoutPassword
});
} catch (err) {
  console.error("Avatar upload error:", err);

  res.status(500).json({
    success: false,
    message: "Upload failed"
  });
}
});

// POST /api/upload/chat

router.post(
  "/chat",
  authMiddleware,
  chatUpload.single("file"),
  (req, res) => {

    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "No file selected"
      });
    }

    res.json({
      success: true,
      file: {
        name: req.file.originalname,
        url: `/uploads/${req.file.filename}`,
        type: req.file.mimetype,
        size: req.file.size
      }
    });

  }
);

// ================= CHAT FILE UPLOAD =================






module.exports = router;
