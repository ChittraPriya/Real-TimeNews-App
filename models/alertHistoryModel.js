const mongoose = require("mongoose");

const alertHistorySchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },

    title: {
      type: String,
      required: true
    },

    description: {
      type: String
    },

    category: {
      type: String
    },

    source: {
      type: String, // api / admin / system
      default: "api"
    },

    link: {
      type: String
    },

    image: {
      type: String
    },

    isRead: {
      type: Boolean,
      default: false
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("AlertHistory", alertHistorySchema);