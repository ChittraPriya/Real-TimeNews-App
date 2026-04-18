const express = require('express');
const { isAuthenticated } = require('../middleware/auth');
const { getUserNews, getAllNews } = require('../controller/newsContoller');

const newsRouter = express.Router();

newsRouter.get("/all", getAllNews);
newsRouter.get('/',isAuthenticated,getUserNews);

module.exports= newsRouter