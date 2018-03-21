import { Component, OnInit } from '@angular/core';
import {ActivatedRoute} from "@angular/router";

declare function JitsiMeetExternalAPI(a,b): void;

@Component({
  selector: 'app-room',
  templateUrl: './room.component.html',
  styleUrls: ['./room.component.css']
})
export class RoomComponent implements OnInit {

  room
  
  constructor(private route: ActivatedRoute) {
    this.route.params.subscribe( params => this.room=params.room );
    console.log("Current room is "+ this.room);
  }
  ngOnInit() {
  }
  startSession(){
    console.log("Connecting to room");
    var domain = "meet.jit.si";
    var options = {
        roomName: "empact-room" + this.room,// +"somerandom",
        width: 700,
        height: 600,
        parentNode: document.querySelector('#meet')
    }
    var api = new JitsiMeetExternalAPI(domain, options);    
  }

}
