const mongoose = require("mongoose");

const newsSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String },
    category: { type: String, required: true },
    link: { type: String },
    image: { type: String },
    source: { type: String, default: "admin" },
    desc1: { type: String, default: "" },
    desc2: { type: String, default: "" },
    desc3: { type: String, default: "" },
    desc4: { type: String, default: "" },
    desc5: { type: String, default: "" },
    desc6: { type: String, default: "" },
    desc7: { type: String, default: "" },

    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    views: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true },
);

module.exports = mongoose.model("News", newsSchema);
