const {
    selectTopics,
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


  
