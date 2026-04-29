const mongoose = require("mongoose");
const { MONGODB_URI, PORT } = require("./utils/config.js");
const { server } = require("./app");

// connect DB
mongoose.connect(MONGODB_URI)
  .then(() => {
    console.log("Connected to MongoDB");

    server.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch((error) => {
    console.log("MongoDB connection error");
    console.log(error.message);
  });

// cron jobs
require("./jobs/cron");