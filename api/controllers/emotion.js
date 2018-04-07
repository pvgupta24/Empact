var mongoose = require('mongoose');
var Emotion = mongoose.model("Emotion", "emotions");

// function to addEmotions to the CosmosDB database: Emotion Schema
module.exports.addEmotion = function(req, res) {
    //console.log('Received emotion : ' + JSON.stringify(req.body));
    let username = req.body.username;
    let emotion = req.body.payload.faceAttributes.emotion;
    //console.log(emotion);    
    let query = {"username": username};
    let update = {"$push": {"emotions": {"time": new Date(), "emotion": emotion}}};
    // If user not present create a new one, else update in the Emotion Schema
    Emotion.findOneAndUpdate(query, update, {upsert: true, new: true}, function (err,doc) {
        if(err){   
            console.log(err);
            res.error=err;
        }
        else
            return res.status(200).send(doc);
    });
};

// function to retreiveEmotions from CosmosDB database: Emotion Schema
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
