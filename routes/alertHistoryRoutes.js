const express = require ('express');
const { isAuthenticated } = require('../middleware/auth');
const { getMyAlerts, markAsRead, markAllAsRead, deleteAlert } = require('../controller/alertHistoryController');

const alertHistoryRouter = express.Router();

alertHistoryRouter.get('/',isAuthenticated,getMyAlerts)
alertHistoryRouter.put('/:id/read',isAuthenticated,markAsRead)
alertHistoryRouter.put('/read-all',isAuthenticated,markAllAsRead)
alertHistoryRouter.delete('/:id',isAuthenticated,deleteAlert)