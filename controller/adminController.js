const User = require("../models/userModel");
const Alert = require("../models/alertsModel");
const News = require("../models/newsModel");
const Preference = require("../models/preferencesModel");
const sendEmail = require("../utils/email");
const alertController = require("./alertController");

const adminController = {
  // CREATE NEWS
  createNews: async (req, res) => {
    const io = req.app.get("io");
    try{ 
      
    console.log("BODY:");
console.dir(req.body, { depth: null });

console.log("FILE:");
console.dir(req.file, { depth: null });

      const {
        title,
        description,
        category,
        link,
        desc1,
        desc2,
        desc3,
        desc4,
        desc5,
        desc6,
        desc7,
      } = req.body;

      const imageUrl = req.file?.path || req.file?.secure_url || "";

      const lower = category?.toLowerCase()?.trim() || "";

      const news = await News.create({
        title: title || "",
        description: description || "",
        category: lower,
        link: link || "",
        source: "admin",

        // image upload
        image: imageUrl,

        // coverage fields
        desc1: req.body.desc1 || "",
        desc2: req.body.desc2 || "",
        desc3: req.body.desc3 || "",
        desc4: req.body.desc4 || "",
        desc5: req.body.desc5 || "",
        desc6: req.body.desc6 || "",
        desc7: req.body.desc7 || "",
      });

      // find matching users
      const prefs = await Preference.find({
        categories: { $in: [lower] },
      }).populate("userId");

      for (const p of prefs) {
        if (!p.userId) continue;

        // get user settings
        const userSetting = await Preference.findOne({
          userId: p.userId._id,
        });

        /* ---------------- PUSH NOTIFICATION ---------------- */
        if (userSetting?.notifications?.push) {
          await alertController.createAlert(
            {
              title: news.title,
              description: news.description,
              link: news.link,
            },
            p.userId._id,
            [lower],
          );

          io.to(p.userId._id.toString()).emit("notification", {
            title: title,
            description: description,
          });
        }

        /* ---------------- EMAIL NOTIFICATION ---------------- */
        if (userSetting?.notifications?.email && p.userId.email) {
          try{
          await sendEmail(p.userId.email, p.userId.name, `🚨 ${title}`, [
            {
              title,
              description,
              link,
              image: imageUrl,
            },
          ]);
        } catch(mailError) {
             console.log("EMAIL ERROR:");
             console.dir(mailError, { depth: null });
        }
      }
    }
      res.status(201).json({
        message: "News Published Successfully",
        data: news,
      });
    } catch (error) {
  console.log("CREATE NEWS ERROR:");
  console.dir(error, { depth: null });

  res.status(500).json({
    message: error.message || "Failed to publish news"
  });
    }
  },
  // USERS
  getUsers: async (req, res) => {
    try {
      const users = await User.find();
      res.json(users);
    } catch (error) {
      res.status(500).json({
        message: "Failed to get users",
      });
    }
  },

  // DELETE NEWS
  deleteNews: async (req, res) => {
    try {
      await News.findByIdAndDelete(req.params.id);

      res.json({
        message: "News Deleted",
      });
    } catch (error) {
      res.status(500).json({
        message: "Delete Failed",
      });
    }
  },

  // UPDATE NEWS
  updateNews: async (req, res) => {
    try {
      const existing = await News.findById(req.params.id);

      if (!existing) {
        return res.status(404).json({ message: "News not found" });
      }

      const updateData = {
        title: req.body.title || existing.title,
        description: req.body.description || existing.description,
        category: req.body.category || existing.category,
        link: req.body.link || existing.link,

        // coverage fields (IMPORTANT FIX)
        desc1: req.body.desc1 !== undefined ? req.body.desc1 : existing.desc1,
        desc2: req.body.desc2 !== undefined ? req.body.desc2 : existing.desc2,
        desc3: req.body.desc3 !== undefined ? req.body.desc3 : existing.desc3,
        desc4: req.body.desc4 !== undefined ? req.body.desc4 : existing.desc4,
        desc5: req.body.desc5 !== undefined ? req.body.desc5 : existing.desc5,
        desc6: req.body.desc6 !== undefined ? req.body.desc6 : existing.desc6,
        desc7: req.body.desc7 !== undefined ? req.body.desc7 : existing.desc7,
      };

      // image update (only if new file uploaded)
      if (req.file) {
        updateData.image = req.file?.path || req.file?.secure_url || existing.image;
      }

      const updated = await News.findByIdAndUpdate(req.params.id, updateData, {
        new: true,
        runValidators: true,
      });

      res.json({
        message: "News updated successfully",
        data: updated,
      });
    } catch (error) {
      console.log("UPDATE NEWS ERROR:", error);
      res.status(500).json({
        message: "Update Failed",
      });
    }
  },

  // GET NEWS
  getAllNews: async (req, res) => {
    try {
      const news = await News.find().sort({
        createdAt: -1,
      });

      res.json(news);
    } catch (error) {
      res.status(500).json({
        message: "Failed to fetch news",
      });
    }
  },

  // STATS
  stats: async (req, res) => {
    try {
      const totalUsers = await User.countDocuments();
      const totalAlerts = await Alert.countDocuments();
      const totalNews = await News.countDocuments();

      const todayUsers = await User.countDocuments({
        createdAt: {
          $gte: new Date(new Date().setHours(0, 0, 0, 0)),
        },
      });

      res.json({
        totalUsers,
        totalAlerts,
        totalNews,
        todayUsers,
      });
    } catch (error) {
      res.status(500).json({
        message: "Failed to load stats",
      });
    }
  },

  // ADMIN ALERTS
  getAlertAdmin: async (req, res) => {
    try {
      const alerts = await Alert.find().populate("userId", "name email").sort({
        createdAt: -1,
      });

      res.json(alerts);
    } catch (error) {
      res.status(500).json({
        message: "Failed to fetch alerts",
      });
    }
  },

  // ANALYTICS
  getAnalytics: async (req, res) => {
    try {
      const news = await News.find();

      const result = {};

      news.forEach((item) => {
        const cat = item.category?.toLowerCase().trim() || "general";

        if (!result[cat]) {
          result[cat] = {
            total: 0,
            admin: 0,
          };
        }

        result[cat].total++;
        result[cat].admin++;
      });

      const finalData = Object.entries(result).map(([category, val]) => ({
        category,
        total: val.total,
        admin: val.admin,
      }));

      res.json(finalData);
    } catch (error) {
      res.status(500).json({
        message: error.message,
      });
    }
  },
};

module.exports = adminController;
