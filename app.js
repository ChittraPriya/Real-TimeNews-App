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
const dashboardRouter = require('./routes/dashboardRoute');
const path = require("path");


const app = express();
const server = http.createServer(app);


//Create socket server
const io = new Server(server, {
  cors: {
    origin:"https://real-timenews.netlify.app",
    credentials: true,
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

// app.use(cors({
//   origin: "*",
//   credentials: true
// }));

app.use(cors({
  origin: "https://real-timenews.netlify.app",
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"]
}));

//middleware to parse the body of incoming request as Json
app.use(express.json());

app.use(cookieParser());

app.get("/", (req, res) => {
  res.send("News Backend is running");
});

app.use(
  "/uploads",
  express.static(path.resolve(__dirname, "uploads"))
);

app.use('/api/v1/auth', authRouter)
app.use("/api/v1/admin", adminRouter);
app.use('/api/v1/preferences', preferenceRouter)
app.use("/api/v1/dashboard", dashboardRouter);
app.use('/api/v1/news', newsRouter)
app.use('/api/v1/alerts',alertRouter)


module.exports = { app, server, io };