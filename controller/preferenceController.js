const Preference = require("../models/preferencesModel.js");
const News = require("../models/newsModel");
const sendEmail = require("../utils/email");

const createPreference = async (req, res) => {
  try {
    const { categories, frequency, time } = req.body;

    let preference = await Preference.findOne({ userId: req.user._id });

    if (preference) {
      //update existing
      preference.categories = categories;
      preference.frequency = frequency;
      preference.time = time ?? "08:00";

      preference.notifications = {
  email: req.body.notifications?.email ?? false,
  push: req.body.notifications?.push ?? false,
};
    } else {
      preference = new Preference({
        userId: req.user._id,
        categories,
        frequency,
        time: time || "08:00",
        notifications: req.body.notifications,
      });
    }
    const saved = await preference.save();

    // populate userId to include name and email in the response
    const populatedPreference = await Preference.findById(saved._id).populate(
      "userId",
      "name email",
    );

    if (preference.notifications?.email) {
      const news = await News.find({
        category: { $in: categories },
      }).sort({ createdAt: -1 });

      if (news.length > 0) {
        await sendEmail(
          populatedPreference.userId.email,
          populatedPreference.userId.name,
          "Your Personalized News Feed",
          news,
        );

        console.log("Preference email sent to:", req.user.email);
      }
    }

    res.status(201).json({
      message: "Preferences saved successfully",
      preference: populatedPreference,
    });
  } catch (error) {
    res.status(500).json({
      message: "Creating preference failed",
      error: error.message,
    });
  }
};

const getMyPreference = async (req, res) => {
  try {
    const preference = await Preference.findOne({ userId: req.user._id });

    if (!preference) {
      return res.status(404).json({ message: "Preference not found" });
    }

    res.status(200).json({
      message: "Preference fetched successfully",
      preference,
    });
  } catch (error) {
    res.status(500).json({
      message: "Fetching preference failed",
      error: error.message,
    });
  }
};
const updatePreference = async (req, res) => {
  try {
    const { categories, frequency, notifications, time } = req.body;

    const updated = await Preference.findOneAndUpdate(
      { userId: req.user._id },
      {
        categories,
        frequency,
        time: time ?? updated.time,
        notifications: {
          email: notifications?.email ?? false,
          push: notifications?.push ?? false,
        },
      },
      {
        new: true,
        upsert: true,
      },
    );

    res.status(200).json({
      message: "Preference updated successfully",
      preference: updated,
    });
  } catch (error) {
    res.status(500).json({
      message: "Updating Preference failed",
      error: error.message,
    });
  }
};
const deletePreference = async (req, res) => {
  try {
    const deleted = await Preference.findOneAndDelete({
      userId: req.user._id,
    });

    if (!deleted) {
      return res.status(404).json({
        message: "Preference not found",
      });
    }

    res.status(200).json({
      message: "Preferences deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      message: "Deleting Preference failed",
      error: error.message,
    });
  }
};
const deleteCategory = async (req, res) => {
  try {
    const { category } = req.body;

    const updated = await Preference.findOneAndUpdate(
      { userId: req.user._id },
      { $pull: { categories: category } },
      { returnDocument: "after" },
    );

    if (!updated) {
      return res.status(404).json({
        message: "Preference not found",
      });
    }

    res.status(200).json({
      message: "Category deleted successfully",
      preference: updated,
    });
  } catch (error) {
    res.status(500).json({
      message: "Deleting category failed",
      error: error.message,
    });
  }
};

module.exports = {
  createPreference,
  getMyPreference,
  updatePreference,
  deletePreference,
  deleteCategory,
};
