var passport = require('passport');
var mongoose = require('mongoose');
var User = mongoose.model('User');

var sendJSONresponse = function(res, status, content) {
  res.status(status);
  res.json(content);
};

<<<<<<< HEAD
// module to register the User
=======

>>>>>>> bfea48e77353b663310ae830d239d343efa5e4d2
module.exports.register = function(req, res) {

  // if(!req.body.name || !req.body.email || !req.body.password) {
  //   sendJSONresponse(res, 400, {
  //     "message": "All fields required"
  //   });
  //   return;
  // }

  var user = new User();

  user.name = req.body.name;
  user.email = req.body.email;
  user.faculty = req.body.faculty;
  user.setPassword(req.body.password);

  user.save(function(err) {
    var token;
    // generate the token
    token = user.generateJwt();
    // send success status 200
    res.status(200);
    res.json({
      "token" : token
    });
  });
};

// module for login of User
module.exports.login = function(req, res) {

  // if(!req.body.email || !req.body.password) {
  //   sendJSONresponse(res, 400, {
  //     "message": "All fields required"
  //   });
  //   return;
  // }

  passport.authenticate('local', function(err, user, info){
    var token;

    // If Passport throws/catches an error
    if (err) {
      res.status(404).json(err);
      return;
    }

    // If a user is found
    if(user){
      // generate the token
      token = user.generateJwt();
      // send success status 200
      res.status(200);
      res.json({
        "token" : token
      });
    } else {
      // If user is not found
      res.status(401).json(info);
    }
  })(req, res);

};
