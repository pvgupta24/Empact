var express = require('express');
var router = express.Router();
var path = require('path');
var ffmpeg = require('ffmpeg');
var base64Img = require('base64-img');
var fs = require('fs');


/* GET users listing. */
router.post('/', function(req, res, next) {
  
  //console.log(req.body);
  base64Img.img(req.body.imgBase64, './public/images', '1', function(err, filepath) {
  	//console.log("done");
  	console.log(filepath);
  	res.send("done");
  });

});

module.exports = router;
