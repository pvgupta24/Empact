var mongoose = require('mongoose');
var Rooms = mongoose.model('Rooms');
var vindexer = require('video-indexer');

var Vindexer = new vindexer("669b250a21b94cda9164021659cc1aa0");

console.log("here in upload");

// to upload video to videoIndexer
module.exports.upload = function(req, res){
	//expect VideoURL here
	//console.log(req);
	videoUrl = req.body.videoUrl;
	roomID = req.body.roomID;
	
	Vindexer.getAccounts()
		.then(function(result){ console.log(result.body)});

	Vindexer.uploadVideo({
		videoUrl: videoUrl,
	    privacy: 'Private', 
	    language: 'English'
	}).then(function(result){
		// will get the ID of the video uploaded
		console.log(result.body);
		Rooms.findOneAndUpdate({roomID: roomID},{$set: {"videoUrl": videoUrl, "videoID":result.body}}, function(err, room){
			res.send("VideoURL and ID updated")
		});
	});
}

// to get the player URL, and insightWidgetURL
module.exports.getURL = function(req, res){
	roomID = req.body.roomID;

	Rooms.findOne({roomID:roomID}, function(err, room){
		if(err){

		}
		else{
			var urls = {};

			console.log(room.videoID);
			var arr = room.videoID.split("\"");

			
			Vindexer.getPlayerWidgetUrl(arr[1])
				.then( function(result){ 
					console.log("player widget");
					urls.PlayerWidgetUrl = result.body 
					Vindexer.getInsightsWidgetUrl(arr[1])
						.then( function(result){ 
							console.log("insight widget");
							urls.InsightsWidgetUrl = result.body 

							res.send(urls);
						});
				});	
		}
	});

	
}
