

const db = require("../db/connection");
const fs = require('fs/promises')

exports.selectTopics = () => {
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
    


exports.selectArticles = (req, res, next) => {
    let queryString =
    "SELECT articles.author, articles.title, articles.article_id, articles.topic, articles.created_at, articles.votes, articles.article_img_url, COUNT(comments.article_id)::INT AS comment_count FROM articles LEFT JOIN comments ON articles.article_id=comments.article_id GROUP BY articles.article_id ORDER BY articles.created_at DESC;";

    return db.query(queryString).then((result) => {

        return result.rows;
      });
}

exports.selectArticleById= (article_id) => {
    const queryString =
    "SELECT * FROM articles WHERE article_id = $1;";
    return db.query(queryString,[article_id]).then((result) => {
        if(!result.rows.length)
        {
            return Promise.reject({status: 404, msg:"not found"})
        }
        else
        {
            return result.rows;
        }
      });
}

exports.updateArticleById= (newVote,article_id) => {
    const {inc_votes}=newVote
    const queryString =
    "UPDATE articles SET votes = $1 WHERE article_id = $2 RETURNING *";
    return db.query(queryString,[inc_votes,article_id]).then((result) => {
        return result.rows[0]
      });
}