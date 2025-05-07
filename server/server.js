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
 
const allowedOrigins = [
  "http://localhost:3000",
  "http://35.223.65.142",
  "https://acs-project-455713.ey.r.appspot.com",
  "http://34.42.130.108",
  'http://127.0.0.1:5000',
  'https://acs-project-458806.uc.r.appspot.com',
  'https://frontend-service-dot-acs-project-458806.uc.r.appspot.com'
];

const corsOptions = {
  origin: function (origin, callback) {
    if (!origin) return callback(null, true);
    if (allowedOrigins.includes(origin)) {
      return callback(null, true);
    } else {
      return callback(new Error('Not allowed by CORS'));
    }
  },
  methods: "GET,POST,PUT,DELETE,PATCH,OPTIONS",
  credentials: true
};
app.use(cors(corsOptions));
app.options('*', cors(corsOptions));

app.use(express.json());
app.use((req, res, next) => {
  console.log(req.path, req.method);
  next();
});

// Routes
app.use('/api/user', UserRoutes);

// Slow endpoint for testing 
app.get('/slow', (req, res) => {
  setTimeout(() => {
    res.send("Slow response....");
  }, 5000);
});
 
// Serve React Build 
app.use(express.static(path.join(__dirname, "client/build")));
 
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "client/build", "index.html"));
});
 

// Health Check
app.get('/health', (req, res) => {
  res.status(200).send('App is healthy!');
});
 

// Start server after DB connects 
console.log("Attempting DB connection...");
mongoose.connect(process.env.MONGO_URL).then(() => {
  console.log("Connected to MongoDB");
 
  const port = process.env.PORT || 8080;
  httpServer.listen(port,'0.0.0.0', () => {
    console.log(`Server listening on port ${port}`);
  });
}).catch((error) => {
  console.error("MongoDB connection failed:", error);
});
 