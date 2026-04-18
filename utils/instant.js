const Preference = require("../models/preferencesModel");
const fetchNews = require("./news");
const sendEmail = require("./email");

const sendInstantNews = async (newArticle) => {
  try {
    // 1. find instant users who match category
    const users = await Preference.find({
      frequency: "instant",
      categories: newArticle.category
    });

    // 2. send immediately
    for (let user of users) {
      await sendEmail(user.userId, newArticle);
    }

  } catch (error) {
    console.log("Instant dispatch error:", error.message);
  }
};

module.exports = sendInstantNews;