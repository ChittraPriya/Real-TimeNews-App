const cron = require("node-cron");
const News = require("../models/newsModel");
const Preference = require("../models/preferencesModel");
const fetchNews = require("../utils/news");
const sendEmail = require("../utils/email");
const Alert = require("../models/alertsModel");

const { io } = require("../app");

/* RUN EVERY MINUTE */
cron.schedule("* * * * *", async () => {
  try {
    console.log("Running News Cron...");

    const now = new Date();
    const currentHour = now.getHours();
    const currentMinute = now.getMinutes();

    const currentTime = `${String(currentHour).padStart(2, "0")}:${String(
      currentMinute
    ).padStart(2, "0")}`;

    const categories = [
      "technology",
      "sports",
      "business",
      "health",
      "science",
      "entertainment",
      "politics",
      "world",
    ];

    for (const cat of categories) {

      const apiNews = await fetchNews([cat]);

      if (!apiNews || !Array.isArray(apiNews)) continue;

      for (const item of apiNews) {

        const exists = await News.findOne({ title: item.title });
        if (exists) continue;

        /* SAVE NEWS */
        await News.create({
          title: item.title,
          description: item.description,
          category: cat,
          link: item.url,
          image: item.urlToImage,
          source: "api",
        });

        /* FIND USERS */
        const prefs = await Preference.find({
          categories: { $in: [cat] },
        }).populate("userId");

        for (const p of prefs) {
          if (!p.userId) continue;

          /* EMAIL */
          if (p.notifications?.email !== false) {
            const shouldEmail =
              p.frequency === "instant" ||
              (p.frequency === "hourly" && currentMinute === 0) ||
              (p.frequency === "daily" && p.time === currentTime);

            if (shouldEmail) {
              await sendEmail(
                p.userId.email,
                "Breaking News Alert",
                `${item.title}<br/><br/>Read More: ${item.url}`
              );
            }
          }

          /* PUSH */
          if (p.notifications?.push === true && io) {
            io.to(p.userId._id.toString()).emit("notification", {
              title: item.title,
              description: item.description,
              category: cat,
              link: item.url,
            });
          }

          /* ALERT STORE */
          await Alert.create({
            userId: p.userId._id,
            title: item.title,
            description: item.description,
            link: item.url,
            categories: [cat],
            type: "news",
            source: "api",
            isRead: false,
            hidden: false,
          });
        }
      }
    }

  } catch (error) {
    console.log("Cron Error:", error.message);
  }
});

console.log("Cron Started");