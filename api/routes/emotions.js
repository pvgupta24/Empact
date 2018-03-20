var express = require('express');
var router = express.Router();
var ctrlEmotion = require('../controllers/emotion');


router.post('/',ctrlEmotion.addEmotion);
module.exports = router;