import { Component, OnInit } from '@angular/core';
import { AuthenticationService, UserDetails } from '../authentication.service';
import { Router } from '@angular/router';
import { HttpClient,HttpHeaders } from '@angular/common/http';

@Component({
  /*selector: 'app-dashboard',*/
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})

export class DashboardComponent {
  user: UserDetails
  rooms : Object[] = []
  newroom = {
    code:"",
    name:"",
    owner:""
  }

  constructor(private auth: AuthenticationService, private router: Router, private http: HttpClient) {}
  httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' })
  };
  ngOnInit() {    
    this.auth.profile().subscribe(user => {
    this.user = user;
    this.rooms = user.rooms;
      for (let room in this.rooms){
        console.log("Requesting "+ JSON.stringify(this.rooms[room]));
      }
      this.newroom.owner = user.name;

    }, (err) => {
      console.error(err);
    });
    
  }
  
  newRoom() {    
    this.rooms.push(this.newroom);
    this.http.post('/api/newRoom',
    JSON.stringify({"user": this.user._id,"room":this.newroom
    }), this.httpOptions)
    .subscribe(res => console.log(res));
    window.location.reload();
  }

  

}
