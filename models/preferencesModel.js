const mongoose = require('mongoose')

const preferenceModel = new mongoose.Schema({
    userId: {type: String},
    categories: [String],
    frequency: {type:String, default: "daily"}
},{timestamps: true})

module.exports = mongoose.model("Preference" , preferenceModel, 'preferences')