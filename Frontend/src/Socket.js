import { io } from "socket.io-client";

// src/socket.js
let socket = null;

export const connectSocket = (userId) => {

  // console.log("Connecting socket for userId:", userId);

  if ((!socket || socket.disconnected) && userId) {
    socket = io("http://localhost:8000", {
      withCredentials: true,
      query: { userId },
    });
  }
};

export const getSocket = () => socket;
