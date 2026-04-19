const express = require('express');
const { isAuthenticated } = require('../middleware/auth');
const { getDashboardNews } = require('../controller/dashboardContoller');

const dashboardRouter = express.Router();

dashboardRouter.get('/dashboard', isAuthenticated,getDashboardNews);

module.exports= dashboardRouter;