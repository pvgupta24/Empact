import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from "@angular/router";
import { AuthenticationService, UserDetails } from '../authentication.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Chart } from "chart.js";
import { EmotionService } from "../emotion.service";

import * as RecordRTC from 'recordrtc';

declare function JitsiMeetExternalAPI(a, b): void;
declare function takeSnap(a): any;
declare function getEmotions(): any

@Component({
	selector: 'app-room',
	templateUrl: './room.component.html',
	styleUrls: ['./room.component.css']
})

export class RoomComponent implements OnInit {
	@ViewChild('record') video: any;
	room;
	api;
	sessionStatus: boolean = false;
	user: UserDetails;
	items = [];
	// items = [0, 1, 2, 3];
	charts = [];
	agg_em_chart;
	recordStatus: boolean = false;
	private stream: MediaStream;
	private recordRTC: any;
	// count = [];
	// chart = [];

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
			console.log(user);
		}, (err) => {
			console.error(err);
		});
		// setInterval(() => {console.log('Hey')},4000);
	}
	ngAfterViewInit() {
		// set the initial state of the video
		let video: HTMLVideoElement = this.video.nativeElement;
		video.muted = false;
		video.controls = true;
		video.autoplay = false;
	}
	startRecording(screen) {
		let mediaConstraints: any = screen ? {
			video: {
				mediaSource: 'screen'
			},
			audio: true
		} : {
				video: true,
				audio: true
			};
		this.recordStatus = true;
		navigator.mediaDevices
			.getUserMedia(mediaConstraints)
			.then(this.successCallback.bind(this), this.errorCallback.bind(this));
	}
	errorCallback(stream: MediaStream) {
		this.recordStatus = false;
	}
	successCallback(stream: MediaStream) {
		var options = {
			mimeType: 'video/webm\;codecs=vp9', // or video/webm\;codecs=h264 or video/webm\;codecs=vp9
			audioBitsPerSecond: 128000,
			videoBitsPerSecond: 128000,
			// bitsPerSecond: 128000 // if this line is provided, skip above two
		};
		this.stream = stream;
		this.recordRTC = RecordRTC(stream, options);
		this.recordRTC.startRecording();
		let video: HTMLVideoElement = this.video.nativeElement;
		video.src = window.URL.createObjectURL(stream);
		this.toggleControls();
	}
	toggleControls() {
		let video: HTMLVideoElement = this.video.nativeElement;
		video.muted = !video.muted;
		video.controls = !video.controls;
		video.autoplay = !video.autoplay;
	}
	stopRecording() {
		let recordRTC = this.recordRTC;
		recordRTC.stopRecording(this.processVideo.bind(this));
		let stream = this.stream;
		stream.getAudioTracks().forEach(track => track.stop());
		stream.getVideoTracks().forEach(track => track.stop());
		this.recordStatus = false;
	}

	processVideo(audioVideoWebMURL) {
		let video: HTMLVideoElement = this.video.nativeElement;
		let recordRTC = this.recordRTC;
		video.src = audioVideoWebMURL;
		this.toggleControls();
		var recordedBlob = recordRTC.getBlob();
		recordRTC.getDataURL(function (dataURL) { });
	}

	download() {
		this.recordRTC.save('video.mp4');
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

		//Start capturing emotions and displaying in real time 
		setInterval(() => {
			console.log(this.user.name);
			this.sendSnaps();
			setTimeout(() => { this.getAllEmotions(); }, 1000);
		}, 5000);

		// TODO: Integrate with TS
		// takeSnap(this.user.name);
	}
	sendSnaps() {
		takeSnap(this.user.name);
	}
	stopSession() {
		this.api.dispose();
		this.sessionStatus = false;
	}
	getAggregateEmotions(res) {
		console.log(res);
		var emotion_score = [];
		var user_names = [];
		var dataset = {
			'label':"Emotion Scores",
			data:[]

		};
		for (var i = 0; i < (<any>res).length; i++) {
			emotion_score[i] = 0;
			var curr:any = {};
			curr['username'] = res[i].username;
			curr['emotions'] = res[i].emotions;
			console.log(curr);
			for (var j = 0; j < res[i].emotions.length; j++) {
				emotion_score[i] += curr.emotions[j].emotion.happiness - curr.emotions[j].emotion.surprise - curr.emotions[j].emotion.anger - curr.emotions[j].emotion.sadness - curr.emotions[j].emotion.disgust - curr.emotions[j].emotion.fear;
			}	
			user_names.push(curr.username);	
			dataset.data.push(emotion_score[i]);
		}
		
		console.log("Entered aggregate emotions");
		console.log(emotion_score);
		console.log(dataset);
		this.agg_em_chart = new Chart(('emotion_scores'), {
			type: 'bar',
			data: {
				labels: user_names,
				datasets: [dataset],
			},
			options: {
				title: {
					display: true,
					text: "Emotion scores"
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
					duration: 800, // general animation time
				},
				// hover: {
				// 	animationDuration: 100, // duration of animations when hovering an item
				// },
				// responsiveAnimationDuration: 100, // animation duration after a resize
			}
		});
	}
	getAllEmotions() {
		this.emotion.getAllEmotions()
			.subscribe((res) => {
				console.log(res);
				this.items = [];
				for (var i = 0; i < (<any>res).length; i++) {
					let curr = {};
					curr['username'] = res[i].username;
					curr['emotions'] = res[i].emotions;
					curr['dates'] = res[i].emotions;
					// this.plotChart(curr, i);
					this.plot(curr, i);
					// notify speaker about negative emotions
					this.notifySpeaker(curr, i);
					this.getAggregateEmotions(res);	
				}
			}, (err) => {
				console.error(err);
			});

	}
	plot(curr, i) {
		this.items.push(i);
		this.plotChart(curr, i);
		this.plotChart(curr, i);
	}
	notifySpeaker(curr, i) {
		var threshhold = 0.01;
		// average of last 10 emotions
		var e = {
			anger: 0,
			contempt: 0,
			disgust: 0,
			fear: 0,
			sadness: 0,
			surprise: 0
		};
		for (var j = 10; j < curr.emotions.length; j++) {
			for (var k = j; k > (j - 10); k--) {
				e.anger += curr.emotions[k].emotion.anger;
				e.contempt += curr.emotions[k].emotion.contempt;
				e.disgust += curr.emotions[k].emotion.disgust;
				e.fear += curr.emotions[k].emotion.fear;
				e.sadness += curr.emotions[k].emotion.sadness;
				e.surprise += curr.emotions[k].emotion.surprise;
			}
			e.anger /= 10;
			e.contempt /= 10;
			e.disgust /= 10;
			e.fear /= 10;
			e.sadness /= 10;
			e.surprise /= 10;
			console.log(e.anger, e.contempt, e.disgust, e.fear, e.sadness, e.surprise);
			if (e.anger > threshhold || e.contempt > threshhold || e.disgust > threshhold || e.fear > threshhold || e.sadness > threshhold || e.surprise > threshhold) {
				console.log("User " + i + " is showing negative emotion.");
			}
		}
	}

	plotChart(curr, i) {
		console.log(this.charts);
		console.log(curr);
		var dates = [];
		var happiness = [], surprise = [], anger = [],
			sadness = [], disgust = [], fear = [], neutral = [], contempt = [];
		for (var j = 0; j < curr.emotions.length; j++) {
			//TODO: Convert this to different formats better for chart
			dates.push(curr.emotions[j].time);
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

		var chart = new Chart(('canvas' + i), {
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
					duration: 800, // general animation time
				},
				// hover: {
				// 	animationDuration: 100, // duration of animations when hovering an item
				// },
				// responsiveAnimationDuration: 100, // animation duration after a resize
			}
		});
		this.charts.push(chart);
	}
	// TODO: Use TS sendEmotion(){}
}
