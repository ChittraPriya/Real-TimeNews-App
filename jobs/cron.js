const cron = require("node-cron");
const News = require("../models/newsModel");
const Preference = require("../models/preferencesModel");
const sendEmail = require("../utils/email");
const Alert = require("../models/alertsModel");
const { io } = require("../app");

cron.schedule("* * * * *", async () => {
  try {
    console.log("Running News Cron...");

    const adminNews = await News.find().sort({ createdAt: -1 });

    const prefs = await Preference.find({
      "notifications.email": true,
    }).populate("userId");

    for (const pref of prefs) {
      if (!pref.userId) continue;

      // ensure array exists (IMPORTANT FIX)
      pref.sentNewsIds = pref.sentNewsIds || [];

      // STEP 1: match news with user preference
      const matchedNews = adminNews.filter((news) =>
        pref.categories.some(
          (cat) =>
            cat.toLowerCase() === news.category.toLowerCase()
        )
      );

      // STEP 2: remove already sent news
      const newNews = matchedNews.filter(
        (news) => !pref.sentNewsIds.includes(news._id.toString())
      );

      // ❌ STOP if nothing new
      if (newNews.length === 0) continue;

      console.log("Sending to:", pref.userId.email);

      // STEP 3: EMAIL NOTIFICATION
      await sendEmail(
        pref.userId.email,
        pref.userId.name,
        "Your Personalized News Feed",
        newNews
      );

      // STEP 4: PUSH NOTIFICATION (Socket.IO)
      io.to(pref.userId._id.toString()).emit("new-notification", {
        title: "Breaking News",
        message: newNews[0]?.title || "New news available",
        news: newNews,
      });

      // STEP 5: SAVE ALERT IN DB
      const alert = await Alert.create({
        userId: pref.userId._id,
        title: `Breaking News (${newNews.length})`,
        description: newNews[0]?.title || "New updates available",
        link: newNews[0]?.link || "",
        categories: pref.categories || [],
        type: "news",
      });

      // STEP 6: STORE SENT NEWS IDS (PREVENT DUPLICATE EMAILS)
      pref.sentNewsIds = [
        ...pref.sentNewsIds,
        ...newNews.map((n) => n._id.toString()),
      ];

      await pref.save();

      console.log("Sent email + push to:", pref.userId.email);
    }
  } catch (error) {
    console.log("Cron Error:", error.message);
  }
});

console.log("Cron Started");