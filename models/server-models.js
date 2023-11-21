
const db = require("../db/connection");
const fs = require('fs/promises')

exports.selectTopics = (req, res, next) => {
    let queryString =
    "SELECT * FROM topics;";

    return db.query(queryString).then((result) => {
        return result.rows;
      });
}

exports.selectAllEndpoints= (req, res, next) => {
    return fs.readFile('endpoints.json')
    .then((data)=>{
        return data  })
       
}