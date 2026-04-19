const User = require("../models/userModel");
const Alert = require("../models/alertsModel");
const News = require("../models/newsModel");
const Preference = require("../models/preferencesModel");
const sendEmail = require("../utils/email")

const adminController = {

  // CREATE NEWS
  createNews: async (req, res) => {
  try {
    const { title, description, category, link } = req.body;

    const lower = category.toLowerCase().trim();

    console.log("CATEGORY:", lower);

    // save news
    const news = await News.create({
      title,
      description,
      category: lower,
      link,
      source: "admin",
    });

    // find matching users
    const prefs = await Preference.find({
      categories: { $in: [lower] },
    }).populate("userId");

    console.log("MATCHED USERS:", prefs.length);

    for (const p of prefs) {
      if (!p.userId || !p.userId.email) continue;

      // create alert
      await Alert.create({
        userId: p.userId._id,
        title,
        description,
        link,
        isRead: false,
        hidden: false,
      });

      // send email (IMPORTANT: use correct function name)
      await sendEmail(
  p.userId.email,
  p.userId.name,
  "Breaking News",
  [
    {
      title,
      description,
      link,
      image_url: null
    }
  ]
);

      console.log("Alert sent to:", p.userId.email);
    }

    res.status(201).json({
      message: "News Published Successfully",
      data: news,
    });
  } catch (error) {
    console.log("CREATE NEWS ERROR:", error);

    res.status(500).json({
      message: "Failed to publish news",
    });
  }
},
  // USERS
  getUsers: async (req, res) => {
    try {
      const users =
        await User.find();

      res.json(users);
    } catch (error) {
      res.status(500).json({
        message:
          "Failed to get users"
      });
    }
  },

  // DELETE
  deleteNews: async (req, res) => {
    try {
      await News.findByIdAndDelete(
        req.params.id
      );

      res.json({
        message:
          "News Deleted"
      });

    } catch (error) {
      res.status(500).json({
        message:
          "Delete Failed"
      });
    }
  },

  // STATS
  stats: async (req, res) => {
    try {
      const totalUsers =
        await User.countDocuments();

      const totalAlerts =
        await Alert.countDocuments();

      const totalNews =
        await News.countDocuments();

      const todayUsers =
        await User.countDocuments({
          createdAt: {
            $gte: new Date(
              new Date().setHours(
                0,0,0,0
              )
            )
          }
        });

      res.json({
        totalUsers,
        totalAlerts,
        totalNews,
        todayUsers
      });

    } catch (error) {
      res.status(500).json({
        message:
          "Failed to load stats"
      });
    }
  },

  // ALERTS
  getAlertAdmin: async (req, res) => {
    try {
      const alerts =
        await Alert.find()
        .populate(
          "userId",
          "name email"
        )
        .sort({
          createdAt: -1
        });

      res.json(alerts);

    } catch (error) {
      res.status(500).json({
        message:
          "Failed to fetch alerts"
      });
    }
  },

  // UPDATE
  updateNews: async (req, res) => {
    try {
      const updated =
        await News.findByIdAndUpdate(
          req.params.id,
          req.body,
          {
            returnDocument: "after",
            runValidators: true
          }
        );

      res.json({
        message:
          "News updated",
        data: updated
      });

    } catch (error) {
      res.status(500).json({
        message:
          "Update Failed"
      });
    }
  },

  // GET NEWS
  getAllNews: async (req, res) => {
    try {
      const news =
        await News.find()
        .sort({
          createdAt: -1
        });

      res.json(news);

    } catch (error) {
      res.status(500).json({
        message:
          "Failed to fetch news"
      });
    }
  },

  // ANALYTICS
  getAnalytics: async (req, res) => {
    try {
      const news =
        await News.find();

      const result = {};

      news.forEach((item) => {
        const cat = item.category?.toLowerCase().trim() || "general";

        if (!result[cat]) {
          result[cat] = {
            total: 0,
            api: 0,
            admin: 0
          };
        }

        result[cat].total++;

        if (
          item.source === "api"
        ) {
          result[cat].api++;
        } else {
          result[cat].admin++;
        }
      });

      const finalData =
        Object.entries(
          result
        ).map(
          ([category, val]) => ({
            category,
            total:
              val.total,
            api:
              val.api,
            admin:
              val.admin
          })
        );

      res.json(finalData);

    } catch (error) {
      res.status(500).json({
        message:
          error.message
      });
    }
  }

};

module.exports = adminController;