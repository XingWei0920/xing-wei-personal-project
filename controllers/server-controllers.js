const {
    selectTopics,selectCommentsByArticleId,
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

exports.getCommentsByArticleId = (req, res, next) => {
    const {article_id}=req.params
    selectCommentsByArticleId(article_id)
    .then((comments)=>{
        console.log(comments)
        res.status(200).send({comments});
    })
    .catch(next)
}
  
