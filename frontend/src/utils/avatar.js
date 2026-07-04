// utils/avatar.js
// Avatar URL helper - backend se image serve karne ka consistent URL banata hai

const BACKEND_URL = 'http://localhost:5000';

// User ka avatar URL return karta hai - agar nahi hai to null (initials fallback ke liye)
export function getAvatarUrl(user) {
  if (!user?.avatar) return null;
  // Agar already full URL hai to as-is return karo
  if (user.avatar.startsWith('http')) return user.avatar;
  return `${BACKEND_URL}${user.avatar}`;
}

// Name ke initials nikalte hain fallback ke liye
export function getInitials(name = '') {
  const parts = name.trim().split(' ');
  if (parts.length === 1) return parts[0].charAt(0).toUpperCase();
  return (parts[0].charAt(0) + parts[parts.length - 1].charAt(0)).toUpperCase();
}
