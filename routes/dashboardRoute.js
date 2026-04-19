const express = require('express');
const { isAuthenticated } = require('../middleware/auth');
const { getUserDashboardNews } = require('../controller/dashboardContoller');

const dashboardRouter = express.Router();

dashboardRouter.get('/dashboard-news', isAuthenticated,getUserDashboardNews);

module.exports= dashboardRouter;