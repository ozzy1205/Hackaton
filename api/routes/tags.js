var express = require("express");
var request = require('request');
var fetch = require("node-fetch");
var router = express.Router();
require('dotenv').config();

router.get("/", (req, res) => {

  let gUrl = `https://api.samsara.com/tags`

  fetch(gUrl, {
      method: 'get',
      headers: {
       'Authorization': 'Bearer '+ process.env.token
      }})
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