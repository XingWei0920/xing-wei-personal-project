const {
    selectTopics,selectArticles, selectArticleById,addNewComment
  } = require("../models/server-models");
  const endpoints= require("../endpoints.json");

  const{checkArticle_idExists, checkUsernameExists}=require("../models/articles-models")


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

exports.postCommentsByArticleId = (req, res, next) => {
        const {article_id}=req.params
        const newComment=req.body
        if (article_id)
        {
            return checkArticle_idExists(article_id)
            .then (()=>{
                return checkUsernameExists(newComment.author)
            })
            .then(()=>{
                return addNewComment(newComment,article_id)})
            .then((comment)=>{
                res.status(201).send({comment});
            })
            .catch(next)
        }
        
    }
    

    