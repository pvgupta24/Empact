import { Component, OnInit } from '@angular/core';
import {ActivatedRoute} from "@angular/router";
import { AuthenticationService, UserDetails } from '../authentication.service';
import { HttpClient,HttpHeaders } from '@angular/common/http';

declare function JitsiMeetExternalAPI(a,b): void;
declare function setWebCam(): any;
declare function takeSnap(a):any;

@Component({
  selector: 'app-room',
  templateUrl: './room.component.html',
  styleUrls: ['./room.component.css']
})
export class RoomComponent implements OnInit {

  room
  api
  sessionStatus:boolean = false
  user: UserDetails

  constructor(private auth: AuthenticationService,private route: ActivatedRoute) {
    this.route.params.subscribe( params => this.room = params.room );
    console.log("Current room is "+ this.room);
  }
  httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' })
  };
  ngOnInit() {
    setWebCam();
    this.auth.profile().subscribe(user => {
      this.user = user;  
      }, (err) => {
        console.error(err);
      });
  }
  startSession(){
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
        
  }
  sendSnaps(){
    takeSnap(this.user.name);
  }
  stopSession(){
    this.api.dispose();
    this.sessionStatus = false;        
  }
  // TODO: Use TS sendEmotion(){}
}
