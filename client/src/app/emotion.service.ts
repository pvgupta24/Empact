import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http'
import 'rxjs/add/operator/map';

declare var Webcam: any;

@Injectable()
export class EmotionService {

	constructor(private http: HttpClient) { }

	setWebCam() {
		Webcam.set({
			width: 320,
			height: 240,
			image_format: 'jpeg',
			jpeg_quality: 90
		});
		Webcam.attach('#my_camera');
	}

	plot(curr) {
		console.log(curr);
	}
	getAllEmotions() {
		return this.http.get("/api/emotion").map(res => res);
	}
	// getEmotions(username) {

	// 	var canvas = document.getElementById('viewport'),
	// 		context = (<any>canvas).getContext('2d');
	// 	var subscriptionKey = "3bc85828a3ed453985e467b187497e05";


	// 	var uriBase = "https://westus.api.cognitive.microsoft.com/face/v1.0/detect";
	// 	// Request parameters.
	// 	var params = {
	// 		"returnFaceId": "true",
	// 		"returnFaceLandmarks": "false",
	// 		"returnFaceAttributes": "age,gender,smile,emotion",
	// 	};

	// 	// take snapshot and get image data through Face API
	// 	Webcam.snap(function (data_uri) {
	// 		var base_image = new Image();
	// 		base_image.src = data_uri;
	// 		base_image.onload = function () {
	// 			context.drawImage(base_image, 0, 0, 320, 240);

	// 			let data = (<any>canvas).toDataURL('image/jpeg');

	// 			fetch(data)
	// 				.then(res => res.blob())
	// 				.then(blobData => {

	// 					$.post({
	// 						url: uriBase + "?" + $.param(params),
	// 						contentType: "application/octet-stream",
	// 						headers: {
	// 							"Ocp-Apim-Subscription-Key": subscriptionKey
	// 						},
	// 						processData: false,
	// 						data: blobData
	// 					})
	// 						.done(function (data) {
	// 							if (data != undefined) {
	// 								$("#results").text(JSON.stringify(data[0].faceAttributes));
	// 								sendEmotions(data[0]);
	// 							} else
	// 								console.log("Could not receive emotions");
	// 						})
	// 						.fail(function (err) {
	// 							// $("#results").text(JSON.stringify(err));
	// 						});
	// 				});
	// 		};
	// 	});

	// 	// post request to DB to save the emotions in DataBase
	// 	var sendEmotions = function (data) {
	// 		console.log("Sending" + JSON.stringify(data));
	// 		console.log(username);
	// 		$.post({
	// 			url: "/api/emotion",
	// 			contentType: "application/json",
	// 			data: JSON.stringify({
	// 				"username": username,
	// 				"payload": data
	// 			})
	// 		}).done(function (data) {
	// 			//$("#results").text(JSON.stringify(data));
	// 			console.log(data);
	// 		})
	// 			.fail(function (err) {
	// 				// $("#results").text(JSON.stringify(err));
	// 			});
	// 	};
	// }
}
