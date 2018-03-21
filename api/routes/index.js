var express = require('express');
var router = express.Router();
var jwt = require('express-jwt');
var auth = jwt({
  secret: 'MY_SECRET',
  userProperty: 'payload'
});

var ctrlProfile = require('../controllers/profile');
var ctrlAuth = require('../controllers/authentication');
// var ctrlCourse = require('../controllers/course');
var ctrlEmotion = require('../controllers/emotion');

// profile
router.get('/profile', auth, ctrlProfile.profileRead);

// authentication
router.post('/register', ctrlAuth.register);
router.post('/login', ctrlAuth.login);

// /api/emotion routes
router.post('/emotion',ctrlEmotion.addEmotion);
router.get('/emotion',ctrlEmotion.getEmotions);

// New Room route
router.post('/newRoom',ctrlProfile.addRoom);

module.exports = router;
