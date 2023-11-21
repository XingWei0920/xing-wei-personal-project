const express = require('express');
// const { getTreasures, getTreasuresSorted} = require('./controllers/treasures-controllers');
const { getTopics, handleFourOhFour  } = require('./controllers/server-controllers');
const { handleCustomErrors, handlePsqErrors} = require('./errors/errors');

const app = express();

app.use(express.json());


app.get('/api/topics', getTopics);

app.use(handleCustomErrors)
app.use(handlePsqErrors)

app.all("*", handleFourOhFour);

module.exports = app;