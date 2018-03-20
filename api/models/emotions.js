var mongoose = require("mongoose");

// Course collection schema
var emotionSchema = new mongoose.Schema({
    username: String,
    emotions: [{
        time: Date,
        emotion: JSON
    }]
});

mongoose.model("Emotion", emotionSchema, "emotions");