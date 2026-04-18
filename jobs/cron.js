const cron = require("node-cron");
const News = require("../models/newsModel");
const Preference = require("../models/preferencesModel");
const fetchNews = require("../utils/news");
const sendMail = require("../utils/email");
const AlertHistory = require("../models/alertsModel");

const { io } = require("../app");

/* RUN EVERY MINUTE */
cron.schedule("* * * * *", async () => {
  try {
    console.log("Running News Cron...");

    const now = new Date();
    const currentHour = now.getHours();
    const currentMinute = now.getMinutes();

    const currentTime = `${String(currentHour).padStart(2, "0")}:${String(
      currentMinute,
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

        /* FIND USERS WHO SELECTED CATEGORY */
        const prefs = await Preference.find({
          categories: cat,
        }).populate("userId");

        for (const p of prefs) {
          if (!p.userId) continue;

          let shouldSend = false;

          /* INSTANT */
          if (p.frequency === "instant") {
            shouldSend = true;
          }

          /* HOURLY => minute 0 */
          if (p.frequency === "hourly" && currentMinute === 0) {
            shouldSend = true;
          }

          /* DAILY => selected time */
          if (p.frequency === "daily" && p.time && p.time === currentTime) {
            shouldSend = true;
          }

          if (!shouldSend) continue;

          /* EMAIL */
          if (p.notifications?.email !== false) {
            await sendMail(
              p.userId.email,
              "Breaking News Alert",
              `${item.title}<br/><br/>Read More: ${item.url}`,
            );

            console.log("Mail Sent:", p.userId.email);
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

          /* STORE ALERT HISTORY */
          await AlertHistory.create({
            userId: p.userId._id,
            title: item.title,
            description: item.description,
            category: cat,
            link: item.url,
            image: item.urlToImage,
            source: "api",
          });
        }
      }
    }
  } catch (error) {
    console.log("Cron Error:", error.message);
  }
});

console.log("Cron Started");
