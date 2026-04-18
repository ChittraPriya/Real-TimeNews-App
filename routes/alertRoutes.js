const express = require('express');
const { isAuthenticated } = require('../middleware/auth');
const { getAlerts, markAsRead, markAllAsRead, getUnreadCount, deleteSingleAlert, deleteAllAlerts } = require('../controller/alertController');

const alertRouter = express.Router();

alertRouter.get("/", isAuthenticated, getAlerts);

alertRouter.put("/mark-all-read", isAuthenticated, markAllAsRead);
alertRouter.get("/unread-count", isAuthenticated, getUnreadCount);

alertRouter.delete("/all", isAuthenticated, deleteAllAlerts);

alertRouter.put("/:id", isAuthenticated, markAsRead);
alertRouter.delete("/:id", isAuthenticated, deleteSingleAlert);

module.exports = alertRouter