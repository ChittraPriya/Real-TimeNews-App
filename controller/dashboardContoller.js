const Preference = require("../models/preferencesModel");
const News = require("../models/newsModel");

const getDashboardNews = async (req, res) => {
  try {
    const preference = await Preference.findOne({
      userId: req.user._id
    });

    console.log("Preference:", preference);

    const categories = preference?.categories || [];

    const adminNews = await News.find({
      category: { $in: categories }
    });

    res.status(200).json({
      news: adminNews
    });

  } catch (error) {
    console.log(error);

    res.status(500).json({
      message: error.message
    });
  }
};

module.exports = { getDashboardNews };