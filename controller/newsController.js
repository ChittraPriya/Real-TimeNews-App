const Preference = require("../models/preferencesModel");
const News = require("../models/newsModel");

/* ALL NEWS - ONLY ADMIN ADDED */
const getAllNews = async (req, res) => {
  try {
    const news = await News.find().sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      news,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/* USER NEWS BY PREFERENCES - ONLY ADMIN ADDED */
const getUserNews = async (req, res) => {
  try {
    const preference = await Preference.findOne({
      userId: req.user._id,
    });

    const categories = (preference?.categories || []).map((c) =>
      c.toLowerCase()
    );

    let news = [];

    if (categories.length > 0) {
      news = await News.find({
        category: { $in: categories },
      }).sort({ createdAt: -1 });
    } else {
      news = await News.find().sort({ createdAt: -1 });
    }

    res.status(200).json({
      success: true,
      news,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/* SINGLE NEWS */
const getSingleNews = async (req, res) => {
  try {
    const news = await News.findById(req.params.id);

    if (!news) {
      return res.status(404).json({
        success: false,
        message: "News not found",
      });
    }

    //ADD THIS (increase views every time someone opens news)
    await News.findByIdAndUpdate(req.params.id, {
      $inc: { views: 1 },
    });

    res.status(200).json({
      success: true,
      news,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = {
  getAllNews,
  getUserNews,
  getSingleNews,
};
