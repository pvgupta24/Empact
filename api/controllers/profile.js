var mongoose = require('mongoose');
var User = mongoose.model('User');

// function to read the profile of the user
module.exports.profileRead = function (req, res) {

  if (!req.payload._id) {
    res.status(401).json({
      "message": "UnauthorizedError: private profile"
    });
  } else {
    User.findById(req.payload._id)
      .exec(function (err, user) {
        console.log("Sending..\n" + user);
        res.status(200).json(user);
      });
  }
};


module.exports.addRoom = function (req, res) {
  let id = req.body.user;
  let updateObj = {
    $push: {
      "rooms": req.body.room
    }
  };
  User.findByIdAndUpdate(id, updateObj, function (err) {
    if (err) {
      console.log(err);
      res.error(err).send();
    }
    console.log("Added");
    res.status(200);
  });

};