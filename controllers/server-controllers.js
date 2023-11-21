const {
    selectTopics, selectAllEndpoints
  } = require("../models/server-models");

exports.getTopics = (req, res, next) => {
    selectTopics()
    .then((topics)=>{
        res.status(200).send({topics});
    })
    .catch(next)
}

exports.getAllEndpoints= (req, res, next) => {
    selectAllEndpoints()
    .then((allEndpoints)=>{
        console.log(JSON.parse(allEndpoints))
        res.status(200).send({msg:JSON.parse(allEndpoints)});
    })
    .catch(next)
}

exports.handleFourOhFour = (req, res) => {
    res.status(404).send ({msg: "path not found"})
}


  
