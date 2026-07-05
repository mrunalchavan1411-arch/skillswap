// services/socket.js
// Real-time chat ke liye Socket.io client connection

import { io } from 'socket.io-client';

const SOCKET_URL = "https://skillswap-premium-backend.onrender.com/api";

// Single shared socket instance - poori app me ek hi connection use hota hai
const socket = io(SOCKET_URL, {
  autoConnect: false, // hum manually connect karenge jab user login ho jaye
});

export default socket;
