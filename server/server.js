const express = require('express');
const mongoose = require('mongoose');
const { createServer } = require("http");
const { Server } = require("socket.io");
require('dotenv').config();
const UserRoutes = require('./routes/UserRoutes');
const socket = require('./socket');
const cors = require('cors');
const path = require('path');
const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer);
 
socket(io);
 
app.use(cors());
const corsOptions = {
  origin: process.env.NODE_ENV === 'production' ? "https://acs-project-455713.ey.r.appspot.com" : "http://localhost:3000",
  methods: "GET,POST,PUT,DELETE,PATCH",
  credentials: true,
};
app.use(cors(corsOptions));
 
 
 
 
app.use(express.json());
app.use((req, res, next) => {
  console.log(req.path, req.method);
  next();
});
 
app.use('/api/user', UserRoutes);
 
app.use(express.static(path.join(__dirname, "client/build")));
 
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "client/build", "index.html"));
});
 
app.get('/health', (req, res) => {
  res.status(200).send('App is healthy!');
});
 
 
console.log("Attempting DB connection...");
mongoose.connect(process.env.MONGO_URL).then(() => {
  console.log("✅ Connected to MongoDB");
 
  const port = process.env.PORT || 8080;
  httpServer.listen(port, () => {
    console.log(`🚀 Server listening on port ${port}`);
  });
}).catch((error) => {
  console.error("❌ MongoDB connection failed:", error);
});
 