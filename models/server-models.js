
const db = require("../db/connection");
const fs = require('fs/promises')

exports.selectTopics = (req, res, next) => {
    let queryString =
    "SELECT * FROM topics;";

    return db.query(queryString).then((result) => {
        return result.rows;
      });
}

exports.selectArticles = (req, res, next) => {
    let queryString =
    "SELECT articles.author, articles.title, articles.article_id, articles.topic, articles.created_at, articles.votes, articles.article_img_url, COUNT(comments.article_id)::INT AS comment_count FROM articles LEFT JOIN comments ON articles.article_id=comments.article_id GROUP BY articles.article_id ORDER BY articles.created_at DESC;";

    return db.query(queryString).then((result) => {
        return result.rows;
      });
}