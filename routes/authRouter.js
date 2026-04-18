const express = require('express')
const {register,login,logout, updateEmail} = require('../controller/authController.js')
const { isAuthenticated } = require('../middleware/auth.js')

const authRouter = express.Router()

//public Routes
authRouter.post('/register', register)
authRouter.post('/login', login)
authRouter.put('/update-email',isAuthenticated,updateEmail)

authRouter.post('/logout', logout)

module.exports = authRouter