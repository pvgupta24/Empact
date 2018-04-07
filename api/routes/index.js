var express = require('express');
var router = express.Router();
var jwt = require('express-jwt');
var auth = jwt({
  secret: 'MY_SECRET',
  userProperty: 'payload'
});

var ctrlProfile = require('../controllers/profile');
var ctrlAuth = require('../controllers/authentication');
var ctrlEmotion = require('../controllers/emotion');
var ctrlUpload = require('../controllers/upload');
var ctrlRoom = require('../controllers/rooms');

// profile
router.get('/profile', auth, ctrlProfile.profileRead);

// authentication
router.post('/register', ctrlAuth.register);
router.post('/login', ctrlAuth.login);

// /api/emotion routes
router.post('/emotion',ctrlEmotion.addEmotion);
router.get('/emotion',ctrlEmotion.getEmotions);

// Room route
router.post('/newRoom', ctrlRoom.createRoom);
router.post('/joinRoom', ctrlRoom.joinRoom);
router.post('/viewRooms', ctrlRoom.viewRooms);

// upload routes
router.post('/upload', ctrlUpload.upload);
router.post('/getURL', ctrlUpload.getURL);

module.exports = router;
