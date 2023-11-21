const {
    selectTopics,
    selectArticleById,
  } = require("../models/server-models");

exports.getTopics = (req, res, next) => {
    selectTopics()
    .then((topics)=>{
        res.status(200).send({topics});
    })
    .catch(next)
}

exports.handleFourOhFour = (req, res) => {
    res.status(404).send ({msg: "path not found"})
}

exports.getArticleById= (req, res, next) => {
    const {article_id}=req.params
    selectArticleById(article_id)
    .then((article)=>{
        res.status(200).send({article});
    })
    .catch(next)
}

  
