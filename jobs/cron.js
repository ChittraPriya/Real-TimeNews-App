const cron = require("node-cron");
const News = require("../models/newsModel");
const Preference = require("../models/preferencesModel");
const sendEmail = require("../utils/email");
const Alert = require("../models/alertsModel");
const { app } = require("../app");

cron.schedule("*/5 * * * *", async () => {
  try {
    console.log("Running News Cron...");

    const io = app.get("io");

    // 🔹 Fetch latest news
    const adminNews = await News.find().sort({ createdAt: -1 });

    // 🔹 Fetch only users who enabled email notifications
    const prefs = await Preference.find({
      "notifications.email": true,
    }).populate("userId");

    for (const pref of prefs) {
      try {
        if (!pref.userId || !pref.userId.email) continue;

        const userId = pref.userId._id.toString();
        const userEmail = pref.userId.email;

        const sentIds = new Set(
          (pref.sentNewsIds || []).map((id) => id.toString())
        );

        // 🔹 Match category safely
        const matchedNews = adminNews.filter((news) =>
          (pref.categories || []).some(
            (cat) =>
              cat?.toLowerCase?.() === news.category?.toLowerCase?.()
          )
        );

        // 🔹 Only new news
        const newNews = matchedNews.filter(
          (news) => !sentIds.has(news._id.toString())
        );

        if (newNews.length === 0) continue;

        console.log(`Sending to: ${userEmail} | News: ${newNews.length}`);

        // 🔹 Format safe payload
        const safeNews = newNews.map((n) => ({
          title: n.title,
          description: n.description,
          link: n.link,
          category: n.category,
          image: n.image || null,
        }));

        // =========================
        // 1. EMAIL
        // =========================
        await sendEmail(
          userEmail,
          pref.userId.name,
          "Your Personalized News Feed",
          safeNews
        );

        // =========================
        // 2. SOCKET
        // =========================
        if (io) {
          io.to(userId).emit("new-notification", {
            title: newNews[0]?.title,
            message: newNews[0]?.description,
            news: safeNews,
          });
        }

        // =========================
        // 3. ALERT DB
        // =========================
        await Alert.create({
          userId,
          title: newNews[0]?.title || "News Update",
          description: newNews[0]?.description || "New updates available",
          link: newNews[0]?.link || "",
          categories: pref.categories || [],
          type: "news",
        });

        // =========================
        // 4. SAVE SENT IDS
        // =========================
        await Preference.updateOne(
          { _id: pref._id },
          {
            $addToSet: {
              sentNewsIds: {
                $each: newNews.map((n) => n._id),
              },
            },
          }
        );

        console.log("Sent successfully:", userEmail);
      } catch (userError) {
        console.log("User cron error:", userError.message);
      }
    }
  } catch (error) {
    console.log("Cron Error:", error.message);
  }
});

console.log("Cron Started");