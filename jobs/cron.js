const cron = require("node-cron");
const News = require("../models/newsModel");
const Preference = require("../models/preferencesModel");
const sendEmail = require("../utils/email");
const Alert = require("../models/alertsModel");
const { io } = require("../app");

cron.schedule("* * * * *", async () => {
  try {
    console.log("Running News Cron...");

    // Get latest news once
    const adminNews = await News.find().sort({ createdAt: -1 });

    // Get users who want email notifications
    const prefs = await Preference.find({
      "notifications.email": true,
    }).populate("userId");

    for (const pref of prefs) {
      try {
        if (!pref.userId) continue;

        const userId = pref.userId._id.toString();
        const userEmail = pref.userId.email;

        // Ensure array exists
        const sentIds = new Set(
          (pref.sentNewsIds || []).map((id) => id.toString()),
        );

        // Match news by category
        const matchedNews = adminNews.filter((news) =>
          (pref.categories || []).some(
            (cat) => cat.toLowerCase() === news.category.toLowerCase(),
          ),
        );

        // Filter only unsent news
        const newNews = matchedNews.filter(
          (news) => !sentIds.has(news._id.toString()),
        );

        if (!newNews.length) continue;

        console.log("Sending to:", userEmail);

        // Safe format
        const safeNews = newNews.map((n) => ({
          title: n.title,
          description: n.description,
          link: n.link,
          category: n.category,
          image:
            typeof n.image === "string" && n.image
              ? `${process.env.BASE_URL}/uploads/${n.image}`
              : null,
        }));

        // 1. SEND EMAIL
        await sendEmail(
          userEmail,
          pref.userId.name,
          "Your Personalized News Feed",
          safeNews,
        );

        // 2. SOCKET NOTIFICATION
        io.to(userId).emit("new-notification", {
          title: newNews[0]?.title || "New news available",
          message: newNews[0]?.description || newNews[0]?.title,
          news: safeNews,
        });

        // 3. ALERT DB
        await Alert.create({
          userId,
          title: newNews[0]?.title || "News Update",
          description: newNews[0]?.title || "New updates available",
          link: newNews[0]?.link || "",
          categories: pref.categories || [],
          type: "news",
        });

        // 4. ATOMIC UPDATE (prevents duplicates)
        await Preference.updateOne(
          { _id: pref._id },
          {
            $addToSet: {
              sentNewsIds: { $each: newNews.map((n) => n._id.toString()) },
            },
          },
        );

        console.log("Sent successfully to:", userEmail);
      } catch (userError) {
        console.log("User cron error:", userError.message);
      }
    }
  } catch (error) {
    console.log("Cron Error:", error.message);
  }
});

console.log("Cron Started");
