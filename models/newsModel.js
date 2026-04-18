const mongoose = require("mongoose");

const newsSchema = new mongoose.Schema(
{
  title: {
    type: String,
    required: true
  },

  description: {
    type: String
  },

  category: {
    type: String,
    required: true
  },

  link: {
    type: String
  },
  source: {
    type: String,
    default: "admin"
  },

  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  }
},
{ timestamps: true }
);

module.exports = mongoose.model("News", newsSchema);