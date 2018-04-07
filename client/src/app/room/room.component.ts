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
	items = [0,1,2,3];
	charts = [];

	// count = [];
	chart = [];

	// results:any = [];

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
		
		// TODO: Integrate with TS
		// takeSnap(this.user.name);
	}
	sendSnaps() {
		// takeSnap(this.user.name);
	}
	stopSession() {
		this.api.dispose();
		this.sessionStatus = false;
	}
	getAllEmotions() {
		this.emotion.getAllEmotions()
			.subscribe((res) => {
				console.log(res);
				
				for (var i = 0; i < (<any>res).length; i++) {
					let curr = {};
					curr['username'] = res[i].username;
					curr['emotions'] = res[i].emotions;
					curr['dates'] = res[i].emotions;
					//array of emotions in diff time
					this.plotChart(curr, i);
				}
			}, (err) => {
				console.error(err);
			});

	}
	plotChart(curr, i) {
		console.log(this.charts);
		console.log(curr);
		var dates = [];
		var happiness = [], surprise = [], anger= [],
		 sadness= [], disgust= [], fear= [], neutral=[], contempt=[];
		for (var j = 0; j < curr.dates.length; j++) {
			dates.push(curr.dates[j].time);
			happiness.push(curr.emotions[j].emotion.happiness);
			surprise.push(curr.emotions[j].emotion.surprise);

			anger.push(curr.emotions[j].emotion.anger);
			sadness.push(curr.emotions[j].emotion.sadness);

			disgust.push(curr.emotions[j].emotion.disgust);
			fear.push(curr.emotions[j].emotion.fear);

			neutral.push(curr.emotions[j].emotion.neutral);
			contempt.push(curr.emotions[j].emotion.contempt);
		}
		console.log(surprise);
		// this.charts.push(new Array());
		
		this.chart = new Chart(('canvas' + i), {
			type: 'line',
			data: {
				labels: dates,
				datasets: [
					{
						data: surprise,
						borderColor: "#3cba9f",
						fill: false,
						label: "Surprise"
					},
					{
						data: happiness,
						borderColor: "#ffcc00",
						fill: false,
						label: "Happiness"
					},
					{
						data: anger,
						borderColor: "#260b03",
						fill: false,
						label: "Anger"
					},
					{
						data: contempt,
						borderColor: "#a61aed",
						fill: false,
						label: "Contempt"
					},
					{
						data: disgust,
						borderColor: "#25a50b",
						fill: false,
						label: "Disgust"
					},
					{
						data: sadness,
						borderColor: "#c1ad2c",
						fill: false,
						label: "Sadness"
					},
					{
						data: neutral,
						borderColor: "#889692",
						fill: false,
						label: "Neutral"
					},
					{
						data: fear,
						borderColor: "#aa1712",
						fill: false,
						label: "Fear"
					},
				]
			},
			options: {
				title: {
					display: true,
					text: curr.username
				},
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
		this.charts.push(this.chart);
	}
	// TODO: Use TS sendEmotion(){}
}
