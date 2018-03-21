var mongoose = require("mongoose");

//Emotion collection schema
var emotionSchema = new mongoose.Schema({
    username: String,
    emotions: [{
        time: Date,
        emotion: JSON
    }]
});

mongoose.model("Emotion", emotionSchema, "emotions");