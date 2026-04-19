const Alert = require("../models/alertsModel.js");

const alertController = {

  // CREATE ALERT (USED IN NEWS CONTROLLER / CRON)
  createAlert: async (news, userId, categories = []) => {
    try {
      await Alert.create({
        userId,
        title: news.title,
        description: news.description,
        link: news.link,
        categories
      });
    } catch (error) {
      console.log(error.message);
    }
  },

  // GET ALL ALERTS (ONLY LOGGED USER)
  getAlerts: async (req, res) => {
  try {

    const alerts = await Alert.find({
      userId: req.user._id,
    }).sort({ createdAt: -1 });

    res.status(200).json({
      total: alerts.length,
      alerts
    });

  } catch (error) {
    res.status(500).json({
      message: "Error fetching alerts",
      error: error.message
    });
  }
},
  // MARK ONE AS READ
  markAsRead: async (req, res) => {
    try {
      const updated = await Alert.findByIdAndUpdate(
        req.params.id,
        { isRead: true },
        { returnDocument: "after" }
      );

      res.status(200).json({
        message: "Alert marked as read",
        alert: updated
      });

    } catch (error) {
      res.status(500).json({
        message: "Failed to update alert",
        error: error.message
      });
    }
  },

  // MARK ALL AS READ
  markAllAsRead: async (req, res) => {
    try {
      await Alert.updateMany(
        { userId: req.user._id, isRead: false },
        { $set: { isRead: false } }
      );

      res.status(200).json({
        message: "All alerts marked as read"
      });

    } catch (error) {
      res.status(500).json({
        message: "Failed to mark all as read",
        error: error.message
      });
    }
  },

  // UNREAD COUNT (BELL ICON)
  getUnreadCount: async (req, res) => {
    try {
      const count = await Alert.countDocuments({
        userId: req.user._id,
        isRead: false
      });

      res.status(200).json({
        unreadCount: count
      });

    } catch (error) {
      res.status(500).json({
        message: "Failed to get unread count",
        error: error.message
      });
    }
  },

  // DELETE SINGLE ALERT
  deleteSingleAlert: async (req, res) => {
  try {
    const alertId = req.params.id;

    const result = await Alert.findOneAndUpdate(
      {
        _id: alertId,
        userId: req.user._id
      },
      {
        $set: { hidden: true }
      },
      {
        new: true
      }
    );

    if (!result) {
      return res.status(404).json({
        message: "Alert not found"
      });
    }

    return res.status(200).json({
      message: "Deleted successfully"
    });

  } catch (err) {
    return res.status(500).json({
      message: "Delete failed",
      error: err.message
    });
  }
},
  deleteAllAlerts: async (req, res) => {
  try {
    if (!req.user || !req.user._id) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const result = await Alert.deleteMany({
      userId: req.user._id
    });

    res.status(200).json({
      message: "All alerts deleted",
      deletedCount: result.deletedCount
    });

  } catch (error) {
    res.status(500).json({
      message: "Failed to delete alerts",
      error: error.message
    });
  }
}
}

module.exports = alertController;