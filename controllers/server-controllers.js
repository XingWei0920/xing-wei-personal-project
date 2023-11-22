const {
    selectTopics,selectArticles, selectArticleById,
  } = require("../models/server-models");
  const endpoints= require("../endpoints.json")

exports.getTopics = (req, res, next) => {
    selectTopics()
    .then((topics)=>{
        res.status(200).send({topics});
    })
    .catch(next)
}

exports.getAllEndpoints= (req, res, next) => 
{
    res.status(200).send(endpoints)
}

exports.handleFourOhFour = (req, res) => {
    res.status(404).send ({msg: "path not found"})
}


exports.getArticles= (req, res, next) => {
    selectArticles()
    .then((articles)=>{
        res.status(200).send({articles});
    })
    .catch(next)
}

exports.getArticleById= (req, res, next) => {
    const {article_id}=req.params
    selectArticleById(article_id)
    .then((article)=>{
        res.status(200).send({article});
    })
    .catch(next)
}


  
