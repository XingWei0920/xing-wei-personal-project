const express = require('express');
const cors = require('cors');



const { getTopics, handleFourOhFour, getAllEndpoints, getCommentsByArticleId, getArticles, getArticleById, patchArticleById,postCommentsByArticleId,deleteCommentById,getUsers,  } = require('./controllers/server-controllers');


const { handleCustomErrors, handlePsqErrors} = require('./errors/errors');

const app = express();
app.use(cors());
app.use(express.json());


app.get('/api/topics', getTopics);
app.get('/api',getAllEndpoints)

app.get('/api/articles', getArticles);

app.get('/api/articles/:article_id', getArticleById);
app.post('/api/articles/:article_id/comments',postCommentsByArticleId);


app.get('/api/articles/:article_id/comments', getCommentsByArticleId);

app.patch('/api/articles/:article_id', patchArticleById);

app.delete('/api/comments/:comment_id', deleteCommentById);

app.get('/api/users', getUsers);

app.use(handleCustomErrors)
app.use(handlePsqErrors)

app.all("*", handleFourOhFour);

module.exports = app;