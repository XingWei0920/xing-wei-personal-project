
const db = require("../db/connection");
const fs = require('fs/promises')

exports.selectTopics = () => {
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

exports.addNewComment= (newComment,article_id) => {
    
    const {author, body}=newComment
    const queryString='INSERT INTO comments (body, author, article_id) VALUES ($1, $2, $3) RETURNING *;'
  
    return db.query(queryString,[body, author, article_id])
    .then((result)=>{
        return result.rows[0]
    })
    
}
