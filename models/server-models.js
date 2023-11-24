

const db = require("../db/connection");
const fs = require('fs/promises');
const { articleData } = require("../db/data/development-data");
const articles = require("../db/data/development-data/articles");

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
    "SELECT articles.*, COUNT(comments.article_id)::INT AS comment_count FROM articles LEFT JOIN comments ON articles.article_id=comments.article_id WHERE articles.article_id = $1 GROUP BY articles.article_id";
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

exports.updateArticleById= (newVote,article_id) => {
    const {inc_votes}=newVote
    const queryString =
    "UPDATE articles SET votes = $1 WHERE article_id = $2 RETURNING *";
    return db.query(queryString,[inc_votes,article_id]).then((result) => {
        return result.rows[0]
      });
}

exports.removeCommentById = (comment_id) =>
{
    return db.query('DELETE FROM comments WHERE comment_id = $1;', [comment_id])
  .then((result)=>{
    if (result.rowCount===0)
    {
      return Promise.reject({status:404, msg:'comment does not exist'})
    }
  });
}

exports.selectUsers = (req, res, next) => {
    let queryString =
    "SELECT username, name, avatar_url FROM users;";
    return db.query(queryString)
    .then((result) => {
        return result.rows;
      });
}
