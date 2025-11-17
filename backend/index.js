const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const connectDB = require("./config/db");
const satelliteRoutes = require("./routes/satelliteRoutes");
const http = require("http");
const { Server } = require("socket.io");

dotenv.config();
const app = express();
const server = http.createServer(app); // Create server for socket.io
const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",  // Correct frontend address
    methods: ["GET", "POST"],
  },
});
const PORT = process.env.PORT || 5000;

// Connect to MongoDB
connectDB();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use("/api/satellites", satelliteRoutes);

// Root route
app.get("/", (req, res) => {
  res.send("Backend is running. Check /api/satellites");
});

// ---- SOCKET.IO ----
io.on("connection", (socket) => {
  console.log("🔌 A client connected:", socket.id);

  // Simulate satellite updates every 10s
  setInterval(() => {
    const fakeUpdate = {
      name: `NewSat-${Math.floor(Math.random() * 1000)}`,
      status: "Active",
      timestamp: new Date(),
    };
    socket.emit("satellite-update", fakeUpdate);
  }, 10000);

  socket.on("disconnect", () => {
    console.log("❌ Client disconnected:", socket.id);
  });
});

// Start server
server.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
