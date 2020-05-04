var express = require("express");
var request = require('request');
var fetch = require("node-fetch");
var router = express.Router();
require('dotenv').config();

router.get("/", (req, res) => {
  let gUrl = 'https://api.samsara.com/v1/fleet/drivers/'+req.query.driverId+'/safety/score?access_token='+process.env.token+'&startMs='+req.query.startMs+'&endMs='+req.query.endMs;

  fetch(gUrl)
  .then(response => {
    response.json().then(json => {
      res.json(json)
    })
  })
  .catch(error => {
    console.log(error)
  })
});


module.exports = router;