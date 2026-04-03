require('dotenv').config()

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/news'
const PORT = process.env.PORT || 5000
const JWT_SECRET = process.env.JWT_SECRET
const NODE_ENV = process.env.NODE_ENV
const NEWS_API_KEY= process.env.NEWS_API_KEY

module.exports = {
    MONGODB_URI,
    PORT,
    JWT_SECRET,
    NODE_ENV,
    NEWS_API_KEY
}