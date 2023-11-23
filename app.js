const express = require('express');



const { getTopics, handleFourOhFour, getAllEndpoints, getCommentsByArticleId, getArticles, getArticleById, patchArticleById,postCommentsByArticleId  } = require('./controllers/server-controllers');


const { handleCustomErrors, handlePsqErrors} = require('./errors/errors');

const app = express();

app.use(express.json());


app.get('/api/topics', getTopics);
app.get('/api',getAllEndpoints)

app.get('/api/articles', getArticles);

app.get('/api/articles/:article_id', getArticleById);
app.post('/api/articles/:article_id/comments',postCommentsByArticleId);


app.get('/api/articles/:article_id/comments', getCommentsByArticleId);

app.patch('/api/articles/:article_id', patchArticleById);

app.use(handleCustomErrors)
app.use(handlePsqErrors)

app.all("*", handleFourOhFour);

module.exports = app;