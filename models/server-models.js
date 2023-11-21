const db = require("../db/connection");

exports.selectTopics = () => {
    let queryString =
    "SELECT * FROM topics;";

    return db.query(queryString).then((result) => {
        return result.rows;
      });
}

exports.selectArticleById= (article_id) => {
    let queryString =
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