const express = require('express');  
const authRouter = require('./routes/authRouter');
const cookieParser = require('cookie-parser');

const app = express();

//middleware to parse the body of incoming request as Json
app.use(express.json());

app.use(cookieParser());

app.use('/api/v1/auth', authRouter)

module.exports = app