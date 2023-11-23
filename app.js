const express = require('express');

const { getTopics, handleFourOhFour, getAllEndpoints, getCommentsByArticleId, getArticles, getArticleById  } = require('./controllers/server-controllers');

const { handleCustomErrors, handlePsqErrors} = require('./errors/errors');

const app = express();

app.use(express.json());


app.get('/api/topics', getTopics);
app.get('/api',getAllEndpoints)

app.get('/api/articles/:article_id/comments', getCommentsByArticleId);

app.get('/api/articles', getArticles);

app.get('/api/articles/:article_id', getArticleById);


app.use(handleCustomErrors)
app.use(handlePsqErrors)

app.all("*", handleFourOhFour);

module.exports = app;