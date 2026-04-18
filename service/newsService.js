const News = require("../models/newsModel");
const fetchNews = require("../utils/news");

const fetchNewsAndStore = async (io, categories) => {
  const articles = await fetchNews(categories);

  for (let article of articles) {
    const saved = await News.create(article);

    // ⚡ REAL-TIME SOCKET
    io.emit("new-news", saved);
  }

  return articles;
};

module.exports = fetchNewsAndStore;