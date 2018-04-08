var mongoose = require("mongoose");

//Rooms collection schema
var roomSchema = new mongoose.Schema({
    roomID: String,
    roomName: String,
    videoID: String,
    videoURL : String,
    users: [String],
    owner: String
});

mongoose.model("Rooms", roomSchema, "rooms");