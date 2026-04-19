const express = require('express');  
const cors = require("cors");
const authRouter = require('./routes/authRouter');
const cookieParser = require('cookie-parser');
const preferenceRouter = require('./routes/preferenceRoute');
const newsRouter = require('./routes/newsRoutes');
const alertRouter = require('./routes/alertRoutes');
const adminRouter = require('./routes/adminRoutes')
const { Server } = require("socket.io");
const http = require("http");


const app = express();
const server = http.createServer(app);

app.get("/", (req, res) => {
  res.send("News Backend is running ");
});

//Create socket server
const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
    credentials: true,
    methods: ["GET", "POST"]
  }
});

//When user connects
io.on("connection", (socket) => {
  console.log("User connected:", socket.id);

  // JOIN USER ROOM
  socket.on("joinRoom", (userId) => {
    socket.join(userId);
    console.log(`User joined room: ${userId}`);
  });

  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id);
  });
});

//Make io accessible everywhere
app.set("io", io);

app.use(cors({
  origin: "http://localhost:5173",
  credentials: true
}));

//middleware to parse the body of incoming request as Json
app.use(express.json());

app.use(cookieParser());

app.use('/api/v1/auth', authRouter)
app.use("/api/v1/admin", adminRouter);
app.use('/api/v1/preferences', preferenceRouter)
app.use('/api/v1/news', newsRouter)
app.use('/api/v1/alerts',alertRouter)

module.exports = { app, server, io };