const Preference = require("../models/preferencesModel");
const News = require("../models/newsModel");

const getDashboardNews = async (req, res) => {
  try {
    const preference = await Preference.findOne({
      userId: req.user._id
    });

    const categories = (preference?.categories || []).map(c =>
      c.toLowerCase()
    );

    let news;

    if (categories.length === 0) {
      // ALL admin news
      news = await News.find()
        .sort({ createdAt: -1 });
    } else {
      // FILTER ONLY ADMIN NEWS
      news = await News.find({
        category: { $in: categories }
      }).sort({ createdAt: -1 });
    }

    res.json({ news });

  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
};

module.exports = {getDashboardNews}