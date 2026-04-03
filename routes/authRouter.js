const express = require('express')
const {register,login,logout} = require('../controller/authController.js')

const authRouter = express.Router()

//public Routes
authRouter.post('/register', register)
authRouter.post('/login', login)

authRouter.post('/logout', logout)

module.exports = authRouter