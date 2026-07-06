// services/socket.js

import { io } from "socket.io-client";

const SOCKET_URL = "https://skillswap-premium-backend.onrender.com";

const socket = io(SOCKET_URL, {
  autoConnect: false,
  transports: ["websocket", "polling"],
});

export default socket;