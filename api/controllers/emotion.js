var mongoose = require('mongoose');
var Emotion = mongoose.model("Emotion", "emotions");

module.exports.addEmotion = function(req, res) {
    //Search if exists in table
    //add new if no
    console.log('Received' + JSON.stringify(req.body));
    // else append to user data
    var emotion = new Emotion();
    console.log(emotion);
    emotion.username = "pv";//req.body.user
    emotion.emotions.push({"time": new Date(),"emotion": req.body.faceAttributes.emotion});
    console.log(emotion);
     //

    emotion.save(function(err,saved) {
        if(err)
            console.log("Error..\t"+err);
        else
            console.log("Saved\t"+saved);
        res.status(200);
    });
};
/*

module.exports.getEmotions = function(req,res){
    console.log("Searching and sending "+req.params.course);
    var _id = (req.params.course);

    Course.findById(_id ,function(err,data){
        if(err) {
            console.log(err)
            res.status(404).json(err);
        }
        console.log(data);
        res.status(200).json(data);
    });
};*/
