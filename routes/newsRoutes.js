const express = require('express');
const { isAuthenticated } = require('../middleware/auth');
const { getUserNews, getAllNews, getSingleNews } = require('../controller/newsContoller');

const newsRouter = express.Router();

newsRouter.get("/all", getAllNews);
newsRouter.get('/',isAuthenticated,getUserNews);
newsRouter.get('/:id',isAuthenticated,getSingleNews);

module.exports= newsRouter