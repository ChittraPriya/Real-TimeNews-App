const Preference = require("../models/preferencesModel");

const News = require("../models/newsModel");

const fetchNews = require("../utils/news");

/* ALL NEWS */
const getAllNews = async (req, res) => {
  try {
    // 1. ALWAYS get admin news first (from DB)
    const adminNews = await News.find().sort({ createdAt: -1 });

    let apiNews = [];

    const categories = [
      "sports",
      "technology",
      "business",
      "health",
      "science",
      "entertainment",
      "politics",
      "world"
    ];

    // 2. TRY API (but DO NOT block admin news if it fails)
    try {
      for (const cat of categories) {
        const data = await fetchNews([cat]);

        if (Array.isArray(data)) {
          apiNews.push(
            ...data.map(item => ({
              title: item.title,
              description: item.description,
              category: cat,
              link: item.url,
              image: item.urlToImage,
              source: "api"
            }))
          );
        }
      }
    } catch (err) {
      console.log("API failed (ignored):", err.message);
    }

    // 3. format admin news
    const formattedAdmin = adminNews.map(n => ({
      ...n._doc,
      source: "admin"
    }));

    // 4. FINAL RESPONSE (admin ALWAYS included)
    res.json({
      success: true,
      news: [...formattedAdmin, ...apiNews]
    });

  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
};
/* USER NEWS */
const getUserNews = async (req, res) => {
  try {
    const preference = await Preference.findOne({
      userId: req.user._id,
    });

    const categories = (preference?.categories || []).map((c) =>
      c.toLowerCase(),
    );

    // 1. ADMIN NEWS (DB)
    const adminNews = await News.find({
      category: { $in: categories },
    }).sort({ createdAt: -1 });

    // 2. API NEWS (LIVE, NOT SAVED)
    let apiNews = [];

    for (const cat of categories) {
      const data = await fetchNews([cat]);

      if (Array.isArray(data)) {
        apiNews.push(
          ...data.map((item) => ({
            title: item.title,
            description: item.description,
            category: cat,
            link: item.url,
            image: item.urlToImage,
            source: "api",
          })),
        );
      }
    }

    // 3. MERGE BOTH
    const allNews = [...adminNews, ...apiNews];

    // 4. SORT BY LATEST (optional)
    allNews.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

    res.json({
      success: true,
      news: allNews,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

module.exports = {
  getAllNews,
  getUserNews,
};
