const db = require("../db/connection");

exports.selectTopics = (req, res, next) => {
    let queryString =
    "SELECT * FROM topics;";

    return db.query(queryString).then((result) => {
        return result.rows;
      });
}