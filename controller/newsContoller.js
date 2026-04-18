const Preference =
require("../models/preferencesModel");

const News =
require("../models/newsModel");

const fetchNews =
require("../utils/news");

/* ALL NEWS */
const getAllNews =
async (req, res) => {
  try {
    const categories = [
      "sports",
      "technology",
      "business",
      "health"
    ];

    let allNews = [];

    for (const cat of categories) {

      const apiNews =
        await fetchNews([cat]);

      for (const item of apiNews) {

        const exists =
          await News.findOne({
            title: item.title
          });

        if (!exists) {
          await News.create({
            title: item.title,
            description:
              item.description,
            category: cat,
            link: item.url,
            image:
              item.urlToImage,
            source: "api"
          });
        }
      }

      allNews.push(...apiNews);
    }

    res.json({
      success: true,
      news: allNews
    });

  } catch (error) {
    res.status(500).json({
      message:
        error.message
    });
  }
};

/* USER NEWS */
const getUserNews =
async (req, res) => {
  try {

    if (!req.user) {
      return res.status(401)
      .json({
        message:
          "Unauthorized"
      });
    }

    const preference =
      await Preference.findOne({
        userId:
          req.user._id
      });

    if (
      !preference ||
      !preference.categories
        ?.length
    ) {
      return res.status(400)
      .json({
        message:
          "No preferences"
      });
    }

    let allNews = [];

    for (const cat of
      preference.categories
    ) {

      const apiNews =
        await fetchNews([cat]);

      for (const item of apiNews) {

        const exists =
          await News.findOne({
            title:
              item.title
          });

        if (!exists) {
          await News.create({
            title:
              item.title,
            description:
              item.description,
            category:
              cat,
            link:
              item.url,
            image:
              item.urlToImage,
            source:
              "api"
          });
        }
      }

      allNews.push(...apiNews);
    }

    res.json({
      success: true,
      news: allNews
    });

  } catch (error) {
    res.status(500).json({
      message:
        error.message
    });
  }
};

module.exports = {
  getAllNews,
  getUserNews
};