const express = require("express");
const http = require("http");
const { Server } = require("socket.io");

const app = express();
const server = http.createServer(app);

// Socket.IO setup with CORS for frontend access
const io = new Server(server, {
  cors: {
    origin: ["https://event-market-place.vercel.app"], // ✅ Your frontend port
    credentials: true,
    methods: ["GET", "POST"],
  },
});

// 💡 Real-time socket logic
io.on("connection", (socket) => {
  
  // const userId = socket.handshake.query.userId;

  // console.log("Connected userId:", userId);
  console.log("✅ User connected:", socket.id);

  // 🔔 Listen for event creation from any user
//   socket.on("event-created", (newEvent) => {
//     console.log("📢 New Event Created:", newEvent);

//     // 📨 Broadcast the event to all other users
//     socket.broadcast.emit("new-event-notification", newEvent);

//     // 📝 (Optional) If you want to notify the sender too
//     // io.emit("new-event-notification", newEvent);
//   });

  // ❌ On disconnect
  socket.on("disconnect", () => {
    console.log("🚫 User disconnected:", socket.id);
  });
});

// 🔁 Export server and app for use in index.js
module.exports = {
  app,
  server,
  io,
};
