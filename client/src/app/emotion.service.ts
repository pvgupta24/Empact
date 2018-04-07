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

	plot(emotionsJSON, i, username){

	}
	getAllEmotions() {
		return this.http.get("/api/emotion")
			.subscribe((res) => {
				console.log("Emotions = ");
				console.log(res);
				//Iterate through Users
				for (var i = 0; i < (<any>res).length; i++) {
					var emotionsGot = [];
					var emotionsJSON = new Array();
					var time = [];
					var username;
					//console.log(res[i].emotions);
					for (var j = 0; j < res[i].emotions.length; j++) {
						username = res[i].username;
						emotionsGot[j] = res[i].emotions[j]["emotion"];
						emotionsGot[j]["time"] = j;
						emotionsJSON.push(emotionsGot[j]);
					}
					// plot the graph for that particular User
					this.plot(emotionsJSON, i, username);
				}
			}, (err) => {
				console.error(err);
			});
	}
	dailyForecast() {
		return this.http.get("http://samples.openweathermap.org/data/2.5/history/city?q=Warren,OH&appid=b6907d289e10d714a6e88b30761fae22")
			.map(result => result);
	}
}
