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
	dailyForecast() {
		return this.http.get("http://samples.openweathermap.org/data/2.5/history/city?q=Warren,OH&appid=b6907d289e10d714a6e88b30761fae22")
			.map(result => result);
	}
}
