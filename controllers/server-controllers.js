

const {
    selectTopics,selectCommentsByArticleId, selectArticles, selectArticleById, updateArticleById, addNewComment,removeCommentById
  } = require("../models/server-models");
  const endpoints = require("../endpoints.json");


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


exports.getCommentsByArticleId = (req, res, next) => {
    const {article_id}=req.params
    const commentPromise=[selectCommentsByArticleId(article_id)]
    if (article_id)
    {
        commentPromise.push(checkArticle_idExists(article_id))
    }
    Promise.all(commentPromise)
    .then((resolvedPromises)=>{
        const comments=resolvedPromises[0]
        res.status(200).send({comments});
    })
    .catch(next)
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
    const promises=[checkArticle_idExists(article_id),checkUsernameExists(newComment.author),addNewComment(newComment,article_id)]
        Promise.all(promises)
        .then((result)=>{
            comment=result[2]
            res.status(201).send({comment});
        })
        .catch(next)   
}

    

exports.patchArticleById= (req, res, next) => {
    const newVote=req.body
    const {article_id}=req.params
    const commentPromise=[updateArticleById(newVote,article_id)]
        
        commentPromise.push(checkArticle_idExists(article_id))
    
    Promise.all(commentPromise)
    .then((resolvedPromises)=>{
        const article=resolvedPromises[0]
        res.status(200).send({article});
    })
    .catch(next)
}

exports.deleteCommentById = (req, res, next) => {
    const {comment_id } = req.params;
    removeCommentById(comment_id).then(() => {
    res.status(204).send();
  }).catch((err)=>{next(err)});
    
}




    