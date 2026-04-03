const mongoose = require('mongoose')

const userSchema =new mongoose.Schema({
    name: {type:String, required: true},
    email: {type:String, required: true},
    password: {type:String, required: true},
    preferences: {
        categories: [String],
        frequency: {type:String, 
            enum: ["instant", "hourly", 'daily'],
            default: "instant"
        }
    },
    lastNotified: Date
}, {timestamps:true}) 

module.exports = mongoose.model('User', userSchema, 'users')