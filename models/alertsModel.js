const mongoose = require("mongoose");

const alertSchema = new mongoose.Schema(
  {
    userId: {type: mongoose.Schema.Types.ObjectId,ref: "User",required: true},
    title: {type: String,required: true},
    description: {type: String},
    link: {type: String},
    categories: [{type: String}],
    type: {type: String,default: "news"},
    isRead: {type: Boolean,default: false},
    hidden: {type: Boolean,default: false}
  },{ timestamps: true });

module.exports = mongoose.model("Alert", alertSchema, 'alerts');