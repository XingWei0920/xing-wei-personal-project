const {
    selectTopics,selectArticles, selectArticleById,addNewComment
  } = require("../models/server-models");
  const endpoints= require("../endpoints.json");

  const{checkArticle_idExists}=require("../models/articles-models")


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
        console.log(article_id)
        const commentPromise=[addNewComment(newComment,article_id)]
        if (article_id)
        {
            commentPromise.push(checkArticle_idExists(article_id))
        }
        Promise.all(commentPromise)
        .then((resolvedPromises)=>{
            
            const comment=resolvedPromises[0]
            res.status(201).send({comment});
        })
        .catch(next)
    }
    

    