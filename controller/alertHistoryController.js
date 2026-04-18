const Alert = require("../models/alertsModel");

// GET USER ALERTS
exports.getMyAlerts = async (req, res) => {
  try {
    const alerts = await Alert.find({
      userId: req.user.id
    }).sort({ createdAt: -1 });

    res.json(alerts);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
exports.markAsRead = async (req, res) => {
  try {
    await Alert.findByIdAndUpdate(req.params.id, {
      isRead: true
    });

    res.json({ message: "Marked as read" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
exports.markAllAsRead = async (req, res) => {
  try {
    await Alert.updateMany(
      { userId: req.user.id },
      { isRead: true }
    );

    res.json({ message: "All marked as read" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
exports.deleteAlert = async (req, res) => {
  try {
    await Alert.findByIdAndDelete(req.params.id);

    res.json({ message: "Deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};