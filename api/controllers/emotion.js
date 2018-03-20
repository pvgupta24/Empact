var mongoose = require('mongoose');
var Emotion = mongoose.model("Emotion", "emotions");

module.exports.addEmotion = function(req, res) {
    //Search if exists in table
    //add new if no
    console.log('Received' + JSON.stringify(req.body));
    // else append to user data
    //var emotion = new Emotion();
    //console.log(emotion);
    var username = "shashank";
    //emotion.username = "pv";//req.body.user
    //emotion.emotions.push({"time": new Date(), "emotion": req.body.faceAttributes.emotion});
    // console.log(emotion);
    //
    /*
    * db.events.update( { "user_id" : "714638ba-2e08-2168-2b99-00002f3d43c0" },
    { $push : { "events" : { "profile" : 10, "data" : "X"}}}, {"upsert" : true});
    */
    /*emotion.save(function(err,saved) {
        if(err)
            console.log("Error..\t"+err);
        else
            console.log("Saved\t"+saved);
        res.status(200);
    });*/
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
   /* console.log("Searching and sending "+req.params.course);
    var _id = (req.params.course);

    Course.findById(_id ,function(err,data){
        if(err) {
            console.log(err)
            res.status(404).json(err);
        }
        console.log(data);
        res.status(200).json(data);
    });*/
};
