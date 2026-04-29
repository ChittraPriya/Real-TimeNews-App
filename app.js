const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");

const authRouter = require("./routes/authRouter");
const preferenceRouter = require("./routes/preferenceRoute");
const newsRouter = require("./routes/newsRoutes");
const alertRouter = require("./routes/alertRoutes");
const adminRouter = require("./routes/adminRoutes");
const dashboardRouter = require("./routes/dashboardRoute");

const http = require("http");
const setupSocket = require("./socket/socket");

const app = express();
const server = http.createServer(app);

// socket
const io = setupSocket(server);
app.set("io", io);

// middleware
app.use(cors({
  origin: [
    "http://localhost:5173",
    "https://real-timenews.netlify.app",
  ],
  credentials: true,
}));

app.use(express.json());
app.use(cookieParser());

// routes
app.get("/", (req, res) => {
  res.send("News Backend is running");
});

app.use("/api/v1/auth", authRouter);
app.use("/api/v1/admin", adminRouter);
app.use("/api/v1/preferences", preferenceRouter);
app.use("/api/v1/dashboard", dashboardRouter);
app.use("/api/v1/news", newsRouter);
app.use("/api/v1/alerts", alertRouter);

module.exports = { app, server, io };