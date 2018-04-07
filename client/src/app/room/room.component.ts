import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from "@angular/router";
import { AuthenticationService, UserDetails } from '../authentication.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Chart } from "chart.js";
import { EmotionService } from "../emotion.service";

declare function JitsiMeetExternalAPI(a, b): void;
declare function takeSnap(a): any;

@Component({
	selector: 'app-room',
	templateUrl: './room.component.html',
	styleUrls: ['./room.component.css']
})
export class RoomComponent implements OnInit {
	room;
	api;
	sessionStatus: boolean = false;
	user: UserDetails;
	chart = [];
	constructor(private auth: AuthenticationService, private route: ActivatedRoute, private emotion: EmotionService) {
		this.route.params.subscribe(params => this.room = params.room);
		console.log("Current room is " + this.room);
	}
	httpOptions = {
		headers: new HttpHeaders({ 'Content-Type': 'application/json' })
	};
	ngOnInit() {
		this.emotion.setWebCam();
		this.auth.profile().subscribe(user => {
			this.user = user;
		}, (err) => {
			console.error(err);
		});

		// setInterval(() => {console.log('Hey')},4000);
	}
	startSession() {
		console.log("Connecting to room");
		let domain = "meet.jit.si";
		let options = {
			roomName: "empact-room-" + this.room,// +"somerandom",
			width: 700,
			height: 600,
			parentNode: document.querySelector('#meet')
		}
		this.sessionStatus = true;
		this.api = new JitsiMeetExternalAPI(domain, options);
		this.api.executeCommand('displayName', this.user.name);
		takeSnap(this.user.name);
	}
	sendSnaps() {
		// takeSnap(this.user.name);
	}
	stopSession() {
		this.api.dispose();
		this.sessionStatus = false;
	}
	getAllEmotions(){
		this.emotion.getAllEmotions();
	}
	plotChart() {
		this.emotion.dailyForecast()
			.subscribe(res => {
				console.log(res);

				let temp_max = res['list'].map(res => res.main.temp_max);
				let temp_min = res['list'].map(res => res.main.temp_min);
				let alldates = res['list'].map(res => res.dt);

				let weatherDates = [];
				alldates.forEach((res) => {
					let jsdate = new Date(res * 1000)
					weatherDates.push(jsdate.toLocaleTimeString('en', { year: 'numeric', month: 'short', day: 'numeric' }))
				})
				this.chart = new Chart('canvas', {
					type: 'line',
					data: {
						labels: weatherDates,
						datasets: [
							{
								data: temp_max,
								borderColor: "#3cba9f",
								fill: false,
								label: "Label"

							},
							{
								data: temp_min,
								borderColor: "#ffcc00",
								fill: true
							},
						]
					},
					options: {
						legend: {
							display: true
						},
						scales: {
							xAxes: [{
								display: true
							}],
							yAxes: [{
								display: true
							}],
						},
						animation: {
							duration: 0, // general animation time
						},
						hover: {
							animationDuration: 0, // duration of animations when hovering an item
						},
						responsiveAnimationDuration: 0, // animation duration after a resize
					}
				});
			})
		let emotionDates = [];

	}
	// TODO: Use TS sendEmotion(){}
}
