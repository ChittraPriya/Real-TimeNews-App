const mongoose = require('mongoose')

const alertModel = new mongoose.Schema({
    userId:{type:String},
    title:{type:String},
    description:{type:String},
    link:{type:String},
    categories:{type:String},
    isRead: {type:Boolean, default:false}

},{timestamps:true})

module.exports = mongoose.model('Alert', alertModel, 'alerts')