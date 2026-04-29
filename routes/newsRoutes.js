const express = require('express');
const { isAuthenticated } = require('../middleware/auth');
const { getUserNews, getAllNews, getSingleNews } = require('../controller/newsContoller');
const { isAdmin } = require('../middleware/admin');
const upload = require('../middleware/multer');
const { createNews } = require('../controller/adminController');

const newsRouter = express.Router();

newsRouter.get("/all", getAllNews);
newsRouter.get('/',isAuthenticated,getUserNews);
newsRouter.get('/:id',isAuthenticated,getSingleNews);
newsRouter.post("/",isAuthenticated,isAdmin,upload.single("image"),createNews);

module.exports= newsRouter