var mongoose = require("mongoose");

//Rooms collection schema
var roomSchema = new mongoose.Schema({
	roomID: String,
    videoID: String,
    videoURL : String,
    users: [String],
    owner: String
});

mongoose.model("Rooms", roomSchema, "rooms");