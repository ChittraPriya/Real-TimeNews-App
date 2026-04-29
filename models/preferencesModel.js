const mongoose = require("mongoose");

const preferenceModel = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },

    categories: [String],

    frequency: {
      type: String,
      enum: ["instant", "hourly", "daily"],
      default: "daily",
    },
    
    time: {
      type: String,
      default: "08:00",
    },

    notifications: {
      email: Boolean,
      push: Boolean,
    },
    sentNewsIds: {
      type: [String],
      default: [],
    },
  },
  { timestamps: true },
);

module.exports = mongoose.model("Preference", preferenceModel);
