const Preference = require("../models/preferencesModel");
const News = require("../models/newsModel");
const axios = require("axios");

const getUserDashboardNews = async (req, res) => {
  try {
    const preference = await Preference.findOne({
      userId: req.user._id,
    });

    if (!preference) {
      return res.status(404).json({
        message: "No preferences found",
      });
    }

    const categories = preference.categories;

    // ADMIN NEWS
    const adminNews = await News.find({
      category: { $in: categories },
    }).sort({ createdAt: -1 });

    // API NEWS
    let apiNews = [];

    for (let category of categories) {
      const response = await axios.get(
        `https://newsapi.org/v2/top-headlines?category=${category}&country=us&apiKey=YOUR_KEY`
      );

      apiNews.push(...response.data.articles);
    }

    res.status(200).json({
      adminNews,
      apiNews,
      allNews: [...adminNews, ...apiNews],
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed",
      error: error.message,
    });
  }
};

module.exports = { getUserDashboardNews };