const axios = require('axios');
const { NEWS_API_KEY } = require('../utils/config');

const fetchNews = async (categories) => {
    let allArticles = [];

    for (let category of categories) {
        const response = await axios.get(
            "https://newsapi.org/v2/everything",
            {
                params: {
                    q: category,
                    pageSize: 5,
                    apiKey: NEWS_API_KEY
                }
            }
        );

        const articles = response.data.articles.map(article => ({
            title: article.title,
            description: article.description,
            url: article.url,
            source: article.source.name,
            category: category
        }));

        allArticles.push(...articles);
    }

    return allArticles;
};

module.exports = fetchNews;