
const db = require("../db/connection");
const fs = require('fs/promises')

exports.selectTopics = (req, res, next) => {
    let queryString =
    "SELECT * FROM topics;";

    return db.query(queryString).then((result) => {
        return result.rows;
      });
}

exports.selectCommentsByArticleId = (article_id) => {

    let queryString =
    "SELECT comments.comment_id, comments.votes, comments.article_id, comments.author, comments.created_at, comments.body FROM comments WHERE article_id=$1 ORDER BY created_at DESC;";

    return db.query(queryString,[article_id]).then((result) => {
        return result.rows;
      });
}