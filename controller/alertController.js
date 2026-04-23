const Alert = require("../models/alertsModel.js");

const alertController = {

  // CREATE ALERT
  createAlert: async (news, userId, categories = []) => {
    try {
      await Alert.create({
        userId,
        title: news.title,
        description: news.description,
        link: news.link,
        categories,
        isRead: false,
        hidden: false
      });
    } catch (error) {
      console.log(error.message);
    }
  },

  // GET ALERTS
  getAlerts: async (req, res) => {
    try {
      const alerts = await Alert.find({
        userId: req.user._id,
        hidden: false
      }).sort({ createdAt: -1 });

      res.status(200).json({
        total: alerts.length,
        alerts
      });

    } catch (error) {
      res.status(500).json({
        message: "Error fetching alerts"
      });
    }
  },

  // MARK ONE READ
  markAsRead: async (req, res) => {
    try {
      const updated = await Alert.findByIdAndUpdate(
        req.params.id,
        { isRead: true },
        { new: true }
      );

      res.status(200).json({
        message: "Marked as read",
        alert: updated
      });

    } catch (error) {
      res.status(500).json({
        message: "Failed"
      });
    }
  },

  // MARK ALL READ
  markAllAsRead: async (req, res) => {
    try {
      await Alert.updateMany(
        { userId: req.user._id, isRead: false },
        { $set: { isRead: true } }
      );

      res.status(200).json({
        message: "All marked read"
      });

    } catch (error) {
      res.status(500).json({
        message: "Failed"
      });
    }
  },

  // UNREAD COUNT
  getUnreadCount: async (req, res) => {
    try {
      const count = await Alert.countDocuments({
        userId: req.user._id,
        isRead: false,
        hidden: false
      });

      res.status(200).json({
        unreadCount: count
      });

    } catch (error) {
      res.status(500).json({
        message: "Failed"
      });
    }
  },

  // DELETE ONE
  deleteSingleAlert: async (req, res) => {
    try {
      await Alert.findByIdAndUpdate(
        req.params.id,
        { hidden: true }
      );

      res.status(200).json({
        message: "Deleted"
      });

    } catch (error) {
      res.status(500).json({
        message: "Failed"
      });
    }
  },

  // DELETE ALL
  deleteAllAlerts: async (req, res) => {
    try {
      await Alert.deleteMany({
        userId: req.user._id
      });

      res.status(200).json({
        message: "All deleted"
      });

    } catch (error) {
      res.status(500).json({
        message: "Failed"
      });
    }
  }

};

module.exports = alertController;