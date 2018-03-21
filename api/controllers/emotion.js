var mongoose = require('mongoose');
var Emotion = mongoose.model("Emotion", "emotions");

module.exports.addEmotion = function(req, res) {
    console.log('Received emotion : ' + JSON.stringify(req.body));
    var username = "shashank";
    
    let query = {"username": username};
    let update = {"$push": {"emotions": {"time": new Date(), "emotion": req.body.faceAttributes.emotion}}};
    Emotion.findOneAndUpdate(query, update, {upsert: true, new: true}, function (err,doc) {
        if(err)
            res.error=err;
        else
            return res.status(200).send(doc);
    });
};

module.exports.getEmotions = function(req,res){
    Emotion.find(function (err, emotion) {
       if(err){
           res.send(err);
       }
       else{
           res.send(emotion);
       }
    });
};
