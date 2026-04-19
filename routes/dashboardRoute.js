const express = require('express');
const { isAuthenticated } = require('../middleware/auth');
const { getDashboardNews } = require('../controller/dashboardContoller');

const dashboardRouter = express.Router();

dashboardRouter.get('/', isAuthenticated,getDashboardNews);

module.exports= dashboardRouter;